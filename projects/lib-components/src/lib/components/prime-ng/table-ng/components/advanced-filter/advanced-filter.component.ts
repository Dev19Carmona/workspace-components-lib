import type { OnInit} from '@angular/core'
import { Component, effect, inject, model, viewChild } from '@angular/core'
import { InlineInputComponent } from '../../../../origin/form/components/inline-input/inline-input.component'
import type { InlineControlConfig } from '../../../../origin/form/components/inline-input/interfaces/index'
import type { IPickListConfig, IPickListElement } from '../../../../origin/pick-list/interfaces'
import { PickListComponent } from '../../../../origin/pick-list/pick-list.component'
import { AdvancedFilterService } from './services/advanced-filter.service'

@Component({
  selector: 'lib-advanced-filter',
  imports: [InlineInputComponent, PickListComponent],
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss',
  providers: [AdvancedFilterService]
})
export class AdvancedFilterComponent implements OnInit{
  private readonly advancedFilterService = inject(AdvancedFilterService)
  sourceElements = model<IPickListElement[]>([])
  targetElements = model<IPickListElement[]>([])
  // Referencia al componente de inline input para gestionar las chips
  inlineInputComponent = viewChild<InlineInputComponent>('inlineInputRef')

  constructor() {
    // Sincronizar el service con el model del componente
    effect(() => {
      this.sourceElements.set(this.advancedFilterService.sourceElements())
    })

    // Efecto para sincronizar chips con el inline input
    effect(() => {
      const chips = this.advancedFilterService.searchChips()
      const inlineInput = this.inlineInputComponent()

      if (inlineInput && Array.isArray(chips)) {
        // Usar el nuevo método para establecer las chips
        inlineInput.setChipsFromArray(chips)
      }
    })
  }

  ngOnInit(): void {
    this.initializeChipsWhitSourceElementsSelected()
    this.advancedFilterService.setSourceElements(this.sourceElements())
  }

  private initializeChipsWhitSourceElementsSelected(): void {
    this.advancedFilterService.setSearchChips(
      this.sourceElements()
        .filter((element: IPickListElement) => element.isSelected)
        .map((element: IPickListElement): string => element.buttonConfig?.label?.toString() ?? '')
    )
  }

  get configInlineInput(): InlineControlConfig {
    return this.advancedFilterService.configInlineInput()
  }

  valueChangeInlineInput(value: string) {
    this.advancedFilterService.setStringToArrayChips(value)
  }



  get configPickList(): IPickListConfig {
    return this.advancedFilterService.configPickList()
  }

  outputElements(event: { sourceElements: IPickListElement[], targetElements: IPickListElement[] }) {
    this.advancedFilterService.outputElements(event)
  }

  /**
   * Método público para establecer chips desde un array externo
   * @param chipsArray Array de strings que representan las chips
   */
  setChipsFromArray(chipsArray: string[]): void {
    this.advancedFilterService.setChipsFromArray(chipsArray)
  }

  /**
   * Método público para limpiar todas las chips
   */
  clearAllChips(): void {
    this.advancedFilterService.clearAllChips()
  }

  /**
   * Método público para agregar chips desde un array
   * @param chipsArray Array de strings a agregar
   */
  addChipsFromArray(chipsArray: string[]): void {
    this.advancedFilterService.addChipsFromArray(chipsArray)
  }

  /**
   * Método público para obtener las chips actuales como array
   * @returns Array de strings con las chips actuales
   */
  getChipsAsArray(): string[] {
    return this.advancedFilterService.searchChips()
  }
}
