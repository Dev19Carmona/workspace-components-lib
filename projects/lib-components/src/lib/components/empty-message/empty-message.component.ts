import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-empty-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-message">
      <p class="empty-message-text">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-message {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    .empty-message-text {
      text-align: center;
      color: #6c757d;
      margin: 0;
      font-size: 1rem;
    }
  `]
})
export class EmptyMessageComponent {
  message = input<string>('NO DATA AVAILABLE');
}
