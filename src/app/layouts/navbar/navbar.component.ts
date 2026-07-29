import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sticky top-0 z-50 bg-white shadow-soft">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 flex items-center gap-3">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">SM</div>
              <div>
                <span class="font-bold text-xl text-primary block leading-tight">SM Incubators</span>
                <span class="text-xs text-gray-500 font-medium">Precision Incubation</span>
              </div>
            </a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex md:items-center md:space-x-8">
            <a routerLink="/" routerLinkActive="text-primary font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 hover:text-primary transition-colors font-medium">Home</a>
            <a routerLink="/products" routerLinkActive="text-primary font-semibold" class="text-gray-700 hover:text-primary transition-colors font-medium">Products</a>
            <a routerLink="/spares" routerLinkActive="text-primary font-semibold" class="text-gray-700 hover:text-primary transition-colors font-medium">Spare Parts</a>
            <a routerLink="/about" routerLinkActive="text-primary font-semibold" class="text-gray-700 hover:text-primary transition-colors font-medium">About</a>
            <a routerLink="/contact" routerLinkActive="text-primary font-semibold" class="text-gray-700 hover:text-primary transition-colors font-medium">Contact</a>
          </div>

          <!-- Contact Buttons -->
          <div class="hidden lg:flex items-center space-x-4">
            <a href="tel:7981081579" class="text-gray-600 hover:text-primary flex items-center gap-2 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              7981081579
            </a>
            <a href="https://wa.me/917981081579" target="_blank" class="bg-accent text-white px-5 py-2.5 rounded-full font-medium hover:bg-green-600 transition-colors shadow-soft flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
              WhatsApp
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden">
            <button (click)="toggleMenu()" type="button" class="text-gray-500 hover:text-gray-700 focus:outline-none p-2" aria-controls="mobile-menu" [attr.aria-expanded]="isMenuOpen()">
              <span class="sr-only">Open main menu</span>
              <!-- Hamburger -->
              <svg [class.hidden]="isMenuOpen()" class="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Close (X) -->
              <svg [class.hidden]="!isMenuOpen()" class="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div [class.hidden]="!isMenuOpen()" class="md:hidden border-t border-gray-100 bg-white" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a routerLink="/" (click)="closeMenu()" class="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50">Home</a>
          <a routerLink="/products" (click)="closeMenu()" class="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50">Products</a>
          <a routerLink="/spares" (click)="closeMenu()" class="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50">Spare Parts</a>
          <a routerLink="/about" (click)="closeMenu()" class="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50">About</a>
          <a routerLink="/contact" (click)="closeMenu()" class="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50">Contact</a>
        </div>
        <div class="pt-4 pb-4 border-t border-gray-100 flex flex-col gap-3 px-5">
          <a href="tel:7981081579" class="text-gray-700 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg font-medium">
            Call 7981081579
          </a>
          <a href="https://wa.me/917981081579" target="_blank" class="bg-accent text-white flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium">
            WhatsApp Us
          </a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
