import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spare } from '../../models/product.model';
import { CheckoutService } from '../../services/checkout.service';
import { UtmService } from '../../services/utm.service';

@Component({
  selector: 'app-spare-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spare-card.component.html',
  styleUrls: ['./spare-card.component.css'],
})
export class SpareCardComponent {
  @Input({ required: true }) spare!: Spare;
  private checkoutService = inject(CheckoutService);
  private utmService = inject(UtmService);

  openCheckout(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.checkoutService.open({
      name: this.spare.name,
      price: this.spare.price,
      modelId: this.spare.id,
      slug: this.spare.slug,
      type: 'spare',
    });
  }

  async shareSpare(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();
    const shareUrl = this.utmService.buildShareUrl(`/spares`, 'share');

    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${this.spare.name} | SM Incubators`,
          text: this.spare.description || this.spare.name,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => alert('Spare part link copied to clipboard!'));
    }
  }
}
