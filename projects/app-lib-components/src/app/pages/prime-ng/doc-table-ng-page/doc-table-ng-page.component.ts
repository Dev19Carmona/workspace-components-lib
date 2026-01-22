import { Component, signal } from '@angular/core';
import { TableNgComponent } from 'lib-components';
import type { ITableNgConfig, ITableNgData } from 'lib-components';
import { CommonModule } from '@angular/common';

interface ExampleRowData {
  id: string;
  name: string;
  email: string;
  age: number;
  status: string;
}

@Component({
  selector: 'app-doc-table-ng-page',
  imports: [TableNgComponent, CommonModule],
  templateUrl: './doc-table-ng-page.component.html',
  styleUrl: './doc-table-ng-page.component.scss'
})
export class DocTableNgPageComponent {
  // Ejemplo básico
  basicTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  basicTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    }
  };

  // Ejemplo con filtro global
  globalFilterTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  globalFilterTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    globalFilterConfig: {
      isEnabled: true,
      globalFilterFields: ['name', 'email', 'status']
    }
  };

  // Ejemplo con selección
  selectionTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  selectionTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    selectionTableConfig: {
      isEnabled: true,
      showManagementConfig: true
    }
  };

  // Ejemplo con título
  titleTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  titleTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    titleConfig: {
      isEnabled: true,
      title: 'Lista de Usuarios'
    }
  };

  // Ejemplo con exportación
  exportTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  exportTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    excelConfig: {
      isEnabled: true,
      name: 'usuarios'
    },
    pdfConfig: {
      isEnabled: true,
      name: 'usuarios'
    }
  };

  // Ejemplo con refresh
  refreshTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  async loadRefreshData(): Promise<ITableNgData<ExampleRowData>[]> {
    // Simulación de llamada async para actualizar datos
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            rowData: { id: '1', name: 'Juan Pérez Actualizado', email: 'juan@example.com', age: 31, status: 'Activo' },
            raw: {},
            onClick: () => {}
          },
          {
            id: '2',
            rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 26, status: 'Activo' },
            raw: {},
            onClick: () => {}
          },
          {
            id: '3',
            rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 36, status: 'Activo' },
            raw: {},
            onClick: () => {}
          },
          {
            id: '4',
            rowData: { id: '4', name: 'Ana Martínez', email: 'ana@example.com', age: 28, status: 'Activo' },
            raw: {},
            onClick: () => {}
          }
        ]);
      }, 500);
    });
  }

  refreshTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    refreshConfig: {
      isEnabled: true,
      isLoading: false,
      callback: async () => {
        const newData = await this.loadRefreshData();
        this.refreshTableData.set(newData);
      }
    }
  };

  // Ejemplo con labels personalizados en español
  labelsTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  labelsTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    selectionTableConfig: {
      isEnabled: true,
      showManagementConfig: true
    },
    labelsConfig: {
      customPageReport: 'Mostrando {first} a {last} de {totalRecords} registros',
      selectedItemsLabel: 'Has seleccionado',
      recordsLabel: 'registros',
      loadingMessage: 'Cargando...',
      noDataMessage: 'No hay información disponible'
    }
  };
}
