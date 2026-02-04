import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message-component',
  standalone: false,
  templateUrl: './error-message-component.html',
  styleUrl: './error-message-component.css',
})
export class ErrorMessageComponent {
  @Input() message = '';
  @Input() type: 'error' | 'warning' | 'info' | 'success' = 'error';
  @Input() dismissible = true;
  @Output() dismissed = new EventEmitter<void>();

  dismiss(): void {
    this.dismissed.emit();
  }

  get bgColor(): string {
    const colors = {
      error: 'bg-red-50 border-red-200 text-red-700',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      info: 'bg-blue-50 border-blue-200 text-blue-700',
      success: 'bg-green-50 border-green-200 text-green-700'
    };
    return colors[this.type];
  }

  get iconColor(): string {
    const colors = {
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
      success: 'text-green-500'
    };
    return colors[this.type];
  }
}
