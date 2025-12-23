import { Component } from '@angular/core';
import { ButtonComponent, EmptyMessageComponent } from 'lib-components';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent, EmptyMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app-lib-components';

  message = 'Si se preciona el boton, se mostrara este mensaje';
}
