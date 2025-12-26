import { Component, signal } from '@angular/core';
import { FormComponent, InlineInputComponent } from 'lib-components';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { IControlConfig, IFormConfig } from 'lib-components';
import { ETypeInput } from 'lib-components';

@Component({
  selector: 'app-doc-form-page',
  imports: [FormComponent, InlineInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './doc-form-page.component.html',
  styleUrl: './doc-form-page.component.scss'
})
export class DocFormPageComponent {
  // Ejemplo básico de Form
  basicFormGroup = signal(new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [Validators.required])
  }));

  basicFormControls: IControlConfig[] = [
    {
      controlName: 'name',
      control: new FormControl('', [Validators.required]),
      typeInput: ETypeInput.TEXT,
      label: 'Nombre'
    },
    {
      controlName: 'email',
      control: new FormControl('', [Validators.required, Validators.email]),
      typeInput: ETypeInput.EMAIL,
      label: 'Email'
    },
    {
      controlName: 'age',
      control: new FormControl('', [Validators.required]),
      typeInput: ETypeInput.NUMBER,
      label: 'Edad'
    }
  ];

  // Ejemplo con diferentes tipos de inputs
  advancedFormGroup = signal(new FormGroup({
    text: new FormControl(''),
    password: new FormControl(''),
    number: new FormControl(''),
    date: new FormControl(''),
    select: new FormControl(''),
    textarea: new FormControl('')
  }));

  advancedFormControls: IControlConfig[] = [
    {
      controlName: 'text',
      control: new FormControl(''),
      typeInput: ETypeInput.TEXT,
      label: 'Texto'
    },
    {
      controlName: 'password',
      control: new FormControl(''),
      typeInput: ETypeInput.PASSWORD,
      label: 'Contraseña'
    },
    {
      controlName: 'number',
      control: new FormControl(''),
      typeInput: ETypeInput.NUMBER,
      label: 'Número'
    },
    {
      controlName: 'date',
      control: new FormControl(''),
      typeInput: ETypeInput.DATE,
      label: 'Fecha'
    },
    {
      controlName: 'select',
      control: new FormControl(''),
      typeInput: ETypeInput.SELECT,
      label: 'Selección',
      selectConfig: {
        options: [
          { code: '1', name: 'Opción 1' },
          { code: '2', name: 'Opción 2' },
          { code: '3', name: 'Opción 3' }
        ]
      }
    },
    {
      controlName: 'textarea',
      control: new FormControl(''),
      typeInput: ETypeInput.TEXTAREA,
      label: 'Área de texto',
      textareaConfig: {
        rows: 4,
        autoResize: true
      }
    }
  ];

  // Ejemplo de InlineInput individual
  inlineTextValue = signal<string | null>('');
  inlineNumberValue = signal<number | null>(null);
  inlineSelectValue = signal<any>(null);
  inlineDateValue = signal<Date | null>(null);

  // Configuraciones para InlineInput individual
  inlineTextConfig = { typeInput: ETypeInput.TEXT, label: 'Nombre' };
  inlineNumberConfig = { typeInput: ETypeInput.NUMBER, label: 'Edad' };
  inlineDateConfig = { typeInput: ETypeInput.DATE, label: 'Fecha' };
  inlineSelectConfig = {
    typeInput: ETypeInput.SELECT,
    label: 'Selección',
    selectConfig: {
      options: [
        { code: '1', name: 'Opción 1' },
        { code: '2', name: 'Opción 2' },
        { code: '3', name: 'Opción 3' }
      ]
    }
  };

  // Ejemplo con validaciones
  validationFormGroup = signal(new FormGroup({
    required: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    minLength: new FormControl('', [Validators.required, Validators.minLength(5)])
  }));

  validationFormControls: IControlConfig[] = [
    {
      controlName: 'required',
      control: new FormControl('', [Validators.required]),
      typeInput: ETypeInput.TEXT,
      label: 'Campo Requerido'
    },
    {
      controlName: 'email',
      control: new FormControl('', [Validators.required, Validators.email]),
      typeInput: ETypeInput.EMAIL,
      label: 'Email Válido'
    },
    {
      controlName: 'minLength',
      control: new FormControl('', [Validators.required, Validators.minLength(5)]),
      typeInput: ETypeInput.TEXT,
      label: 'Mínimo 5 caracteres'
    }
  ];

  // Ejemplo con multiselect
  multiselectFormGroup = signal(new FormGroup({
    multiselect: new FormControl([])
  }));

  multiselectFormControls: IControlConfig[] = [
    {
      controlName: 'multiselect',
      control: new FormControl([]),
      typeInput: ETypeInput.MULTISELECT,
      label: 'Selección Múltiple',
      multiSelectConfig: {
        options: [
          { code: '1', name: 'Opción 1' },
          { code: '2', name: 'Opción 2' },
          { code: '3', name: 'Opción 3' },
          { code: '4', name: 'Opción 4' }
        ]
      }
    }
  ];

  // Ejemplo con currency
  currencyFormGroup = signal(new FormGroup({
    currency: new FormControl('')
  }));

  currencyFormControls: IControlConfig[] = [
    {
      controlName: 'currency',
      control: new FormControl(''),
      typeInput: ETypeInput.CURRENCY,
      label: 'Moneda',
      currencyConfig: {
        currency: 'USD',
        locale: 'en-US'
      }
    }
  ];

  // Handlers
  onFormSubmit(formGroup: FormGroup): void {
    console.log('Form submitted:', formGroup.value);
    alert('Formulario enviado: ' + JSON.stringify(formGroup.value, null, 2));
  }

  onFormChanges(formGroup: FormGroup): void {
    console.log('Form changed:', formGroup.value);
  }

  onInlineValueChange(value: any): void {
    console.log('Inline input value changed:', value);
  }
}
