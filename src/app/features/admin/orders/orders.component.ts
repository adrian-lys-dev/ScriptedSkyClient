import { Component, inject, OnInit } from '@angular/core';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { Order } from '../../../shared/models/order/orderResponse';
import { AdminOrderService } from '../../../core/services/admin-services/admin-order.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DropdownComponent } from "../../../shared/components/dropdown/dropdown.component";
import { DropdownIcon, DropdownOption } from '../../../shared/models/dropdown/dropDownOptions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, MatPaginator, CommonModule, DropdownComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  private adminOrderService = inject(AdminOrderService);
  private router = inject(Router);

  paginationParams = new PaginationParams();
  orders?: Pagination<Order>;
  loadingOrders = new Set<number>();

  options: DropdownOption[] = [];

  ngOnInit(): void {
    this.getCurrentUserOrdersList();
  }

  getCurrentUserOrdersList() {
    this.adminOrderService.getOrderList(this.paginationParams).subscribe({
      next: response => this.orders = response,
      error: error => console.error('Error fetching orders:', error)
    });
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getCurrentUserOrdersList();
  }

  getDropDownOptions(order: Order): DropdownOption[] {
    return [
      {
        label: 'Order details',
        action: () => this.router.navigate([`/account/user-profile/order/${order.id}`]),
        icon: DropdownIcon.Eye
      },
      ...(order.status === 'Pending' 
        ? [{
            label: 'Confirm Order',
            action: () => this.confirmOrder(order),
            icon: DropdownIcon.Check
          }]
        : []),
      ...(order.status === 'Confirmed'
        ? [{
            label: 'Mark as done',
            action: () => this.doneOrder(order),
            class: 'text-green-600',
            icon: DropdownIcon.Done
          }]
        : []),
      ...(order.status === 'Pending'
        ? [{
            label: 'Cancel order',
            class: 'text-red-600',
            action: () => this.cancelOrder(order),
            icon: DropdownIcon.Trash
          }]
        : [])
    ];
  }

  confirmOrder(order: Order) {
    this.loadingOrders.add(order.id);

    this.adminOrderService.updateOrderStatus(order.id, "Confirmed").subscribe({
      next: () => {
        order.status = 'Confirmed';
        this.loadingOrders.delete(order.id);
        this.getDropDownOptions(order);
      },
      error: error => {
        console.error(`Error confirming order ${order.id}:`, error);
        this.loadingOrders.delete(order.id);
      }
    });
  }

  doneOrder(order: Order) {
    this.loadingOrders.add(order.id);

    this.adminOrderService.updateOrderStatus(order.id, "Done").subscribe({
      next: () => {
        order.status = 'Done';
        this.loadingOrders.delete(order.id);
        this.getDropDownOptions(order);
      },
      error: error => {
        console.error(`Error marking order ${order.id} as done:`, error);
        this.loadingOrders.delete(order.id);
      }
    });
  }

  cancelOrder(order: Order) {

    this.loadingOrders.add(order.id);

    this.adminOrderService.updateOrderStatus(order.id, "Cancelled").subscribe({
      next: () => {
        order.status = 'Cancelled';
        this.loadingOrders.delete(order.id);
        this.getDropDownOptions(order);
      },
      error: error => {
        console.error(`Error cancelling order ${order.id}:`, error);
        this.loadingOrders.delete(order.id);
      }
    })
  }
}
