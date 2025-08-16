import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Order } from '../../../../shared/models/order/orderResponse';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { Router } from '@angular/router';
import { DropdownIcon, DropdownOption } from '../../../../shared/models/dropdown/dropDownOptions';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-user-order-item',
  imports: [DatePipe, CommonModule, DropdownComponent],
  templateUrl: './user-order-item.component.html',
  styleUrl: './user-order-item.component.scss'
})
export class UserOrderItemComponent implements OnInit{

  private userProfileService = inject(UserProfileService);
  private router = inject(Router);
  
  @Input() order?: Order;
  @Output() loadingChange = new EventEmitter<boolean>();

  options: DropdownOption[] = [];
  
  isCancelling: boolean = false;

  ngOnInit(): void {
    this.setDropDownOptions();
  }

  cancelOrder() {

    if (!this.order) return;

    this.isCancelling = true;
    this.loadingChange.emit(true);

    this.userProfileService.cancelOrder(this.order.id).subscribe({
      next: () => {
        this.order!.status = 'Cancelled';
        this.isCancelling = false;
        this.setDropDownOptions();
        this.loadingChange.emit(false); 
      },
      error: error => {
        console.error(`Error cancelling order ${this.order!.id}:`, error);
        this.isCancelling = false;
        this.loadingChange.emit(false);
      }
    })
  }

  setDropDownOptions() {
    if (!this.order) {
      this.options = [];
      return;
    }

    this.options = [
      {
        label: 'Order details',
        action: () => this.router.navigate([`/account/user-profile/order/${this.order!.id}`]),
        icon: DropdownIcon.Eye
      },
      ...(this.order.status === 'Pending' ? [{
        label: 'Cancel order',
        class: 'text-red-600',
        action: () => this.cancelOrder(),
        icon: DropdownIcon.Trash
      }] : [])
    ];
  }

}
