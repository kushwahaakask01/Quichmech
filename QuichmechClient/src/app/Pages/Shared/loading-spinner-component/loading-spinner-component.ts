import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner-component',
  standalone: false,
  templateUrl: './loading-spinner-component.html',
  styleUrl: './loading-spinner-component.css',
})
export class LoadingSpinnerComponent {
  @Input() fullScreen = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message = '';
}
