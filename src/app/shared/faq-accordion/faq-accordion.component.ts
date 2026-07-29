import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm hover:shadow-md transition-shadow">
      <button 
        (click)="toggle()"
        class="w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center bg-white"
        [attr.aria-expanded]="isOpen()">
        <span class="font-semibold text-gray-900 pr-8">{{ item.question }}</span>
        <span class="flex-shrink-0 text-primary transition-transform duration-300" [class.rotate-180]="isOpen()">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      <div 
        class="px-6 overflow-hidden transition-all duration-300 ease-in-out"
        [ngClass]="isOpen() ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'">
        <div class="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {{ item.answer }}
        </div>
      </div>
    </div>
  `
})
export class FaqAccordionComponent {
  @Input({ required: true }) item!: FaqItem;
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }
}
