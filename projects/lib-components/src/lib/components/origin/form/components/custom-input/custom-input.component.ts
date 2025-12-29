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

  /**
   * Sincroniza el valor del input visible con el input oculto de password
   * para mantener ambos actualizados
   */
  syncPasswordAutofill(event: Event): void {
    const visibleInput = event.target as HTMLInputElement
    const currentComponent = visibleInput.closest('lib-custom-input')
    if (!currentComponent) return

    const hiddenInput = currentComponent.querySelector<HTMLInputElement>(
      'input[type="password"][id^="password-autofill-hidden-"]'
    ) as HTMLInputElement
    
    if (hiddenInput && hiddenInput.value !== visibleInput.value) {
      hiddenInput.value = visibleInput.value
    }
  }

  /**
   * Maneja el autocompletado cuando el navegador llena el input oculto de password.
   * Actualiza el input visible y el FormControl.
   */
  onPasswordAutofillHidden(event: Event): void {
    const hiddenInput = event.target as HTMLInputElement
    const passwordValue = hiddenInput.value

    if (!passwordValue) return

    // Buscar el input visible de password en el mismo componente
    const currentComponent = hiddenInput.closest('lib-custom-input')
    if (!currentComponent) return

    const visibleInput = currentComponent.querySelector<HTMLInputElement>(
      'input[type="password"]:not([id^="password-autofill-hidden-"]), input[type="text"][class*="custom-password"]'
    )

    if (visibleInput && visibleInput.value !== passwordValue) {
      // Actualizar el input visible
      visibleInput.value = passwordValue
      
      // Actualizar el FormControl
      this.controlData().control.setValue(passwordValue, { emitEvent: true })
      
      // Disparar eventos para que Angular Forms lo detecte
      visibleInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
      visibleInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
    }
  }

  /**
   * Maneja el autocompletado del password cuando el navegador llena automáticamente
   * el campo de password oculto en EMAIL_PASSWORD. Busca el siguiente campo de password
   * en el formulario y actualiza su FormControl directamente.
   */
  onPasswordAutofill(event: Event): void {
    const passwordInput = event.target as HTMLInputElement
    const passwordValue = passwordInput.value

    if (!passwordValue) return

    // Buscar el formulario padre
    let parent = passwordInput.parentElement
    let formElement: HTMLFormElement | null = null
    
    for (let i = 0; i < 6 && parent; i++) {
      if (parent.tagName === 'FORM') {
        formElement = parent as HTMLFormElement
        break
      }
      parent = parent.parentElement
    }

    if (!formElement) return

    // Buscar el componente lib-custom-input actual (EMAIL_PASSWORD)
    const currentComponent = passwordInput.closest('lib-custom-input')
    if (!currentComponent) return

    // Buscar todos los componentes lib-custom-input en el formulario
    const allCustomInputs = formElement.querySelectorAll('lib-custom-input')
    const currentIndex = Array.from(allCustomInputs).indexOf(currentComponent as Element)
    
    // Buscar el siguiente componente después del actual que tenga un campo de password
    for (let i = currentIndex + 1; i < allCustomInputs.length; i++) {
      const nextComponent = allCustomInputs[i]
      
      // Buscar el input de password dentro del componente siguiente
      const passwordField = nextComponent.querySelector<HTMLInputElement>(
        'input[type="password"]:not([id="password-autofill-helper"])'
      )
      
      if (passwordField) {
        // Actualizar el valor directamente en el input
        // y disparar eventos para que Angular Forms lo detecte
        passwordField.value = passwordValue
        passwordField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
        passwordField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
        
        // Forzar la actualización después de un breve delay
        // para asegurar que Angular Forms procese el cambio
        setTimeout(() => {
          if (passwordField.value !== passwordValue) {
            passwordField.value = passwordValue
            passwordField.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }, 50)
        break
      }
    }
  }
}
