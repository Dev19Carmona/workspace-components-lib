import { Component } from '@angular/core';
import { ButtonNgComponent, EmptyMessageComponent, IButtonConfig } from 'lib-components';

@Component({
  selector: 'app-root',
  imports: [ButtonNgComponent, EmptyMessageComponent, ButtonNgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app-lib-components';

  message = 'Si se preciona el boton, se mostrara este mensaje';

  protected buttonConfig: IButtonConfig = {
    label: 'Click me',
    severity: 'success',
    onClick: () => {
      this.message = 'Button clicked';
    },
    loading: false,
    loadingMessages: ['Loading...', 'Loading...', 'Loading...'],
    tooltipConfig: {
      pTooltip: 'Tooltip',
      tooltipPosition: 'top'
    }
  }
}
