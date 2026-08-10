import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService, CheckoutItem } from '../../services/checkout.service';
import { Subscription } from 'rxjs';
import { INDIAN_STATES, StateShipping } from '../../data/states.data';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div [style.display]="isOpen ? 'flex' : 'none'" class="checkout-backdrop" (click)="onBackdropClick($event)">
      <!-- Modal Container -->
      <div class="checkout-modal" (click)="$event.stopPropagation()">

        <!-- Close Button -->
        <button (click)="close()" class="checkout-close" aria-label="Close">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Step Progress Indicator -->
        <div class="checkout-steps">
          <div class="checkout-step" [class.active]="currentStep >= 1" [class.done]="currentStep > 1">
            <div class="step-circle">
              <span *ngIf="currentStep <= 1">1</span>
              <svg *ngIf="currentStep > 1" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span class="step-label">Details</span>
          </div>
          <div class="step-line" [class.active]="currentStep > 1"></div>
          <div class="checkout-step" [class.active]="currentStep >= 2" [class.done]="currentStep > 2">
            <div class="step-circle">
              <span *ngIf="currentStep <= 2">2</span>
              <svg *ngIf="currentStep > 2" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span class="step-label">Payment</span>
          </div>
          <!-- Step 3 removed -->
        </div>

        <!-- Product Summary Bar -->
        <div class="checkout-product-bar" *ngIf="item">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">{{item.name}}</p>
              <p class="text-xs text-gray-500">{{item.modelId}}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-lg font-extrabold text-primary" *ngIf="item.price > 0">₹{{item.price | number}}</p>
            <p class="text-sm font-semibold text-gray-500" *ngIf="item.price === 0">Price on request</p>
          </div>
        </div>

        <!-- Step Content Area -->
        <div class="checkout-content">

          <!-- ========== STEP 1: Customer Details ========== -->
          <div *ngIf="currentStep === 1" class="step-panel">
            <h2 class="text-xl font-bold text-gray-900 mb-1">Your Details</h2>
            <p class="text-sm text-gray-500 mb-6">Fill in your information to proceed with the order.</p>

            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="checkout-label">Full Name <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="customerName" name="name" placeholder="Enter your full name"
                         class="checkout-input" [class.error]="submitted && !customerName.trim()">
                  <p *ngIf="submitted && !customerName.trim()" class="text-xs text-red-500 mt-1">Name is required</p>
                </div>

                <div>
                  <label class="checkout-label">Phone Number <span class="text-red-500">*</span></label>
                  <input type="tel" [(ngModel)]="customerPhone" name="phone" placeholder="+91 98765 43210"
                         class="checkout-input" [class.error]="submitted && !customerPhone.trim()">
                  <p *ngIf="submitted && !customerPhone.trim()" class="text-xs text-red-500 mt-1">Phone is required</p>
                </div>
              </div>

              <div>
                <label class="checkout-label">Email Address <span class="text-gray-400">(Optional)</span></label>
                <input type="email" [(ngModel)]="customerEmail" name="email" placeholder="you@example.com"
                       class="checkout-input">
              </div>

              <div>
                <label class="checkout-label">Full Address <span class="text-red-500">*</span></label>
                <textarea [(ngModel)]="customerAddress" name="address" placeholder="House/Flat No, Street, Landmark, City, District"
                          rows="2" class="checkout-input resize-none" [class.error]="submitted && !customerAddress.trim()"></textarea>
                <p *ngIf="submitted && !customerAddress.trim()" class="text-xs text-red-500 mt-1">Address is required</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- State Searchable Dropdown -->
                <div class="relative">
                  <label class="checkout-label">State <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input type="text" [(ngModel)]="stateSearchText" name="stateSearch" (focus)="isStateDropdownOpen = true" (input)="filterStates()" (blur)="onStateBlur()" placeholder="Search state"
                           class="checkout-input pr-10" [class.error]="submitted && !selectedState" autocomplete="off">
                    <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <!-- Dropdown -->
                  <div *ngIf="isStateDropdownOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    <div *ngFor="let state of filteredStates" (mousedown)="selectState(state)" class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0 transition-colors">
                      {{ state.name }}
                    </div>
                    <div *ngIf="filteredStates.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                      No states found.
                    </div>
                  </div>
                  <p *ngIf="submitted && !selectedState" class="text-xs text-red-500 mt-1">State is required</p>
                </div>

                <div>
                  <label class="checkout-label">Pincode <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="customerPincode" name="pincode" placeholder="530001" maxlength="6"
                         class="checkout-input" [class.error]="submitted && !customerPincode.trim()">
                  <p *ngIf="submitted && !customerPincode.trim()" class="text-xs text-red-500 mt-1">Pincode is required</p>
                </div>
              </div>
            </div>

            <button (click)="goToStep2()" class="checkout-btn-primary mt-6">
              Proceed to Payment
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

          <!-- ========== STEP 2: UPI Payment ========== -->
          <div *ngIf="currentStep === 2" class="step-panel">
            <h2 class="text-xl font-bold text-gray-900 mb-1">Make Payment</h2>
            <p class="text-sm text-gray-500 mb-6">Scan the QR code or pay to the UPI ID below.</p>

            <!-- Amount Display -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6" *ngIf="item && item!.price > 0">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Product Price</span>
                <span class="font-semibold text-gray-800">₹{{item?.price | number}}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600 mb-2 pb-2 border-b border-blue-200">
                <span>Shipping <span class="text-xs text-gray-500">({{selectedState?.name}})</span></span>
                <span class="font-semibold text-gray-800">{{ shippingCharge > 0 ? '₹' + (shippingCharge | number) : 'Free' }}</span>
              </div>
              <div class="flex flex-col items-center pt-1">
                <p class="text-sm text-gray-600 mb-1 font-medium">Total Amount to Pay</p>
                <p class="text-3xl font-extrabold text-primary">₹{{totalAmount | number}}</p>
              </div>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 text-center" *ngIf="!item || item?.price === 0">
              <p class="text-sm text-gray-600 mb-1">Amount</p>
              <p class="text-lg font-bold text-gray-700">As discussed / Price on request</p>
            </div>

            <!-- QR Code -->
            <div class="flex flex-col items-center mb-6">
              <div class="w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center p-3 shadow-sm">
                <img src="/assets/images/upi-qr.png" alt="UPI QR Code" class="w-full h-full object-contain"
                     (error)="onQrError($event)">
              </div>
              <p class="text-xs text-gray-400 mt-2">Scan with any UPI app</p>
            </div>

            <!-- UPI ID Copy -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-6">
              <div>
                <p class="text-xs text-gray-500 font-medium mb-1">UPI ID</p>
                <p class="text-base font-bold text-gray-900 font-mono tracking-wide">7981081579&#64;ptyes</p>
              </div>
              <button (click)="copyUpiId()" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 flex-shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>

            <div class="flex gap-3">
              <button (click)="currentStep = 1" class="checkout-btn-secondary flex-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
              <button (click)="confirmAndSendWhatsApp()" class="checkout-btn-accent flex-[2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                I've Paid (Send WhatsApp)
              </button>
            </div>
          </div>

          <!-- ========== STEP 3: Transaction Confirmation (DISABLED) ========== -->
          <div *ngIf="false" class="step-panel">
            <h2 class="text-xl font-bold text-gray-900 mb-1">Confirm Payment</h2>
            <p class="text-sm text-gray-500 mb-6">Enter your transaction reference so we can verify your payment.</p>

            <div class="space-y-4">
              <!-- Reference Type Selection -->
              <div>
                <label class="checkout-label">Reference Type <span class="text-red-500">*</span></label>
                <div class="flex gap-3 mt-2">
                  <label class="flex-1 cursor-pointer">
                    <input type="radio" name="refType" value="TRN" [(ngModel)]="referenceType" class="sr-only peer">
                    <div class="peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:text-primary border-2 border-gray-200 rounded-xl p-3 text-center font-semibold text-gray-600 transition-all hover:border-gray-300">
                      TRN Number
                    </div>
                  </label>
                  <label class="flex-1 cursor-pointer">
                    <input type="radio" name="refType" value="UTR" [(ngModel)]="referenceType" class="sr-only peer">
                    <div class="peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:text-primary border-2 border-gray-200 rounded-xl p-3 text-center font-semibold text-gray-600 transition-all hover:border-gray-300">
                      UTR Number
                    </div>
                  </label>
                </div>
                <p *ngIf="step3Submitted && !referenceType" class="text-xs text-red-500 mt-1">Please select a reference type</p>
              </div>

              <!-- Reference Number Input -->
              <div>
                <label class="checkout-label">{{ referenceType || 'Transaction' }} Number <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="referenceNumber" [placeholder]="referenceType === 'UTR' ? 'Enter 12-digit UTR number' : 'Enter transaction reference number'"
                       class="checkout-input font-mono tracking-wider" [class.error]="step3Submitted && !referenceNumber.trim()">
                <p *ngIf="step3Submitted && !referenceNumber.trim()" class="text-xs text-red-500 mt-1">Reference number is required</p>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 space-y-2">
              <h4 class="text-sm font-bold text-gray-700 mb-3">Order Summary</h4>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Product</span>
                <span class="font-semibold text-gray-900 text-right max-w-[60%] truncate">{{item?.name}}</span>
              </div>
              <div class="flex justify-between text-sm" *ngIf="item && item!.price > 0">
                <span class="text-gray-500">Base Amount</span>
                <span class="font-semibold text-gray-700">₹{{item?.price | number}}</span>
              </div>
              <div class="flex justify-between text-sm" *ngIf="item && item!.price > 0">
                <span class="text-gray-500">Shipping</span>
                <span class="font-semibold text-gray-700">{{ shippingCharge > 0 ? '₹' + (shippingCharge | number) : 'Free' }}</span>
              </div>
              <div class="flex justify-between text-sm border-t border-gray-200 pt-2" *ngIf="item && item!.price > 0">
                <span class="text-gray-700 font-bold">Total Amount</span>
                <span class="font-bold text-primary">₹{{totalAmount | number}}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Customer</span>
                <span class="font-semibold text-gray-900">{{customerName}}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Phone</span>
                <span class="font-semibold text-gray-900">{{customerPhone}}</span>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button (click)="currentStep = 2" class="checkout-btn-secondary flex-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
              <button (click)="confirmAndSendWhatsApp()" class="checkout-btn-accent flex-[2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                Confirm & Send to WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    .checkout-modal {
      background: white;
      border-radius: 1.5rem;
      width: 100%;
      max-width: 550px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease-out;
    }

    .checkout-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }
    .checkout-close:hover {
      background: #e5e7eb;
      color: #111827;
    }

    /* Step Progress */
    .checkout-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 2rem 0;
      gap: 0;
    }
    .checkout-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .step-circle {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      background: #e5e7eb;
      color: #9ca3af;
      transition: all 0.3s;
    }
    .checkout-step.active .step-circle {
      background: #0a1f44;
      color: white;
    }
    .checkout-step.done .step-circle {
      background: #16a34a;
      color: white;
    }
    .step-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .checkout-step.active .step-label {
      color: #0a1f44;
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: #e5e7eb;
      margin: 0 0.5rem;
      margin-bottom: 1.5rem;
      transition: background 0.3s;
      min-width: 2rem;
    }
    .step-line.active {
      background: #0a1f44;
    }

    /* Product Summary Bar */
    .checkout-product-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      margin: 1rem 1.5rem 0;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
    }

    /* Content */
    .checkout-content {
      padding: 1.5rem;
    }

    .step-panel {
      animation: fadeSlide 0.3s ease-out;
    }

    /* Form Elements */
    .checkout-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    .checkout-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      color: #111827;
      background: white;
      outline: none;
      transition: border-color 0.2s;
    }
    .checkout-input:focus {
      border-color: #0a1f44;
    }
    .checkout-input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    /* Buttons */
    .checkout-btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: #0a1f44;
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .checkout-btn-primary:hover {
      background: #0d2a5c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(10, 31, 68, 0.3);
    }

    .checkout-btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: white;
      color: #374151;
      font-weight: 600;
      font-size: 0.95rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .checkout-btn-secondary:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .checkout-btn-accent {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: #25D366;
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .checkout-btn-accent:hover {
      background: #1fb855;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeSlide {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .checkout-modal {
        max-height: 95vh;
        border-radius: 1rem;
      }
      .checkout-content {
        padding: 1rem;
      }
      .checkout-product-bar {
        margin: 0.75rem 1rem 0;
        padding: 0.75rem 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class CheckoutModalComponent implements OnInit, OnDestroy {
  private checkoutService = inject(CheckoutService);
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
    console.log('CheckoutModalComponent initialized!');
    this.subs.push(
      this.checkoutService.isOpen.subscribe(v => {
        console.log('Checkout modal isOpen changed to:', v);
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
  }

  // --- State selection logic ---
  filterStates(): void {
    const term = this.stateSearchText.toLowerCase().trim();
    if (!term) {
      this.filteredStates = this.states;
      return;
    }
    this.filteredStates = this.states.filter(s => s.name.toLowerCase().includes(term));
    // If text changes and doesn't match selected state precisely, deselect
    if (this.selectedState && this.selectedState.name.toLowerCase() !== term) {
      this.selectedState = null;
    }
  }

  selectState(state: StateShipping): void {
    this.selectedState = state;
    this.stateSearchText = state.name;
    this.isStateDropdownOpen = false;
  }

  onStateBlur(): void {
    // Timeout allows mousedown to fire on dropdown options before closing
    setTimeout(() => {
      this.isStateDropdownOpen = false;
      // Revert text to selected state name if they typed something invalid
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
  // -----------------------------

  copyUpiId(): void {
    navigator.clipboard.writeText('7981081579@ptyes').then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
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

    const text = `🛒 *New Order from SM Incubators Website*\n\n${productDetailsText}\n\n${customerInfo}${productLink}`;

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
