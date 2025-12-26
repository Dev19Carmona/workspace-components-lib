import { Route } from '@angular/router';

export const PRIME_NG_ROUTES: Route[] = [
  {
    path: 'button',
    loadComponent: () => import('./doc-button-ng-page/doc-button-ng-page.component').then(m => m.DocButtonNgPageComponent)
  },
  
  {
    path: '',
    redirectTo: 'button',
    pathMatch: 'full'
  }
];
