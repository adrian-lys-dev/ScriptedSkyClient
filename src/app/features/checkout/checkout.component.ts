import { Component, inject, OnInit } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import { CheckoutService } from '../../core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../core/services/cart.service';
import { DeliveryMethods } from '../../shared/models/order/deliveryMethods';
import { BusyService } from '../../core/services/busy.service';
import { Router } from '@angular/router';
import { CreateOrder } from '../../shared/models/order/createOrder';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummaryComponent, TextInputComponent, ReactiveFormsModule, MatRadioModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  busyService = inject(BusyService);
  private snackbar = inject(SnackbarService);

  ngOnInit() {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
          if (method) {
            this.cartService.selectedDeliveryMethod.set(method);
          }
        }
      }
    });
  }

  checkoutForm = this.fb.group({
    contactName: ['', [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]],
    deliveryMethodId: [null as number | null, [Validators.required]],
    deliveryAddress: ['']
  });

  updateDeliveryMethod(method: DeliveryMethods) {
    this.cartService.selectedDeliveryMethod.set(method);
    const cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
    }

    this.checkoutForm.patchValue({
      deliveryMethodId: method.id
    });

    if (method.id === 3) {
      // Free deliveery — adress is not required and hidden
      this.checkoutForm.get('deliveryAddress')?.clearValidators();
      this.checkoutForm.get('deliveryAddress')?.setValue('');
    } else {
      // Any other delivery method requires an address
      this.checkoutForm.get('deliveryAddress')?.setValidators([Validators.required]);
    }
    this.checkoutForm.get('deliveryAddress')?.updateValueAndValidity();

  }

  onSubmit() {

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formValue = this.checkoutForm.value;
    const cart = this.cartService.cart();

    if (!cart) {
      console.error('Cart not found');
      return;
    }

    const order: CreateOrder = {
      cartId: cart.id,
      deliveryMethodId: formValue.deliveryMethodId!,
      contactEmail: formValue.contactEmail!,
      contactName: formValue.contactName!,
      adress: formValue.deliveryAddress || ''
    };

    this.checkoutService.createOrder(order).subscribe({
      next: response => {
        this.snackbar.success('Order ' + response.id + ' created successfully. Thank you for your purchase!');
        this.cartService.clearCartLocally();
        this.router.navigate(['/checkout/checkout-success'], {
          state: { order: response }
        });
      },
      error: error => {
        this.snackbar.error('Error creating order');
        console.error('Error creating order:', error);
      }
    })

  }

}
