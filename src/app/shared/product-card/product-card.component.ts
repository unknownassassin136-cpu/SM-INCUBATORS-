import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CheckoutService } from '../../services/checkout.service';
import { UtmService } from '../../services/utm.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  private checkoutService = inject(CheckoutService);
  private utmService = inject(UtmService);

  openCheckout(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.checkoutService.open({
      name: this.product.name,
      price: this.product.price,
      modelId: this.product.specifications?.['Model'] || this.product.id,
      slug: this.product.slug,
      type: 'product',
      imageUrl: this.product.images?.[0] || this.product.image,
    });
  }

  async shareProduct(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();
    const shareUrl = this.utmService.buildShareUrl(`/products/${this.product.slug}`, 'share');

    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: this.product.name,
          text: this.product.shortDescription || this.product.name,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => alert('Link copied to clipboard!'));
    }
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
