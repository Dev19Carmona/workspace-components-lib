import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'prime-ng',
    loadChildren: () => import('./pages/prime-ng/prime-ng.routes').then(m => m.PRIME_NG_ROUTES)
  },
  {
    path: 'origin',
    loadChildren: () => import('./pages/origin/origin.routes').then(m => m.ORIGIN_ROUTES)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
