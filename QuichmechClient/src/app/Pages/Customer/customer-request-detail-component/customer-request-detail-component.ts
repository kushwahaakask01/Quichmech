import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../../../Models/ServiceRequestModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { ReviewService } from '../../../Services/review-service';

@Component({
  selector: 'app-customer-request-detail-component',
  standalone: false,
  templateUrl: './customer-request-detail-component.html',
  styleUrl: './customer-request-detail-component.css',
})
export class CustomerRequestDetailComponent implements OnInit {
  request: ServiceRequest | null = null;
  loading = true;
  canReview = false;
  showReviewForm = false;
  reviewForm!: FormGroup;
  submittingReview = false;
  selectedRating = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.initReviewForm();
    this.loadRequestDetails(id);
  }

  initReviewForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['']
    });
  }

  loadRequestDetails(id: number): void {
    this.loading = true;
    this.serviceRequestService.getServiceRequestById(id).subscribe({
      next: (request) => {
        this.request = request;
        this.canReview = request.status === ServiceRequestStatus.Completed && !request.mechanicId;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading request:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: ServiceRequestStatus): string {
    const statusMap: { [key in ServiceRequestStatus]: string } = {
      [ServiceRequestStatus.Pending]: 'status-pending',
      [ServiceRequestStatus.Accepted]: 'status-accepted',
      [ServiceRequestStatus.InProgress]: 'status-inprogress',
      [ServiceRequestStatus.Completed]: 'status-completed',
      [ServiceRequestStatus.Cancelled]: 'status-cancelled',
      [ServiceRequestStatus.Rejected]: 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.request) {
      this.submittingReview = true;
      const reviewData = {
        serviceRequestId: this.request.id,
        ...this.reviewForm.value
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: () => {
          this.showReviewForm = false;
          this.loadRequestDetails(this.request!.id);
          this.submittingReview = false;
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          alert('Failed to submit review');
          this.submittingReview = false;
        }
      });
    }
  }

  cancelRequest(): void {
    if (confirm('Are you sure you want to cancel this service request?')) {
      this.serviceRequestService.updateStatus(this.request!.id, {
        status: ServiceRequestStatus.Cancelled,
        cancellationReason: 'Cancelled by customer'
      }).subscribe({
        next: () => {
          this.router.navigate(['/customer/my-requests']);
        },
        error: (error) => {
          console.error('Error cancelling request:', error);
          alert('Failed to cancel request');
        }
      });
    }
  }
}

