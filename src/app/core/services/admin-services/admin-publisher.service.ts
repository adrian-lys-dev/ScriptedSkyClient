import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Publisher } from '../../../shared/models/publisher';
import { Pagination } from '../../../shared/models/pagination/pagination';

@Injectable({
  providedIn: 'root'
})
export class AdminPublisherService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getPublisherList(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize = 12);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<Publisher>>(this.baseUrl + 'adminpublisher', { params });
  }

  addPublisher(name: string) {
    return this.http.post(this.baseUrl + 'adminpublisher', { name });
  }

  updatePublisher(id: number, name: string) {
    return this.http.put(this.baseUrl + 'adminpublisher/' + id, { name });
  }

  deletePublisher(id: number) {
    return this.http.delete(this.baseUrl + 'adminpublisher/' + id);
  }
}
