import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from "./cart-item/cart-item.component";
import { RouterLink } from '@angular/router';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { BusyService } from '../../core/services/busy.service';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, RouterLink, OrderSummaryComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartService = inject(CartService);
  busyService = inject(BusyService);

  loading = signal(true);

  constructor() {
    setTimeout(() => this.loading.set(false), 800);
  }

}
