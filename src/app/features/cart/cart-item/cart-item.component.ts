import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../shared/models/cart/cart';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);

  incrementQuantity() {
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity() {
    this.cartService.removeItemFromCart(this.item().bookId);
  }

  removeItemFromCart() {
    this.cartService.removeItemFromCart(this.item().bookId, this.item().quantity);
  }
}