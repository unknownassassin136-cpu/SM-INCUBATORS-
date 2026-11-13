import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Spare } from '../models/product.model';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  heroImage: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  upiId: string;
  upiQrImage: string;
  address: string;
  googleMapsEmbedUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  private products$: Observable<Product[]> | null = null;
  private spares$: Observable<Spare[]> | null = null;

  // Invalidate cached observables (useful when admin updates products)
  refreshData(): void {
    this.products$ = null;
    this.spares$ = null;
  }

  getProducts(): Observable<Product[]> {
    if (!this.products$) {
      // Try API first, fallback to static JSON
      this.products$ = this.http.get<{ success: boolean; data: Product[] }>(`${environment.apiUrl}/products`).pipe(
        map((res) => res.data || (res as unknown as Product[])),
        catchError((err) => {
          console.warn('DataService: Backend API unavailable, falling back to local products.json', err);
          return this.http.get<Product[]>(`${this.getBaseUrl()}/assets/data/products.json`).pipe(
            catchError((fallbackErr) => {
              console.error('DataService: Failed to load local products.json', fallbackErr);
              return of([]);
            })
          );
        }),
        shareReplay(1)
      );
    }
    return this.products$;
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getProducts().pipe(map((products) => products.find((p) => p.slug === slug)));
  }

  getSpares(): Observable<Spare[]> {
    if (!this.spares$) {
      this.spares$ = this.http.get<{ success: boolean; data: Spare[] }>(`${environment.apiUrl}/spares`).pipe(
        map((res) => res.data || (res as unknown as Spare[])),
        catchError((err) => {
          console.warn('DataService: Backend API unavailable, falling back to local spares.json', err);
          return this.http.get<Spare[]>(`${this.getBaseUrl()}/assets/data/spares.json`).pipe(
            catchError((fallbackErr) => {
              console.error('DataService: Failed to load local spares.json', fallbackErr);
              return of([]);
            })
          );
        }),
        shareReplay(1)
      );
    }
    return this.spares$;
  }

  getContent<T = any>(key: string): Observable<T | null> {
    return this.http.get<{ success: boolean; data: T }>(`${environment.apiUrl}/content/${key}`).pipe(
      map((res) => res.data),
      catchError((err) => {
        console.warn(`DataService: Failed to load content for ${key}:`, err);
        return of(null);
      })
    );
  }

  saveOrderInquiry(order: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/orders`, order).pipe(
      catchError((err) => {
        console.error('DataService: Failed to record order inquiry', err);
        return of({ success: false });
      })
    );
  }
}
