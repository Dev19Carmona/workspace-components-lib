import { type TemplateRef } from '@angular/core'
import { type FormControl } from '@angular/forms'
import type { FilterMetadata } from 'primeng/api'
import type { ICurrencyConfig, InlineControlConfig } from '../../../origin/form/components/inline-input/interfaces/index'
import { type ETypeInput } from '../../../origin/form/enums'
import type { IButtonConfig } from '../../button-ng/interfaces'
import type { IColumnPrimeNg, IPrimeNgSelection } from '../../interfaces'
import type { Observable } from 'rxjs'

export interface ITableNgData<T = IRowData, R = unknown> {
    rowData: T;
    rowDataButtons?: Record<string, IButtonConfig[]>;
    rowDataComponents?: Record<string, TemplateRef<{ $implicit: T }>>
    typeCell?: Record<string, ETypeInput>
    currencyTypeCellConfig?: Record<string, ICurrencyConfig>
    componentTypeCellConfig?: Record<string, TemplateRef<unknown>>
    raw: R;
    onClick: (data?: unknown) => void;
    sortConfig?: ISortConfig;
    id: string;
    isSelected?: boolean;
    isLoading?: boolean;
}

export interface IMetaPagination {
    limit?: number
    skip?: number
    sortBy?: 'createdAt' | 'updatedAt'
    sortOrder?: 'ASC' | 'DESC'
  }


export type IRowData<T = Record<string, any>> = T

export type SortButtonKey = 'label' | 'icon' | 'loading' | 'severity' | 'disabled';

export interface ISortConfig {
    /**
     * Objeto que define la configuración de ordenamiento.
     * - La clave representa el nombre de la columna a ordenar.
     * - El valor indica la propiedad del botón que se utilizará para reflejar el estado del ordenamiento.
     *
     * Ejemplo:
     * {
     *   "Acciones": "label",
     * }
     */
    buttonKeyToSort?: Record<string, SortButtonKey>;
}

export interface IGlobalSearchForm {
    search?: FormControl<string>
}

export interface IPaginationConfig {
    paginator: boolean;
    rows: number;
    rowsPerPageOptions: number[];
}

export interface IColumnConfig {
    sizeByKey?: Record<string, number> // columnKey, size%
}

export interface ITableNgLabelsTitleConfig {
    customPageReport?: string;
}

export interface ITableNgConfig {
    keys: string[];
    keysNames?: Record<string, string>;
    paginationConfig: IPaginationConfig;
    globalFilterConfig?: IGlobalFilterConfig;
    selectionTableConfig?: ISelectionTableConfig;
    filterConfigByKey?: Record<string, IFilterConfigByKey>
    frozenColumnConfigByKey?: Record<string, boolean>
    scrollConfig?: IScrollConfig
    lazyLoadingConfig?: ITableNgLazyLoading
    columnConfig?: IColumnConfig
    titleConfig?: ITitleConfig
    selectedColumns?: IColumnPrimeNg[]
    rowExpansionConfig?: IRowExpansionConfig
    toolbarConfig?: IToolbarConfig
    hideToolbar?: boolean;
    excelConfig?: IExcelConfig
    pdfConfig?: IPdfConfig
}

export interface IExcelConfig {
    isEnabled: boolean;
    name: string;
}

export interface IPdfConfig {
    isEnabled: boolean;
    name: string;
}

export interface IToolbarConfig {
    isEnabled: boolean;
}

export interface IRowExpansionConfig {
    isEnabled: boolean;
    template?: TemplateRef<unknown>;
}

export interface ITitleConfig {
    isEnabled?: boolean;
    title: string;
}

export interface ITableNgLazyLoading {
    isEnabled: boolean;
    totalRecords: number;

    excelLazyLoadingConfig?: IExcelLazyLoadingConfig
}

export interface IExcelLazyLoadingConfig<T = IRowData> {
    callback: (filters: Record<string, any>) => Observable<ITableNgData<T>[]>;
}

export interface IScrollConfig {
    isEnabled: boolean;
    scrollHeight: string;
}

export interface IGlobalFilterConfig {
    isEnabled?: boolean;
    globalFilterFields?: string[];
    advancedIdentifierFiltersConfig?: IAdvancedIdentifierFiltersConfig
}

export interface IAdvancedIdentifierFiltersConfig {
    isEnabled: boolean;
}

export interface ISelectionTableConfig {
    isEnabled?: boolean;
    showManagementConfig?: boolean;
}

export interface IFilterConfigByKey {
    isEnabled?: boolean;

    primeNgColumnFilterConfig?: IPrimeNgColumnFilterConfig
    customColumnFilterConfig?: ICustomColumnFilterConfig
}

export interface IPrimeNgColumnFilterConfig {
    showMatchModes?: boolean;
    showOperator?: boolean;
    showAddButton?: boolean;
    showApplyButton?: boolean;
    showClearButton?: boolean;
    matchMode?: TPrimeNgTextMatchMode;
    type?: TPrimeNgColumnFilterType
}

export interface ICustomColumnFilterConfig {
    isEnabled: boolean;
    mode?: TCustomColumnFilterModes;
    multiselectConfig?: ICustomColumnMultiSelectConfig
    inlineControlConfig?: InlineControlConfig
}

export interface ICustomColumnMultiSelectConfig {
    label: string;
    options: IPrimeNgSelection[];
}

export type TCustomColumnFilterModes = 'multiselect'

export interface IArrayStringFilterConfig {
    filterValues: string[];
    mode: 'contains' | 'exact';
}

export interface ILazyLoadResponse {
    filters: Record<string, FilterMetadata | FilterMetadata[] | undefined>;
    metaPagination: IMetaPagination
}


export type TPrimeNgTextMatchMode =
    | 'startsWith'
    | 'contains'
    | 'notContains'
    | 'endsWith'
    | 'equals'
    | 'notEquals'
    | 'in'
    | 'arrayStringFilter'
    | 'arrayStringExactFilter';

export type TPrimeNgColumnFilterType =
    | 'text'
    | 'numeric'
    | 'date'
    | 'boolean';

export interface IEditTableNgConfig<T = IRowData> {
    isEnabled: boolean;
    type: 'cell' | 'row';
    inlineControls?: IInlineControls
    rowEditConfig?: IRowEditConfig<T>
    cellEditConfig?: IConfigEditCellAndRow<T>
}

export interface IFooterConfig {
    isEnabled: boolean;
    footerRows: IFooterRow[][];
}

export interface IFooterRow {
    value: string | number;
    colSpan: number;
    class: string;
    // el pipe quiero poder enviar por ejemplo currency: 'USD' como puedo hacerlo?
    pipeConfig?: IPipeConfig
}

export interface IPipeConfig {
    pipe: string;
    args: any[];
}



export type IInlineControls = Record<string, InlineControlConfig> // key, controlConfig

export interface IRowEditConfig<T = IRowData> extends IConfigEditCellAndRow<T> {
    rowErrorConfig?: IRowErrorConfig
}

export interface IConfigEditCellAndRow<T = IRowData> {
    defaultTableNgData: ITableNgData<T>
    isDisabledAddButton?: boolean
    isDisabledDeleteButton?: boolean
}

export interface IRowErrorConfig {
    isEnabled: boolean
    fieldErrors: Record<string, Record<string, IErrorConfig>>
}

export interface IErrorConfig {
    fieldName: string
    message: string
}
