import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminAuthService } from './admin-auth.service';
import { Product, Spare } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private http = inject(HttpClient);
  private authService = inject(AdminAuthService);

  private get headers() {
    return { headers: this.authService.getAuthHeaders() };
  }

  // --- Products ---
  getProducts(): Observable<{ success: boolean; data: Product[] }> {
    return this.http.get<{ success: boolean; data: Product[] }>(`${environment.apiUrl}/products`);
  }

  createProduct(product: Partial<Product>): Observable<{ success: boolean; data: Product }> {
    return this.http.post<{ success: boolean; data: Product }>(`${environment.apiUrl}/products`, product, this.headers);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<{ success: boolean; data: Product }> {
    return this.http.put<{ success: boolean; data: Product }>(`${environment.apiUrl}/products/${id}`, product, this.headers);
  }

  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.apiUrl}/products/${id}`, this.headers);
  }

  // --- CSV Bulk Operations ---
  getExportCSVUrl(): string {
    return `${environment.apiUrl}/products/export/csv`;
  }

  getTemplateCSVUrl(): string {
    return `${environment.apiUrl}/products/template/csv`;
  }

  downloadExportCSV(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/products/export/csv`, { responseType: 'blob' });
  }

  downloadTemplateCSV(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/products/template/csv`, { responseType: 'blob' });
  }

  bulkUploadProducts(
    file: File,
    mode: 'dry_run' | 'upsert' | 'insert_only' | 'update_only'
  ): Observable<{
    success: boolean;
    mode: string;
    message: string;
    summary: {
      totalRows: number;
      newCount: number;
      updateCount: number;
      skippedCount: number;
      errorCount: number;
      committedInserts?: number;
      committedUpdates?: number;
    };
    rows: Array<{
      rowNumber: number;
      name: string;
      slug: string;
      category: string;
      price: number;
      action: 'NEW' | 'UPDATE' | 'SKIPPED' | 'ERROR';
      message: string;
      changes?: Record<string, { old: any; new: any }>;
      errors?: string[];
    }>;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    return this.http.post<any>(`${environment.apiUrl}/products/bulk/upload`, formData, this.headers);
  }

  // --- Spares ---
  getSpares(): Observable<{ success: boolean; data: Spare[] }> {
    return this.http.get<{ success: boolean; data: Spare[] }>(`${environment.apiUrl}/spares`);
  }

  createSpare(spare: Partial<Spare>): Observable<{ success: boolean; data: Spare }> {
    return this.http.post<{ success: boolean; data: Spare }>(`${environment.apiUrl}/spares`, spare, this.headers);
  }

  updateSpare(id: string, spare: Partial<Spare>): Observable<{ success: boolean; data: Spare }> {
    return this.http.put<{ success: boolean; data: Spare }>(`${environment.apiUrl}/spares/${id}`, spare, this.headers);
  }

  deleteSpare(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.apiUrl}/spares/${id}`, this.headers);
  }

  // --- Site Content (Hero, Settings, FAQs) ---
  getContent<T = any>(key: string): Observable<{ success: boolean; data: T }> {
    return this.http.get<{ success: boolean; data: T }>(`${environment.apiUrl}/content/${key}`);
  }

  updateContent(key: string, data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(
      `${environment.apiUrl}/content/${key}`,
      { data },
      this.headers
    );
  }

  // --- Firebase Storage Image Upload ---
  uploadImage(file: File, folder = 'products'): Observable<{ success: boolean; url: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return this.http.post<{ success: boolean; url: string; message: string }>(
      `${environment.apiUrl}/upload`,
      formData,
      this.headers
    );
  }

  // --- Orders & Inquiries ---
  getOrders(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${environment.apiUrl}/orders`, this.headers);
  }

  updateOrderStatus(id: string, status: string, notes?: string): Observable<{ success: boolean; data: any }> {
    return this.http.patch<{ success: boolean; data: any }>(
      `${environment.apiUrl}/orders/${id}/status`,
      { status, notes },
      this.headers
    );
  }
}

