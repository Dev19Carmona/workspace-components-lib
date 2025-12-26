import { NgClass } from '@angular/common'
import type { Signal } from '@angular/core'
import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output } from '@angular/core'
import type { ControlValueAccessor, FormControl } from '@angular/forms'
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { CheckboxModule } from 'primeng/checkbox'
import { DatePickerModule } from 'primeng/datepicker'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputOtpModule } from 'primeng/inputotp'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectModule } from 'primeng/select'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { ToggleSwitchModule } from 'primeng/toggleswitch'
import { TooltipModule } from 'primeng/tooltip'
import { ETypeInput } from '../../enums'
import type { IControlConfig } from '../../interfaces'
import { InputNumberModule } from 'primeng/inputnumber'
import { TextareaModule } from 'primeng/textarea'
import { DisabledContainerComponent } from '../../../disabled-container/disabled-container.component'

@Component({
  selector: 'lib-custom-input',
  imports: [
    ReactiveFormsModule,
    IftaLabelModule,
    NgClass,
    DatePickerModule,
    CheckboxModule,
    MultiSelectModule,
    SelectModule,
    ToggleButtonModule,
    InputOtpModule,
    ToggleSwitchModule,
    InputNumberModule,
    TextareaModule,
    DisabledContainerComponent,
    TooltipModule,
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true
  }]
})
export class CustomInputComponent implements ControlValueAccessor {
  controlData = input.required<IControlConfig>()
  controlUpperName: Signal<string> = computed(() => this.controlData().controlName.toLocaleUpperCase())
  showPassword: boolean = false
  output = output<IControlConfig>()
  onTouched = () => { }
  onChange = (_value: any) => { }

  constructor() { }

  writeValue(value: any): void {
    if (value !== this.controlData().control.value) {
      this.controlData().control.setValue(value, { emitEvent: false })
    }
  }

  get showLabel(): boolean {
    return !this.controlData().hideLabel
  }

  get inputTypesEnum(): typeof ETypeInput {
    return ETypeInput
  }

  onCheckboxChange(event: Event, control: FormControl): void {
    const input = event.target as HTMLInputElement
    const isChecked = input.checked
    control.setValue(isChecked)
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  // setDisabledState(isDisabled: boolean): void {
  //   if (isDisabled) {
  //     this.controlData().control.disable()
  //   } else {
  //     this.controlData().control.enable()
  //   }
  // }

  generateUniqueId(baseString: string): string {
    const timestamp = new Date().getTime()
    const random = Math.random().toString(36).substring(2, 8)
    return `${baseString}-${timestamp}-${random}`
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onSelectChange(): void {
    this.output.emit(this.controlData())
  }
}
