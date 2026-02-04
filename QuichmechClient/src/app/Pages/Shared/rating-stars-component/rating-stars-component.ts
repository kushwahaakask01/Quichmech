import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars-component',
  standalone: false,
  templateUrl: './rating-stars-component.html',
  styleUrl: './rating-stars-component.css',
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() showCount: boolean = false;
  @Input() count: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get stars(): number[] {
    return Array(this.maxRating).fill(0).map((_, i) => i < Math.floor(this.rating) ? 1 : 0);
  }

  get starSize(): string {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    return sizes[this.size];
  }
}
