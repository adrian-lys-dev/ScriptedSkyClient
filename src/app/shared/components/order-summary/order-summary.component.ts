import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  cartService = inject(CartService);
  location = inject(Location);
}