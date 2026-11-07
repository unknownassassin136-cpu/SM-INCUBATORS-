import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { CheckoutModalComponent } from './shared/checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CheckoutModalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  title = 'sm-incubators';
  private router = inject(Router);

  isAdminRoute = signal(this.checkIfAdmin());

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAdminRoute.set(this.checkIfAdmin(event.urlAfterRedirects || event.url));
      });
  }

  private checkIfAdmin(url?: string): boolean {
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.pathname : '');
    return targetUrl.includes('/admin');
  }
}
