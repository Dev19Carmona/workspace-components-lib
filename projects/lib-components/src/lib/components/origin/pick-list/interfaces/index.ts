import type { IButtonConfig, IButtonSeverity } from '../../../prime-ng/button-ng/interfaces'

export interface IPickListConfig {
  cols?: number
  targetSeverityButton?: IButtonSeverity['severity']
  sourceSeverityButton?: IButtonSeverity['severity']
}

export interface IPickListElement {
  buttonConfig?: IButtonConfig<IPickListElement>
  isSelected?: boolean
  colSpan?: number
  id: string
}
