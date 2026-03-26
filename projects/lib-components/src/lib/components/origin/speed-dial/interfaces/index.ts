import type { IButtonConfig } from 'ln-20-lib-components'

export interface ISpeedDialConfig {
  buttons: IButtonConfig[]
  mainButton: IButtonConfig
  direction: TSpeedDialDirection
}

export type TSpeedDialDirection = 'top' | 'bottom' | 'left' | 'right'
