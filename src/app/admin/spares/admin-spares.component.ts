import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';
import { Spare } from '../../models/product.model';

@Component({
  selector: 'app-admin-spares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-spares.component.html',
  styleUrls: ['./admin-spares.component.css'],
})
export class AdminSparesComponent implements OnInit {
  private api = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  spares: Spare[] = [];
  filteredSpares: Spare[] = [];
  searchTerm = '';
  loading = true;

  // Modal State
  isModalOpen = false;
  isEditing = false;
  saving = false;
  uploadingImage = false;

  notification = '';
  notificationType: 'success' | 'error' = 'success';

  activeSpare: Partial<Spare> = this.getEmptySpare();
  newModelInput = '';

  ngOnInit(): void {
    this.loadSpares();
  }

  loadSpares(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.api.getSpares().subscribe({
      next: (res) => {
        this.spares = res.data || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.showNotification('Failed to load spare parts: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(): void {
    let result = [...this.spares];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(term) || s.slug.toLowerCase().includes(term)
      );
    }
    this.filteredSpares = result;
    this.cdr.detectChanges();
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.activeSpare = this.getEmptySpare();
    this.isModalOpen = true;
  }

  openEditModal(spare: Spare): void {
    this.isEditing = true;
    this.activeSpare = JSON.parse(JSON.stringify(spare));
    if (!this.activeSpare.images) this.activeSpare.images = [];
    if (!this.activeSpare.compatibleModels) this.activeSpare.compatibleModels = [];
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.activeSpare = this.getEmptySpare();
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadingImage = true;

    this.api.uploadImage(file, 'spares').subscribe({
      next: (res) => {
        this.uploadingImage = false;
        if (res.url) {
          if (!this.activeSpare.images) this.activeSpare.images = [];
          this.activeSpare.images.push(res.url);
          this.showNotification('Image uploaded successfully!', 'success');
        }
      },
      error: (err) => {
        this.uploadingImage = false;
        this.showNotification(err.error?.message || 'Failed to upload image', 'error');
      },
    });
  }

  removeImage(index: number): void {
    this.activeSpare.images?.splice(index, 1);
  }

  addCompatibleModel(): void {
    if (!this.newModelInput.trim()) return;
    if (!this.activeSpare.compatibleModels) this.activeSpare.compatibleModels = [];
    this.activeSpare.compatibleModels.push(this.newModelInput.trim());
    this.newModelInput = '';
  }

  removeCompatibleModel(index: number): void {
    this.activeSpare.compatibleModels?.splice(index, 1);
  }

  generateSlug(): void {
    if (!this.isEditing && this.activeSpare.name) {
      this.activeSpare.slug = this.activeSpare.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }

  saveSpare(): void {
    if (!this.activeSpare.name || !this.activeSpare.slug) {
      this.showNotification('Name and Slug are required.', 'error');
      return;
    }

    this.saving = true;

    if (this.isEditing && this.activeSpare.id) {
      this.api.updateSpare(this.activeSpare.id, this.activeSpare).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.showNotification('Spare part updated successfully!', 'success');
          this.loadSpares();
        },
        error: (err) => {
          this.saving = false;
          this.showNotification(err.error?.message || 'Failed to update spare part', 'error');
        },
      });
    } else {
      this.api.createSpare(this.activeSpare).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.showNotification('Spare part created successfully!', 'success');
          this.loadSpares();
        },
        error: (err) => {
          this.saving = false;
          this.showNotification(err.error?.message || 'Failed to create spare part', 'error');
        },
      });
    }
  }

  deleteSpare(spare: Spare): void {
    if (!confirm(`Are you sure you want to delete "${spare.name}"?`)) return;

    this.api.deleteSpare(spare.id).subscribe({
      next: () => {
        this.showNotification('Spare part deleted successfully', 'success');
        this.loadSpares();
      },
      error: (err) => {
        this.showNotification(err.error?.message || 'Failed to delete spare part', 'error');
      },
    });
  }

  private getEmptySpare(): Partial<Spare> {
    return {
      name: '',
      slug: '',
      price: 500,
      description: '',
      images: [],
      compatibleModels: [],
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

