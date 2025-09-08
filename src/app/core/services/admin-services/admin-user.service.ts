import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { User } from '../../../shared/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUserList(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize = 12);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<User>>(this.baseUrl + 'adminuser', { params });
  }

  addUserRole(userId: string, role: string) {
    return this.http.post(this.baseUrl + 'adminuser/add-role', null, { params: { userId, role } } );
  }

  removeUserRole(userId: string, role: string) {
    return this.http.post(this.baseUrl + 'adminuser/remove-role', null, { params: { userId, role } } );
  }

}
