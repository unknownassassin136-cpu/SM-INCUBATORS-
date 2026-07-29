import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar></app-navbar>
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `
})
export class AppComponent {
  title = 'sm-incubators';
}
