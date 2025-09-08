import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { Author } from '../../../shared/models/author';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthorService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAuthorList(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize = 12);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<Author>>(this.baseUrl + 'adminauthor', { params });
  }

  addAuthor(name: string) {
    return this.http.post(this.baseUrl + 'adminauthor', { name });
  }

  updateAuthor(id: number, name: string) {
    return this.http.put(this.baseUrl + 'adminauthor/' + id, { name });
  }

  deleteAuthor(id: number) {
    return this.http.delete(this.baseUrl + 'adminauthor/' + id);
  }
}
