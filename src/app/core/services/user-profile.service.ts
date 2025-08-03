import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserStat } from '../../shared/models/user/userStat';
import { Avatar } from '../../shared/models/user/avatar';
import { Order } from '../../shared/models/order/orderResponse';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUserStat() {
    return this.http.get<UserStat>(this.baseUrl + 'userprofile/stats');
  }

  getAvailableAvatars() {
    return this.http.get<Avatar[]>(this.baseUrl + 'useravatar/available');
  }

  getOrderById(orderId: number) {
    return this.http.get<Order>(this.baseUrl + 'order/get-user-order/' + orderId);
  }

  updateUserAvatar(avatarId: number) {
    return this.http.post<Avatar>(this.baseUrl + 'useravatar/update/' + avatarId, null);
  }

  cancelOrder(orderId: number) {
    return this.http.put(this.baseUrl + 'order/cancel-order/' + orderId, null);
  }

}
