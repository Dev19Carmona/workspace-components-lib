export interface IPrimeNgSelection<T = string> {
  name: string
  code: T
}

export interface ITooltipConfig {
  pTooltip: string;
  tooltipPosition?: 'right' | 'top' | 'bottom' | 'left'
}

export interface IColumnPrimeNg {
  field: string;
  header: string;
}

