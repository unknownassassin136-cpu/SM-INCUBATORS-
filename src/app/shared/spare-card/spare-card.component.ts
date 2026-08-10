import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spare } from '../../models/product.model';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-spare-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 flex flex-col h-full card-hover">
      <div class="relative h-48 bg-gray-50 p-4 border-b border-gray-100">
        <!-- Placeholder for Image -->
        <div class="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          <span class="text-sm">Image: {{spare.images[0]}}</span>
        </div>
      </div>
      
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{spare.name}}</h3>
        
        <!-- Price -->
        <div class="mb-3" *ngIf="spare.price > 0">
          <span class="text-xl font-extrabold text-primary">₹{{spare.price | number}}</span>
        </div>
        <div class="mb-3" *ngIf="!spare.price || spare.price === 0">
          <span class="text-sm font-bold text-gray-500">Price on request</span>
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{spare.description}}</p>
        
        <div class="mt-auto mb-6">
          <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Compatible With:</h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let model of spare.compatibleModels" class="inline-block bg-blue-50 text-primary text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
              {{model}}
            </span>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button (click)="openCheckout($event)" class="flex-grow inline-flex justify-center items-center py-2.5 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {{ spare.price > 0 ? '₹' + (spare.price | number) + ' — Buy Now' : 'Buy Now' }}
          </button>
          <button (click)="shareSpare($event)" class="flex-shrink-0 w-11 h-11 bg-gray-50 text-primary border border-gray-200 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shadow-sm" title="Share this spare">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SpareCardComponent {
  @Input({ required: true }) spare!: Spare;
  private checkoutService = inject(CheckoutService);

  openCheckout(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.checkoutService.open({
      name: this.spare.name,
      price: this.spare.price,
      modelId: this.spare.id,
      slug: this.spare.slug,
      type: 'spare'
    });
  }

  async shareSpare(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();
    const url = `https://smincubators.in/spares/${this.spare.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.spare.name,
          text: this.spare.description || this.spare.name,
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
    }
  }
}
