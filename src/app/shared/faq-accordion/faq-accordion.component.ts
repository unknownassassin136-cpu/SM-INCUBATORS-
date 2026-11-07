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
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.css'],
})
export class FaqAccordionComponent {
  @Input({ required: true }) item!: FaqItem;
  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }
}
