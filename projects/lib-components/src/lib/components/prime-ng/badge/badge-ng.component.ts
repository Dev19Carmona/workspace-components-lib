import { Component, model } from '@angular/core'
import { BadgeModule } from 'primeng/badge'
import type { IBadgeConfig, IBadgeSeverity, IBadgeSize } from './interfaces'
@Component({
  selector: 'app-badge-ng',
  imports: [BadgeModule],
  templateUrl: './badge-ng.component.html'
})
export class BadgeNgComponent {
  config = model.required<IBadgeConfig>()

  get value(): string {
    return this.config().value
  }

  get severity(): IBadgeSeverity {
    return this.config().severity
  }

  get badgeSize(): IBadgeSize {
    return this.config().badgeSize ?? 'small'
  }

  get fullWidth(): boolean {
    return this.config().fullWidth ?? true
  }
}
