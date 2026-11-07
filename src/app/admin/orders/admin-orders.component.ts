import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];
  filteredOrders: any[] = [];
  searchTerm = '';
  selectedStatus = 'All';
  loading = true;

  notification = '';
  notificationType: 'success' | 'error' = 'success';

  statusOptions = ['All', 'Pending', 'Contacted', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.api.getOrders().subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.showNotification('Failed to load orders: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(): void {
    let result = [...this.orders];
    if (this.selectedStatus !== 'All') {
      result = result.filter((o) => o.status === this.selectedStatus);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(term) ||
          o.customerPhone.includes(term) ||
          o.itemName.toLowerCase().includes(term) ||
          (o.state && o.state.toLowerCase().includes(term))
      );
    }
    this.filteredOrders = result;
    this.cdr.detectChanges();
  }

  updateStatus(order: any, newStatus: string): void {
    this.api.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        this.showNotification(`Order status updated to "${newStatus}"`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showNotification(err.error?.message || 'Failed to update order status', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  openWhatsApp(order: any): void {
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Hello ${order.customerName}, this is SM Incubators regarding your order inquiry for "${order.itemName}".`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  }

  private showNotification(msg: string, type: 'success' | 'error'): void {
    this.notification = msg;
    this.notificationType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.notification = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}
