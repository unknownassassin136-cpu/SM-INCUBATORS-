import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

export interface HeroData {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  heroImage: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

@Component({
  selector: 'app-admin-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-hero.component.html',
  styleUrls: ['./admin-hero.component.css'],
})
export class AdminHeroComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  heroData: HeroData = {
    badge: 'Premium Egg Incubators',
    titleLine1: 'Precision Incubation.',
    titleLine2: 'Trusted Results.',
    description:
      'Manufactured with industrial-grade materials and advanced microcomputer technology to ensure the highest hatch rates for your poultry business.',
    heroImage: '/assets/images/hero/main.jpeg',
    primaryButtonText: 'Explore Products',
    primaryButtonLink: '/products',
    secondaryButtonText: 'Shop Now',
    secondaryButtonLink: '/products',
  };

  loading = true;
  saving = false;
  uploadingImage = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.loadHeroData();
  }

  loadHeroData(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.api.getContent<HeroData>('hero').subscribe({
      next: (res) => {
        if (res.data) {
          this.heroData = { ...this.heroData, ...res.data };
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadingImage = true;
    this.cdr.detectChanges();

    this.api.uploadImage(file, 'hero').subscribe({
      next: (res) => {
        this.uploadingImage = false;
        if (res.url) {
          this.heroData.heroImage = res.url;
          this.showNotification('Hero image uploaded successfully!', 'success');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploadingImage = false;
        this.showNotification(err.error?.message || 'Failed to upload hero image', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  saveHero(): void {
    this.saving = true;
    this.cdr.detectChanges();
    this.api.updateContent('hero', this.heroData).subscribe({
      next: () => {
        this.saving = false;
        this.showNotification('Hero page changes saved successfully!', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.showNotification(err.error?.message || 'Failed to save changes', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  private showNotification(msg: string, type: 'success' | 'error'): void {
    this.notificationMessage = msg;
    this.notificationType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.notificationMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}
