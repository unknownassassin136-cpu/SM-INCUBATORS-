import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <!-- Header -->
    <div class="bg-gray-50 py-16 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Our Products</h1>
        <p class="text-xl text-gray-600 max-w-2xl">Browse our complete range of premium egg incubators. From hobbyist models to industrial-scale machines, we have the perfect solution for your needs.</p>
        
        <!-- Category Filter -->
        <div class="mt-8 flex flex-wrap gap-3">
          <button (click)="setCategory(null)" [class.bg-primary]="!selectedCategory" [class.text-white]="!selectedCategory" [class.bg-white]="selectedCategory" [class.text-gray-700]="selectedCategory" class="px-5 py-2.5 rounded-full font-medium border border-gray-200 hover:bg-primary hover:text-white transition-colors">
            All Models
          </button>
          <button *ngFor="let cat of categories" (click)="setCategory(cat)" [class.bg-primary]="selectedCategory === cat" [class.text-white]="selectedCategory === cat" [class.bg-white]="selectedCategory !== cat" [class.text-gray-700]="selectedCategory !== cat" class="px-5 py-2.5 rounded-full font-medium border border-gray-200 hover:bg-primary hover:text-white transition-colors">
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="py-16 bg-white min-h-[50vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div *ngIf="filteredProducts.length === 0" class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500">We couldn't find any products in this category.</p>
        </div>
        
        <div *ngIf="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-product-card *ngFor="let product of filteredProducts" [product]="product"></app-product-card>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Fully Automatic', 'Semi Automatic', 'Commercial', 'Mini'];
  selectedCategory: string | null = null;

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Our Products - Egg Incubators',
      description: 'Browse our complete catalog of premium egg incubators. Explore fully automatic, commercial, and mini incubators for all types of poultry.',
      keywords: 'egg incubators, fully automatic incubator, buy egg incubator online, wooden incubator, poultry farming tools',
      route: '/products'
    });
    
    // Independent subscription to products
    this.dataService.getProducts().subscribe(products => {
      this.allProducts = products || [];
      this.applyFilter();
    });

    // Independent subscription to route params
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
      this.applyFilter();
    });
  }
  
  applyFilter() {
    // Only apply if we have loaded the products array
    if (!this.allProducts || this.allProducts.length === 0) {
      return;
    }
    
    if (this.selectedCategory) {
      this.filteredProducts = this.allProducts.filter(p => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = [...this.allProducts];
    }
    
    // Force change detection just in case RxJS or caching is bypassing Zone.js
    this.cdr.detectChanges();
  }

  setCategory(category: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category },
      queryParamsHandling: 'merge'
    });
  }
}
