import type { IPickListElement } from '../interfaces'


export const pickListConstant = (e: IPickListElement, element: IPickListElement | undefined) => {
  if (e.id === element?.id) {
    e.isSelected = !e.isSelected
    if (e.isSelected) {
      delete e.buttonConfig!.variant
      delete e.buttonConfig!.raised
    } else {
      e.buttonConfig!.variant = 'outlined'
      e.buttonConfig!.raised = true
    }
  }
}
