import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-empty-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-message">
      <p class="empty-message-text">{{ message || 'No data available' }}</p>
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
  @Input() message?: string;
}
