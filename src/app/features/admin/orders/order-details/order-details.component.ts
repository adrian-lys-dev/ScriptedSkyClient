import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminOrderService } from '../../../../core/services/admin-services/admin-order.service';
import { BusyService } from '../../../../core/services/busy.service';
import { Order } from '../../../../shared/models/order/orderResponse';
import { CommonModule } from '@angular/common';
import { LoadingAdminComponent } from "../../../../shared/components/loading-admin/loading-admin.component";

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, RouterLink, LoadingAdminComponent],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private adminOrderService = inject(AdminOrderService);
  busyService = inject(BusyService);

  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.adminOrderService.getOrderById(+id).subscribe({
      next: order => this.order = order,
      error: error => console.error('Error loading order:', error)
    });
  }
}
