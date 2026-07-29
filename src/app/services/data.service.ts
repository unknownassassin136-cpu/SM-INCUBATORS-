import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Spare } from '../models/product.model';
import { map, catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);

  // Use absolute URLs to prevent relative path resolution issues on nested routes
  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  private products$: Observable<Product[]> | null = null;
  private spares$: Observable<Spare[]> | null = null;

  getProducts(): Observable<Product[]> {
    if (!this.products$) {
      this.products$ = this.http.get<Product[]>(`${this.getBaseUrl()}/assets/data/products.json`).pipe(
        catchError(err => {
          console.error('DataService: Failed to load products.json', err);
          this.products$ = null;
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.products$;
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  getSpares(): Observable<Spare[]> {
    if (!this.spares$) {
      this.spares$ = this.http.get<Spare[]>(`${this.getBaseUrl()}/assets/data/spares.json`).pipe(
        catchError(err => {
          console.error('DataService: Failed to load spares.json', err);
          this.spares$ = null;
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.spares$;
  }
}
