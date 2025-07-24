import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from "./cart-item/cart-item.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartService = inject(CartService);

  trackByBookId(index: number, item: any): number {
    return item.bookId;
  }
}
