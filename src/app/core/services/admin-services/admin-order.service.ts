import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Order } from '../../../shared/models/order/orderResponse';
import { Pagination } from '../../../shared/models/pagination/pagination';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getOrderList(paginationParams: PaginationParams) {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.PageSize = 12);
    params = params.append('pageIndex', paginationParams.PageNumber);

    return this.http.get<Pagination<Order>>(this.baseUrl + 'adminorder', { params });
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.put(this.baseUrl + 'adminorder/update-status/' + orderId, null, { params: { status } } );
  }
  
}
