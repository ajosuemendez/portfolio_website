import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./sites/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./sites/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./sites/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./sites/projects/projects.component').then((m) => m.ProjectsComponent),
      },
    ],
  },
];
