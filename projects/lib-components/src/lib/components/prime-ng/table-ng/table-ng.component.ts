/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CommonModule } from '@angular/common'
import type { OnDestroy, OnInit, Signal, TemplateRef, WritableSignal } from '@angular/core'
import { ChangeDetectionStrategy, Component, computed, ContentChild, effect, inject, input, model, output, signal, ViewChild } from '@angular/core'
import { FormsModule, NonNullableFormBuilder, type FormGroup } from '@angular/forms'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { FilterMetadata, SortEvent } from 'primeng/api'
import type { Table, TableFilterEvent, TableLazyLoadEvent } from 'primeng/table'
import { TableModule } from 'primeng/table'
import * as XLSX from 'xlsx'
import { KeyToDisplayNamePipe } from '../../../pipes'
import { formatNumber, generateId, PrimeNgUtil, removeNullUndefined } from '../../../utils'
import { AminatedContainerComponent } from '../../origin/aminated-container/aminated-container.component'
import { InlineInputComponent } from '../../origin/form/components/inline-input/inline-input.component'
import { ETypeInput } from '../../origin/form/enums'
import { FormComponent } from '../../origin/form/form.component'
import type { IControlConfig } from '../../origin/form/interfaces'
import { HttpMessageComponent } from '../../origin/http-message/http-message.component'
import type { IHttpMessage } from '../../origin/http-message/interfaces'
import type { IPickListElement } from '../../origin/pick-list/interfaces'
import { BadgeNgComponent } from '../badge/badge-ng.component'
import { ButtonNgComponent } from '../button-ng/button-ng.component'
import type { IButtonConfig } from '../button-ng/interfaces'
// import { CustomDialogService } from './services/custom-dialog.service'
import { ToolbarNgComponent } from '../toolbar-ng/toolbar-ng.component'
// import { ModalAdvancedFilterComponent } from './components/modal-advanced-filter/modal-advanced-filter.component'
import type { IEditTableNgConfig, IErrorConfig, IFooterConfig, IGlobalSearchForm, ILazyLoadResponse, IMetaPagination, IPipeConfig, ITableNgConfig, ITableNgData, ITableNgLazyLoading } from './interfaces'
import { TableNgEditService } from './services/table-ng-edit.service'
import { TableNgService } from './services/table-ng.service'
import { IPrimeNgSelection, IColumnPrimeNg } from '../interfaces'


@Component({
  selector: 'app-table-ng',
  imports: [
    CommonModule,
    TableModule,
    ButtonNgComponent,
    ToolbarNgComponent,
    FormComponent,
    KeyToDisplayNamePipe,
    FormsModule,
    InlineInputComponent,
    AminatedContainerComponent,
    BadgeNgComponent,
    HttpMessageComponent
  ],
  templateUrl: './table-ng.component.html',
  styleUrl: './table-ng.component.scss',
  providers: [TableNgService, TableNgEditService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableNgComponent<T extends Record<string, any> = Record<string, any>> implements OnInit, OnDestroy {
  private readonly tableNgService = inject(TableNgService)
  private readonly tableNgEditService = inject(TableNgEditService)
  // private readonly dialogService = inject(CustomDialogService)

  readonly data = model.required<ITableNgData<T>[]>()

  // Loading state management
  private loadingTimeout: any = null
  protected isLoading = signal<boolean>(false)
  protected timeoutExpired = signal<boolean>(false)
  readonly config = model<ITableNgConfig>()
  readonly editConfig = model<IEditTableNgConfig<T>>()
  readonly footerConfig = model<IFooterConfig>()
  public toolbarButtons = model<IButtonConfig[]>([])
  public sourceElements = model<IPickListElement[]>([])
  public targetElements = model<IPickListElement[]>([])
  public httpMessage = model<IHttpMessage>()

  public lazyLoading = output<ILazyLoadResponse>()
  public outputChangeData = output<ITableNgData<T>[]>()
  public outputHandleEditInitButton = output<ITableNgData<T>>()
  public outputAddRow = output<ITableNgData<T>[]>()
  public outputDeleteRow = output<ITableNgData<T>>()
  public outputRowInlineChange = output<T>()
  public outputRowDataChange = output<ITableNgData<T>>()
  public outputEditData = output<ITableNgData<T>[]>()
  public outputIsEditing = output<boolean>()

  public resetData(): void {
    this.data.set([])
  }

  advancedFiltersPerformed: string[] = []
  advancedFiltersValues: WritableSignal<Record<string, Record<string, any>>> = signal({})
  @ViewChild('dt') dt!: Table

  private readonly fb = inject(NonNullableFormBuilder)
  constructor() {
    this.tableNgEditService.setEditConfig(this.editConfig())
    this.tableNgEditService.setKeysNames(this.config()?.keysNames ?? {})

    effect(() => {
      this.outputChangeData.emit([...this.data()])
    })

    // Effect para gestionar el loading basado en el estado de data
    effect(() => {
      const currentData = this.data()

      // Limpiar el timeout anterior si existe
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout)
        this.loadingTimeout = null
      }

      if (currentData.length === 0) {
        // Si data está vacío, activar loading
        this.isLoading.set(true)

        this.loadingTimeout = setTimeout(() => {
          if (this.data().length === 0) {
            this.isLoading.set(false)
            this.timeoutExpired.set(true)
          }
        }, 0)
      } else {
        // Si hay data, desactivar loading y resetear timeout
        this.isLoading.set(false)
        this.timeoutExpired.set(false)
      }
    })
  }
  ngOnInit(): void {
    this.tableNgService.setInitialValue([...this.data()])
  }

  ngOnDestroy(): void {
    // Limpiar el timeout al destruir el componente
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout)
      this.loadingTimeout = null
    }
  }

  get hideToolbar(): boolean { return this.config()?.hideToolbar ?? false }

  /**
   * Calcula el número total de columnas para el colspan del mensaje vacío
   */
  protected totalColumns: Signal<number> = computed(() => {
    const selectedColumns = this.config()?.selectedColumns ?? []
    const baseColumns = selectedColumns.length > 0 ? selectedColumns.length : this.keys().length
    const selectionColumn = this.config()?.selectionTableConfig?.isEnabled ? 1 : 0
    const expansionColumn = this.config()?.rowExpansionConfig?.isEnabled ? 1 : 0
    const editColumn = (this.editConfig()?.type === 'row' || this.editConfig()?.type === 'cell') && this.editConfig()?.isEnabled ? 1 : 0

    return baseColumns + selectionColumn + expansionColumn + editColumn
  })

  isPrimeNgSelection(value: any): boolean {
    return PrimeNgUtil.isPrimeNgSelection(value)
  }

  hasErrorValues(object: Record<string, IErrorConfig>): boolean {
    return Object.keys(object).length > 0
  }

  private rowFieldsValue: WritableSignal<Record<string, string | number | boolean | null | IPrimeNgSelection<string | boolean>>> = signal({})
  public rowFieldsHasValue: Signal<Record<string, boolean>> = computed(() => {
    return Object.keys(this.rowFieldsValue()).reduce((acc, key: string) => {
      acc[key] = !!this.rowFieldsValue()[key]
      return acc
    }, {} as Record<string, boolean>)
  })

  inlineChange(value: string | number | boolean | null | IPrimeNgSelection<string | boolean>, key: string) {
    this.rowFieldsValue.update((prev: Record<string, string | number | boolean | null | IPrimeNgSelection<string | boolean>>) => {
      return { ...prev, [key]: value }
    })
    this.outputRowInlineChange.emit({ ...this.rowFieldsValue() } as T)
  }

  trackById(index: number, item: { id: any }): any {
    return item.id
  }

  frozenHandle(value: boolean | undefined): boolean {
    return value ? value : false
  }

  isDate(value: any): boolean {
    return value instanceof Date
  }

  onFilter(event: TableFilterEvent) {
    const filters = event.filters
    if (!filters) return
    const global: undefined | Record<string, any> = filters['global']
    if (!global?.['value']) {
      this.handleAdvancedFiltersPerformed(filters)
    }
  }

  resetRowDatas(): void {
    this.data.update((data: ITableNgData<T>[]) => {
      return data.map((item: ITableNgData<T>) => {
        return {
          ...item,
          rowData: {} as T
        }
      })
    })
  }

  get ETypeInput(): typeof ETypeInput {
    return ETypeInput
  }

  handleAdvancedFiltersPerformed(filters: TableFilterEvent['filters']) {
    if (!filters) return
    const entriesFilters = Object.entries(filters)
    const keysColumn = this.config()?.keys ?? []
    entriesFilters.forEach(([key, value]) => {
      const valueArray = value as FilterMetadata[]
      const hasValue = !!valueArray[0]?.value
      const keyColumn = key.split('.')[1]

      if (keysColumn.includes(keyColumn)) {
        const index = this.advancedFiltersPerformed.indexOf(keyColumn)
        if (hasValue && index === -1) {
          // Agregar si no existe
          this.advancedFiltersPerformed.push(keyColumn)
        } else if (!hasValue && index !== -1) {
          // Quitar si ya no tiene valor
          this.advancedFiltersPerformed.splice(index, 1)
        }
      }

    })
  }

  numberOfRecords: Signal<number> = computed(() => {
    return this.data().length ?? 0
  })

  hasRecords: Signal<boolean> = computed(() => {
    return this.numberOfRecords() > 0
  })

  /**
   * Computed que valida si al menos una fila tiene datos válidos en rowData.
   * Retorna true si al menos una fila tiene un valor que no sea '', null o undefined.
   * Retorna false si todas las filas tienen valores vacíos, null o undefined.
   */
  hasValidRowData: Signal<boolean> = computed(() => {
    const data = this.data()

    return data.some(item => {
      if (!item?.rowData || typeof item.rowData !== 'object') {
        return false
      }

      const values = Object.values(item.rowData)

      // Verificar si al menos un valor es válido (no vacío, null o undefined)
      return values.some(value => {
        if (value === null || value === undefined || value === '') {
          return false
        }
        // Si es string, verificar que no esté vacío después de trim
        if (typeof value === 'string') {
          return value.trim() !== ''
        }
        // Para otros tipos (números, fechas, booleanos, etc.)
        return true
      })
    })
  })

  readonly keys: Signal<string[]> = computed(() => {
    return this.config()?.keys ?? []
  })

  onRowClick(item: ITableNgData<T>) {
    item.onClick()
  }

  //#region Scroll Config
  protected scrollHeight: Signal<string> = computed(() => {
    const scrollHeightInitial = this.config()?.scrollConfig?.scrollHeight ?? '58vh'
    let res: string = scrollHeightInitial
    if (this.showBottomToolbar()) {
      const { number: size, unit } = this.parseValue(scrollHeightInitial)

      res = `${size - 7.6}${unit}`
    }
    return res
  })

  private parseValue(str: string): { number: number, unit: string } {
    const match = str.match(/^(-?\d+\.?\d*)(.*)$/)

    if (match) {
      return {
        number: parseFloat(match[1]),
        unit: match[2]
      }
    }

    return { number: 0, unit: '' }
  }
  //#endregion

  //#region Paginator Config
  paginatorStyleClass: Signal<string> = computed(() => {
    if (this.showBottomToolbar()) {
      return 'p-datatable-paginator p-datatable-paginator-bottom sticky bottom-18 z-10'
    }
    return 'p-datatable-paginator p-datatable-paginator-bottom sticky bottom-2 z-10'
  })
  //#endregion

  //#region toolbar config
  showBottomToolbar: Signal<boolean> = computed(() => {
    return this.showManagementSelectionConfig()
  })
  //#endregion

  //#region Clear Filters
  clearFilters() {
    this.tableNgService.clearSearchInput()
    this.advancedFiltersPerformed = []
    this.advancedFiltersValues.set({})
    this.dt.clear()
    this.targetElements.set([])
    this.handleTableValueToSourceElements()
    this.selectedItems.set([])
  }

  get filteredValue(): boolean {
    return !!this.dt?.filteredValue && this.dt.filteredValue.length > 0
  }

  clearFiltersButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-filter-circle-xmark',
      rounded: true,
      raised: true,
      severity: 'contrast',
      tooltipConfig: {
        pTooltip: 'Limpiar filtros'
      },
      onClick: () => {
        this.clearFilters()
      }
    }
  })
  //#endregion

  //#region Global Filter
  get controlsGlobalFilter(): IControlConfig[] {
    return this.tableNgService.controls()
  }
  get searchFormGroupGlobalFilter(): FormGroup {
    return this.tableNgService.searchFormGroup()
  }

  submitGlobalSearch(formGroup: FormGroup<IGlobalSearchForm>) {
    this.dt.globalFilterFields = this.config()?.globalFilterConfig?.globalFilterFields ?? []
    this.tableNgService.submitGlobalSearch(formGroup, this.dt)
  }
  //#endregion

  //#region SORT
  customSort(event: SortEvent) {
    this.tableNgService.customSort(event)
  }
  //#endregion

  //#region Selection
  selectedItems = model<ITableNgData<T>[]>([])
  protected totalItemsSelected: Signal<number> = computed(() => this.selectedItems().length)
  protected showManagementSelectionConfig: Signal<boolean> = computed(() => this.totalItemsSelected() > 0 && (this.config()?.selectionTableConfig?.showManagementConfig ?? false))

  protected buttonTotalItemsSelected: Signal<IButtonConfig> = computed(() => {
    return {
      label: this.totalItemsSelected().toLocaleString(),
      variant: 'text',
      rounded: true
    }
  })

  protected showSelectedItemsManagementButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-eye',
      rounded: true,
      variant: 'text',
      severity: 'secondary',
      onClick: () => {
        this.openModalManagementSelectedItems()
      }
    }
  })

  openModalManagementSelectedItems() {
    this.tableNgService.openModalManagementSelectedItems(this.selectedItems, this.config())
      .then(() => { })
      .catch(() => { })
  }
  //#endregion

  //#region Custom Filter
  inlineFormChanges(inlineValue: unknown, filter: (value: any) => void, typeInput?: ETypeInput, key?: string): void {
    const lazyLoadingConfig = this.config()?.lazyLoadingConfig
    if (typeInput === ETypeInput.MULTISELECT) {
      const options: IPrimeNgSelection[] | undefined = inlineValue ?  inlineValue as IPrimeNgSelection[] : undefined
      const arrayValue: string[] | undefined = options ? options.map((data: IPrimeNgSelection) => lazyLoadingConfig?.isEnabled ? data.code : data.name) : undefined
      if (Array.isArray(arrayValue) && arrayValue.length === 0) {
        if (key) {
          this.advancedFiltersValues.update((prev: Record<string, any>) => {
            const { [key]: _value, ...rest } = prev
            return { ...rest }
          })
        }
      }
      if (inlineValue && (Array.isArray(arrayValue) && arrayValue.length > 0)) {
        filter(arrayValue)
      }
    }
  }
  formChanges(formValue: Record<string, any>, filter: (value: any) => void, key: string): void {

    if (Array.isArray(formValue['multiSelect'])) {
      this.advancedFiltersValues.update((prev: Record<string, Record<string, any>>) => {
        return { ...prev, [key]: formValue }
      })
    }
    if (!Array.isArray(formValue['multiSelect']) && this.advancedFiltersValues()?.[key]) {
      this.advancedFiltersValues.update((prev: Record<string, any>) => {
        const { [key]: _value, ...rest } = prev
        return { ...rest }
      })
    }
    const arrayValue: string[] = Array.isArray(formValue['multiSelect'])
      ? (formValue['multiSelect'] as IPrimeNgSelection[]).map((data) => data.code)
      : []

    if (arrayValue.length > 0) {
      filter(arrayValue)
    }
  }

  rowDataKey(key: string) {
    return `rowData.${key}`
  }
  //#endregion

  //#region Lazy Loading

  onLazyLoad(event: TableLazyLoadEvent) {
    const filters: Record<string, FilterMetadata | FilterMetadata[] | undefined> = event.filters ?? {}
    const filtersWithValue = this.getFiltersWithValue(filters)

    const metaPagination: IMetaPagination = {
      limit: event.rows ?? undefined,
      skip: event.first ?? undefined
    }
    if (event.sortOrder) {
      metaPagination.sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC'
    }
    if (event.sortField) {
      metaPagination.sortBy = event.sortField as 'createdAt' | 'updatedAt'
    }
    const lazyLoadResponse: ILazyLoadResponse = {
      filters: filtersWithValue,
      metaPagination
    }
    this.lazyLoading.emit(lazyLoadResponse)
  }

  private getFiltersWithValue(filters: Record<string, FilterMetadata | FilterMetadata[] | undefined>): Record<string, FilterMetadata | FilterMetadata[]> {
    const result: Record<string, FilterMetadata | FilterMetadata[]> = {}

    Object.entries(filters).forEach(([key, filter]) => {
      const keyColumn = key.split('.')[1]
      if (!filter) return

      if (Array.isArray(filter)) {
        // Si es un array, filtrar solo los elementos que tienen value
        const filtersWithValue = filter.filter(f => f.value !== undefined && f.value !== null && f.value !== '')
        if (filtersWithValue.length > 0) {
          result[keyColumn] = filtersWithValue
        }
      } else {
        // Si es un objeto único, verificar si tiene value
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          result[keyColumn] = filter
        }
      }
    })

    return result
  }
  //#endregion

  //#region Edit
  onCellValueChange() {
    this.updateDataWithTableValue()
  }

  onRowDataChange(_data: ITableNgData<T>) {
  }

  onEditData() {
    this.updateDataWithTableValue()
    this.outputEditData.emit([...this.data()])
  }

  get controlsEdit(): IControlConfig[] {
    return this.tableNgEditService.controls()
  }

  get searchFormGroupEdit(): FormGroup {
    return this.tableNgEditService.searchFormGroup()
  }

  customControlConfig(key: string, value: any): IControlConfig {
    return {
      controlName: key,
      control: this.fb.control(value),
      typeInput: ETypeInput.TEXT
    }
  }

  cellFormGroup: FormGroup = this.fb.group({})

  //#region Row

  addRowButton: Signal<IButtonConfig> = computed(() => {
    const editConfig = this.editConfig()
    const isDisabled = editConfig?.type === 'cell'
      ? (editConfig?.cellEditConfig?.isDisabledAddButton ?? false)
      : (editConfig?.rowEditConfig?.isDisabledAddButton ?? false) || this.hasRowInEdit

    const button: IButtonConfig = {
      icon: 'fa-solid fa-plus',
      rounded: true,
      severity: 'success',
      tooltipConfig: {
        pTooltip: 'Agregar registro',
        tooltipPosition: 'top'
      },
      onClick: () => {
        this.addRow()
      },
      disabled: isDisabled
    }
    return button
  })

  public addRow(): void {
    const editConfig = this.editConfig()
    // Si es modo cell y hay defaultTableNgData configurado, agregar la fila directamente
    if (editConfig?.type === 'cell' && editConfig?.cellEditConfig?.defaultTableNgData) {
      const newRow = this.editConfig()?.cellEditConfig?.defaultTableNgData
      if (newRow) {
        this.data.update(currentData => [...currentData, newRow])
        this.outputChangeData.emit(this.data())
        return
      }
    }

    // Comportamiento original para modo row o cuando no hay defaultTableNgData
    this.outputAddRow.emit(this.data())
    this.setEditingRowId(null)
  }

  private defaultTableNgData: Signal<ITableNgData<T>> = computed(() => {
    const editConfig = this.editConfig()
    let defaultData: ITableNgData<T> | undefined

    // Usar la configuración apropiada según el tipo de edición
    if (editConfig?.type === 'cell' && editConfig?.cellEditConfig?.defaultTableNgData) {
      defaultData = editConfig.cellEditConfig.defaultTableNgData
    } else if (editConfig?.type === 'row' && editConfig?.rowEditConfig?.defaultTableNgData) {
      defaultData = editConfig.rowEditConfig.defaultTableNgData
    }

    const res = { ...defaultData } as ITableNgData<T>
    return {
      ...res,
      id: generateId()
    }
  })

  private clonedRowData: T | null = null
  private editingRowId: WritableSignal<string | null> = signal(null)

  /**
   * Verifica si una fila específica está siendo editada
   */
  isRowEditing(id: string): boolean {
    return this.editingRowId() === id
  }

  /**
   * Verifica si hay alguna fila siendo editada actualmente
   */
  get hasRowInEdit(): boolean {
    return this.editingRowId() !== null
  }

  onRowEditInit(data: ITableNgData<T>) {
    // Verificar si ya hay una fila en edición

    this.clonedRowData = structuredClone(data.rowData)
    this.setEditingRowId(data.id)
    this.outputHandleEditInitButton.emit(data)
  }

  private setEditingRowId(id: string | null) {
    this.editingRowId.set(id)
    this.outputIsEditing.emit(true)
  }

  onRowEditSave(_data: ITableNgData<T>) {
    this.clonedRowData = null
    this.editingRowId.set(null)
    this.updateDataWithTableValue()
    this.setEnableErrors(false)
    this.outputIsEditing.emit(false)
    this.outputRowDataChange.emit(_data)
  }

  onRowEditCancel(data: ITableNgData<T>, index: number) {
    if (this.clonedRowData && this.editingRowId() === data.id) {
      const items = [...this.data()]
      items[index] = { ...items[index], rowData: this.clonedRowData }
      this.data.set(items)
    }
    this.clonedRowData = null
    this.setEditingRowId(null)
    this.setEnableErrors(false)
    this.outputIsEditing.emit(false)
  }

  private updateDataWithTableValue() {
    const tableValue = (this.dt.value ?? []) as ITableNgData<T>[]
    this.data.set([...tableValue])
  }

  editInitButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-pencil',
      rounded: true,
      variant: 'text',
      severity: 'secondary'
    }
  })

  getEditInitButton(productId: string): IButtonConfig {
    return {
      ...this.editInitButton(),
      disabled: this.hasRowInEdit && !this.isRowEditing(productId)
    }
  }

  editSaveButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-check',
      rounded: true,
      variant: 'text',
      severity: 'secondary'
    }
  })

  editSaveButtonWithErrors: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-check',
      rounded: true,
      variant: 'text',
      severity: 'secondary'
    }
  })

  enableErrors: boolean = false
  setEnableErrors(value: boolean) {
    this.enableErrors = value
  }

  onEditSaveWithErrors() {
    this.setEnableErrors(true)
  }

  editCancelButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-times',
      rounded: true,
      variant: 'text',
      severity: 'secondary'
    }
  })

  deleteRowButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'fa-solid fa-trash',
      rounded: true,
      variant: 'text',
      severity: 'danger'
    }
  })

  getDeleteRowButton(): IButtonConfig {
    return {
      ...this.deleteRowButton(),
      disabled: this.hasRowInEdit
    }
  }

  removeRowFromData(data: ITableNgData<T>) {
    const { id } = data
    const items = [...this.data()]
    items.splice(items.findIndex(item => item.id === id), 1)
    this.data.set(items)
    this.outputDeleteRow.emit(data)
  }

  deleteRow(data: ITableNgData<T>) {
    this.removeRowFromData(data)
    this.outputEditData.emit(this.data())
  }
  //#endregion Row

  get footerRows() {
    return this.footerConfig()?.footerRows || []
  }

  applyPipe(value: any, pipeConfig?: IPipeConfig): string {
    if (!pipeConfig || !pipeConfig.pipe) {
      return value?.toString() || ''
    }

    switch (pipeConfig.pipe) {
    case 'currency': {
      const currencyCode = pipeConfig.args?.[0] || 'COP'
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currencyCode

      }).format(value)
    }

    case 'number': {
      const digits = pipeConfig.args?.[0] || '1.2-2'
      const [minInteger, fractional] = digits.split('.')
      const [minFractional, maxFractional] = fractional ? fractional.split('-') : ['0', '0']
      return new Intl.NumberFormat('es-CO', {
        minimumIntegerDigits: parseInt(minInteger),
        minimumFractionDigits: parseInt(minFractional),
        maximumFractionDigits: parseInt(maxFractional || minFractional)
      }).format(value)
    }

    case 'date': {
      if (value instanceof Date) {
        return value.toLocaleDateString('es-CO')
      }
      return value?.toString() || ''
    }

    default:
      return value?.toString() || ''
    }
  }

  // #endregion
  //#region Row Expansion
  protected rowExpansionButton(isRowExpanded: boolean): Signal<IButtonConfig> {
    return computed(() => {
      return {
        icon: isRowExpanded ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right',
        rounded: true,
        variant: 'text',
        severity: 'contrast'
      }
    })
  }
  //#endregion

  itemTemplateInput = input<TemplateRef<{ $implicit: T }> | null>(null)
  @ContentChild('item', { static: true }) itemTemplate!: TemplateRef<{ $implicit: T }>
  get currentItemTemplate(): TemplateRef<{ $implicit: T }> | null {
    return this.itemTemplateInput() || this.itemTemplate || null
  }

  isThatItemInTheProductSelection(field: string): boolean {
    const selectedColumns = this.config()?.selectedColumns ?? []
    if (!selectedColumns.length) {
      return true
    }
    return selectedColumns.some((column: IColumnPrimeNg) => column.field === field)
  }

  //#region Advanced Identifier Filters
  advancedIdentifierFiltersButton: Signal<IButtonConfig> = computed(() => {
    return {
      icon: 'pi pi-filter',
      rounded: true,
      severity: 'warn',
      raised: true,
      tooltipConfig: {
        pTooltip: this.data().length === 0 ? 'No hay datos para filtrar' : 'Filtros avanzados',
        tooltipPosition: 'top'
      },
      onClick: () => {
        this.openAdvancedIdentifierFilters()
      },
      disabled: this.data().length === 0
    }
  })
  openAdvancedIdentifierFilters() {
    if (this.sourceElements().length === 0) {
      this.handleTableValueToSourceElements()
    }
    this.handleSelectedItemsToSourceElements()
    if (this.data().length === 0) {
      return
    }
    // const ref = this.dialogService.open(ModalAdvancedFilterComponent, {
    //   header: 'Filtros Avanzados',
    //   width: '70%',
    //   height: '70%',
    //   styleClass: 'overflow-hidden',
    //   data: {
    //     sourceElements: this.sourceElements(),
    //     targetElements: this.targetElements()
    //   }
    // })
    // ref.onClose.subscribe((result: { success: boolean, data: { sourceElements: IPickListElement[], targetElements: IPickListElement[] } }) => {
    //   const { sourceElements, targetElements } = result?.data ?? {}
    //   if (!result?.success) {
    //     return
    //   }
    //   if (result?.data?.targetElements?.length === 0) {
    //     return
    //   }
    //   if (sourceElements.length === 0) {
    //     return
    //   }
    //   this.sourceElements.set(sourceElements ?? [])
    //   this.targetElements.set(targetElements ?? [])
    //   this.identifiersSelected.set((this.targetElements() ?? []).filter((element: IPickListElement) => element.buttonConfig?.label).map((element: IPickListElement) => element.buttonConfig?.label as string) ?? [])
    //   this.dt.filter(this.identifiersSelected(), 'rowData.identifier', 'arrayStringFilter')
    // })
  }
  private handleTableValueToSourceElements(): void {
    const value = this.data()
    if (!value.some((item: ITableNgData<T>) => item.rowData['identifier'])) {
      return
    }
    const sourceElements: IPickListElement[] = value.map((item: ITableNgData<T>) => ({
      id: item.id,
      buttonConfig: {
        label: item.rowData['identifier'],
        fullWidth: true,
        fullHeight: true
      },
      isSelected: false
    }))
    this.sourceElements.set(sourceElements)
  }
  private handleSelectedItemsToSourceElements(): void {
    const selectedItems: ITableNgData<T>[] = this.selectedItems()
    if (!selectedItems.some((item: ITableNgData<T>) => item.rowData['identifier'])) {
      return
    }
    const identifiers: string[] = selectedItems.map((item: ITableNgData<T>) => item.rowData['identifier'])
    const sourceElements: IPickListElement[] = this.sourceElements().map((item: IPickListElement) => ({
      ...item,
      isSelected: identifiers.includes(item.buttonConfig?.label as string)
    }))
    this.sourceElements.set(sourceElements)
  }
  private identifiersSelected: WritableSignal<string[]> = signal<string[]>([])
  //#endregion

  get excelButton(): IButtonConfig {
    return this.tableNgService.excelButton()
  }

  get pdfButton(): IButtonConfig {
    return this.tableNgService.pdfButton()
  }

  private lazyLoadingConfig: Signal<ITableNgLazyLoading | undefined> = computed(() => {
    return this.config()?.lazyLoadingConfig ?? undefined
  })
  private isEnabledLazyLoading: Signal<boolean> = computed(() => {
    return this.lazyLoadingConfig()?.isEnabled ?? false
  })

  private prepareDataForExport(dataToExport: ITableNgData<T>[]): Record<string, any>[] {
    const keys: string[] = this.config()?.keys ?? []
    const keysNames: Record<string, string> = this.config()?.keysNames ?? {}
    return dataToExport.map((item: ITableNgData<T>) => {
      const row: Record<string, any> = {}
      const rowData: T = item.rowData
      keys.forEach((key: string) => {
        const keyName: string = keysNames[key] ?? key
        if (rowData[key]) {
          let value = rowData[key]
          switch (typeof value) {

          case 'number':
            value = formatNumber(value)
            break

          default:
            break
          }
          row[keyName] = value
        }
      })
      return row
    })
  }

  exportCSV(data: Record<string, T>[]) {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Get title from config or use default
    const name = this.config()?.excelConfig?.name ?? 'Report'
    const fileName = name || 'table-export'

    // Excel sheet names cannot exceed 31 characters
    const sheetName = name.substring(0, 31)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  protected exportData(dt: Table, endpoint: 'excel' | 'pdf'): void {
    if (this.isEnabledLazyLoading()) {
      const filters: Record<string, any> = dt.filters ?? {}
      const filterQuery: Record<string, any> = {}
      Object.entries(filters).forEach(([key, value]) => {
        const keyName = key.split('.')[1]
        const valueFilter = value[0]?.value
        filterQuery[keyName] = valueFilter
      })
      this.lazyLoadingConfig()?.excelLazyLoadingConfig?.callback(removeNullUndefined<Record<string, any>>(filterQuery))
        .subscribe((response: ITableNgData<any>[]) => {
          const data: Record<string, T>[] = this.prepareDataForExport(response)
          if (endpoint === 'excel') {
            this.exportCSV(data)
          } else {
            this.exportPDF(data)
          }
        })
    } else {
      const value: ITableNgData<T>[] = dt.value ?? this.data()
      const filteredValue: ITableNgData<T>[] = dt.filteredValue ?? []
      let dataToExport: ITableNgData<T>[] = []

      if (filteredValue.length > 0) {
        dataToExport = filteredValue
      } else {
        dataToExport = value
      }
      const data: Record<string, T>[] = this.prepareDataForExport(dataToExport)
      if (endpoint === 'excel') {
        this.exportCSV(data)
      } else {
        this.exportPDF(data)
      }
    }
  }

  exportPDF(data: Record<string, T>[]) {
    // Get title from config or use default
    const name = this.config()?.pdfConfig?.name ?? this.config()?.excelConfig?.name ?? 'Report'
    const fileName = name || 'table-export'

    // Get keys and column names
    const keys: string[] = this.config()?.keys ?? []
    const keysNames: Record<string, string> = this.config()?.keysNames ?? {}

    // Prepare headers
    const headers: string[] = keys.map((key: string) => keysNames[key] ?? key)

    // Prepare rows data
    const rows: any[][] = data.map((row: Record<string, T>) => {
      return keys.map((key: string) => {
        const keyName: string = keysNames[key] ?? key
        return row[keyName] ?? ''
      })
    })

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Add title
    doc.setFontSize(16)
    doc.text(name, 14, 15)

    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 20 }
    })

    // Save PDF
    doc.save(`${fileName}.pdf`)
  }

  enableExcelButton: Signal<boolean> = computed(() => {
    return this.config()?.excelConfig?.isEnabled ?? false
  })

  enablePdfButton: Signal<boolean> = computed(() => {
    return this.config()?.pdfConfig?.isEnabled ?? false
  })
}
