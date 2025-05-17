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
        path: 'me',
        loadComponent: () =>
          import('./sites/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'email',
        loadComponent: () =>
          import('./sites/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'works',
        loadComponent: () =>
          import('./sites/projects/projects.component').then((m) => m.ProjectsComponent),
      },
      {
        path: 'cv',
        loadComponent: () =>
          import('./sites/cv/cv.component').then((m) => m.CvComponent),
      },
    ],
  },
];
