import type { Signal, WritableSignal } from '@angular/core'
import { computed, inject, Injectable, signal } from '@angular/core'
import type { IEditTableNgConfig, IGlobalSearchForm } from '../interfaces'
import { FormGroup, NonNullableFormBuilder } from '@angular/forms'
import { ETypeInput } from '../../../origin/form/enums'
import type { IControlConfig } from '../../../origin/form/interfaces'

@Injectable({
  providedIn: 'root'
})
export class TableNgEditService {
  private editConfig: WritableSignal<IEditTableNgConfig | undefined> = signal<IEditTableNgConfig | undefined>(undefined)
  private keysNames: WritableSignal<Record<string, string>> = signal<Record<string, string>>({})
  constructor() { }

  setEditConfig(editConfig: IEditTableNgConfig | undefined): void {
    this.editConfig.set(editConfig)
  }

  setKeysNames(keysNames: Record<string, string>): void {
    this.keysNames.set(keysNames)
  }

  private fb = inject(NonNullableFormBuilder)
  controls: Signal<IControlConfig[]> = computed(() => {
    const formValues = this.searchFormGroup().value
    const controls = [
      {
        controlName: 'search',
        control: this.fb.control(formValues.search, { validators: [] }),
        typeInput: ETypeInput.TEXT,
        colSpan: 12,
        label: '-'
      }
    ]
    return controls
  })
  searchFormGroup: WritableSignal<FormGroup<IGlobalSearchForm>> = signal(new FormGroup({}))


}
