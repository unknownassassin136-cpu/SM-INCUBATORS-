import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { CheckoutModalComponent } from './shared/checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CheckoutModalComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar></app-navbar>
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
    
    <app-checkout-modal></app-checkout-modal>
  `
})
export class AppComponent {
  title = 'sm-incubators';
}
