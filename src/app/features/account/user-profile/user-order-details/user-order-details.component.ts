import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../../../shared/models/order/orderResponse';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { CommonModule } from '@angular/common';
import { BusyService } from '../../../../core/services/busy.service';
import { LoadingMainComponent } from "../../../../shared/components/loading-main/loading-main.component";

@Component({
  selector: 'app-user-order-details',
  imports: [CommonModule, RouterLink, LoadingMainComponent],
  templateUrl: './user-order-details.component.html',
  styleUrl: './user-order-details.component.scss'
})
export class UserOrderDetailsComponent implements OnInit {
  
  private userProfileService = inject(UserProfileService);
  private activatedRoute = inject(ActivatedRoute);
  busyService = inject(BusyService);

  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.userProfileService.getOrderById(+id).subscribe({
      next: order => this.order = order,
      error: error => console.error('Error loading order:', error)
    });
  }
}
