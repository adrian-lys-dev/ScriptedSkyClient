import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../../shared/models/order/orderResponse';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink, DatePipe],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {

  private router = inject(Router);
  order: Order | null = this.router.getCurrentNavigation()?.extras.state?.['order'] ?? null;

  ngOnInit() {
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }

}
