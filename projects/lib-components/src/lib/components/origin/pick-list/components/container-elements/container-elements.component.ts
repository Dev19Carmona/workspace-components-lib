import { CommonModule } from '@angular/common'
import { Component, computed, input, model, output, type OnInit, type Signal } from '@angular/core'
import type { IPickListElement } from '../../interfaces'
import { pickListConstant } from '../../constant'
import { ButtonNgComponent } from '../../../../prime-ng/button-ng/button-ng.component'
import type { IButtonSeverity, IButtonConfig } from '../../../../prime-ng/button-ng/interfaces'

@Component({
  selector: 'app-container-elements',
  imports: [ButtonNgComponent, CommonModule],
  templateUrl: './container-elements.component.html',
  styleUrl: './container-elements.component.scss'
})
export class ContainerElementsComponent implements OnInit{
  cols = input<number>(3)
  elements = model<IPickListElement[]>([])
  severityButton = input<IButtonSeverity['severity']>('contrast')

  outputElements = output<IPickListElement[]>()
  constructor() {
  }
  ngOnInit(): void {
    this.elements.update((elements: IPickListElement[]) => {
      elements.forEach((e: IPickListElement) => {
        // Si e.isSelected es true, se elimina el variant y raised
        if (e.isSelected) {
          delete e.buttonConfig!.variant
          delete e.buttonConfig!.raised
        } else {
          e.buttonConfig!.variant = 'outlined'
          e.buttonConfig!.raised = true
        }
        e.buttonConfig = {
          ...e.buttonConfig,
          fullWidth: true,
          fullHeight: true,
          hasStaticClick: true,
          severity: this.severityButton()
        }
      })
      return [...elements]
    })
  }

  protected containerClass: Signal<string> = computed(() => 'w-[45%] flex flex-col shadow-md bg-white dark:bg-gray-800 rounded-xl h-full overflow-y-auto')
  protected titleClass: Signal<string> = computed(() => 'text-lg font-bold self-center text-center')
  protected containerElementsClass: Signal<string> = computed(() => `grid grid-cols-${this.cols() ?? 3} gap-2 p-2`)

  getButtonConfig(buttonConfig: IButtonConfig): IButtonConfig {
    return { ...buttonConfig, fullWidth: true, severity: this.severityButton(), hasStaticClick: true }
  }

  onButtonClick(element: IPickListElement | undefined): void {
    this.elements.update((elements: IPickListElement[]) => {
      elements.forEach((e: IPickListElement) => {
        pickListConstant(e, element)
      })
      return [...elements]
    })

    this.outputElements.emit([...this.elements()])
  }
}
