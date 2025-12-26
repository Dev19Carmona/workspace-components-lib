import type { OnInit, Signal } from '@angular/core'
import { Component, computed, ViewChild } from '@angular/core'
import { ButtonNgComponent } from '../../../button-ng/button-ng.component'
import type { IButtonConfig } from '../../../button-ng/interfaces'
import { BaseDialogComponent } from '../../../dynamic-dialog/components/base-dialog.component'
import type { ITableNgConfig, ITableNgData } from '../../interfaces'
import { TableNgComponent } from '../../table-ng.component'

@Component({
  selector: 'app-selected-items-management',
  imports: [TableNgComponent, ButtonNgComponent],
  templateUrl: './selected-items-management.component.html',
  styleUrl: './selected-items-management.component.scss'
})
export class SelectedItemsManagementComponent extends BaseDialogComponent implements OnInit {
  @ViewChild('tableNg') tableNg!: TableNgComponent

  constructor(
  ) {
    super()
  }
  protected selectedItems: ITableNgData[] = []
  protected configTable?: ITableNgConfig | undefined
  ngOnInit(): void {
    if (this.data) {
      const selectedItems: ITableNgData[] = this.data?.selectedItems as ITableNgData[] ?? []
      const config: ITableNgConfig | undefined = this.data?.config as ITableNgConfig | undefined
      this.selectedItems = selectedItems
      this.configTable = config
    }
  }

  buttonsSubmit: Signal<IButtonConfig[]> = computed(() => {
    const buttons: IButtonConfig[] = [
      {
        label: 'Aceptar',
        severity: 'success',
        onClick: () => {
          this.submitSelection('accept')
        }
      },
      {
        label: 'Cerrar',
        severity: 'info',
        onClick: () => {
          this.submitSelection('reject')
        }
      }
    ]
    return buttons
  })

  submitSelection(flag: 'accept' | 'reject') {
    const selectedItems: ITableNgData[] = this.tableNg.dt.selection as ITableNgData[]
    this.ref.close(flag === 'accept' ? selectedItems : undefined)
  }

}
