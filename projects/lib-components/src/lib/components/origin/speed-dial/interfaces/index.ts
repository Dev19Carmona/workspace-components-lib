import type { IButtonConfig } from '../../../prime-ng/button-ng/interfaces'

export interface ISpeedDialConfig {
  buttons: IButtonConfig[]
  mainButton: IButtonConfig
  direction: TSpeedDialDirection
}

export type TSpeedDialDirection = 'top' | 'bottom' | 'left' | 'right'
