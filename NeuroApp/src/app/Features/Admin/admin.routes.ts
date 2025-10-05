// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminContainer } from './Components/admin-container/admin-container';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminContainer,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./Pages/dashboard/dashboard').then(m => m.AdminDashboard) },
      { path: 'analytics', loadComponent: () => import('./Pages/analytics/analytics').then(m => m.AdminAnalytics) },
      { path: 'users', loadComponent: () => import('./Pages/users/users').then(m => m.AdminUsers) },
      { path: 'products', loadComponent: () => import('./Pages/products/products').then(m => m.AdminProducts) },
      { path: 'orders', loadComponent: () => import('./Pages/orders/orders').then(m => m.AdminOrders) },
      { path: 'categories', loadComponent: () => import('./Pages/categories/categories').then(m => m.AdminCategories) }
    ]
  }
];
