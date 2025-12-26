import { Component, model } from '@angular/core'

@Component({
  selector: 'app-disabled-container',
  imports: [],
  templateUrl: './disabled-container.component.html',
  styleUrl: './disabled-container.component.scss'
})
export class DisabledContainerComponent {
  disabled = model<boolean>(false)
}
