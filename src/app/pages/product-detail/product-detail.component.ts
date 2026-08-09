import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { CheckoutService } from '../../services/checkout.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div *ngIf="product" class="bg-gray-50 min-h-screen pb-20">
      
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-200 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex text-sm font-medium text-gray-500 space-x-2">
            <a routerLink="/" class="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a routerLink="/products" class="hover:text-primary transition-colors">Products</a>
            <span>/</span>
            <a [routerLink]="['/products']" [queryParams]="{category: product.category}" class="hover:text-primary transition-colors">{{product.category}}</a>
            <span>/</span>
            <span class="text-gray-900">{{product.name}}</span>
          </nav>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <!-- Main Product Section -->
        <div class="bg-white rounded-3xl shadow-soft p-6 md:p-10 mb-12 border border-gray-100 flex flex-col lg:flex-row gap-12">
          
          <!-- Image Gallery -->
          <div class="lg:w-1/2 flex flex-col gap-4">
            <div class="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 overflow-hidden relative group">
              <img [src]="activeImage()" 
                   [alt]="product.name" 
                   class="absolute inset-0 w-full h-full object-contain p-4"
                   (error)="onImageError($event)"
                   loading="lazy">
              <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                Zoom
              </div>
            </div>
            
            <!-- Thumbnails -->
            <div class="flex gap-4 overflow-x-auto pb-2">
              <button *ngFor="let img of product.images" 
                      (click)="activeImage.set(img)"
                      class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden relative"
                      [class.border-primary]="activeImage() === img"
                      [class.border-transparent]="activeImage() !== img">
                <img [src]="img" 
                     [alt]="product.name + ' thumbnail'" 
                     class="absolute inset-0 w-full h-full object-contain p-1"
                     loading="lazy">
              </button>
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="lg:w-1/2 flex flex-col">
            <div class="flex items-center gap-3 mb-4">
              <span class="inline-block py-1 px-3 rounded-md bg-blue-50 text-primary font-bold text-xs uppercase tracking-wider border border-blue-100">
                {{product.category}}
              </span>
              <span class="inline-block py-1 px-3 rounded-md bg-green-50 text-green-700 font-bold text-xs uppercase tracking-wider border border-green-100">
                {{product.availability}}
              </span>
            </div>
            
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              {{product.name}}
            </h1>

            <!-- Price Display -->
            <div class="mb-4" *ngIf="product.price > 0">
              <span class="text-3xl font-extrabold text-primary">₹{{product.price | number}}</span>
              <span *ngIf="product.originalPrice" class="text-lg text-gray-400 line-through ml-3">₹{{product.originalPrice | number}}</span>
              <p class="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>
            <div class="mb-4" *ngIf="!product.price || product.price === 0">
              <span class="text-xl font-bold text-gray-500">Price on request</span>
            </div>
            
            <p class="text-xl text-gray-600 leading-relaxed mb-8">
              {{product.shortDescription}}
            </p>
            
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p class="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Capacity</p>
                <p class="text-lg font-bold text-gray-900">{{product.capacity}} Eggs</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p class="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Warranty</p>
                <p class="text-lg font-bold text-gray-900">{{product.warranty || product.specifications?.['Warranty'] || 'Contact Us'}}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p class="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Delivery</p>
                <p class="text-lg font-bold text-gray-900">{{product.delivery}}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p class="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Suitable Birds</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span *ngFor="let bird of product.birds" class="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium">
                    {{bird}}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Call to action -->
            <div class="mt-auto">
              <button (click)="openCheckout($event)" class="flex items-center justify-center w-full py-4 px-6 bg-primary text-white text-xl font-bold rounded-xl hover:bg-blue-900 transition-colors shadow-soft gap-3 mb-4">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {{ product.price > 0 ? '₹' + (product.price | number) + ' — Buy Now' : 'Buy Now' }}
              </button>
              
              <a [href]="getWhatsAppUrl()" target="_blank" class="flex items-center justify-center w-full py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                Have questions? Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Details Tabs Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div class="lg:col-span-2 space-y-8">
            <!-- Overview -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Overview</h2>
              <div class="prose max-w-none text-gray-700 leading-relaxed">
                <p>{{product.description}}</p>
              </div>
            </div>
            
            <!-- Features -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Key Features</h2>
              <ul class="space-y-4">
                <li *ngFor="let feature of product.features" class="flex items-start">
                  <svg class="w-6 h-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  <span class="text-gray-700">{{feature}}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="space-y-8">
            <!-- Specifications -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Specifications</h2>
              <div class="divide-y divide-gray-100">
                <div *ngFor="let spec of getSpecKeys()" class="py-3 flex justify-between items-center">
                  <span class="text-sm font-semibold text-gray-500">{{spec}}</span>
                  <span class="text-sm font-bold text-gray-900 text-right">{{product.specifications[spec]}}</span>
                </div>
              </div>
            </div>
            
            <!-- Applications -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Applications</h2>
              <ul class="space-y-3">
                <li *ngFor="let app of product.applications" class="flex items-center">
                  <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span class="text-gray-700 font-medium">{{app}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Related Products -->
        <div *ngIf="relatedProducts.length > 0" class="pt-8 border-t border-gray-200">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <app-product-card *ngFor="let relProd of relatedProducts" [product]="relProd"></app-product-card>
          </div>
        </div>

      </div>
    <div *ngIf="errorMessage" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong class="font-bold">Error loading product details:</strong>
        <span class="block sm:inline"> {{ errorMessage }}</span>
      </div>
    </div>
    
    <div *ngIf="isLoading && !errorMessage" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
        <div class="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div class="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private checkoutService = inject(CheckoutService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  product: Product | undefined;
  relatedProducts: Product[] = [];
  activeImage = signal<string>('');
  errorMessage: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
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
            // SEO
            this.seoService.setSeoData({
              title: product.name,
              description: product.shortDescription,
              keywords: `${product.name}, ${product.category} incubator, egg incubator, poultry farming, buy incubator online, sm incubators`,
              route: `/products/${product.slug}`
            });
            
            // Structured Data
            const structuredData: any = {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "image": product.images ? product.images.map(img => `https://smincubators.in/${img}`) : [],
              "description": product.description,
              "sku": product.id,
              "brand": {
                "@type": "Brand",
                "name": "SM Incubators"
              }
            };
            if (product.price > 0) {
              structuredData["offers"] = {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": product.price.toString(),
                "availability": "https://schema.org/InStock",
                "seller": { "@type": "Organization", "name": "SM Incubators" }
              };
            }
            this.seoService.setStructuredData(structuredData);
          } catch (e: any) {
             console.error("SEO Error:", e);
          }

          // Load related products
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
      }
    });
  }

  loadRelatedProducts(slugs: string[]) {
    this.dataService.getProducts().subscribe(products => {
      this.relatedProducts = products.filter(p => slugs.includes(p.slug)).slice(0, 3);
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
      imageUrl: this.product.images?.[0] || this.product.image
    });
  }

  getWhatsAppUrl(): string {
    if (!this.product) return '';
    const phone = '917981081579';
    const productUrl = `https://smincubators.in/products/${this.product.slug}`;
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
      fallback.innerHTML = `<svg class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
      parent.appendChild(fallback);
    }
  }
}
