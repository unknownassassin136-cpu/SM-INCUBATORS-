import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-20">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 class="text-9xl font-extrabold text-primary tracking-widest">404</h1>
          <div class="bg-accent px-2 text-sm rounded rotate-12 absolute text-white font-bold tracking-widest p-1 shadow-sm mx-auto left-0 right-0 w-max -mt-10 z-10">
            Page Not Found
          </div>
        </div>
        
        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Oops! The page you're looking for isn't here.</h2>
          <p class="text-gray-600 mb-8">
            You might have the wrong address, or the page may have moved.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/" class="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-soft">
              Go Home
            </a>
            <a routerLink="/products" class="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              View Products
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      route: '/404'
    });
  }
}
