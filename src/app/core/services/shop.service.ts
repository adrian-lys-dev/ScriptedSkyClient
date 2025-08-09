import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination/pagination';
import { CatalogBook } from '../../shared/models/catalogBook';
import { ShopParams } from '../../shared/models/pagination/shopParams';
import { FilteringItems } from '../../shared/models/filteringItems';
import { Book } from '../../shared/models/book';
import { PaginationParams } from '../../shared/models/pagination/paginationParams';
import { Review } from '../../shared/models/review';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:7217/api/';
  private http = inject(HttpClient);

  getBooks(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.genres.length > 0) {
      shopParams.genres.forEach(genre => {
        params = params.append('GenreIds', genre);
      });
    }

    if (shopParams.authors.length > 0) {
      shopParams.authors.forEach(author => {
        params = params.append('AuthorIds', author);
      });
    }

    if (shopParams.publishers.length > 0) {
      shopParams.publishers.forEach(publisher => {
        params = params.append('PublisherIds', publisher);
      });
    }

    if (shopParams.sort) {
      params = params.append('Sort', shopParams.sort);
    }

    if (shopParams.search) {
      params = params.append('Search', shopParams.search);
    }

    params = params.append('pageSize', shopParams.PageSize);
    params = params.append('pageIndex', shopParams.PageNumber);

    return this.http.get<Pagination<CatalogBook>>(this.baseUrl + 'book', { params });
  }

  getBook(id: number) {
    return this.http.get<Book>(this.baseUrl + 'book/' + id);
  }

  getBookReviews(paginationParams: PaginationParams, id: number) {

    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<Review>>(this.baseUrl + 'review/book/' + id, { params });
  }

  getGenres() {
    return this.http.get<FilteringItems[]>(this.baseUrl + 'filtering/genre');
  }

  getAuthors() {
    return this.http.get<FilteringItems[]>(this.baseUrl + 'filtering/author')
  }

  getPublishers() {
    return this.http.get<FilteringItems[]>(this.baseUrl + 'filtering/publisher')
  }

}
