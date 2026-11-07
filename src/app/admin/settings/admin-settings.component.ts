import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

export interface SiteSettingsData {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  upiId: string;
  upiQrImage: string;
  address: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css'],
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  settings: SiteSettingsData = {
    brandName: 'SM Incubators',
    tagline: 'Precision Incubation',
    phone: '7981081579',
    whatsappNumber: '917981081579',
    upiId: '7981081579@ptyes',
    upiQrImage: '/assets/images/upi-qr.png',
    address: 'Chinamiram, Balram Raju Nagar, Bhimavaram, Andhra Pradesh - 534204',
  };

  loading = true;
  saving = false;
  uploadingQr = false;
  notification = '';
  notificationType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.api.getContent<SiteSettingsData>('settings').subscribe({
      next: (res) => {
        if (res.data) {
          this.settings = { ...this.settings, ...res.data };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onQrSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadingQr = true;
    this.cdr.detectChanges();

    this.api.uploadImage(file, 'settings').subscribe({
      next: (res) => {
        this.uploadingQr = false;
        if (res.url) {
          this.settings.upiQrImage = res.url;
          this.showNotification('UPI QR Code uploaded successfully!', 'success');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploadingQr = false;
        this.showNotification(err.error?.message || 'Failed to upload QR code', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  saveSettings(): void {
    this.saving = true;
    this.cdr.detectChanges();
    this.api.updateContent('settings', this.settings).subscribe({
      next: () => {
        this.saving = false;
        this.showNotification('Site settings updated successfully!', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.showNotification(err.error?.message || 'Failed to update settings', 'error');
        this.cdr.detectChanges();
      },
    });
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
