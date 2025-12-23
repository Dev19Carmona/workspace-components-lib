import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [],
  template: `
    <button 
      [class]="'lib-button ' + (variant || 'primary')" 
      [disabled]="disabled" 
      (click)="onClick.emit()">
    </button>
  `,
  styles: [`
    .lib-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: opacity 0.2s ease;
    }
    
    .lib-button.primary {
      background-color: #007bff;
      color: white;
    }
    
    .lib-button.primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .lib-button.secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .lib-button.secondary:hover:not(:disabled) {
      background-color: #545b62;
    }
    
    .lib-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}
