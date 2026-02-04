import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reveiw-form-component',
  standalone: false,
  templateUrl: './reveiw-form-component.html',
  styleUrl: './reveiw-form-component.css',
})
export class ReveiwFormComponent implements OnInit {
  @Input() serviceRequestId!: number;
  @Output() reviewSubmitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  reviewForm!: FormGroup;
  selectedRating = 0;
  hoveredRating = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      serviceRequestId: [this.serviceRequestId],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating, serviceRequestId: this.serviceRequestId });
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  resetHoveredRating(): void {
    this.hoveredRating = 0;
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.reviewSubmitted.emit(this.reviewForm.value);
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }

  getDisplayRating(): number {
    return this.hoveredRating || this.selectedRating;
  }
}
