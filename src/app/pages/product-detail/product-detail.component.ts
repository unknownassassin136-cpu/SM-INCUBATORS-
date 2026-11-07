import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { CheckoutService } from '../../services/checkout.service';
import { UtmService } from '../../services/utm.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private checkoutService = inject(CheckoutService);
  private utmService = inject(UtmService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  product: Product | undefined;
  relatedProducts: Product[] = [];
  activeImage = signal<string>('');
  errorMessage: string = '';
  isLoading: boolean = true;
  shareCopied: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.dataService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.isLoading = false;
        if (product) {
          this.product = product;

          if (product.images && product.images.length > 0) {
            this.activeImage.set(product.images[0]);
          } else {
            this.activeImage.set('/assets/images/placeholder.jpg');
          }

          try {
            this.seoService.setSeoData({
              title: product.name,
              description: product.shortDescription || product.description,
              keywords: `${product.name}, ${product.category} incubator, egg incubator, poultry farming, buy incubator online, sm incubators`,
              ogImage: product.images && product.images.length > 0 ? product.images[0] : product.image,
              ogType: 'product',
              price: product.price,
              availability: product.availability === 'In Stock' ? 'in stock' : 'preorder',
              route: `/products/${product.slug}`,
            });

            const structuredData: any = {
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: product.name,
              image: product.images
                ? product.images.map((img) =>
                    img.startsWith('http://') || img.startsWith('https://')
                      ? img
                      : `https://smincubators.in/${img.replace(/^\//, '')}`
                  )
                : [],
              description: product.description,
              sku: product.id,
              brand: {
                '@type': 'Brand',
                name: 'SM Incubators',
              },
            };
            if (product.price > 0) {
              structuredData['offers'] = {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: product.price.toString(),
                availability: 'https://schema.org/InStock',
                seller: { '@type': 'Organization', name: 'SM Incubators' },
              };
            }
            this.seoService.setStructuredData(structuredData);
          } catch (e: any) {
            console.error('SEO Error:', e);
          }

          if (product.relatedProducts && product.relatedProducts.length > 0) {
            this.loadRelatedProducts(product.relatedProducts);
          }
          this.cdr.detectChanges();
        } else {
          this.router.navigate(['/404']);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || JSON.stringify(err);
        console.error('Error fetching product:', err);
        this.cdr.detectChanges();
      },
    });
  }

  loadRelatedProducts(slugs: string[]) {
    this.dataService.getProducts().subscribe((products) => {
      this.relatedProducts = products.filter((p) => slugs.includes(p.slug)).slice(0, 3);
    });
  }

  getSpecKeys(): string[] {
    if (!this.product?.specifications) return [];
    return Object.keys(this.product.specifications);
  }

  openCheckout(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!this.product) return;
    this.checkoutService.open({
      name: this.product.name,
      price: this.product.price,
      modelId: this.product.specifications?.['Model'] || this.product.id,
      slug: this.product.slug,
      type: 'product',
      imageUrl: this.product.images?.[0] || this.product.image,
    });
  }

  getWhatsAppUrl(): string {
    if (!this.product) return '';
    const phone = '917981081579';
    const productUrl = `https://smincubators.in/products/${this.product.slug}`;
    const utmSuffix = this.utmService.getWhatsAppTrackingSuffix();
    const text = `${this.product.whatsappMessage}\n\nProduct Link: ${productUrl}${utmSuffix}`;
    const message = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${message}`;
  }

  shareOnWhatsApp(): void {
    if (!this.product) return;
    const shareUrl = this.utmService.buildShareUrl(`/products/${this.product.slug}`, 'whatsapp');
    const text = encodeURIComponent(`Check out this ${this.product.name} from SM Incubators:\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  shareOnFacebook(): void {
    if (!this.product) return;
    const shareUrl = encodeURIComponent(this.utmService.buildShareUrl(`/products/${this.product.slug}`, 'facebook'));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  }

  shareOnTwitter(): void {
    if (!this.product) return;
    const shareUrl = encodeURIComponent(this.utmService.buildShareUrl(`/products/${this.product.slug}`, 'twitter'));
    const text = encodeURIComponent(`Explore ${this.product.name} with high hatch rate at SM Incubators:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
  }

  async shareNative(): Promise<void> {
    if (!this.product) return;
    const shareUrl = this.utmService.buildShareUrl(`/products/${this.product.slug}`, 'share');
    const shared = await this.seoService.shareNative({
      title: `${this.product.name} | SM Incubators`,
      text: this.product.shortDescription || `High hatchability egg incubator: ${this.product.name}`,
      url: shareUrl,
    });
    if (!shared) {
      this.copyShareLink();
    }
  }

  copyShareLink(): void {
    if (!this.product) return;
    const shareUrl = this.utmService.buildShareUrl(`/products/${this.product.slug}`, 'copy');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.shareCopied = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.shareCopied = false;
          this.cdr.detectChanges();
        }, 2500);
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('div');
      fallback.className =
        'img-fallback absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400';
      fallback.innerHTML = `<svg class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
      parent.appendChild(fallback);
    }
  }
}
