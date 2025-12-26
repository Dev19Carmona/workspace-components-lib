import { Route } from '@angular/router';

export const ORIGIN_ROUTES: Route[] = [
  {
    path: 'form',
    loadComponent: () => import('./doc-form-page/doc-form-page.component').then(m => m.DocFormPageComponent)
  }
]