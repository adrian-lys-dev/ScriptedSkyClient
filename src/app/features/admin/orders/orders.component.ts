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
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, MatPaginator, CommonModule, DropdownComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  private adminOrderService = inject(AdminOrderService);
  private router = inject(Router);
  private snackbar = inject(SnackbarService);

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

    const options: DropdownOption[] = [
      {
        label: 'Order details',
        action: () => this.router.navigate([`/account/user-profile/order/${order.id}`]),
        class: 'text-gray-500',
        iconHover: 'group-hover:text-gray-900',
        icon: DropdownIcon.Eye
      }
    ];

    switch (order.status) {
      case 'Pending':
        options.push(
          {
            label: 'Confirm order',
            action: () => this.confirmOrder(order),
            class: 'text-blue-600',
            iconHover: 'group-hover:text-blue-800',
            icon: DropdownIcon.Check
          },
          {
            label: 'Cancel order',
            action: () => this.cancelOrder(order),
            class: 'text-red-600',
            icon: DropdownIcon.Trash
          }
        );
        break;

      case 'Confirmed':
        options.push(
          {
            label: 'Complete order',
            action: () => this.doneOrder(order),
            class: 'text-green-600',
            iconHover: 'group-hover:text-green-800',
            icon: DropdownIcon.Done
          },
          {
            label: 'Cancel order',
            action: () => this.cancelOrder(order),
            class: 'text-red-600',
            icon: DropdownIcon.Trash
          }
        );
        break;

      case 'Done':
      case 'Cancelled':
        break;
    }

    return options;
  }

  confirmOrder(order: Order) {
    this.updateOrderStatusForOrder(order, 'Confirmed');
  }

  doneOrder(order: Order) {
    this.updateOrderStatusForOrder(order, 'Done');
  }

  cancelOrder(order: Order) {
    this.updateOrderStatusForOrder(order, 'Cancelled');
  }

  private updateOrderStatusForOrder(order: Order, status: 'Confirmed' | 'Done' | 'Cancelled') {
    this.loadingOrders.add(order.id);

    this.adminOrderService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        order.status = status;
        this.loadingOrders.delete(order.id);

        this.getDropDownOptions(order);

        let message = '';
        switch (status) {
          case 'Confirmed':
            message = `Order #${order.id} has been successfully confirmed.`;
            break;
          case 'Done':
            message = `Order #${order.id} is now marked as completed.`;
            break;
          case 'Cancelled':
            message = `Order #${order.id} has been cancelled.`;
            break;
        }

        this.snackbar.success(message);
      },
      error: (error) => {
        console.error(`Error updating order ${order.id} to ${status}:`, error);
        this.loadingOrders.delete(order.id);
        this.snackbar.error(`Failed to update Order #${order.id}. Please try again.`);
      }
    });
  }

}
