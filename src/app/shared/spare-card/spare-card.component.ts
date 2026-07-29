import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spare } from '../../models/product.model';

@Component({
  selector: 'app-spare-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 flex flex-col h-full card-hover">
      <div class="relative h-48 bg-gray-50 p-4 border-b border-gray-100">
        <!-- Placeholder for Image -->
        <div class="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          <span class="text-sm">Image: {{spare.images[0]}}</span>
        </div>
      </div>
      
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{spare.name}}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{spare.description}}</p>
        
        <div class="mt-auto mb-6">
          <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Compatible With:</h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let model of spare.compatibleModels" class="inline-block bg-blue-50 text-primary text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
              {{model}}
            </span>
          </div>
        </div>
        
        <a [href]="getWhatsAppUrl()" target="_blank" class="w-full inline-flex justify-center items-center py-2.5 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm gap-2">
          Get Quote
        </a>
      </div>
    </div>
  `
})
export class SpareCardComponent {
  @Input({ required: true }) spare!: Spare;

  getWhatsAppUrl(): string {
    const phone = '917981081579';
    const sparesUrl = `https://sm-incubators.vercel.app/spares`;
    const text = `${this.spare.whatsappMessage}\n\nLink: ${sparesUrl}`;
    const message = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${message}`;
  }
}
