import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
// import Lara from '@primeng/themes/lara';
import { DialogService } from 'primeng/dynamicdialog'


import { routes } from './app.routes';
import { NebukenV1 } from './presets/nebuken-v1.preset';
import { mockApiInterceptor } from './interceptors/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    DialogService,
    providePrimeNG({
      theme: {
        preset: NebukenV1,
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    // providePrimeNG({
    //   theme: {
    //     preset: Lara,
    //     options: {
    //       darkModeSelector: false
    //     }
    //   }
    // })
  ]
};
