// app.routes.ts
import { Route } from '@angular/router';
import { provideRouter } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'products',
    loadComponent: () =>
        import('./features/products/product-list.component').then((m) => m.ProductListComponent), 
  },
  {
    path: '',
    loadComponent: () =>
        import('./sites/home/home.component').then((m) => m.HomeComponent), 
  },
//   {
//     path: '',
//     redirectTo: 'products',
//     pathMatch: 'full',
//   },
//   {
//     path: '**',
//     redirectTo: '',
//   },
];

export const provideAppRoutes = provideRouter(appRoutes);
