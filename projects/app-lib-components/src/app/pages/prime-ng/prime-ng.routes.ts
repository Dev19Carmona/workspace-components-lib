import { Route } from '@angular/router';

export const PRIME_NG_ROUTES: Route[] = [
  {
    path: 'button',
    loadComponent: () => import('./doc-button-ng-page/doc-button-ng-page.component').then(m => m.DocButtonNgPageComponent)
  },
  {
    path: 'table',
    loadComponent: () => import('./doc-table-ng-page/doc-table-ng-page.component').then(m => m.DocTableNgPageComponent)
  },
  {
    path: '',
    redirectTo: 'button',
    pathMatch: 'full'
  }
];
