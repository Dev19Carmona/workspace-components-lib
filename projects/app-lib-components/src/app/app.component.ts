import { Component } from '@angular/core';
import { ButtonComponent } from 'lib-components';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app-lib-components';
}
