import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

export interface FooterData {
  companyName: string;
  tagline: string;
  aboutText: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  copyrightText: string;
  gstNumber: string;
  showGst: boolean;
  workingHours: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWhatsappChannel: string;
  socialTwitter: string;
  trustBadgesText: string;
  showTrustBadges: boolean;
}

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css'],
})
export class AdminFooterComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  footerData: FooterData = {
    companyName: 'SM Incubators',
    tagline: 'Precision Incubation. Trusted Results.',
    aboutText:
      'Precision Incubation. Trusted Results. We manufacture top-quality egg incubators and provide genuine spare parts for hobbyists and commercial hatcheries across India.',
    phone: '7981081579',
    whatsappNumber: '917981081579',
    email: 'srimavullammaincubator@gmail.com',
    addressLine1: 'Chinamiram',
    addressLine2: 'Balram Raju Nagar',
    city: 'Bhimavaram',
    state: 'Andhra Pradesh',
    pincode: '534204',
    copyrightText: '© 2026 SRI MAVULLAMMA INCUBATORS. All rights reserved.',
    gstNumber: 'GSTIN37XXXXXXXXXX',
    showGst: true,
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM (Sunday Closed)',
    socialFacebook: 'https://facebook.com',
    socialInstagram: 'https://instagram.com',
    socialYoutube: 'https://youtube.com',
    socialWhatsappChannel: 'https://whatsapp.com/channel',
    socialTwitter: '',
    trustBadgesText: '100% Tested Hatch Rates • Genuine Spare Parts Guarantee • Pan India Delivery',
    showTrustBadges: true,
  };

  loading = true;
  saving = false;
  notification = '';
  notificationType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.loadFooterData();
  }

  loadFooterData(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.api.getContent<FooterData>('footer').subscribe({
      next: (res) => {
        if (res.data) {
          this.footerData = { ...this.footerData, ...res.data };
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

  saveFooter(): void {
    this.saving = true;
    this.cdr.detectChanges();

    this.api.updateContent('footer', this.footerData).subscribe({
      next: () => {
        this.saving = false;
        this.showNotification('Footer content updated and published live successfully!', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.showNotification(err.error?.message || 'Failed to update footer', 'error');
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

