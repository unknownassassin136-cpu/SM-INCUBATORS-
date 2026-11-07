import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  loading = true;

  // Modal State
  isModalOpen = false;
  isEditing = false;
  saving = false;
  uploadingImage = false;

  // Bulk CSV State
  isBulkModalOpen = false;
  bulkMode: 'dry_run' | 'upsert' | 'insert_only' | 'update_only' = 'dry_run';
  selectedCSVFile: File | null = null;
  csvProcessing = false;
  exportingCSV = false;
  downloadingTemplate = false;
  bulkResult: any = null;
  activeBulkTab: 'all' | 'new' | 'update' | 'skipped' | 'error' = 'all';

  // Notification
  notification = '';
  notificationType: 'success' | 'error' = 'success';

  // Active product form
  activeProduct: Partial<Product> = this.getEmptyProduct();
  newFeatureInput = '';
  specKey = '';
  specValue = '';

  categories: string[] = ['All', 'Thermocol Fully Automatic', 'Wooden Fully Automatic', 'Commercial', 'Semi Automatic'];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.api.getProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.showNotification('Failed to load products: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(): void {
    let result = [...this.products];
    if (this.selectedCategory !== 'All') {
      result = result.filter((p) => p.category === this.selectedCategory);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          (p.specifications?.['Model'] && p.specifications['Model'].toLowerCase().includes(term))
      );
    }
    this.filteredProducts = result;
    this.cdr.detectChanges();
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.activeProduct = this.getEmptyProduct();
    this.isModalOpen = true;
  }

  openEditModal(product: Product): void {
    this.isEditing = true;
    // Deep clone product to avoid direct mutations
    this.activeProduct = JSON.parse(JSON.stringify(product));
    if (!this.activeProduct.images) this.activeProduct.images = [];
    if (!this.activeProduct.features) this.activeProduct.features = [];
    if (!this.activeProduct.specifications) this.activeProduct.specifications = {};
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.activeProduct = this.getEmptyProduct();
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadingImage = true;

    this.api.uploadImage(file, 'products').subscribe({
      next: (res) => {
        this.uploadingImage = false;
        if (res.url) {
          if (!this.activeProduct.images) {
            this.activeProduct.images = [];
          }
          this.activeProduct.images.push(res.url);
          if (!this.activeProduct.image) {
            this.activeProduct.image = res.url;
          }
          this.showNotification('Image uploaded successfully!', 'success');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploadingImage = false;
        this.showNotification(err.error?.message || 'Failed to upload image', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  removeImage(index: number): void {
    if (this.activeProduct.images) {
      this.activeProduct.images.splice(index, 1);
      if (this.activeProduct.images.length > 0) {
        this.activeProduct.image = this.activeProduct.images[0];
      } else {
        this.activeProduct.image = '';
      }
    }
  }

  addFeature(): void {
    if (!this.newFeatureInput.trim()) return;
    if (!this.activeProduct.features) this.activeProduct.features = [];
    this.activeProduct.features.push(this.newFeatureInput.trim());
    this.newFeatureInput = '';
  }

  removeFeature(index: number): void {
    this.activeProduct.features?.splice(index, 1);
  }

  addSpecification(): void {
    if (!this.specKey.trim() || !this.specValue.trim()) return;
    if (!this.activeProduct.specifications) this.activeProduct.specifications = {};
    this.activeProduct.specifications[this.specKey.trim()] = this.specValue.trim();
    this.specKey = '';
    this.specValue = '';
  }

  removeSpecification(key: string): void {
    if (this.activeProduct.specifications) {
      delete this.activeProduct.specifications[key];
    }
  }

  generateSlug(): void {
    if (!this.isEditing && this.activeProduct.name) {
      this.activeProduct.slug = this.activeProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }

  saveProduct(): void {
    if (!this.activeProduct.name || !this.activeProduct.slug || !this.activeProduct.category) {
      this.showNotification('Name, Slug, and Category are required.', 'error');
      return;
    }

    this.saving = true;

    if (this.isEditing && this.activeProduct.id) {
      this.api.updateProduct(this.activeProduct.id, this.activeProduct).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.showNotification('Product updated successfully!', 'success');
          this.loadProducts();
        },
        error: (err) => {
          this.saving = false;
          this.showNotification(err.error?.message || 'Failed to update product', 'error');
        },
      });
    } else {
      this.api.createProduct(this.activeProduct).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.showNotification('Product created successfully!', 'success');
          this.loadProducts();
        },
        error: (err) => {
          this.saving = false;
          this.showNotification(err.error?.message || 'Failed to create product', 'error');
        },
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    this.api.deleteProduct(product.id).subscribe({
      next: () => {
        this.showNotification('Product deleted successfully', 'success');
        this.loadProducts();
      },
      error: (err) => {
        this.showNotification(err.error?.message || 'Failed to delete product', 'error');
      },
    });
  }

  // --- Bulk CSV Actions ---
  openBulkModal(): void {
    this.isBulkModalOpen = true;
    this.bulkResult = null;
    this.selectedCSVFile = null;
    this.bulkMode = 'dry_run';
    this.activeBulkTab = 'all';
  }

  closeBulkModal(): void {
    this.isBulkModalOpen = false;
    this.selectedCSVFile = null;
    this.bulkResult = null;
  }

  onCSVFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCSVFile = input.files[0];
      this.bulkResult = null;
    }
  }

  onCSVDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        this.selectedCSVFile = file;
        this.bulkResult = null;
      } else {
        this.showNotification('Please drop a valid .csv file.', 'error');
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  clearCSVFile(): void {
    this.selectedCSVFile = null;
    this.bulkResult = null;
  }

  downloadExport(): void {
    this.exportingCSV = true;
    this.api.downloadExportCSV().subscribe({
      next: (blob) => {
        this.exportingCSV = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sm_incubators_products_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showNotification('Products exported to CSV successfully!', 'success');
      },
      error: (err) => {
        this.exportingCSV = false;
        this.showNotification('Failed to export CSV: ' + (err.error?.message || err.message), 'error');
      },
    });
  }

  downloadTemplate(): void {
    this.downloadingTemplate = true;
    this.api.downloadTemplateCSV().subscribe({
      next: (blob) => {
        this.downloadingTemplate = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products_import_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.showNotification('Template downloaded successfully!', 'success');
      },
      error: (err) => {
        this.downloadingTemplate = false;
        this.showNotification('Failed to download template: ' + (err.error?.message || err.message), 'error');
      },
    });
  }

  executeBulkUpload(modeOverride?: 'dry_run' | 'upsert' | 'insert_only' | 'update_only'): void {
    if (!this.selectedCSVFile) {
      this.showNotification('Please select or drop a CSV file first.', 'error');
      return;
    }

    const modeToRun = modeOverride || this.bulkMode;
    this.csvProcessing = true;

    this.api.bulkUploadProducts(this.selectedCSVFile, modeToRun).subscribe({
      next: (res) => {
        this.csvProcessing = false;
        this.bulkResult = res;

        if (modeToRun === 'dry_run') {
          this.showNotification(
            `Dry run complete! ${res.summary.newCount} new, ${res.summary.updateCount} updates, ${res.summary.errorCount} errors.`,
            res.summary.errorCount > 0 ? 'error' : 'success'
          );
        } else {
          this.showNotification(
            `Bulk upload committed successfully! (${res.summary.committedInserts || 0} inserted, ${res.summary.committedUpdates || 0} updated)`,
            'success'
          );
          // Refresh products table
          this.loadProducts();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.csvProcessing = false;
        this.showNotification('Bulk upload failed: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      },
    });
  }

  getFilteredBulkRows(): any[] {
    if (!this.bulkResult || !this.bulkResult.rows) return [];
    if (this.activeBulkTab === 'all') return this.bulkResult.rows;
    if (this.activeBulkTab === 'new') return this.bulkResult.rows.filter((r: any) => r.action === 'NEW');
    if (this.activeBulkTab === 'update') return this.bulkResult.rows.filter((r: any) => r.action === 'UPDATE');
    if (this.activeBulkTab === 'skipped') return this.bulkResult.rows.filter((r: any) => r.action === 'SKIPPED');
    if (this.activeBulkTab === 'error') return this.bulkResult.rows.filter((r: any) => r.action === 'ERROR');
    return this.bulkResult.rows;
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  private getEmptyProduct(): Partial<Product> {
    return {
      name: '',
      slug: '',
      category: 'Thermocol Fully Automatic',
      capacity: 50,
      price: 5000,
      originalPrice: 6000,
      shortDescription: '',
      description: '',
      image: '',
      images: [],
      features: [],
      specifications: {
        Model: '',
        Brand: 'SRI MAVULLAMMA INCUBATORS',
        Warranty: '1 Year',
      },
      availability: 'In Stock',
      delivery: 'Ships within 2-3 business days',
    };
  }

  private showNotification(msg: string, type: 'success' | 'error'): void {
    this.notification = msg;
    this.notificationType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.notification = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}

