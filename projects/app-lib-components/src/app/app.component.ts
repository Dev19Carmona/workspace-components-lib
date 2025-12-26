import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IButtonConfig } from 'lib-components';
import { ButtonNgComponent } from 'lib-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonNgComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;

  // Rutas principales de la aplicación
  private readonly mainRoutes = [
    { path: 'home', label: 'Home' },
    { path: 'prime-ng', label: 'Prime NG' },
    { path: 'origin', label: 'Origin' }
  ];

  // Rutas hijas de prime-ng
  private readonly primeNgRoutes = [
    { path: 'button', label: 'Button' },
    { path: 'table', label: 'Table' }
  ];

  // Rutas hijas de origin
  private readonly originRoutes = [
    { path: 'form', label: 'Form' }
  ];

  // Signal para la ruta actual
  private currentPathSignal = signal<string[]>([]);

  // Generar el menú dinámicamente según la ruta actual
  menuItems = computed<IButtonConfig[]>(() => {
    const segments = this.currentPathSignal();
    const menu: IButtonConfig[] = [];

    // Si estamos en la raíz o en home, mostrar todas las rutas principales
    if (segments.length === 0 || (segments.length === 1 && segments[0] === 'home')) {
      return this.mainRoutes.map(route => ({
        label: route.label,
        severity: 'info' as const,
        onClick: () => this.router.navigate([`/${route.path}`]),
        fullWidth: true,
        fullHeight: true,
      }));
    }

    // Si estamos dentro de prime-ng
    if (segments[0] === 'prime-ng') {
      // Siempre agregar Home
      menu.push({
        label: 'Home',
        severity: 'secondary' as const,
        onClick: () => this.router.navigate(['/home']),
        fullWidth: true,
        fullHeight: true,
      });

      // Agregar las rutas hijas de prime-ng
      this.primeNgRoutes.forEach(route => {
        menu.push({
          label: route.label,
          severity: 'secondary' as const,
          onClick: () => this.router.navigate([`/prime-ng/${route.path}`]),
          fullWidth: true,
          fullHeight: true,
        });
      });

      return menu;
    }

    // Si estamos dentro de origin
    if (segments[0] === 'origin') {
      // Siempre agregar Home
      menu.push({
        label: 'Home',
        severity: 'secondary' as const,
        onClick: () => this.router.navigate(['/home']),
        fullWidth: true,
        fullHeight: true,
      });

      // Agregar las rutas hijas de origin
      this.originRoutes.forEach(route => {
        menu.push({
          label: route.label,
          severity: 'secondary' as const,
          onClick: () => this.router.navigate([`/origin/${route.path}`]),
          fullWidth: true,
          fullHeight: true,
        });
      });

      return menu;
    }

    // Para cualquier otra ruta, mostrar las rutas principales
    return this.mainRoutes.map(route => ({
      label: route.label,
      severity: 'secondary' as const,
      onClick: () => this.router.navigate([`/${route.path}`]),
      fullWidth: true,
      fullHeight: true,
    }));
  });

  ngOnInit() {
    // Actualizar la ruta inicial
    this.updateCurrentPath();

    // Suscribirse a los cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentPath();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateCurrentPath() {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);
    this.currentPathSignal.set(segments);
  }
}
