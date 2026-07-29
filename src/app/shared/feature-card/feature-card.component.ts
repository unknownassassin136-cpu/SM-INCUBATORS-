import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 card-hover text-center h-full flex flex-col items-center">
      <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-6">
        <ng-content></ng-content>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">{{ title }}</h3>
      <p class="text-gray-600 leading-relaxed">{{ description }}</p>
    </div>
  `
})
export class FeatureCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
}
