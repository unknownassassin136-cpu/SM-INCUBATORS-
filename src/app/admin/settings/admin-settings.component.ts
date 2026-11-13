import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminApiService } from '../services/admin-api.service';

export interface SiteSettingsData {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  upiId: string;
  upiQrImage: string;
  address: string;
  googleMapsEmbedUrl?: string;
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
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  settings: SiteSettingsData = {
    brandName: 'SM Incubators',
    tagline: 'Precision Incubation',
    phone: '7981081579',
    whatsappNumber: '917981081579',
    upiId: '7981081579@ptyes',
    upiQrImage: '/assets/images/upi-qr.png',
    address: 'Chinamiram, Balram Raju Nagar, Bhimavaram, Andhra Pradesh - 534204',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3824.477909185154!2d81.49747847514628!3d16.552434884199307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDMzJzA4LjgiTiA4McKwMzAnMDAuMiJF!5e0!3m2!1sen!2sin!4v1788267945069!5m2!1sen!2sin',
  };

  rawMapInput = '';
  sanitizedMapPreview: SafeResourceUrl | null = null;
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
        this.rawMapInput = this.settings.googleMapsEmbedUrl || '';
        this.updateMapPreview();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.rawMapInput = this.settings.googleMapsEmbedUrl || '';
        this.updateMapPreview();
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onMapInputChange(input: string): void {
    const trimmed = (input || '').trim();
    if (!trimmed) {
      this.settings.googleMapsEmbedUrl = '';
      this.sanitizedMapPreview = null;
      return;
    }

    // Automatically extract src URL if the user pastes the full <iframe> code
    if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        this.settings.googleMapsEmbedUrl = match[1];
        this.rawMapInput = match[1];
      } else {
        this.settings.googleMapsEmbedUrl = trimmed;
      }
    } else {
      this.settings.googleMapsEmbedUrl = trimmed;
    }

    this.updateMapPreview();
  }

  updateMapPreview(): void {
    if (this.settings.googleMapsEmbedUrl && this.settings.googleMapsEmbedUrl.startsWith('http')) {
      this.sanitizedMapPreview = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.settings.googleMapsEmbedUrl
      );
    } else {
      this.sanitizedMapPreview = null;
    }
    this.cdr.detectChanges();
  }

  resetDefaultMap(): void {
    const defaultUrl =
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3824.477909185154!2d81.49747847514628!3d16.552434884199307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDMzJzA4LjgiTiA4McKwMzAnMDAuMiJF!5e0!3m2!1sen!2sin!4v1788267945069!5m2!1sen!2sin';
    this.settings.googleMapsEmbedUrl = defaultUrl;
    this.rawMapInput = defaultUrl;
    this.updateMapPreview();
    this.showNotification('Reset to SM Incubators default map coordinates', 'success');
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
