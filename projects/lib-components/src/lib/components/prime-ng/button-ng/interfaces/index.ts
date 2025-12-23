import type { ITooltipConfig } from '../../interfaces'

export interface IButtonSeverity {
  severity: 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';
}

export interface IButtonConfig<T = any> {
  id?: string; // If provided, button will have this id
  label?: string;
  icon?: string;
  loading?: boolean;
  loadingMessages?: string[];
  onClick?: (data?: T) => void;
  severity?: IButtonSeverity['severity'];
  disabled?: boolean;
  rounded?: boolean;
  raised?: boolean;
  variant?: 'text' | 'outlined';
  badge?: string;
  size?: 'small' | 'large'
  tooltipConfig?: ITooltipConfig
  hideButton?: boolean // If true, button will not render
  fullWidth?: boolean
  fullHeight?: boolean
  iconPos?: 'right' | 'top' | 'bottom' | 'left'
  hasTemplate?: boolean,
  style?: Record<string, string>
  outlined?: boolean
  text?: boolean
  class?: string
  hasStaticClick?: boolean
}
