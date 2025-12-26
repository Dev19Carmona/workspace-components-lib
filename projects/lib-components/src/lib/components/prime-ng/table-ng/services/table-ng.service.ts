import type { Signal, WritableSignal } from '@angular/core'
import { computed, inject, Injectable, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormGroup, NonNullableFormBuilder } from '@angular/forms'
import type { SortEvent, SortMeta } from 'primeng/api'
import { FilterService } from 'primeng/api'
import type { Table } from 'primeng/table'
import { ETypeInput } from '../../../origin/form/enums'
import type { IControlConfig } from '../../../origin/form/interfaces'
import type { IButtonConfig } from '../../button-ng/interfaces'
import type { IGlobalSearchForm, ISelectionTableConfig, ITableNgConfig, ITableNgData } from '../interfaces'
import { TableNgGeneralService } from './table-ng-general.service'
import { CustomDialogService } from '../../dynamic-dialog/services/custom-dialog.service'

@Injectable({
  providedIn: 'root'
})
export class TableNgService {
  private readonly tableNgGeneralService = inject(TableNgGeneralService)
  private readonly filterService = inject(FilterService)
  private readonly dialogService = inject(CustomDialogService)
  private initialValue!: ITableNgData[]

  constructor() {
    this.filterService.register('globalCustomFilter', (rowData: string | IButtonConfig[], filter: string): boolean => {
      if (!filter || filter.trim() === '') return true

      const searchTerm = filter.toLowerCase()

      // Si es string
      if (typeof rowData === 'string') {
        return rowData.toLowerCase().includes(searchTerm)
      }

      // Si es array de botones
      if (Array.isArray(rowData)) {
        return rowData.some((button: IButtonConfig) => {
          const label = button.label || ''
          return label.toLowerCase().includes(searchTerm)
        })
      }

      return false
    })

    /**
     * Filtro para arrays de strings que verifica si el valor contiene alguno de los strings del filtro.
     * Uso: dt.filter(['valor1', 'valor2'], 'nombreColumna', 'arrayStringFilter')
     * @param rowData - Puede ser un string o array de strings
     * @param filter - Array de strings para filtrar
     * @returns true si encuentra coincidencias parciales (case-insensitive)
     */
    this.filterService.register('arrayStringFilter', (rowData: string | string[], filter: string[]): boolean => {
      // Si no hay filtro o el filtro está vacío, mostrar todos los elementos
      if (!filter || !Array.isArray(filter) || filter.length === 0) return true

      // Si rowData es null, undefined o vacío, no mostrar el elemento
      if (rowData == null || rowData === '') return false

      // Si rowData es un string
      if (typeof rowData === 'string') {
        return filter.some(filterValue =>
          rowData.toLowerCase().includes(filterValue.toLowerCase())
        )
      }

      // Si rowData es un array de strings
      if (Array.isArray(rowData)) {
        return rowData.some(dataValue =>
          filter.some(filterValue =>
            typeof dataValue === 'string' &&
            dataValue.toLowerCase().includes(filterValue.toLowerCase())
          )
        )
      }

      // Para otros tipos de datos, convertir a string si es posible
      const stringValue = String(rowData)
      if (stringValue && stringValue !== 'undefined' && stringValue !== 'null') {
        return filter.some(filterValue =>
          stringValue.toLowerCase().includes(filterValue.toLowerCase())
        )
      }

      return false
    })

    /**
     * Filtro exacto para arrays de strings que verifica coincidencias exactas.
     * Uso: dt.filter(['valor1', 'valor2'], 'nombreColumna', 'arrayStringExactFilter')
     * @param rowData - Puede ser un string o array de strings
     * @param filter - Array de strings para filtrar
     * @returns true si encuentra coincidencias exactas (case-sensitive)
     */
    this.filterService.register('arrayStringExactFilter', (rowData: string | string[], filter: string[]): boolean => {
      if (!filter || !Array.isArray(filter) || filter.length === 0) return true

      // Si rowData es null, undefined o vacío, no mostrar el elemento
      if (rowData == null || rowData === '') return false

      // Si rowData es un string
      if (typeof rowData === 'string') {
        return filter.includes(rowData)
      }

      // Si rowData es un array de strings
      if (Array.isArray(rowData)) {
        return rowData.some(dataValue => filter.includes(dataValue))
      }

      // Para otros tipos de datos, convertir a string si es posible
      const stringValue = String(rowData)
      if (stringValue && stringValue !== 'undefined' && stringValue !== 'null') {
        return filter.includes(stringValue)
      }

      return false
    })

    this.filterService.register('customIn', (rowData: string | any[], filter: string[]): boolean => {
      if (!filter || !Array.isArray(filter) || filter.length === 0) return true

      // Si rowData es null, undefined o vacío, no mostrar el elemento
      if (rowData == null || rowData === '') return false

      if (typeof rowData === 'string') {
        return filter.includes(rowData)
      }

      // Para otros tipos de datos, convertir a string si es posible
      const stringValue = String(rowData)
      if (stringValue && stringValue !== 'undefined' && stringValue !== 'null') {
        return filter.includes(stringValue)
      }

      return false
    })
  }

  get MOCK_EMPTY_DATE(): Date {
    return this.tableNgGeneralService.MOCK_EMPTY_DATE
  }

  setInitialValue(data: ITableNgData[]): void {
    this.initialValue = data
  }

  //#region SORT
  customSort(event: SortEvent) {
    let field: string | undefined = undefined
    let order: number | undefined = undefined
    switch (event.mode) {
    case 'single':
      field = event.field
      order = event.order
      break

    case 'multiple': {
      const multiSortMeta: SortMeta[] = event.multiSortMeta ?? []
      const sortMeta: SortMeta = multiSortMeta[0]
      field = sortMeta?.field ?? undefined
      order = sortMeta?.order ?? undefined
      break
    }

    default:
      break
    }

    if (!field || order === undefined) return

    const data: ITableNgData[] = event.data as ITableNgData[] ?? []

    if (order === 0) {
      // Sin sorting - restaurar orden original
      data.splice(0, data.length, ...this.initialValue)
    } else {
      // Aplicar sorting
      data.sort((a, b) => {
        const valueA = this.getFieldValue(a, field)
        const valueB = this.getFieldValue(b, field)

        const result = this.compareValues(valueA, valueB)
        return order * result // 1 para ASC, -1 para DESC
      })
    }
  }

  private getFieldValue(item: ITableNgData, field: string): string | IButtonConfig[] | Date {
    const rawValue = item.rowData[field]

    // Si es un array (probablemente IButtonConfig[])
    if (Array.isArray(rawValue) && rawValue.length > 0) {
      // Verificar si tenemos configuración de sorting para este campo
      const buttonKeyToSort = item.sortConfig?.buttonKeyToSort?.[field]

      if (buttonKeyToSort) {
        // Usar la primera configuración de botón del array
        const firstButton = rawValue[0]
        return firstButton[buttonKeyToSort] as string
      }

      // Si no hay configuración, intentar usar 'label' por defecto
      const firstButton = rawValue[0]
      return firstButton.label || ''
    }

    // Si es un string o cualquier otro tipo
    return rawValue
  }

  private compareValues(a: any, b: any): number {
    // Manejar valores null/undefined
    if (a == null && b == null) return 0
    if (a == null) return -1
    if (b == null) return 1

    // Si ambos son strings, usar localeCompare para mejor sorting
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().localeCompare(b.toLowerCase())
    }

    // Si ambos son números
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b
    }

    // Si ambos son booleanos
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b ? 0 : a ? 1 : -1
    }

    // Si son fechas
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime()
    }

    // Para otros tipos, convertir a string y comparar
    const strA = String(a).toLowerCase()
    const strB = String(b).toLowerCase()
    return strA.localeCompare(strB)
  }
  //#endregion

  //#region Global Filter
  private fb = inject(NonNullableFormBuilder)

  controls: Signal<IControlConfig[]> = computed(() => {
    const formValues = this.searchFormGroup().value
    const controls = [
      {
        controlName: 'search',
        control: this.fb.control(formValues.search, { validators: [] }),
        typeInput: ETypeInput.TEXT,
        colSpan: 12,
        label: 'Buscar'
      }
    ]
    return controls
  })
  searchFormGroup: WritableSignal<FormGroup<IGlobalSearchForm>> = signal(new FormGroup({}))
  values = toSignal(this.searchFormGroup().valueChanges)
  submitGlobalSearch(formGroup: FormGroup<IGlobalSearchForm>, dt: Table) {
    const search: string = formGroup.value.search ?? ''
    dt.filterGlobal(search, 'globalCustomFilter')
  }
  clearSearchInput() {
    this.searchFormGroup().get('search')?.setValue('')
  }
  //#endregion
  //#region Selection
  async openModalManagementSelectedItems(selectedItems: WritableSignal<ITableNgData[]>, config?: ITableNgConfig) {
    const { SelectedItemsManagementComponent } = await import('../components/selected-items-management/selected-items-management.component')
    let configSelectedItems = config
    if (config) {
      configSelectedItems = structuredClone(config)
      const selectionTableConfig: ISelectionTableConfig = {
        ...(configSelectedItems.selectionTableConfig ?? {}),
        showManagementConfig: false
      }
      delete configSelectedItems.lazyLoadingConfig

      configSelectedItems.selectionTableConfig = selectionTableConfig

    }
    const ref = this.dialogService?.open(SelectedItemsManagementComponent, {
      header: 'Gestionar Seleccionados',
      data: {
        selectedItems: selectedItems(),
        config: configSelectedItems
      },
      width: '90%',
      height: '90%',
      styleClass: 'overflow-hidden'
    })

    ref.onClose.subscribe((selectedReturnItems: ITableNgData[] | undefined) => {
      if (selectedReturnItems) {
        selectedItems.set(selectedReturnItems)
      }
    })
  }
  //#endregion

  //#region Custom Filter
  //#endregion

  excelButton: Signal<IButtonConfig> = computed(() => {
    return {
      label: '',
      icon: 'fa-solid fa-file-excel',
      variant: 'text',
      severity: 'success',
      raised: true,
      size: 'large',
      tooltipConfig: {
        pTooltip: 'Exportar a Excel',
        tooltipPosition: 'top'
      }
    }
  })

  pdfButton: Signal<IButtonConfig> = computed(() => {
    return {
      label: '',
      icon: 'fa-solid fa-file-pdf',
      variant: 'text',
      severity: 'danger',
      raised: true,
      size: 'large',
      tooltipConfig: {
        pTooltip: 'Exportar a PDF',
        tooltipPosition: 'top'
      }
    }
  })
}
