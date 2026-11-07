import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService, CheckoutItem } from '../../services/checkout.service';
import { DataService } from '../../services/data.service';
import { UtmService } from '../../services/utm.service';
import { Subscription } from 'rxjs';
import { INDIAN_STATES, StateShipping } from '../../data/states.data';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.css']
})
export class CheckoutModalComponent implements OnInit, OnDestroy {
  private checkoutService = inject(CheckoutService);
  private dataService = inject(DataService);
  private utmService = inject(UtmService);
  private cdr = inject(ChangeDetectorRef);
  private subs: Subscription[] = [];

  isOpen = false;
  item: CheckoutItem | null = null;
  currentStep = 1;

  // Step 1 fields
  customerName = '';
  customerPhone = '';
  customerEmail = '';
  customerAddress = '';
  customerPincode = '';
  
  // State Search & Selection
  states = INDIAN_STATES;
  filteredStates = INDIAN_STATES;
  selectedState: StateShipping | null = null;
  stateSearchText = '';
  isStateDropdownOpen = false;

  submitted = false;

  // Step 2
  copied = false;

  // Step 3 fields
  referenceType: string = 'TRN';
  referenceNumber = '';
  step3Submitted = false;

  ngOnInit(): void {
    this.subs.push(
      this.checkoutService.isOpen.subscribe(v => {
        this.isOpen = v;
        this.cdr.detectChanges();
      }),
      this.checkoutService.item.subscribe(v => {
        this.item = v;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  close(): void {
    this.checkoutService.close();
    this.resetForm();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  goToStep2(): void {
    this.submitted = true;
    if (!this.customerName.trim() || !this.customerPhone.trim() || !this.customerAddress.trim() || !this.selectedState || !this.customerPincode.trim()) {
      return;
    }
    this.currentStep = 2;
    this.cdr.detectChanges();
  }

  // --- State selection logic ---
  filterStates(): void {
    const term = this.stateSearchText.toLowerCase().trim();
    if (!term) {
      this.filteredStates = this.states;
      return;
    }
    this.filteredStates = this.states.filter(s => s.name.toLowerCase().includes(term));
    if (this.selectedState && this.selectedState.name.toLowerCase() !== term) {
      this.selectedState = null;
    }
  }

  selectState(state: StateShipping): void {
    this.selectedState = state;
    this.stateSearchText = state.name;
    this.isStateDropdownOpen = false;
    this.cdr.detectChanges();
  }

  onStateBlur(): void {
    setTimeout(() => {
      this.isStateDropdownOpen = false;
      if (this.selectedState) {
        this.stateSearchText = this.selectedState.name;
      } else {
        this.stateSearchText = '';
      }
      this.cdr.detectChanges();
    }, 150);
  }

  get shippingCharge(): number {
    return this.selectedState ? this.selectedState.shippingCharge : 0;
  }

  get totalAmount(): number {
    if (!this.item) return 0;
    if (this.item.price === 0) return 0;
    return this.item.price + this.shippingCharge;
  }

  copyUpiId(): void {
    navigator.clipboard.writeText('7981081579@ptyes').then(() => {
      this.copied = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.copied = false;
        this.cdr.detectChanges();
      }, 2000);
    });
  }

  onQrError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="flex flex-col items-center justify-center text-gray-400">
          <svg class="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span class="text-sm font-medium">QR Code</span>
          <span class="text-xs">Use UPI ID below</span>
        </div>`;
    }
  }

  confirmAndSendWhatsApp(): void {
    const phone = '917981081579';
    let productDetailsText = '';
    if (this.item) {
      productDetailsText = `*Product:* ${this.item.name}\n*Model:* ${this.item.modelId}\n`;
      if (this.item.price > 0) {
        productDetailsText += `*Base Price:* ₹${this.item.price.toLocaleString('en-IN')}\n`;
        productDetailsText += `*Shipping:* ${this.shippingCharge > 0 ? '₹' + this.shippingCharge.toLocaleString('en-IN') : 'Free'}\n`;
        productDetailsText += `*Total Amount:* ₹${this.totalAmount.toLocaleString('en-IN')}`;
      } else {
        productDetailsText += `*Amount:* As discussed`;
      }
    }

    const customerInfo = `*Customer:* ${this.customerName}\n*Phone:* ${this.customerPhone}${this.customerEmail ? '\n*Email:* ' + this.customerEmail : ''}\n*Address:* ${this.customerAddress}\n*State:* ${this.selectedState?.name}\n*Pincode:* ${this.customerPincode}`;

    const productLink = this.item
      ? `\n\n*Product Link:* https://smincubators.in/${this.item.type === 'product' ? 'products/' + this.item.slug : 'spares'}`
      : '';

    const utmData = this.utmService.getUtmData();
    const utmSuffix = this.utmService.getWhatsAppTrackingSuffix();

    const text = `🛒 *New Order from SM Incubators Website*\n\n${productDetailsText}\n\n${customerInfo}${productLink}${utmSuffix}`;

    // Asynchronously record order inquiry in backend database with UTM tracking
    this.dataService.saveOrderInquiry({
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
      customerAddress: this.customerAddress,
      state: this.selectedState?.name || '',
      pincode: this.customerPincode,
      itemName: this.item?.name || 'Incubator',
      itemModel: this.item?.modelId || '',
      itemType: this.item?.type || 'product',
      price: this.item?.price || 0,
      shippingCharge: this.shippingCharge || 0,
      totalAmount: this.totalAmount || 0,
      utmSource: utmData.source,
      utmMedium: utmData.medium,
      utmCampaign: utmData.campaign,
      referrer: utmData.referrer,
    }).subscribe();

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${phone}?text=${encodedText}`;

    window.open(waUrl, '_blank');
    this.close();
  }

  private resetForm(): void {
    this.currentStep = 1;
    this.customerName = '';
    this.customerPhone = '';
    this.customerEmail = '';
    this.customerAddress = '';
    this.selectedState = null;
    this.stateSearchText = '';
    this.customerPincode = '';
    this.submitted = false;
    this.copied = false;
    this.referenceType = 'TRN';
    this.referenceNumber = '';
    this.step3Submitted = false;
  }
}
