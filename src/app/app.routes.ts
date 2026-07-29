import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:slug', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'spares', loadComponent: () => import('./pages/spares/spares.component').then(m => m.SparesComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./pages/policies/policies.component').then(m => m.PoliciesComponent) },
  { path: 'terms', loadComponent: () => import('./pages/policies/policies.component').then(m => m.PoliciesComponent) },
  { path: 'shipping-policy', loadComponent: () => import('./pages/policies/policies.component').then(m => m.PoliciesComponent) },
  { path: 'return-policy', loadComponent: () => import('./pages/policies/policies.component').then(m => m.PoliciesComponent) },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '/404' }
];
