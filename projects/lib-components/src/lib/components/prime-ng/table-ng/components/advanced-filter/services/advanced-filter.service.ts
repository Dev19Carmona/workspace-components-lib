import type { Signal, WritableSignal } from '@angular/core'
import { computed, effect, Injectable, signal } from '@angular/core'
import { ETypeInput } from '../../../../../origin/form/enums'
import type { InlineControlConfig } from '../../../../../origin/form/components/inline-input/interfaces/index'
import type { IPickListConfig, IPickListElement } from '../../../../../origin/pick-list/interfaces'

@Injectable({
  providedIn: 'root'
})
export class AdvancedFilterService {

  constructor() {
    // Effect para actualizar isSelected basado en los chips
    effect(() => {
      const chips: string[] = [...this.searchChips()]
      this.updateElementSelection(chips)
    })
  }

  public configInlineInput: Signal<InlineControlConfig> = computed(() => ({
    typeInput: ETypeInput.CHIPS
  }))

  private _searchChips: WritableSignal<string[]> = signal<string[]>([])
  public searchChips: Signal<string[]> = this._searchChips.asReadonly()
  public setSearchChips(searchChips: string[]): void {
    this._searchChips.set(searchChips)
  }
  public setStringToArrayChips(searchValue: string): void {
    this._searchChips.set(searchValue.split(' ').filter(chip => chip.trim() !== ''))
  }

  private _sourceElements: WritableSignal<IPickListElement[]> = signal<IPickListElement[]>([])
  public sourceElements: Signal<IPickListElement[]> = this._sourceElements.asReadonly()
  public setSourceElements(sourceElements: IPickListElement[]): void {
    this._sourceElements.set(sourceElements)
  }

  public configPickList: Signal<IPickListConfig> = computed(() => ({
    cols: 3,
    sourceSeverityButton: 'contrast',
    targetSeverityButton: 'success'
  }))

  /**
   * Actualiza la selección de elementos basándose en los chips del input
   * @param chips Array de strings que representan los chips actuales
   */
  public updateElementSelection(chips: string[]): void {
    this._sourceElements.update(currentElements => {
      return currentElements.map((element: IPickListElement) => {
        // Verificar si el label del elemento está en el array de chips
        const shouldBeSelected = chips.includes(element.buttonConfig?.label || '')
        if (shouldBeSelected) {
          delete element.buttonConfig!.variant
          delete element.buttonConfig!.raised
        } else {
          element.buttonConfig!.variant = 'outlined'
          element.buttonConfig!.raised = true
        }
        return {
          ...element,
          isSelected: shouldBeSelected
        }
      })
    })
  }

  outputElements(event: { sourceElements: IPickListElement[], targetElements: IPickListElement[] }): void {
    const { sourceElements } = event
    this.setSourceElements(sourceElements)
    this.validateAndSyncChipsWithElements(sourceElements)
  }

  /**
   * Valida y sincroniza los chips con los elementos de sourceElements
   * @param sourceElements Array de elementos fuente
   */
  private validateAndSyncChipsWithElements(sourceElements: IPickListElement[]): void {
    const currentChips = this._searchChips()

    if (sourceElements.length === 0) {
      this.setSearchChips([])
      return
    }

    const validChips: string[] = []

    // Iterar sobre cada chip actual
    currentChips.forEach(chip => {
      // Buscar el elemento correspondiente en sourceElements
      const element = sourceElements.find(el => el.buttonConfig?.label === chip)

      if (element) {
        // Si la chip existe en sourceElements
        if (element.isSelected === false) {
          // Si la chip está en isSelected false, NO la incluimos en validChips (la eliminamos)
          return
        } else {
          // Si la chip está seleccionada, la mantenemos
          validChips.push(chip)
        }
      } else {
        // Si la chip no está en sourceElements, NO la incluimos en validChips (la eliminamos)
        return
      }
    })

    // Verificar si hay elementos seleccionados que no tienen chip correspondiente
    sourceElements.forEach(element => {
      if (element.isSelected && element.buttonConfig?.label) {
        const chipExists = currentChips.includes(element.buttonConfig.label)
        if (!chipExists) {
          // Si el elemento está seleccionado pero no tiene chip, agregamos la chip
          validChips.push(element.buttonConfig.label)
        }
      }
    })

    // Actualizar los chips solo si hay cambios
    if (JSON.stringify(validChips.sort()) !== JSON.stringify(currentChips.sort())) {
      this._searchChips.set(validChips)
    }
  }

  /**
   * Método público para establecer chips desde un array externo
   * Útil para gestionar las chips programáticamente
   * @param chipsArray Array de strings que representan las chips
   */
  public setChipsFromArray(chipsArray: string[]): void {
    if (!Array.isArray(chipsArray)) {
      console.warn('setChipsFromArray: El parámetro debe ser un array de strings')
      return
    }

    // Filtrar elementos válidos (strings no vacíos)
    const validChips = chipsArray
      .filter(chip => typeof chip === 'string' && chip.trim() !== '')
      .map(chip => chip.trim())

    // Actualizar las chips
    this._searchChips.set(validChips)
  }

  /**
   * Método público para limpiar todas las chips
   */
  public clearAllChips(): void {
    this._searchChips.set([])
  }

  /**
   * Método público para agregar chips desde un array
   * Evita duplicados
   * @param chipsArray Array de strings a agregar
   */
  public addChipsFromArray(chipsArray: string[]): void {
    if (!Array.isArray(chipsArray)) {
      console.warn('addChipsFromArray: El parámetro debe ser un array de strings')
      return
    }

    const currentChips = this._searchChips()

    // Filtrar elementos válidos y únicos
    const validChips = chipsArray
      .filter(chip => typeof chip === 'string' && chip.trim() !== '')
      .map(chip => chip.trim())
      .filter(chip => !currentChips.includes(chip))

    // Agregar las nuevas chips
    if (validChips.length > 0) {
      this._searchChips.set([...currentChips, ...validChips])
    }
  }
}
