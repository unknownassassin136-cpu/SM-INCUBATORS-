import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeoService } from '../../services/seo.service';
import { DataService, SiteSettings } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);
  private dataService = inject(DataService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  phone: string = '7981081579';
  whatsappNumber: string = '917981081579';
  address: string = 'Chinamiram,\nBalram Raju Nagar,\nBhimavaram, Andhra Pradesh - 534204';
  
  defaultMapUrl =
    'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3824.477909185154!2d81.49747847514628!3d16.552434884199307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDMzJzA4LjgiTiA4McKwMzAnMDAuMiJF!5e0!3m2!1sen!2sin!4v1788267945069!5m2!1sen!2sin';
  safeMapUrl: SafeResourceUrl | null = null;

  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
  };

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Contact Us',
      description:
        'Get in touch with SM Incubators for product inquiries, bulk orders, or technical support. We are here to help your poultry business grow.',
      keywords: 'contact sm incubators, incubator support, buy incubator, poultry equipment supplier, contact details',
      route: '/contact',
    });

    // Initialize with safe default map
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultMapUrl);

    // Load dynamic settings from backend
    this.dataService.getContent<SiteSettings>('settings').subscribe({
      next: (settings) => {
        if (settings) {
          if (settings.phone) this.phone = settings.phone;
          if (settings.whatsappNumber) this.whatsappNumber = settings.whatsappNumber;
          if (settings.address) this.address = settings.address;
          if (settings.googleMapsEmbedUrl) {
            let cleanUrl = settings.googleMapsEmbedUrl.trim();
            // Handle cases where full <iframe> was saved
            if (cleanUrl.includes('<iframe') && cleanUrl.includes('src=')) {
              const match = cleanUrl.match(/src=["']([^"']+)["']/i);
              if (match && match[1]) cleanUrl = match[1];
            }
            if (cleanUrl.startsWith('http')) {
              this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cleanUrl);
            }
          }
          this.cdr.detectChanges();
        }
      },
    });
  }

  submitForm() {
    if (!this.formData.name || !this.formData.phone || !this.formData.message) return;

    let text = `Hello SM Incubators,\n\nI am contacting you through your website form.\n\n*Name:* ${this.formData.name}\n*Phone:* ${this.formData.phone}\n`;
    if (this.formData.email) {
      text += `*Email:* ${this.formData.email}\n`;
    }
    text += `\n*Message:*\n${this.formData.message}`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${this.whatsappNumber || '917981081579'}?text=${encodedText}`;

    window.open(waUrl, '_blank');
  }
}
