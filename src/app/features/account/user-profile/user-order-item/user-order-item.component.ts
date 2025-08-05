import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { Order } from '../../../../shared/models/order/orderResponse';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-order-item',
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './user-order-item.component.html',
  styleUrl: './user-order-item.component.scss'
})
export class UserOrderItemComponent {

  private userProfileService = inject(UserProfileService);
  
  @Input() order?: Order;
  @Output() loadingChange = new EventEmitter<boolean>();

  dropdownVisible: boolean = false;
  isCancelling: boolean = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdown() {
    this.dropdownVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown-container');
    if (!clickedInside) {
      this.dropdownVisible = false;
    }
  }

  cancelOrder() {

    if (!this.order) return;

    this.isCancelling = true;
    this.loadingChange.emit(true);

    this.userProfileService.cancelOrder(this.order.id).subscribe({
      next: () => {
        this.order!.status = 'Cancelled';
        this.isCancelling = false;
        this.closeDropdown();
        this.loadingChange.emit(false); 
      },
      error: error => {
        console.error(`Error cancelling order ${this.order!.id}:`, error);
        this.isCancelling = false;
        this.closeDropdown();
        this.loadingChange.emit(false);
      }
    })
  }

}
