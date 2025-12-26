// components/confirm-dialog.component.ts
import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { BaseDialogComponent } from './base-dialog.component'

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="tw-flex tw-flex-col tw-gap-4">
      <div class="tw-text-lg">{{ data.message }}</div>
      <div class="tw-flex tw-justify-end tw-gap-3">
        <p-button
          label="Cancelar"
          severity="secondary"
          (click)="dismiss()">
        </p-button>
        <p-button
          label="Confirmar"
          severity="primary"
          (click)="confirm()">
        </p-button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent extends BaseDialogComponent {


  constructor( ) {
    super()
  }

  confirm(): void {
    this.close({ success: true, data: true })
  }
}
