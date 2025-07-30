import { Component, HostListener, Input } from '@angular/core';
import { Order } from '../../../../shared/models/order/orderResponse';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-order-item',
  imports: [DatePipe, CommonModule],
  templateUrl: './user-order-item.component.html',
  styleUrl: './user-order-item.component.scss'
})
export class UserOrderItemComponent {
  @Input() order?: Order;

  dropdownVisible: boolean = false;

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
}
