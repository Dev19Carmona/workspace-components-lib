import { ChangeDetectionStrategy, Component, effect, inject, input, model, output } from '@angular/core'
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import type { FormGroup } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { debounceTime, filter, map, switchMap } from 'rxjs'
import { FormChildComponent } from './components/form-child/form-child.component'
import type { IControlConfig, IFormConfig } from './interfaces'
import { ETypeInput } from './enums'
import { HttpMessageComponent } from '../http-message/http-message.component'
import type { IHttpMessage } from '../http-message/interfaces'
import { IPrimeNgSelection } from '../../prime-ng/interfaces'
@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    FormChildComponent,
    HttpMessageComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {
  formGroup = model.required<FormGroup>()
  controls = input.required<IControlConfig[]>()
  formConfig = input<IFormConfig>()
  httpMessage = model<IHttpMessage>()

  formSubmit = output<FormGroup>()
  formChanges = output<FormGroup>()
  formChangesDebounced = output<FormGroup>()

  constructor() {
    effect(() => {
      const controls = this.controls()
      const controlsNames = this.controls().map((controlConfig) => controlConfig.controlName)
      const controlsToDelete = Object.keys(this.formGroup().controls).filter(control => !controlsNames.includes(control))

      controls.forEach((controlData: IControlConfig) => {
        this.formGroup.update((formGroup: FormGroup) => {
          if (formGroup.contains(controlData.controlName)) {
            formGroup.setControl(controlData.controlName, controlData.control)
          } else {
            formGroup.addControl(controlData.controlName, controlData.control)
          }
          controlsToDelete.forEach(controlName => {
            formGroup.removeControl(controlName)
          })

          return formGroup
        })
      })

    })

    effect(() => {
        const controlsDataTypeSelect: IControlConfig[] = this.controls().filter((controlData: IControlConfig) => controlData.typeInput === ETypeInput.SELECT)
        controlsDataTypeSelect.forEach((controlData: IControlConfig) => {
          const control = this.formGroup().get(controlData.controlName)
          const controlValue: IPrimeNgSelection | undefined = control?.value
          if (controlValue) {
            const options = controlData.selectConfig?.options ?? []
            const optionSelected = options.find((option) => {
              return option.code === controlValue.code
            })
            if (optionSelected) {
              control?.setValue(optionSelected)
            }
        }
      })
    })

    effect(() => {
      this.formGroup().valueChanges.subscribe(() => {
        this.formChanges.emit(this.formGroup())
      })
    })

    const fg$ = toObservable(this.formGroup)

    fg$.pipe(
      switchMap((fg) =>
        fg.valueChanges.pipe(
          debounceTime(650),
          filter(() => this.anyInteracted(fg)),
          map(() => fg)
        )
      ),
      takeUntilDestroyed()
    )
      .subscribe(() => this.formChangesDebounced.emit(this.formGroup()))
  }



  anyInteracted(formGroup: FormGroup): boolean {
    return Object.values(formGroup.controls).some(control => control.touched || control.dirty)
  }

  submit(formGroup: FormGroup): void {
    this.formSubmit.emit(formGroup)
  }

  clearHttpMessage(): void {
    this.httpMessage.set(undefined)
  }
}
