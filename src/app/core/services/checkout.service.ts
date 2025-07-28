import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethods } from '../../shared/models/order/deliveryMethods';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethods[] = [];

  getDeliveryMethods() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http.get<DeliveryMethods[]>(this.baseUrl + 'order/delivery-methods').pipe(
      map(methods => {
        this.deliveryMethods = methods.sort((a, b) => b.price - a.price);
        return methods;
      })
    )
  }

}
