/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FormControl } from '@angular/forms'
import type { IPrimeNgSelection } from '../../../prime-ng/interfaces'
import type { ETypeInput } from '../enums'
import type { ICurrencyConfig } from '../components/inline-input/interfaces'

export interface IControlConfig extends IDefaultControlConfig {
  controlName: string
  control: FormControl
}

export interface IFormConfig {
  backgroundColor?: string
}

export interface IDateConfig {
  minDate?: Date
  maxDate?: Date
  selectionMode?: 'multiple' | 'range' | 'single'
}

export interface IMultiSelectConfig extends ICommonSelectConfig {
}

export interface ISelectConfig extends ICommonSelectConfig {
  change?: (controlConfig: IControlConfig) => void
}

interface ICommonSelectConfig {
  options: IPrimeNgSelection<any>[]
  optionLabel?: string
}

export interface IToggleButtonConfig {
  onLabel: string
  offLabel: string
}

export interface ITextareaConfig {
  rows?: number
  cols?: number
  autoResize?: boolean
  height?: string | number
  maxHeight?: string | number
  minHeight?: string | number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  variant?: 'outlined' | 'filled'
}

export interface IDefaultControlConfig {
  typeInput: ETypeInput
  readonly?: boolean
  label?: string
  dateConfig?: IDateConfig
  multiSelectConfig?: IMultiSelectConfig
  selectConfig?: ISelectConfig
  toggleConfig?: IToggleButtonConfig
  otpConfig?: {
    length: number,
    mask?: boolean,
    integerOnly?: boolean,
  },
  textareaConfig?: ITextareaConfig
  colSpan?: number
  hideLabel?: boolean
  currencyConfig?: ICurrencyConfig
}
