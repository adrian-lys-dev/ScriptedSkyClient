import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { Genre } from '../../../shared/models/genre';

@Injectable({
  providedIn: 'root'
})
export class AdminGenreService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getGenreList(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize = 12);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<Genre>>(this.baseUrl + 'admingenre', { params });
  }

  addGenre(name: string) {
    return this.http.post(this.baseUrl + 'admingenre', { name });
  }

  updateGenre(id: number, name: string) {
    return this.http.put(this.baseUrl + 'admingenre/' + id, { name });
  }

  deleteGenre(id: number) {
    return this.http.delete(this.baseUrl + 'admingenre/' + id);
  }
}
