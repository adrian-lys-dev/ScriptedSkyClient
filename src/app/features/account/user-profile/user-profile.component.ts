import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AccountService } from '../../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Order } from '../../../shared/models/order/orderResponse';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserOrderItemComponent } from "./user-order-item/user-order-item.component";

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserOrderItemComponent, MatPaginator],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  accountService = inject(AccountService);
  private orderService= inject(OrderService);

  paginationParams = new PaginationParams();
  orders?: Pagination<Order>;

  ngOnInit() {
    this.getCurrentUserOrdersList();
  }

  getCurrentUserOrdersList() {
    this.orderService.getCurrentUserOrders(this.paginationParams).subscribe({
      next: response => this.orders = response,
      error: error => console.error('Error fetching orders:', error)
    });

  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getCurrentUserOrdersList();
  }

}
