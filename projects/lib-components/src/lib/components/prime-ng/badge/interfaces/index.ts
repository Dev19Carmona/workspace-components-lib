
export type IBadgeSeverity =  'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast'
export type IBadgeSize = 'small' | 'large' | 'xlarge'

export interface IBadgeConfig {
  value: string
  severity: IBadgeSeverity
  badgeSize?: IBadgeSize
  fullWidth?: boolean
}
