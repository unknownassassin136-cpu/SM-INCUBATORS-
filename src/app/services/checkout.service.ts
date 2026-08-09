import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CheckoutItem {
  name: string;
  price: number;
  modelId: string;
  slug: string;
  type: 'product' | 'spare';
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private isOpen$ = new BehaviorSubject<boolean>(false);
  private item$ = new BehaviorSubject<CheckoutItem | null>(null);

  readonly isOpen = this.isOpen$.asObservable();
  readonly item = this.item$.asObservable();

  open(item: CheckoutItem): void {
    this.item$.next(item);
    this.isOpen$.next(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen$.next(false);
    this.item$.next(null);
    document.body.style.overflow = '';
  }
}
