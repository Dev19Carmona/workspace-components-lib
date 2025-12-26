import { Component, computed, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  
  // Signals para la navegación de documentación
  docSections = signal<Array<{ id: string; title: string }>>([]);
  activeSectionId = signal<string>('');
  private docNavigationSubscription?: Subscription;
  private intersectionObserver?: IntersectionObserver;
  
  @ViewChild('contentArea', { static: false }) contentArea?: ElementRef<HTMLElement>;

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

  // Determinar si mostrar la navegación de documentación
  showDocNavigation = computed(() => {
    const segments = this.currentPathSignal();
    // Mostrar navegación solo en páginas de documentación (no en home)
    return segments.length > 1 && segments[0] !== 'home';
  });

  ngOnInit() {
    // Actualizar la ruta inicial
    this.updateCurrentPath();

    // Suscribirse a los cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentPath();
        // Esperar a que el DOM se actualice antes de escanear las secciones
        setTimeout(() => this.scanDocumentationSections(), 100);
      });
    
    // Escanear secciones iniciales
    setTimeout(() => this.scanDocumentationSections(), 100);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.docNavigationSubscription) {
      this.docNavigationSubscription.unsubscribe();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private updateCurrentPath() {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);
    this.currentPathSignal.set(segments);
  }

  /**
   * Escanea el DOM para encontrar todas las secciones de documentación
   */
  private scanDocumentationSections(): void {
    if (!this.showDocNavigation()) {
      this.docSections.set([]);
      return;
    }

    const contentAreaElement = this.contentArea?.nativeElement;
    if (!contentAreaElement) {
      // Si el ViewChild aún no está disponible, reintentar después de un breve delay
      setTimeout(() => this.scanDocumentationSections(), 50);
      return;
    }

    const sections: Array<{ id: string; title: string }> = [];
    const docSections = contentAreaElement.querySelectorAll('.doc-section');

    docSections.forEach((section, index) => {
      const h2 = section.querySelector('h2');
      if (h2) {
        const title = h2.textContent?.trim() || '';
        const id = this.generateSectionId(title, index);
        
        // Asignar el ID al elemento section para poder hacer scroll
        section.id = id;
        sections.push({ id, title });
      }
    });

    this.docSections.set(sections);

    // Configurar Intersection Observer para detectar la sección activa
    this.setupIntersectionObserver();
  }

  /**
   * Genera un ID único para una sección basado en su título
   */
  private generateSectionId(title: string, index: number): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
      .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
      || `section-${index}`;
  }

  /**
   * Configura el Intersection Observer para detectar qué sección está visible
   */
  private setupIntersectionObserver(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    const contentAreaElement = this.contentArea?.nativeElement;
    if (!contentAreaElement) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        // Encontrar la sección más visible en la parte superior del área de contenido
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            // Preferir la sección más cercana a la parte superior del content area
            return Math.abs(aTop) - Math.abs(bTop);
          });

        if (visibleSections.length > 0) {
          const activeId = visibleSections[0].target.id;
          if (activeId) {
            this.activeSectionId.set(activeId);
          }
        }
      },
      {
        root: contentAreaElement, // Usar el content area como root
        rootMargin: '-100px 0px -70% 0px', // Considerar visible cuando está cerca de la parte superior
        threshold: 0
      }
    );

    // Observar todas las secciones dentro del content area
    contentAreaElement.querySelectorAll('.doc-section').forEach(section => {
      this.intersectionObserver?.observe(section);
    });
  }

  /**
   * Hace scroll suave a una sección específica
   */
  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const contentAreaElement = this.contentArea?.nativeElement;
    const section = document.getElementById(sectionId);
    
    if (section && contentAreaElement) {
      // Obtener la posición de la sección relativa al content area
      const contentAreaRect = contentAreaElement.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      
      // Calcular la posición relativa dentro del content area
      const relativeTop = sectionRect.top - contentAreaRect.top + contentAreaElement.scrollTop;
      
      // Offset pequeño para que no quede pegado al borde superior
      const offset = 20;
      
      // Hacer scroll dentro del content area
      contentAreaElement.scrollTo({
        top: relativeTop - offset,
        behavior: 'smooth'
      });

      // Actualizar el ID activo inmediatamente
      this.activeSectionId.set(sectionId);
    }
  }
}
