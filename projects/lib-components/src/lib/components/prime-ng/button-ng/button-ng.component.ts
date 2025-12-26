import { CommonModule } from '@angular/common'
import { Component, effect, inject, model, output } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'
import type { IButtonConfig } from './interfaces'
import { AppButtonNgService } from './services/app-button-ng.service'

@Component({
  selector: 'lib-button-ng',
  imports: [
    ButtonModule,
    TooltipModule,
    CommonModule
  ],
  templateUrl: './button-ng.component.html',
  styleUrl: './button-ng.component.scss',
  providers: [AppButtonNgService]
})
export class ButtonNgComponent {
  private readonly appButtonNgService = inject(AppButtonNgService)
  buttonConfig = model.required<IButtonConfig>()
  onClick = output<void>()

  constructor() {
    effect(() => {
      this.appButtonNgService.setButtonConfig(this.buttonConfig())
    })
  }

  get label(): string {
    return this.appButtonNgService.label()
  }

  onClickButton(): void {
    if (this.buttonConfig().onClick) {
      return
    }
    this.onClick.emit()
  }
}
