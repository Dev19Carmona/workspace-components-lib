// components/base-dialog.component.ts
import type { OnDestroy } from '@angular/core'
import { Component, inject } from '@angular/core'
import  { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Subject } from 'rxjs'

export interface IDialogResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

@Component({
  standalone: true,
  template: ''
})
export class BaseDialogComponent implements OnDestroy {
  protected destroy$ = new Subject<void>()
  protected data: any

  public ref = inject(DynamicDialogRef)
  public config = inject(DynamicDialogConfig)
  constructor(
  ) {
    this.data = this.config.data
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  close<T>(result?: IDialogResult<T>): void {
    this.ref.close(result)
  }

  dismiss(): void {
    this.ref.close({ success: false })
  }
}
