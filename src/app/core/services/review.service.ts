import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PaginationParams } from '../../shared/models/pagination/paginationParams';
import { Pagination } from '../../shared/models/pagination/pagination';
import { Review } from '../../shared/models/review/review';
import { ReviewDto } from '../../shared/models/review/reviewDto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getBookReviews(paginationParams: PaginationParams, id: number) {

    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<Review>>(this.baseUrl + 'review/book/' + id, { params });
  }

  postReview(review: ReviewDto) {
    return this.http.post<ReviewDto>(this.baseUrl + 'review', review);
  }

  deleteReview(id: number) {
    return this.http.delete<void>(this.baseUrl + 'review/' + id);
  }

  updateReview(review: ReviewDto, reviewId: number){
    return this.http.put<ReviewDto>(this.baseUrl + 'review/' + reviewId, review);
  }

}
