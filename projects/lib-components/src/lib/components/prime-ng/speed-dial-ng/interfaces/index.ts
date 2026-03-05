import { MenuItem, TooltipOptions } from "primeng/api"
import { ButtonProps } from "primeng/button"

export interface ISpeedDialNgConfig {
  items: ISpeedDialNgItem[]
  buttonProps?: ButtonProps
  tooltipOptions?: TooltipOptions
  style?: Record<string, string>
  direction?: ISpeedDialNgDirection
}

export interface ISpeedDialNgItem extends MenuItem{
  isSpeedDial?: boolean
}

export type ISpeedDialNgDirection = 'up' | 'down' | 'left' | 'right'