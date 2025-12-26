import { CommonModule } from '@angular/common'
import { Component, input, output } from '@angular/core'
import type { FormGroup } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import type { IControlConfig } from '../../interfaces'
import { CustomInputComponent } from '../custom-input/custom-input.component'

@Component({
  selector: 'app-form-child',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CustomInputComponent
  ],
  templateUrl: './form-child.component.html',
  styleUrl: './form-child.component.scss'
})
export class FormChildComponent {
  controlsData = input.required<IControlConfig[]>()
  formGroup = input.required<FormGroup>()
  formSubmit = output<FormGroup>()

  constructor() {
  }

  submit() {
    this.formSubmit.emit(this.formGroup())
  }

  onSelectChange(controlConfig: IControlConfig): void {
    controlConfig.selectConfig?.change?.(controlConfig)
  }
}
