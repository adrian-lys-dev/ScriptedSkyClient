import { Component, inject, OnInit } from '@angular/core';
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
import { LoadingMainComponent } from "../../../shared/components/loading-main/loading-main.component";

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserOrderItemComponent, MatPaginator, AvatarSelectorComponent, LoadingMainComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  private orderService = inject(OrderService);
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
  cancelLoading = false;

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
          this.snackbar.error('Something went wrong...');
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

  onOrderLoadingChange(isLoading: boolean) {
    this.cancelLoading = isLoading;
  }

  getOrdersMadeComment(count?: number): string {
    if (!count) return "You’ve got the shelf, now fill it!";
    if (count < 3) return "One does not simply stop at one book.";
    if (count < 5) return "A humble start… legends begin like this!";
    if (count < 10) return "Building your collection, I see!";
    if (count < 20) return "Nice! You’re definitely warming up!";
    if (count < 35) return "Turning pages like a pro!";
    if (count < 50) return "Impressive — you read more than you sleep!";
    if (count < 75) return "That’s not a hobby, that’s a mission.";
    return "Okay, are you trying to build your own library?";
  }

  getActiveOrdersComment(count?: number): string {
    if (!count) return "No books on the way… yet.";
    if (count === 1) return "A lonely parcel makes its journey.";
    if (count < 3) return "A couple of stories are en route!";
    if (count < 5) return "Your next reads are almost here!";
    if (count < 10) return "The books are marching in!";
    if (count < 20) return "Mailman’s favorite customer?";
    return "That’s not a reading list, it’s an invasion!";
  }

  getReviewsComment(count?: number): string {
    if (!count) return "Silence is an opinion too.";
    if (count < 1) return "Your thoughts are just beginning to echo.";
    if (count < 7) return "Careful, someone’s becoming a critic!";
    if (count < 15) return "Readers listen. Reviewers speak.";
    if (count < 30) return "A voice worth reading!";
    if (count < 50) return "A reviewer of high caliber!";
    return "Critic, reader, reviewer — you’ve become a legend.";
  }

  getAccountAgeComment(createdAt?: string): string {
    if (!createdAt) return "Unknown origin… a mystery user!";
    const date = new Date(createdAt);
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) return "Welcome! You’ve just stepped into the story.";
    if (days === 1) return "Day one — it all begins here.";
    if (days < 3) return "Fresh and curious — hello, new explorer!";
    if (days < 7) return "Fresh ink on your library card!";
    if (days < 14) return "Already turning pages like a veteran!";
    if (days < 30) return "Still a newbie, but making progress.";
    if (days < 90) return "Getting comfy, aren’t you?";
    if (days < 180) return "Half a year of adventures behind!";
    if (days < 365) return "Almost a year of bookish adventures!";
    if (days < 730) return "One year strong — still reading!";
    return "Veteran of the shelves. Respect.";
  }

}
