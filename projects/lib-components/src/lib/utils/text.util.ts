import type { TranslocoService } from '@jsverse/transloco'
import Alerts from '../services/alerts/alerts'

export const copyToClipboard = (text: string, transloco: TranslocoService): void => {
  void navigator.clipboard.writeText(text).then(() => {
    Alerts.showToast({
      position: 'top-end',
      icon: 'success',
      title: transloco.translate('common.alerts.copied')
    })
  }).catch(() => {
    Alerts.showToast({
      position: 'top-end',
      icon: 'error',
      title: transloco.translate('common.alerts.copy_error')
    })
  })
}
