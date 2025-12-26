import type { AfterViewInit, OnInit } from '@angular/core'
import { Component, inject, input, model, output } from '@angular/core'
import type { FormControl } from '@angular/forms'
import type { FormGroup } from '@angular/forms'
import { FormComponent } from '../../../../origin/form/form.component'
import type { IControlConfig } from '../../../../origin/form/interfaces'
import type { ICustomColumnFilterConfig } from '../../interfaces'
import { CustomAdvancedFilterService } from './services/custom-advanced-filter.service'

@Component({
  selector: 'lib-custom-advanced-filter',
  imports: [FormComponent],
  templateUrl: './custom-advanced-filter.component.html',
  styleUrl: './custom-advanced-filter.component.scss',
  providers: [CustomAdvancedFilterService]
})
export class CustomAdvancedFilterComponent implements OnInit, AfterViewInit {
  private customAdvancedFilterService = inject(CustomAdvancedFilterService)
  customColumnFilterConfig = model.required<ICustomColumnFilterConfig>()
  columnKey = input<string>()
  formChanges = output<Record<string, any>>()
  initialValue = input<Record<string, any>>()

  constructor() {
    this.formGroup.valueChanges.subscribe(formValue => {
      this.formChanges.emit(formValue)
    })
  }
  ngAfterViewInit(): void {
    if (this.initialValue()) {
      this.customAdvancedFilterService.setInitialValue(this.initialValue()!)
    }
  }
  ngOnInit(): void {
    this.customAdvancedFilterService.setCustomColumnFilterConfig(this.customColumnFilterConfig())
  }

  get formGroup(): FormGroup<Record<string, FormControl>> {
    return this.customAdvancedFilterService.formGroup()
  }

  get customFormControls(): IControlConfig[] {
    return this.customAdvancedFilterService.customFormControls()
  }

  change(formGroup: FormGroup): void {
    this.formChanges.emit(formGroup)
  }
}
