import { Component, signal } from '@angular/core';
import { FormComponent } from 'lib-components';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { IControlConfig } from 'lib-components';
import { ETypeInput } from 'lib-components';

@Component({
  selector: 'app-examples-page',
  imports: [FormComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './examples-page.component.html',
  styleUrl: './examples-page.component.scss'
})
export class ExamplesPageComponent {
  // Formulario de Login
  loginFormGroup = signal(new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  }));

  loginFormControls: IControlConfig[] = [
    {
      controlName: 'email',
      control: new FormControl('', [Validators.required, Validators.email]),
      typeInput: ETypeInput.EMAIL_PASSWORD,
      label: 'Email'
    },
    {
      controlName: 'password',
      control: new FormControl('', [Validators.required, Validators.minLength(6)]),
      typeInput: ETypeInput.PASSWORD,
      label: 'Contraseña'
    }
  ];

  onLoginSubmit(formGroup: FormGroup): void {
    if (formGroup.valid) {
      console.log('Login form submitted:', formGroup.value);
      // Aquí puedes agregar la lógica de autenticación
      alert(`Login exitoso!\nEmail: ${formGroup.value.email}\nPassword: ${formGroup.value.password ? '***' : ''}`);
    } else {
      console.log('Form is invalid');
      formGroup.markAllAsTouched();
    }
  }

  onLoginChanges(formGroup: FormGroup): void {
    console.log('Login form changes:', formGroup.value);
  }
}

