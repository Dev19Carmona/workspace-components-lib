import { Component, signal, OnInit, inject } from '@angular/core';
import { ETypeInput, TableNgComponent } from 'lib-components';
import type {
  IEditTableNgConfig,
  ITableNgConfig,
  ITableNgData,
  ILazyLoadResponse,
  ISpeedDialConfig
} from 'lib-components';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

interface ExampleRowData {
  id: string;
  identifier?: string;
  name: string;
  email: string;
  age: number;
  status: string;
  isActive?: boolean;
}

// Interfaz para la respuesta del servidor simulada
interface ApiResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

@Component({
  selector: 'app-doc-table-ng-page',
  imports: [TableNgComponent, CommonModule],
  templateUrl: './doc-table-ng-page.component.html',
  styleUrl: './doc-table-ng-page.component.scss'
})
export class DocTableNgPageComponent implements OnInit {
  private http = inject(HttpClient);
  
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

  // Ejemplo con filtros avanzados por identifier
  advancedFiltersTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', identifier: 'USR-001', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', identifier: 'USR-002', name: 'María García', email: 'maria@example.com', age: 25, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', identifier: 'USR-003', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '4',
      rowData: { id: '4', identifier: 'ADM-001', name: 'Ana Martínez', email: 'ana@example.com', age: 28, status: 'Activo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  advancedFiltersTableConfig: ITableNgConfig = {
    keys: ['identifier', 'name', 'email', 'status'],
    keysNames: {
      identifier: 'Identifier',
      name: 'Nombre',
      email: 'Email',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    globalFilterConfig: {
      isEnabled: true,
      globalFilterFields: ['identifier', 'name', 'email', 'status'],
      advancedIdentifierFiltersConfig: {
        isEnabled: true
      }
    },
    selectionTableConfig: {
      isEnabled: true,
      showManagementConfig: true
    }
  };

  // Ejemplo con Speed Dial en el toolbar
  toolbarSpeedDialButtonsExample: ISpeedDialConfig[] = [
    {
      direction: 'bottom',
      mainButton: {
        icon: 'pi pi-plus',
        severity: 'help',
        rounded: true,
        tooltipConfig: {
          pTooltip: 'Acciones rápidas',
          tooltipPosition: 'top'
        }
      },
      buttons: [
        {
          icon: 'pi pi-file-excel',
          severity: 'success',
          tooltipConfig: {
            pTooltip: 'Exportar Excel',
            tooltipPosition: 'left'
          },
          onClick: () => console.log('Exportar Excel desde speed dial')
        },
        {
          icon: 'pi pi-refresh',
          severity: 'info',
          tooltipConfig: {
            pTooltip: 'Refrescar tabla',
            tooltipPosition: 'left'
          },
          onClick: () => console.log('Refrescar tabla desde speed dial')
        },
        {
          icon: 'pi pi-filter',
          severity: 'warn',
          tooltipConfig: {
            pTooltip: 'Abrir filtros',
            tooltipPosition: 'left'
          },
          onClick: () => console.log('Abrir filtros desde speed dial')
        }
      ]
    }
  ];

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

  // Ejemplo de tabla editable por celda
  editableCellTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Laura Gómez', email: 'laura@example.com', age: 29, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'Andrés Ruiz', email: 'andres@example.com', age: 33, status: 'Inactivo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  editableCellTableConfig: ITableNgConfig = {
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

  editableCellEditConfig: IEditTableNgConfig<ExampleRowData> = {
    isEnabled: true,
    type: 'cell',
    inlineControls: {
      name: { typeInput: ETypeInput.TEXT },
      email: { typeInput: ETypeInput.EMAIL },
      age: { typeInput: ETypeInput.NUMBER },
      status: {
        typeInput: ETypeInput.SELECT,
        selectConfig: {
          options: [
            { code: 'Activo', name: 'Activo' },
            { code: 'Inactivo', name: 'Inactivo' },
            { code: 'Pendiente', name: 'Pendiente' }
          ]
        }
      }
    },
    cellEditConfig: {
      defaultTableNgData: {
        id: '',
        rowData: { id: '', name: '', email: '', age: 0, status: 'Activo' },
        raw: {},
        onClick: () => {}
      },
      isDisabledAddButton: false,
      isDisabledDeleteButton: false
    }
  };

  // Ejemplo de tabla editable por fila
  editableRowTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Camila Torres', email: 'camila@example.com', age: 31, status: 'Activo' },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'Diego Morales', email: 'diego@example.com', age: 27, status: 'Activo' },
      raw: {},
      onClick: () => {}
    }
  ]);

  editableRowTableConfig: ITableNgConfig = {
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

  editableRowEditConfig: IEditTableNgConfig<ExampleRowData> = {
    isEnabled: true,
    type: 'row',
    inlineControls: {
      name: { typeInput: ETypeInput.TEXT },
      email: { typeInput: ETypeInput.EMAIL },
      age: { typeInput: ETypeInput.NUMBER },
      status: {
        typeInput: ETypeInput.SELECT,
        selectConfig: {
          options: [
            { code: 'Activo', name: 'Activo' },
            { code: 'Inactivo', name: 'Inactivo' },
            { code: 'Pendiente', name: 'Pendiente' }
          ]
        }
      }
    },
    rowEditConfig: {
      defaultTableNgData: {
        id: '',
        rowData: { id: '', name: '', email: '', age: 0, status: 'Activo' },
        raw: {},
        onClick: () => {}
      },
      isDisabledAddButton: false,
      isDisabledDeleteButton: false
    }
  };

  // Ejemplo (pruebas): INPUT por celda + inputConfig (header maestro applyBulkBooleanToColumn)
  inputCellTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Prueba input', email: 'input@example.com', age: 22, status: 'Activo', isActive: true },
      // typeCell define cómo se renderiza la celda dentro de la tabla
      typeCell: { name: ETypeInput.INPUT, isActive: ETypeInput.INPUT },
      // rowDataInput configura el lib-inline-input de esa celda
      rowDataInput: { name: { typeInput: ETypeInput.TEXT }, isActive: { typeInput: ETypeInput.SWITCH } },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'Prueba input', email: 'input@example.com', age: 22, status: 'Activo', isActive: false },
      typeCell: { name: ETypeInput.INPUT, isActive: ETypeInput.INPUT },
      rowDataInput: { name: { typeInput: ETypeInput.TEXT }, isActive: { typeInput: ETypeInput.SWITCH } },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Prueba input', email: 'input@example.com', age: 22, status: 'Activo', isActive: true },
      typeCell: { name: ETypeInput.INPUT, isActive: ETypeInput.INPUT },
      rowDataInput: { name: { typeInput: ETypeInput.TEXT }, isActive: { typeInput: ETypeInput.SWITCH } },
      raw: {},
      onClick: () => {}
    },
    {
      id: '4',
      rowData: { id: '4', name: 'Prueba input', email: 'input@example.com', age: 22, status: 'Activo', isActive: false },
      typeCell: { name: ETypeInput.INPUT, isActive: ETypeInput.INPUT },
      rowDataInput: { name: { typeInput: ETypeInput.TEXT }, isActive: { typeInput: ETypeInput.SWITCH } },
      raw: {},
      onClick: () => {}
    }
  ]);

  inputCellTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'isActive'],
    keysNames: {
      name: 'Nombre (INPUT)',
      email: 'Email',
      age: 'Edad',
      status: 'Estado',
      isActive: 'Activo'
    },
    paginationConfig: {
      paginator: false,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    },
    inputConfig: {
      isActive: {
        isEnabled: true,
        type: ETypeInput.SWITCH
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

  // Ejemplo con Lazy Loading y descarga de Excel
  lazyLoadingTableData = signal<ITableNgData<ExampleRowData>[]>([]);
  
  // Total de registros simulados en el servidor
  totalLazyRecords = 100;

  // Simula la carga de datos desde el servidor usando HTTP
  private loadLazyData(filters: Record<string, any> = {}, skip: number = 0, limit: number = 10): Observable<ITableNgData<ExampleRowData>[]> {
    // Construir parámetros de la petición HTTP
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
    
    // Agregar filtros como parámetros de query
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(`filter[${key}]`, value.toString());
      }
    });

    // Simular envío de filtros - mostrar en consola
    console.log('🔍 Enviando petición HTTP con filtros:', {
      url: '/api/users',
      filters: filters,
      pagination: { skip, limit },
      queryParams: params.toString()
    });

    // Simular petición HTTP GET con datos mock
    // En producción, esto sería una URL real como: 'https://api.example.com/users'
    return this.http.get<ApiResponse<ITableNgData<ExampleRowData>>>('/api/users', { params })
      .pipe(
        delay(500), // Simula latencia de red
        map((response: ApiResponse<ITableNgData<ExampleRowData>>) => {
          // Actualizar el total de registros basado en la respuesta del servidor
          this.totalLazyRecords = response.total;
          console.log('✅ Respuesta recibida del servidor:', {
            totalRecords: response.total,
            dataCount: response.data.length,
            skip: response.skip,
            limit: response.limit
          });
          return response.data;
        })
      );
  }

  // Maneja el evento de lazy loading
  onLazyLoad(event: ILazyLoadResponse): void {
    const skip = event.metaPagination.skip ?? 0;
    const limit = event.metaPagination.limit ?? 10;
    
    // Extraer filtros del evento
    const filters: Record<string, any> = {};
    Object.entries(event.filters).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'value' in value) {
        const filterKey = key.replace('rowData.', '');
        filters[filterKey] = (value as any).value;
      }
    });

    this.loadLazyData(filters, skip, limit).subscribe((data) => {
      this.lazyLoadingTableData.set(data);
    });
  }

  // Simula la carga de todos los datos para Excel usando HTTP (con filtros aplicados)
  loadExcelData(filters: Record<string, any>): Observable<ITableNgData<ExampleRowData>[]> {
    // Construir parámetros de la petición HTTP para Excel (sin paginación)
    let params = new HttpParams()
      .set('skip', '0')
      .set('limit', '10000'); // Limite alto para obtener todos los datos
    
    // Agregar filtros como parámetros de query
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(`filter[${key}]`, value.toString());
      }
    });

    // Simular envío de filtros para Excel - mostrar en consola
    console.log('📥 Enviando petición HTTP para exportar Excel con filtros:', {
      url: '/api/users/export',
      filters: filters,
      queryParams: params.toString()
    });

    // Simular petición HTTP GET para Excel
    // En producción, esto sería una URL real como: 'https://api.example.com/users/export'
    return this.http.get<ApiResponse<ITableNgData<ExampleRowData>>>('/api/users/export', { params })
      .pipe(
        delay(800), // Simula latencia de red (más tiempo para más datos)
        map((response: ApiResponse<ITableNgData<ExampleRowData>>) => {
          console.log('✅ Respuesta de exportación recibida:', {
            totalRecords: response.total,
            dataCount: response.data.length
          });
          return response.data;
        })
      );
  }

  lazyLoadingTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'status'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      status: 'Estado'
    },
    paginationConfig: {
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50]
    },
    globalFilterConfig: {
      isEnabled: true,
      globalFilterFields: ['name', 'email', 'status']
    },
    lazyLoadingConfig: {
      isEnabled: true,
      totalRecords: this.totalLazyRecords,
      excelLazyLoadingConfig: {
        callback: (filters: Record<string, any>) => {
          return this.loadExcelData(filters);
        }
      }
    },
    excelConfig: {
      isEnabled: true,
      name: 'usuarios-lazy'
    }
  };

  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadLazyData({}, 0, 10).subscribe((data) => {
      this.lazyLoadingTableData.set(data);
    });
  }
}
