import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  productCount = 0;
  sparesCount = 0;
  ordersCount = 0;
  recentOrders: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.api.getProducts().subscribe({
      next: (res) => {
        this.productCount = res.data?.length || 0;
        this.cdr.detectChanges();
      },
    });

    this.api.getSpares().subscribe({
      next: (res) => {
        this.sparesCount = res.data?.length || 0;
        this.cdr.detectChanges();
      },
    });

    this.api.getOrders().subscribe({
      next: (res) => {
        this.ordersCount = res.data?.length || 0;
        this.recentOrders = (res.data || []).slice(0, 5);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
