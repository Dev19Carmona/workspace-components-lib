import type { IDefaultControlConfig, ITextareaConfig } from '../../../interfaces'

export interface INumberLikeConfig {
  locale?: string
  minFractionDigits?: number
  maxFractionDigits?: number
}

export interface ICurrencyConfig extends INumberLikeConfig {
  currency?: string
}

export interface IKnobConfig {
  min?: number
  max?: number
  step?: number
  valueTemplate?: string
  size?: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INumberConfig extends INumberLikeConfig {}

export interface InlineControlConfig extends IDefaultControlConfig {
  currencyConfig?: ICurrencyConfig
  numberConfig?: INumberConfig
  isDisabled?: boolean
  required?: boolean
  knobConfig?: IKnobConfig
  textareaConfig?: ITextareaConfig
}
