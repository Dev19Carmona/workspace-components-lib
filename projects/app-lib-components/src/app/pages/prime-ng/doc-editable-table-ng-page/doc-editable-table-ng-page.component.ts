import { Component, signal } from '@angular/core';
import { TableNgComponent } from 'lib-components';
import type { ITableNgConfig, ITableNgData, IEditTableNgConfig } from 'lib-components';
import { ETypeInput } from 'lib-components';
import { CommonModule } from '@angular/common';

interface ExampleRowData {
  id: string;
  name: string;
  email: string;
  age: number;
  salary: number;
  status: string;
  active: boolean;
  date: Date | null;
}

@Component({
  selector: 'app-doc-editable-table-ng-page',
  imports: [TableNgComponent, CommonModule],
  templateUrl: './doc-editable-table-ng-page.component.html',
  styleUrl: './doc-editable-table-ng-page.component.scss'
})
export class DocEditableTableNgPageComponent {
  // Ejemplo básico de edición por celda
  cellEditTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, salary: 50000, status: 'Activo', active: true, date: new Date() },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'María García', email: 'maria@example.com', age: 25, salary: 45000, status: 'Activo', active: false, date: new Date() },
      raw: {},
      onClick: () => {}
    },
    {
      id: '3',
      rowData: { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, salary: 60000, status: 'Inactivo', active: true, date: new Date() },
      raw: {},
      onClick: () => {}
    }
  ]);

  cellEditTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'salary', 'status', 'active', 'date'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      salary: 'Salario',
      status: 'Estado',
      active: 'Activo',
      date: 'Fecha'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    }
  };

  cellEditConfig: IEditTableNgConfig<ExampleRowData> = {
    isEnabled: true,
    type: 'cell',
    inlineControls: {
      name: { typeInput: ETypeInput.TEXT },
      email: { typeInput: ETypeInput.EMAIL },
      age: { typeInput: ETypeInput.NUMBER },
      salary: { typeInput: ETypeInput.CURRENCY, currencyConfig: { currency: 'USD', locale: 'en-US' } },
      status: { 
        typeInput: ETypeInput.SELECT,
        selectConfig: {
          options: [
            { code: 'Activo', name: 'Activo' },
            { code: 'Inactivo', name: 'Inactivo' },
            { code: 'Pendiente', name: 'Pendiente' }
          ]
        }
      },
      active: { typeInput: ETypeInput.SWITCH },
      date: { typeInput: ETypeInput.DATE }
    },
    cellEditConfig: {
      defaultTableNgData: {
        id: '',
        rowData: { id: '', name: '', email: '', age: 0, salary: 0, status: 'Activo', active: false, date: null } as ExampleRowData,
        raw: {},
        onClick: () => {}
      },
      isDisabledAddButton: false,
      isDisabledDeleteButton: false
    }
  };

  // Ejemplo de edición por fila
  rowEditTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Ana Martínez', email: 'ana@example.com', age: 28, salary: 55000, status: 'Activo', active: true, date: new Date() },
      raw: {},
      onClick: () => {}
    },
    {
      id: '2',
      rowData: { id: '2', name: 'Pedro Sánchez', email: 'pedro@example.com', age: 32, salary: 48000, status: 'Activo', active: false, date: new Date() },
      raw: {},
      onClick: () => {}
    }
  ]);

  rowEditTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'salary', 'status', 'active', 'date'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      salary: 'Salario',
      status: 'Estado',
      active: 'Activo',
      date: 'Fecha'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    }
  };

  rowEditConfig: IEditTableNgConfig<ExampleRowData> = {
    isEnabled: true,
    type: 'row',
    inlineControls: {
      name: { typeInput: ETypeInput.TEXT },
      email: { typeInput: ETypeInput.EMAIL },
      age: { typeInput: ETypeInput.NUMBER },
      salary: { typeInput: ETypeInput.CURRENCY, currencyConfig: { currency: 'USD', locale: 'en-US' } },
      status: { 
        typeInput: ETypeInput.SELECT,
        selectConfig: {
          options: [
            { code: 'Activo', name: 'Activo' },
            { code: 'Inactivo', name: 'Inactivo' },
            { code: 'Pendiente', name: 'Pendiente' }
          ]
        }
      },
      active: { typeInput: ETypeInput.SWITCH },
      date: { typeInput: ETypeInput.DATE }
    },
    rowEditConfig: {
      defaultTableNgData: {
        id: '',
        rowData: { id: '', name: '', email: '', age: 0, salary: 0, status: 'Activo', active: false, date: null } as ExampleRowData,
        raw: {},
        onClick: () => {}
      },
      isDisabledAddButton: false,
      isDisabledDeleteButton: false
    }
  };

  // Ejemplo con diferentes tipos de controles
  advancedEditTableData = signal<ITableNgData<ExampleRowData>[]>([
    {
      id: '1',
      rowData: { id: '1', name: 'Luis Rodríguez', email: 'luis@example.com', age: 40, salary: 70000, status: 'Activo', active: true, date: new Date() },
      raw: {},
      onClick: () => {}
    }
  ]);

  advancedEditTableConfig: ITableNgConfig = {
    keys: ['name', 'email', 'age', 'salary', 'status', 'active', 'date'],
    keysNames: {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      salary: 'Salario',
      status: 'Estado',
      active: 'Activo',
      date: 'Fecha'
    },
    paginationConfig: {
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20]
    }
  };

  advancedEditConfig: IEditTableNgConfig<ExampleRowData> = {
    isEnabled: true,
    type: 'cell',
    inlineControls: {
      name: { typeInput: ETypeInput.TEXT },
      email: { typeInput: ETypeInput.EMAIL },
      age: { typeInput: ETypeInput.NUMBER },
      salary: { 
        typeInput: ETypeInput.CURRENCY, 
        currencyConfig: { 
          currency: 'USD', 
          locale: 'en-US',
          minFractionDigits: 2,
          maxFractionDigits: 2
        } 
      },
      status: { 
        typeInput: ETypeInput.SELECT,
        selectConfig: {
          options: [
            { code: 'Activo', name: 'Activo' },
            { code: 'Inactivo', name: 'Inactivo' },
            { code: 'Pendiente', name: 'Pendiente' }
          ]
        }
      },
      active: { typeInput: ETypeInput.SWITCH },
      date: { typeInput: ETypeInput.DATETIME_LOCAL }
    },
    cellEditConfig: {
      defaultTableNgData: {
        id: '',
        rowData: { id: '', name: '', email: '', age: 0, salary: 0, status: 'Activo', active: false, date: null } as ExampleRowData,
        raw: {},
        onClick: () => {}
      }
    }
  };

  // Handlers para eventos
  onEditData(data: ITableNgData<ExampleRowData>[]) {
    console.log('Datos editados:', data);
  }

  onRowDataChange(data: ITableNgData<ExampleRowData>) {
    console.log('Fila modificada:', data);
  }

  onAddRow(data: ITableNgData<ExampleRowData>[]) {
    console.log('Agregar fila. Datos actuales:', data);
  }

  onDeleteRow(data: ITableNgData<ExampleRowData>) {
    console.log('Eliminar fila:', data);
  }
}


