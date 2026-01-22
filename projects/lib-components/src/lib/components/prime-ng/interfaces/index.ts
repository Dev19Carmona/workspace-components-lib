export interface IPrimeNgSelection<T = string> {
  name: string
  code: T
}

export interface ITooltipConfig {
  pTooltip: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export interface IColumnPrimeNg {
  field: string;
  header: string;
}

