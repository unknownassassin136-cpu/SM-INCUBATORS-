import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { SpareCardComponent } from '../../shared/spare-card/spare-card.component';
import { Spare } from '../../models/product.model';

@Component({
  selector: 'app-spares',
  standalone: true,
  imports: [CommonModule, SpareCardComponent],
  template: `
    <!-- Header -->
    <div class="bg-gray-50 py-16 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Spare Parts & Accessories</h1>
        <p class="text-xl text-gray-600 max-w-2xl">Maintain and upgrade your incubators with our genuine spare parts. We stock components for all our current and legacy models.</p>
      </div>
    </div>

    <!-- Spares Grid -->
    <div class="py-16 bg-white min-h-[50vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <app-spare-card *ngFor="let spare of spares" [spare]="spare"></app-spare-card>
        </div>
      </div>
    </div>

    <!-- Contact for unlisted parts -->
    <div class="bg-blue-50 py-12 border-t border-blue-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h3>
        <p class="text-gray-600 mb-6">We might have it in stock or can source it for you.</p>
        <a href="https://wa.me/917981081579?text=Hello,%20I'm%20looking%20for%20a%20specific%20spare%20part%20not%20listed%20on%20the%20website." target="_blank" class="inline-flex items-center justify-center py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm gap-2">
          Contact Support
        </a>
      </div>
    </div>
  `
})
export class SparesComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private cdr = inject(ChangeDetectorRef);
  
  spares: Spare[] = [];

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Spare Parts & Accessories',
      description: 'Find genuine spare parts and accessories for SM Incubators. We stock heating elements, turning motors, humidity sensors, and more.',
      route: '/spares'
    });

    this.dataService.getSpares().subscribe(spares => {
      this.spares = spares;
      this.cdr.detectChanges();
    });
  }
}
