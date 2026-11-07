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
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Thermocol Fully Automatic', 'Wooden Fully Automatic', 'Commercial', 'Semi Automatic'];
  selectedCategory: string | null = null;

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Our Products - Egg Incubators',
      description:
        'Browse our complete catalog of premium egg incubators. Explore fully automatic, commercial, and mini incubators for all types of poultry.',
      keywords:
        'egg incubators, fully automatic incubator, buy egg incubator online, wooden incubator, poultry farming tools',
      route: '/products',
    });

    // Load products from DataService
    this.dataService.getProducts().subscribe((products) => {
      this.allProducts = products || [];
      this.applyFilter();
    });

    // Query params filtering
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params['category'] || null;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.allProducts || this.allProducts.length === 0) {
      return;
    }

    if (this.selectedCategory) {
      this.filteredProducts = this.allProducts.filter((p) => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = [...this.allProducts];
    }

    this.cdr.detectChanges();
  }

  setCategory(category: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category },
      queryParamsHandling: 'merge',
    });
  }
}
