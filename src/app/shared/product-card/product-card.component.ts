import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CheckoutService } from '../../services/checkout.service';

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
        
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-sm font-semibold text-gray-600">Capacity: {{product.capacity}} Eggs</span>
        </div>

        <!-- Price -->
        <div class="mb-4" *ngIf="product.price > 0">
          <span class="text-2xl font-extrabold text-primary">₹{{product.price | number}}</span>
          <span *ngIf="product.originalPrice" class="text-sm text-gray-400 line-through ml-2">₹{{product.originalPrice | number}}</span>
        </div>
        <div class="mb-4" *ngIf="!product.price || product.price === 0">
          <span class="text-lg font-bold text-gray-500">Price on request</span>
        </div>
        
        <p class="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
          {{product.shortDescription}}
        </p>
        
        <div class="space-y-3 mt-auto">
          <a [routerLink]="['/products', product.slug]" class="block w-full py-2.5 px-4 bg-gray-50 text-primary font-semibold text-center rounded-lg hover:bg-gray-100 transition-colors">
            View Details
          </a>
          <button (click)="openCheckout($event)" class="flex items-center justify-center w-full py-2.5 px-4 bg-primary text-white font-semibold text-center rounded-lg hover:bg-blue-900 transition-colors shadow-sm gap-2 relative z-10 pointer-events-auto">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {{ product.price > 0 ? '₹' + (product.price | number) + ' — Buy Now' : 'Buy Now' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  private checkoutService = inject(CheckoutService);

  openCheckout(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('Opening checkout for', this.product.name);
    this.checkoutService.open({
      name: this.product.name,
      price: this.product.price,
      modelId: this.product.specifications?.['Model'] || this.product.id,
      slug: this.product.slug,
      type: 'product',
      imageUrl: this.product.images?.[0] || this.product.image
    });
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
