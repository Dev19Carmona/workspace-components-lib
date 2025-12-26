import type { Signal, WritableSignal } from '@angular/core'
import { computed, inject, Injectable, signal } from '@angular/core'
import { ETypeInput } from '../../../../../origin/form/enums'
import type { IControlConfig } from '../../../../../origin/form/interfaces'
import type { FormControl } from '@angular/forms'
import { FormGroup, NonNullableFormBuilder } from '@angular/forms'
import type { ICustomColumnFilterConfig } from '../../../interfaces'

@Injectable({
  providedIn: 'root'
})
export class CustomAdvancedFilterService {
  customColumnFilterConfig = signal<ICustomColumnFilterConfig>({
    isEnabled: false,
    mode: 'multiselect'
  })
  constructor() {
  }

  setCustomColumnFilterConfig(customColumnFilterConfig: ICustomColumnFilterConfig) {
    this.customColumnFilterConfig.set(customColumnFilterConfig)
  }
  private fb = inject(NonNullableFormBuilder)
  formGroup: WritableSignal<FormGroup<Record<string, FormControl>>> = signal(new FormGroup({}))
  setInitialValue(initialValue: Record<string, any>) {
    this.formGroup.update((formGroup: FormGroup<Record<string, FormControl>>) => {
      Object.entries(initialValue).forEach(([key, value]) => {

        const formControl = formGroup.get(key)
        if (!formControl) {
          formGroup.addControl(key, this.fb.control(value, { validators: [] }))
        } else {
          formControl.patchValue(value, { emitEvent: false })
        }
      })
      return formGroup
    })
  }
  customFormControls: Signal<IControlConfig[]> = computed(() => {
    const formValues = this.formGroup().value
    let controls: IControlConfig[] = []
    switch (this.customColumnFilterConfig().mode) {
    case 'multiselect':
      controls = [
        {
          controlName: 'multiSelect',
          control: this.fb.control(formValues['multiselect'], { validators: [] }),
          typeInput: ETypeInput.MULTISELECT,
          colSpan: 12,
          label: this.customColumnFilterConfig().multiselectConfig?.label,
          multiSelectConfig: {
            options: this.customColumnFilterConfig().multiselectConfig?.options ?? []
          }
        }
      ]
      break

    default:
      break
    }
    return controls
  })


}
