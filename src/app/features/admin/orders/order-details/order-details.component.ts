import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminOrderService } from '../../../../core/services/admin-services/admin-order.service';
import { BusyService } from '../../../../core/services/busy.service';
import { CommonModule } from '@angular/common';
import { LoadingAdminComponent } from "../../../../shared/components/loading-admin/loading-admin.component";
import { AdminOrder } from '../../../../shared/models/order/adminOrderResponse';

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

  order?: AdminOrder;

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
