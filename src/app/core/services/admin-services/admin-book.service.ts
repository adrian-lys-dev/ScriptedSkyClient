import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { AdminBook } from '../../../shared/models/admin-book/adminBook';
import { BookDetails } from '../../../shared/models/admin-book/book-details';

@Injectable({
  providedIn: 'root'
})
export class AdminBookService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getBookList(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize = 10);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<AdminBook>>(this.baseUrl + 'adminbook', { params });
  }

  getBookById(id: number){
    return this.http.get<BookDetails>(this.baseUrl + 'adminbook/' + id);
  }

  createBook(book: FormData) {
    return this.http.post(this.baseUrl + 'adminbook', book);
  }

  deleteBook(id: number) {
    return this.http.delete(this.baseUrl + 'adminbook/' + id);
  }

}
