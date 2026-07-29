import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-2xl shadow-soft overflow-hidden card-hover flex flex-col h-full border border-gray-100">
      <div class="relative h-64 bg-gray-50 flex items-center justify-center p-6">
        <img [src]="product.images?.[0] || product.image" 
             [alt]="product.name" 
             class="absolute inset-0 w-full h-full object-contain p-4"
             (error)="onImageError($event)"
             loading="lazy">
        <span class="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-bold tracking-wider text-primary rounded-full shadow-sm">
          {{product.category}}
        </span>
      </div>
      
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {{product.name}}
        </h3>
        
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-sm font-semibold text-gray-600">Capacity: {{product.capacity}} Eggs</span>
        </div>
        
        <p class="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
          {{product.shortDescription}}
        </p>
        
        <div class="space-y-3 mt-auto">
          <a [routerLink]="['/products', product.slug]" class="block w-full py-2.5 px-4 bg-gray-50 text-primary font-semibold text-center rounded-lg hover:bg-gray-100 transition-colors">
            View Details
          </a>
          <a [href]="getWhatsAppUrl()" target="_blank" class="flex items-center justify-center w-full py-2.5 px-4 bg-primary text-white font-semibold text-center rounded-lg hover:bg-blue-900 transition-colors shadow-sm gap-2">
            Get Quote
          </a>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  getWhatsAppUrl(): string {
    const phone = '917981081579';
    const productUrl = `https://sm-incubators.vercel.app/products/${this.product.slug}`;
    const text = `${this.product.whatsappMessage}\n\nProduct Link: ${productUrl}`;
    const message = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${message}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400';
      fallback.innerHTML = `<svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
      parent.appendChild(fallback);
    }
  }
}
