import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card.component';
import { FaqAccordionComponent, FaqItem } from '../../shared/faq-accordion/faq-accordion.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FeatureCardComponent, FaqAccordionComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-white pt-16 pb-32 overflow-hidden border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="text-center lg:text-left">
            <span class="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary font-bold text-sm mb-6 uppercase tracking-wider border border-blue-100">Premium Egg Incubators</span>
            <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Precision Incubation.<br/>
              <span class="text-primary">Trusted Results.</span>
            </h1>
            <p class="mt-4 text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Manufactured with industrial-grade materials and advanced microcomputer technology to ensure the highest hatch rates for your poultry business.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a routerLink="/products" class="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors shadow-soft">
                Explore Products
              </a>
              <a href="https://wa.me/917981081579?text=Hello,%20I%20would%20like%20to%20get%20a%20quote." target="_blank" class="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                Get Quote
              </a>
            </div>
          </div>
          
          <div class="relative hidden lg:block">
            <!-- Hero Image -->
            <div class="aspect-square bg-gray-100 rounded-full flex items-center justify-center relative shadow-card border-8 border-white overflow-hidden z-10">
              <img src="/assets/images/hero/main.jpeg" 
                   alt="Premium Egg Incubator" 
                   class="absolute inset-0 w-full h-full object-cover"
                   (error)="onImageError($event)">
            </div>
            <!-- Decorative Elements -->
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-accent opacity-20 rounded-full blur-3xl z-0"></div>
            <div class="absolute -bottom-10 -left-10 w-60 h-60 bg-primary opacity-20 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose SM Incubators</h2>
          <p class="mt-4 text-xl text-gray-600">Built for reliability, designed for results. Experience the difference of premium incubation technology.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-feature-card title="Reliable" description="Industrial-grade components ensure years of uninterrupted, dependable operation for your breeding needs.">
            <!-- Icon -->
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </app-feature-card>
          
          <app-feature-card title="Energy Efficient" description="Advanced insulation and smart heating algorithms significantly reduce power consumption without compromising performance.">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </app-feature-card>
          
          <app-feature-card title="Automatic Turning" description="Programmable synchronous motors gently turn eggs at precise intervals, mimicking natural incubation.">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </app-feature-card>
          
          <app-feature-card title="Digital Control" description="Fully automated digital interfaces make adjusting temperature and humidity settings simple." class="hidden md:block">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </app-feature-card>
          
          <app-feature-card title="High Hatch Rate" description="Tested across multiple poultry types, our systems consistently deliver 90%+ hatch rates." class="hidden lg:block">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </app-feature-card>
          
          <app-feature-card title="After Sales Support" description="Our expert engineers are available 24/7 to help you troubleshoot and maximize yield." class="hidden lg:block">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </app-feature-card>
        </div>
      </div>
    </section>

    <!-- Product Categories -->
    <section class="py-24 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-12 text-center">Incubator Categories</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a routerLink="/products" [queryParams]="{category: 'Fully Automatic'}" class="group block relative rounded-2xl overflow-hidden shadow-soft h-64 border border-gray-100 hover:shadow-card transition-all">
            <div class="absolute inset-0 bg-blue-900/80 z-10 transition-opacity group-hover:opacity-90"></div>
            <div class="absolute inset-0 bg-gray-200 z-0 flex items-center justify-center">Image Placeholder</div>
            <div class="absolute inset-0 z-20 flex items-center justify-center">
              <h3 class="text-2xl font-bold text-white tracking-wide">Fully Automatic</h3>
            </div>
          </a>
          <a routerLink="/products" [queryParams]="{category: 'Commercial'}" class="group block relative rounded-2xl overflow-hidden shadow-soft h-64 border border-gray-100 hover:shadow-card transition-all">
            <div class="absolute inset-0 bg-blue-900/80 z-10 transition-opacity group-hover:opacity-90"></div>
            <div class="absolute inset-0 bg-gray-200 z-0 flex items-center justify-center">Image Placeholder</div>
            <div class="absolute inset-0 z-20 flex items-center justify-center">
              <h3 class="text-2xl font-bold text-white tracking-wide">Commercial</h3>
            </div>
          </a>
          <a routerLink="/products" [queryParams]="{category: 'Semi Automatic'}" class="group block relative rounded-2xl overflow-hidden shadow-soft h-64 border border-gray-100 hover:shadow-card transition-all">
            <div class="absolute inset-0 bg-blue-900/80 z-10 transition-opacity group-hover:opacity-90"></div>
            <div class="absolute inset-0 bg-gray-200 z-0 flex items-center justify-center">Image Placeholder</div>
            <div class="absolute inset-0 z-20 flex items-center justify-center">
              <h3 class="text-2xl font-bold text-white tracking-wide">Semi Automatic</h3>
            </div>
          </a>
          <a routerLink="/spares" class="group block relative rounded-2xl overflow-hidden shadow-soft h-64 border border-gray-100 hover:shadow-card transition-all">
            <div class="absolute inset-0 bg-blue-900/80 z-10 transition-opacity group-hover:opacity-90"></div>
            <div class="absolute inset-0 bg-gray-200 z-0 flex items-center justify-center">Image Placeholder</div>
            <div class="absolute inset-0 z-20 flex items-center justify-center">
              <h3 class="text-2xl font-bold text-white tracking-wide">Spare Parts</h3>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Products</h2>
            <p class="mt-4 text-xl text-gray-600">Our best-selling models trusted by farmers worldwide.</p>
          </div>
          <a routerLink="/products" class="hidden md:inline-flex text-primary font-bold hover:text-blue-900 transition-colors items-center gap-2">
            View All Products
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-product-card *ngFor="let product of featuredProducts" [product]="product"></app-product-card>
        </div>
        
        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          <strong class="font-bold">Error loading products:</strong>
          <span class="block sm:inline"> {{ errorMessage }}</span>
        </div>
        
        <div class="mt-10 text-center md:hidden">
          <a routerLink="/products" class="inline-flex text-primary font-bold hover:text-blue-900 transition-colors items-center gap-2">
            View All Products
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-24 bg-white border-t border-gray-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p class="mt-4 text-xl text-gray-600">Everything you need to know about our products and services.</p>
        </div>
        
        <div>
          <app-faq-accordion *ngFor="let faq of faqs" [item]="faq"></app-faq-accordion>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary text-white py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-extrabold sm:text-4xl mb-6">Need Help Choosing an Incubator?</h2>
        <p class="text-xl text-blue-100 mb-10">Our experts are ready to assist you in finding the perfect incubator for your specific needs and budget.</p>
        <a href="https://wa.me/917981081579?text=Hello,%20I%20need%20help%20choosing%20an%20incubator." target="_blank" class="inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-soft gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
          Get Free Consultation on WhatsApp
        </a>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  
  featuredProducts: Product[] = [];
  errorMessage: string = '';
  
  faqs: FaqItem[] = [
    { question: 'What is the warranty period on your incubators?', answer: 'We offer a standard 1 to 3 years manufacturer warranty depending on the model. This covers all electrical components and manufacturing defects.' },
    { question: 'Do you provide spare parts?', answer: 'Yes, we stock a complete range of spare parts including heating elements, turning motors, and controllers for all our models.' },
    { question: 'How long does delivery take?', answer: 'Standard delivery takes 2-5 business days depending on your location. Commercial large-scale units may take 7-10 days for freight shipping.' },
    { question: 'Are these incubators suitable for all bird eggs?', answer: 'Our incubators feature universal trays that can accommodate chicken, duck, quail, turkey, and goose eggs. The digital controller allows custom temperature and humidity settings for each species.' },
    { question: 'What happens during a power failure?', answer: 'Many of our small to medium models support dual power (220V AC / 12V DC) allowing you to connect them to a battery during power outages. For larger commercial units, we recommend a backup generator.' }
  ];

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Precision Egg Incubators for High Hatch Rates',
      description: 'SM Incubators manufactures premium, fully automatic egg incubators for hobbyists and commercial hatcheries. Get the best hatch rates with our advanced technology.',
      keywords: 'egg incubator, fully automatic incubator, poultry incubator, chicken incubator, commercial incubator',
      route: '/'
    });
    
    this.seoService.setStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SM Incubators",
      "url": "https://smincubators.in",
      "logo": "https://smincubators.in/assets/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7981081579",
        "contactType": "sales"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Chinamiram, Balram Raju Nagar",
        "addressLocality": "Bhimavaram",
        "addressRegion": "Andhra Pradesh",
        "addressCountry": "IN"
      }
    });

    this.dataService.getProducts().subscribe({
      next: (products) => {
        // Display first 6 products as featured
        this.featuredProducts = products.slice(0, 6);
      },
      error: (err) => {
        this.errorMessage = err.message || JSON.stringify(err);
        console.error('Error fetching products:', err);
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400';
      fallback.innerHTML = `<span class="text-gray-400 font-medium text-center px-4">Hero Image<br/><span class="text-xs font-normal">Place in /assets/images/hero/main.jpeg</span></span>`;
      parent.appendChild(fallback);
    }
  }
}
