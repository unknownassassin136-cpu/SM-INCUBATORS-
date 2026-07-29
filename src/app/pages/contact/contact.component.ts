import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Header -->
    <div class="bg-gray-50 py-16 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Get in touch with our team for sales inquiries, technical support, or any questions about our products.</p>
      </div>
    </div>

    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <!-- Contact Information -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
            
            <div class="space-y-8">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                  <p class="text-gray-600 leading-relaxed">
                    SM Incubators<br>
                    Chinamiram,<br>
                    Balram Raju Nagar,<br>
                    Bhimavaram, Andhra Pradesh
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                  <p class="text-gray-600 mb-2">Sales & Support:</p>
                  <a href="tel:7981081579" class="text-xl font-semibold text-primary hover:text-blue-800">7981081579</a>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-green-50 text-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                  <p class="text-gray-600 mb-2">Chat with our experts instantly:</p>
                  <a href="https://wa.me/917981081579" target="_blank" class="text-xl font-semibold text-accent hover:text-green-700">7981081579</a>
                </div>
              </div>
            </div>
            
            <div class="mt-12">
              <!-- Google Maps Placeholder -->
              <div class="w-full h-64 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center shadow-inner overflow-hidden relative">
                <span class="text-gray-500 font-medium z-10 bg-white/80 px-4 py-2 rounded-lg backdrop-blur">Google Maps Placeholder</span>
                <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;"></div>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-200 shadow-soft">
            <h2 class="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
            
            <form (ngSubmit)="submitForm()" #contactForm="ngForm" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Full Name <span class="text-red-500">*</span></label>
                <input type="text" id="name" name="name" [(ngModel)]="formData.name" required
                       class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                       placeholder="John Doe">
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span class="text-red-500">*</span></label>
                <input type="tel" id="phone" name="phone" [(ngModel)]="formData.phone" required
                       class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                       placeholder="+91 98765 43210">
              </div>
              
              <div>
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address (Optional)</label>
                <input type="email" id="email" name="email" [(ngModel)]="formData.email"
                       class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                       placeholder="john@example.com">
              </div>
              
              <div>
                <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">Message <span class="text-red-500">*</span></label>
                <textarea id="message" name="message" [(ngModel)]="formData.message" rows="5" required
                          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none resize-none"
                          placeholder="How can we help you?"></textarea>
              </div>
              
              <button type="submit" [disabled]="!contactForm.form.valid"
                      class="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl hover:bg-blue-900 transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                Send via WhatsApp
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              <p class="text-xs text-center text-gray-500 mt-4">By submitting this form, you will be redirected to WhatsApp to complete your message.</p>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);
  
  formData = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Contact Us',
      description: 'Get in touch with SM Incubators for sales, support, and inquiries. Find our phone number, WhatsApp, and address details.',
      route: '/contact'
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
