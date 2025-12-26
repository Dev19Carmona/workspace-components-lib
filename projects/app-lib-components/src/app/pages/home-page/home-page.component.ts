import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ComponentCard {
  name: string;
  description: string;
  route: string;
  category: 'prime-ng' | 'origin';
  icon?: string;
}

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  readonly npmUrl = 'https://www.npmjs.com/package/ln-20-lib-components';
  readonly githubUrl = 'https://github.com/Dev19Carmona/workspace-components-lib';

  readonly components: ComponentCard[] = [
    {
      name: 'Button NG',
      description: 'Componente de botón basado en PrimeNG con funcionalidades avanzadas como estados de carga, mensajes rotativos, tooltips y múltiples variantes de estilo.',
      route: '/prime-ng/button',
      category: 'prime-ng',
      icon: 'fa-solid fa-hand-pointer'
    },
    {
      name: 'Table NG',
      description: 'Componente de tabla avanzado basado en PrimeNG con funcionalidades como paginación, filtros globales y por columna, selección múltiple, edición inline, lazy loading, exportación a Excel/PDF y mucho más.',
      route: '/prime-ng/table',
      category: 'prime-ng',
      icon: 'fa-solid fa-table'
    },
    {
      name: 'Form',
      description: 'Componente de formulario completo con validaciones, múltiples tipos de inputs, controles inline y gestión de estados. Incluye soporte para select, multiselect, currency, date y más.',
      route: '/origin/form',
      category: 'origin',
      icon: 'fa-solid fa-file-lines'
    },
    {
      name: 'Inline Input',
      description: 'Componente de input inline que puede ser usado individualmente. Soporta múltiples tipos de entrada incluyendo text, number, currency, date, select, multiselect y más.',
      route: '/origin/form',
      category: 'origin',
      icon: 'fa-solid fa-keyboard'
    }
  ];

  readonly primeNgComponents = this.components.filter(c => c.category === 'prime-ng');
  readonly originComponents = this.components.filter(c => c.category === 'origin');
}
