import { Component } from '@angular/core';
import { ButtonNgComponent } from 'lib-components';
import { IButtonConfig } from 'lib-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc-button-ng-page',
  imports: [ButtonNgComponent, CommonModule],
  templateUrl: './doc-button-ng-page.component.html',
  styleUrl: './doc-button-ng-page.component.scss'
})
export class DocButtonNgPageComponent {
  // Ejemplo básico
  basicButtonConfig: IButtonConfig = {
    label: 'Click Me',
    severity: 'secondary'
  };

  // Ejemplo con severidad
  successButtonConfig: IButtonConfig = {
    label: 'Success',
    severity: 'success'
  };

  dangerButtonConfig: IButtonConfig = {
    label: 'Danger',
    severity: 'danger'
  };

  infoButtonConfig: IButtonConfig = {
    label: 'Info',
    severity: 'info'
  };

  // Ejemplo con icono
  iconButtonConfig: IButtonConfig = {
    label: 'Save',
    icon: 'pi pi-save',
    severity: 'success'
  };

  // Ejemplo con loading
  loadingButtonConfig: IButtonConfig = {
    label: 'Loading...',
    severity: 'secondary',
    loading: true
  };

  // Ejemplo con loading messages rotativos
  loadingMessagesConfig: IButtonConfig = {
    label: 'Processing',
    severity: 'info',
    loading: true,
    loadingMessages: ['Cargando...', 'Procesando...', 'Finalizando...']
  };

  // Ejemplo con tooltip
  tooltipButtonConfig: IButtonConfig = {
    label: 'Hover me',
    severity: 'secondary',
    tooltipConfig: {
      pTooltip: 'Este es un tooltip de ejemplo',
      tooltipPosition: 'top'
    }
  };

  // Ejemplo con onClick
  onClickButtonConfig: IButtonConfig = {
    label: 'Click me',
    severity: 'success',
    onClick: () => {
      alert('¡Botón clickeado!');
    }
  };

  // Ejemplo disabled
  disabledButtonConfig: IButtonConfig = {
    label: 'Disabled',
    severity: 'secondary',
    disabled: true
  };

  // Ejemplo con variantes
  outlinedButtonConfig: IButtonConfig = {
    label: 'Outlined',
    severity: 'secondary',
    outlined: true
  };

  textButtonConfig: IButtonConfig = {
    label: 'Text',
    severity: 'contrast',
    text: true
  };

  // Ejemplo con rounded
  roundedButtonConfig: IButtonConfig = {
    label: 'Rounded',
    severity: 'success',
    rounded: true
  };

  // Ejemplo con raised
  raisedButtonConfig: IButtonConfig = {
    label: 'Raised',
    severity: 'secondary',
    raised: true
  };

  // Ejemplo con badge
  badgeButtonConfig: IButtonConfig = {
    label: 'Notifications',
    severity: 'secondary',
    badge: '5'
  };

  // Ejemplo con tamaño
  smallButtonConfig: IButtonConfig = {
    label: 'Small',
    severity: 'secondary',
    size: 'small'
  };

  largeButtonConfig: IButtonConfig = {
    label: 'Large',
    severity: 'secondary',
    size: 'large'
  };

  // Ejemplo full width
  fullWidthButtonConfig: IButtonConfig = {
    label: 'Full Width Button',
    severity: 'secondary',
    fullWidth: true
  };

  // Ejemplo con icono a la derecha
  iconRightButtonConfig: IButtonConfig = {
    label: 'Next',
    icon: 'pi pi-arrow-right',
    severity: 'secondary',
    iconPos: 'right'
  };
}
