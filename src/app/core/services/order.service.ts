import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../../shared/models/order/orderResponse';
import { Pagination } from '../../shared/models/pagination/pagination';
import { PaginationParams } from '../../shared/models/pagination/paginationParams';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCurrentUserOrders(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize);
    params = params.append('pageIndex', paginationParams.PageNumber);
    
    return this.http.get<Pagination<Order>>(this.baseUrl + 'order/get-orders-for-current-user', { params })
  }

}
