import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, HeroContent } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card.component';
import { FaqAccordionComponent, FaqItem } from '../../shared/faq-accordion/faq-accordion.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FeatureCardComponent, FaqAccordionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private cdr = inject(ChangeDetectorRef);

  featuredProducts: Product[] = [];
  errorMessage: string = '';

  // Dynamic Hero Content (fallback values default to original text)
  heroContent: HeroContent = {
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

  faqs: FaqItem[] = [
    {
      question: 'What is the warranty period on your incubators?',
      answer:
        'We offer a standard 1 to 3 years manufacturer warranty depending on the model. This covers all electrical components and manufacturing defects.',
    },
    {
      question: 'Do you provide spare parts?',
      answer:
        'Yes, we stock a complete range of spare parts including heating elements, turning motors, and controllers for all our models.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'Standard delivery takes 2-5 business days depending on your location. Commercial large-scale units may take 7-10 days for freight shipping.',
    },
    {
      question: 'Are these incubators suitable for all bird eggs?',
      answer:
        'Our incubators feature universal trays that can accommodate chicken, duck, quail, turkey, and goose eggs. The digital controller allows custom temperature and humidity settings for each species.',
    },
    {
      question: 'What happens during a power failure?',
      answer:
        'Many of our small to medium models support dual power (220V AC / 12V DC) allowing you to connect them to a battery during power outages. For larger commercial units, we recommend a backup generator.',
    },
  ];

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Premium Egg Incubators & Poultry Equipment',
      description:
        'Discover premium fully automatic egg incubators and poultry equipment by SM Incubators. High hatch rates, digital controls, and durable designs.',
      keywords:
        'egg incubators, automatic incubator, poultry equipment, sm incubators, chicken incubator, hatch eggs, wooden incubator',
      route: '/',
    });

    this.seoService.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SM Incubators',
      url: 'https://smincubators.in',
      logo: 'https://smincubators.in/assets/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-7981081579',
        contactType: 'sales',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chinamiram, Balram Raju Nagar',
        addressLocality: 'Bhimavaram',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'IN',
      },
    });

    // Load dynamic hero content from backend API if available
    this.dataService.getContent<HeroContent>('hero').subscribe({
      next: (content) => {
        if (content) {
          this.heroContent = { ...this.heroContent, ...content };
          this.cdr.detectChanges();
        }
      },
    });

    // Load products
    this.dataService.getProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 6);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || JSON.stringify(err);
        console.error('Error fetching products:', err);
        this.cdr.detectChanges();
      },
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('div');
      fallback.className =
        'img-fallback absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400';
      fallback.innerHTML = `<span class="text-gray-400 font-medium text-center px-4">Hero Image<br/><span class="text-xs font-normal">Place in /assets/images/hero/main.jpeg</span></span>`;
      parent.appendChild(fallback);
    }
  }
}
