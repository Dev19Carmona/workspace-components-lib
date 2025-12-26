// services/dialog.service.ts
import { inject, Injectable } from '@angular/core'
import type { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { DialogService } from 'primeng/dynamicdialog'

export interface IDialogConfig {
  header?: string;
  width?: string;
  height?: string;
  closeOnEscape?: boolean;
  baseZIndex?: number;
  maximizable?: boolean;
  data?: any;
  style?: {
    [key: string]: string | number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {
  private dialogRef: DynamicDialogRef | undefined
  public dialogService = inject(DialogService)

  constructor() { }

  open(component: any, options: DynamicDialogConfig = {}): DynamicDialogRef {
    const defaultConfig: DynamicDialogConfig = {
      closable: true,
      header: options.header || '',
      width: options.width || '50%',
      height: options.height || 'auto',
      closeOnEscape: options.closeOnEscape ?? true,
      baseZIndex: options.baseZIndex || 10000,
      maximizable: options.maximizable ?? true,
      data: options.data || {},
      style: {
        borderRadius: '8px',
        ...options.style
      },
      modal: true
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.dialogRef = this.dialogService.open(component, defaultConfig)
    return this.dialogRef
  }

  close(result?: any): void {
    if (this.dialogRef) {
      this.dialogRef.close(result)
    }
  }


}
