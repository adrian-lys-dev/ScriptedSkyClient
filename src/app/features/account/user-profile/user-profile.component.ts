import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AccountService } from '../../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Order } from '../../../shared/models/order/orderResponse';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserOrderItemComponent } from "./user-order-item/user-order-item.component";
import { BusyService } from '../../../core/services/busy.service';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { UserStat } from '../../../shared/models/user/userStat';
import { AvatarSelectorComponent } from "./avatar-selector/avatar-selector.component";
import { Avatar } from '../../../shared/models/user/avatar';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserOrderItemComponent, MatPaginator, AvatarSelectorComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  private orderService= inject(OrderService);
  private userProfileService = inject(UserProfileService);
  private snackbar = inject(SnackbarService);

  accountService = inject(AccountService);
  busyService = inject(BusyService);

  paginationParams = new PaginationParams();
  orders?: Pagination<Order>;
  userStat?: UserStat;

  avatarModalOpen = false;
  availableAvatars: Avatar[] = [];

  profileLoading = false;


  ngOnInit() {
    this.getCurrentUserOrdersList();
    this.getCurrentUserStat();
    this.getAvailableAvatars();
  }

  openAvatarModal() {
    this.avatarModalOpen = true;
  }

  onAvatarSelected(avatar: Avatar) {
    const currentUser = this.accountService.currentUser();
    if (currentUser && currentUser.avatar !== avatar.avatarPath) {

      this.profileLoading = true;
      
      this.userProfileService.updateUserAvatar(avatar.id).subscribe({
        next: () => {
          currentUser.avatar = avatar.avatarPath;
          this.profileLoading = false;
          this.snackbar.success('Your avatar updated successfully!');
        },
        error: err => {
          this.snackbar.success('Something went wrong...');
        }
      });
    }
  }

  getAvailableAvatars() {
    this.userProfileService.getAvailableAvatars().subscribe({
      next: response => this.availableAvatars = response,
      error: error => console.error('Error fetching available avatars:', error)
    })
  }

  getCurrentUserStat() {
    return this.userProfileService.getUserStat().subscribe({
      next: response => this.userStat = response,
      error: error => console.error('Error fetching user stats:', error)
    })
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
