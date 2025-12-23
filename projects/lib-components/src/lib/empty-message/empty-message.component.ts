import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-empty-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-message">
      <p class="empty-message-text">NO DATA AVAILABLE</p>
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
export class EmptyMessageComponent implements OnInit{

  constructor() {
    console.log('EmptyMessageComponent constructor');
  }

  ngOnInit(): void {
    console.log('EmptyMessageComponent ngOnInit');
  }
}
