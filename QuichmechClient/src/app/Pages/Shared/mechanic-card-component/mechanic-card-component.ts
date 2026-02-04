import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mechanic } from '../../../Models/MechanicModel';

@Component({
  selector: 'app-mechanic-card-component',
  standalone: false,
  templateUrl: './mechanic-card-component.html',
  styleUrl: './mechanic-card-component.css',
})
export class MechanicCardComponent {
  @Input() mechanic!: Mechanic;
  @Input() showActions = true;
  @Output() viewProfile = new EventEmitter<number>();
  @Output() requestService = new EventEmitter<number>();

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  onViewProfile(): void {
    this.viewProfile.emit(this.mechanic.id);
  }

  onRequestService(): void {
    this.requestService.emit(this.mechanic.id);
  }

  getInitials(): string {
    return `${this.mechanic.firstName[0]}${this.mechanic.lastName[0]}`.toUpperCase();
  }
}
