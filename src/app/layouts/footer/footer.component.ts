import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

export interface FooterContent {
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
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialWhatsappChannel?: string;
  socialTwitter?: string;
  trustBadgesText?: string;
  showTrustBadges?: boolean;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  footer: FooterContent = {
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
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
    socialFacebook: 'https://facebook.com',
    socialInstagram: 'https://instagram.com',
    socialYoutube: 'https://youtube.com',
    socialWhatsappChannel: '',
    socialTwitter: '',
    trustBadgesText: '100% Tested Hatch Rates • Genuine Spare Parts Guarantee • Pan India Delivery',
    showTrustBadges: true,
  };

  ngOnInit(): void {
    this.dataService.getContent<FooterContent>('footer').subscribe({
      next: (data) => {
        if (data) {
          this.footer = { ...this.footer, ...data };
          this.cdr.detectChanges();
        }
      },
    });
  }

  getWhatsAppLink(): string {
    const raw = this.footer.whatsappNumber ? this.footer.whatsappNumber.replace(/[^0-9]/g, '') : '917981081579';
    const clean = raw.startsWith('91') ? raw : `91${raw}`;
    return `https://wa.me/${clean}?text=${encodeURIComponent('Hello SM Incubators, I would like to inquire about your egg incubators.')}`;
  }
}
