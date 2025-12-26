import type { OnInit, Signal, WritableSignal } from '@angular/core'
import { Component, computed, signal } from '@angular/core'
import type { IPickListElement } from '../../../../origin/pick-list/interfaces'
import { ButtonNgComponent } from '../../../button-ng/button-ng.component'
import type { IButtonConfig } from '../../../button-ng/interfaces'
import { BaseDialogComponent } from '../../../dynamic-dialog/components/base-dialog.component'
import { AdvancedFilterComponent } from '../advanced-filter/advanced-filter.component'

@Component({
  selector: 'app-modal-advanced-filter',
  imports: [AdvancedFilterComponent, ButtonNgComponent],
  templateUrl: './modal-advanced-filter.component.html',
  styleUrl: './modal-advanced-filter.component.scss'
})
export class ModalAdvancedFilterComponent extends BaseDialogComponent implements OnInit{
  constructor() {
    super()
  }
  public sourceElements: WritableSignal<IPickListElement[]> = signal([])
  public targetElements: WritableSignal<IPickListElement[]> = signal([])
  ngOnInit(): void {
    if (this.data) {
      this.sourceElements.set((this.data.sourceElements as IPickListElement[]) ?? [])
      this.targetElements.set((this.data.targetElements as IPickListElement[]) ?? [])
    }
  }

  public applyFiltersButton: Signal<IButtonConfig> = computed(() => {
    return {
      label: 'Aplicar Filtros',
      severity: 'info',
      onClick: () => {
        this.close({ success: true, data: { sourceElements: this.sourceElements(), targetElements: this.targetElements() } })
      },
      disabled: this.targetElements().length === 0
    }
  })

}
