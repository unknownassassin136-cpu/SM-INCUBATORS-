import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);

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
  }

  submitForm() {
    if (!this.formData.name || !this.formData.phone || !this.formData.message) return;

    let text = `Hello SM Incubators,\n\nI am contacting you through your website form.\n\n*Name:* ${this.formData.name}\n*Phone:* ${this.formData.phone}\n`;
    if (this.formData.email) {
      text += `*Email:* ${this.formData.email}\n`;
    }
    text += `\n*Message:*\n${this.formData.message}`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/917981081579?text=${encodedText}`;

    window.open(waUrl, '_blank');
  }
}
