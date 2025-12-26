import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-aminated-container',
  imports: [CommonModule],
  templateUrl: './aminated-container.component.html',
  styleUrl: './aminated-container.component.scss'
})
export class AminatedContainerComponent {
  isLoading: boolean = true
}
