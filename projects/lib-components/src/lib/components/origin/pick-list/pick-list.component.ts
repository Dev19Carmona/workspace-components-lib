import type { OnInit, Signal } from '@angular/core'
import { Component, computed, input, model, output } from '@angular/core'
import { ContainerElementsComponent } from './components/container-elements/container-elements.component'
import type { IPickListConfig, IPickListElement } from './interfaces'
import { ButtonNgComponent } from '../../prime-ng/button-ng/button-ng.component'
import type { IButtonConfig } from '../../prime-ng/button-ng/interfaces'

@Component({
  selector: 'lib-pick-list',
  imports: [ButtonNgComponent, ContainerElementsComponent],
  templateUrl: './pick-list.component.html',
  styleUrl: './pick-list.component.scss'
})
export class PickListComponent implements OnInit{

  constructor() {
  }

  ngOnInit(): void {  }

  sourceElements = model<IPickListElement[]>([])
  hasAnySourceElementSelected = computed(() => this.sourceElements().some(element => element.isSelected))

  targetElements = model<IPickListElement[]>([])
  hasAnyTargetElementSelected = computed(() => this.targetElements().some(element => element.isSelected))

  config = input<IPickListConfig>()

  outputElements = output<{ sourceElements: IPickListElement[], targetElements: IPickListElement[] }>()
  protected sourceSeverityButton = computed(() => this.config()?.sourceSeverityButton ?? 'secondary')

  protected targetSeverityButton = computed(() => this.config()?.targetSeverityButton ?? 'contrast')

  protected controlButtons: Signal<IButtonConfig[]> = computed(() => [
    {
      label: '',
      icon: 'pi pi-angle-double-right',
      severity: this.sourceSeverityButton(),
      disabled: this.sourceElements().length === 0,
      tooltipConfig: {
        pTooltip: this.sourceElements().length === 0 ? 'No hay elementos' : 'Mover todos hacia la derecha',
        tooltipPosition: 'top'
      },
      onClick: () => {
        this.moveAllSourceToTarget()
      }
    },
    {
      label: '',
      icon: 'pi pi-angle-right',
      severity: this.sourceSeverityButton(),
      disabled: !this.hasAnySourceElementSelected(),
      tooltipConfig: {
        pTooltip: !this.hasAnySourceElementSelected() ? 'No hay elementos seleccionados' : 'Mover los elementos seleccionados hacia la derecha',
        tooltipPosition: 'top'
      },
      onClick: () => {
        this.moveSelectedSourceToTarget()
      }
    },
    {
      label: '',
      icon: 'pi pi-angle-double-left',
      severity: this.targetSeverityButton(),
      disabled: this.targetElements().length === 0,
      tooltipConfig: {
        pTooltip: this.targetElements().length === 0 ? 'No hay elementos' : 'Mover todos hacia la izquierda',
        tooltipPosition: 'top'
      },
      onClick: () => {
        this.moveAllTargetToSource()
      }
    },
    {
      label: '',
      icon: 'pi pi-angle-left',
      severity: this.targetSeverityButton(),
      disabled: !this.hasAnyTargetElementSelected(),
      tooltipConfig: {
        pTooltip: !this.hasAnyTargetElementSelected() ? 'No hay elementos seleccionados' : 'Mover los elementos seleccionados hacia la izquierda',
        tooltipPosition: 'top'
      },
      onClick: () => {
        this.moveSelectedTargetToSource()
      }
    }
  ])

  /**
   * Mueve todos los elementos del sourceElements al targetElements,
   * convirtiendo su severidad para que coincida con targetSeverityButton
   */
  private moveAllSourceToTarget(): void {
    const sourceElementsCopy = [...this.sourceElements()]
    if (sourceElementsCopy.length === 0) {
      return
    }

    // Convertir los elementos para usar targetSeverityButton
    const convertedElements = sourceElementsCopy.map(element => {
      const convertedElement: IPickListElement = {
        ...element,
        isSelected: false, // Limpiar selección
        buttonConfig: {
          ...element.buttonConfig,
          severity: this.targetSeverityButton(),
          variant: 'outlined',
          raised: true
        }
      }
      return convertedElement
    })

    // Agregar elementos convertidos al target
    this.targetElements.update(currentTarget => [
      ...currentTarget,
      ...convertedElements
    ])

    // Limpiar sourceElements
    this.sourceElements.set([])
    this.handleOutputElements()
  }

  /**
   * Mueve todos los elementos del targetElements al sourceElements,
   * convirtiendo su severidad para que coincida con sourceSeverityButton
   */
  private moveAllTargetToSource(): void {
    const targetElementsCopy = [...this.targetElements()]

    if (targetElementsCopy.length === 0) {
      return
    }

    // Convertir los elementos para usar sourceSeverityButton
    const convertedElements = targetElementsCopy.map(element => {
      const convertedElement: IPickListElement = {
        ...element,
        isSelected: false, // Limpiar selección
        buttonConfig: {
          ...element.buttonConfig,
          severity: this.sourceSeverityButton(),
          variant: 'outlined',
          raised: true
        }
      }
      return convertedElement
    })

    // Agregar elementos convertidos al source
    this.sourceElements.update(currentSource => [
      ...currentSource,
      ...convertedElements
    ])


    // Limpiar targetElements
    this.targetElements.set([])
    this.handleOutputElements()
  }

  /**
   * Mueve los elementos seleccionados del sourceElements al targetElements,
   * ubicándolos en la primera posición y convirtiendo su severidad
   */
  public moveSelectedSourceToTarget(): void {
    const selectedElements = this.sourceElements().filter(element => element.isSelected)
    const remainingElements = this.sourceElements().filter(element => !element.isSelected)

    if (selectedElements.length === 0) {
      return
    }

    // Convertir los elementos seleccionados para usar targetSeverityButton
    const convertedElements = selectedElements.map(element => {
      const convertedElement: IPickListElement = {
        ...element,
        isSelected: false, // Limpiar selección
        buttonConfig: {
          ...element.buttonConfig,
          severity: this.targetSeverityButton(),
          variant: 'outlined',
          raised: true
        }
      }
      return convertedElement
    })

    // Agregar elementos convertidos al inicio de targetElements
    this.targetElements.update(currentTarget => [
      ...convertedElements,
      ...currentTarget
    ])

    // Actualizar sourceElements sin los elementos seleccionados
    this.sourceElements.set(remainingElements)
    this.handleOutputElements()
  }

  /**
   * Mueve los elementos seleccionados del targetElements al sourceElements,
   * ubicándolos en la primera posición y convirtiendo su severidad
   */
  public moveSelectedTargetToSource(): void {
    const selectedElements = this.targetElements().filter(element => element.isSelected)
    const remainingElements = this.targetElements().filter(element => !element.isSelected)

    if (selectedElements.length === 0) {
      return
    }

    // Convertir los elementos seleccionados para usar sourceSeverityButton
    const convertedElements = selectedElements.map(element => {
      const convertedElement: IPickListElement = {
        ...element,
        isSelected: false, // Limpiar selección
        buttonConfig: {
          ...element.buttonConfig,
          severity: this.sourceSeverityButton(),
          variant: 'outlined',
          raised: true
        }
      }
      return convertedElement
    })

    // Agregar elementos convertidos al inicio de sourceElements
    this.sourceElements.update(currentSource => [
      ...convertedElements,
      ...currentSource
    ])

    // Actualizar targetElements sin los elementos seleccionados
    this.targetElements.set(remainingElements)
    this.handleOutputElements()
  }

  handleOutputElements(): void {
    this.outputElements.emit({ sourceElements: this.sourceElements(), targetElements: this.targetElements() })
  }
}
