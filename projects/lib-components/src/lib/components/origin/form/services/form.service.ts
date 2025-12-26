import { inject, Injectable } from '@angular/core'
import type { FormArray, FormGroup, ValidatorFn } from '@angular/forms'
import { NonNullableFormBuilder } from '@angular/forms'
import type { IControlConfig } from '../interfaces'

/**
 * Servicio base para la gestión de formularios dinámicos.
 * Proporciona métodos para manipular FormArrays y sus controles.
 */
@Injectable({
  providedIn: 'root'
})
export class FormService {
  readonly fb = inject(NonNullableFormBuilder)
  constructor() { }

  //#region FormArray Methods
  /**
   * Obtiene el FormArray 'items' de un FormGroup.
   * @param form - El FormGroup que contiene el FormArray 'items'
   * @returns El FormArray 'items'
   */
  getFormArray(form: FormGroup): FormArray {
    return form.get('items') as FormArray
  }

  /**
   * Agrega un nuevo grupo de controles al FormArray.
   * @param items - El FormArray al que se agregará el nuevo grupo
   * @param controls - Los controles que conformarán el nuevo grupo
   */
  addNewGroup(items: FormArray, controls: IControlConfig): void {
    const group = this.fb.group(controls)
    items.push(group)
  }

  /**
   * Elimina un grupo del FormArray por su índice.
   * @param items - El FormArray del que se eliminará el grupo
   * @param index - El índice del grupo a eliminar
   */
  removeGroupByIndex(items: FormArray, index: number): void {
    items.removeAt(index)
  }

  /**
   * Reemplaza un grupo existente en una posición específica del FormArray.
   * @param items - El FormArray donde se realizará el reemplazo
   * @param index - El índice donde se reemplazará el grupo
   * @param controls - Los nuevos controles que reemplazarán al grupo existente
   */
  replaceGroupOnPosition(items: FormArray, index: number, controls: IControlConfig): void {
    items.setControl(index, this.fb.group(controls))
  }

  /**
   * Actualiza los valores de un grupo específico en el FormArray.
   * @param items - El FormArray que contiene el grupo a actualizar
   * @param index - El índice del grupo a actualizar
   * @param controls - Los nuevos valores para el grupo
   */
  updateValueFormArray(items: FormArray, index: number, controls: IControlConfig): void {
    const group = items.at(index) as FormGroup
    group.patchValue(controls)
  }

  /**
   * Limpia todos los grupos del FormArray.
   * @param items - El FormArray a limpiar
   */
  clearFormArray(items: FormArray): void {
    while (items.length) {
      items.removeAt(0)
    }
  }

  /**
   * Actualiza el valor de un control específico en un grupo del FormArray.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a actualizar
   * @param value - El nuevo valor para el control
   */
  updateControlValue(
    items: FormArray,
    index: number,
    controlName: string,
    value: unknown
  ): void {
    const group = items.at(index) as FormGroup
    const control = group.get(controlName)
    if (control && !control.disabled) {
      control.setValue(value)
    }
  }

  /**
   * Actualiza múltiples controles en el FormArray basado en pares clave-valor.
   * @param items - El FormArray a actualizar
   * @param keyValuePairs - Array de objetos con clave y valor para actualizar
   */
  updateFormArrayByKeys(items: FormArray, keyValuePairs: { key: string, value: any }[]): void {
    for (let i = 0; i < items.length; i++) {
      const group = items.at(i) as FormGroup
      keyValuePairs.forEach(({ key, value }) => {
        const control = group.get(key)
        if (control && !control.disabled) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const dateValue = new Date(value)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const isValidDate = this.isValidDate(value)
          if (isValidDate && typeof value !== 'number') {
            control.setValue(dateValue)
          } else {
            control.setValue(value)
          }
        }
      })
    }
  }

  /**
   * Verifica si una cadena representa una fecha válida.
   * @param dateString - La cadena a verificar
   * @returns true si la cadena representa una fecha válida
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  /**
   * Deshabilita un control específico en un grupo del FormArray.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a deshabilitar
   */
  disableControl(items: FormArray, index: number, controlName: string): void {
    const group = items.at(index) as FormGroup
    group.get(controlName)?.disable()
  }

  /**
   * Habilita un control específico en un grupo del FormArray.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a habilitar
   */
  enableControl(items: FormArray, index: number, controlName: string): void {
    const group = items.at(index) as FormGroup
    group.get(controlName)?.enable()
  }

  /**
   * Reinicia un control específico a un valor dado.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a reiniciar
   * @param value - El valor al que se reiniciará el control
   */
  resetControl(items: FormArray, index: number, controlName: string, value: any): void {
    const group = items.at(index) as FormGroup
    group.get(controlName)?.reset(value)
  }

  /**
   * Marca un control como tocado.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a marcar
   */
  markAsTouched(items: FormArray, index: number, controlName: string): void {
    const group = items.at(index) as FormGroup
    group.get(controlName)?.markAsTouched()
  }

  /**
   * Marca un control como modificado.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a marcar
   */
  markAsDirty(items: FormArray, index: number, controlName: string): void {
    const group = items.at(index) as FormGroup
    group.get(controlName)?.markAsDirty()
  }

  /**
   * Actualiza los validadores de un control específico.
   * @param items - El FormArray que contiene el control
   * @param index - El índice del grupo que contiene el control
   * @param controlName - El nombre del control a actualizar
   * @param validators - Array de validadores a aplicar
   */
  updateValidators(
    items: FormArray,
    index: number,
    controlName: string,
    validators: ValidatorFn[]
  ): void {
    const group = items.at(index) as FormGroup
    const control = group.get(controlName)
    if (!control) return
    control.setValidators(validators)
    control.updateValueAndValidity()
  }
  //#endregion
}
