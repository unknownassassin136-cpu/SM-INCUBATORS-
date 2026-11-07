import { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'hero',
        loadComponent: () => import('./hero/admin-hero.component').then((m) => m.AdminHeroComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/admin-products.component').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'spares',
        loadComponent: () => import('./spares/admin-spares.component').then((m) => m.AdminSparesComponent),
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/admin-settings.component').then((m) => m.AdminSettingsComponent),
      },
      {
        path: 'footer',
        loadComponent: () =>
          import('./footer/admin-footer.component').then((m) => m.AdminFooterComponent),
      },
    ],
  },
];

