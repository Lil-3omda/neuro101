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
      { path: 'courses', loadComponent: () => import('./Pages/courses/courses').then(m => m.AdminCourses) },
      { path: 'instructors', loadComponent: () => import('./Pages/instructors/instructors').then(m => m.AdminInstructors) },
      { path: 'categories', loadComponent: () => import('./Pages/categories/categories').then(m => m.AdminCategories) }
    ]
  }
];
