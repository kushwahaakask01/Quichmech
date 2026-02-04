import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../../../Models/ServiceRequestModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mechanic-request-management-component',
  standalone:false,
  templateUrl: './mechanic-request-management-component.html',
  styleUrls: ['./mechanic-request-management-component.css'],
})
export class MechanicRequestManagementComponent implements OnInit {
  request: ServiceRequest | null = null;
  loading = true;
  statusForm!: FormGroup;
  updating = false;

  statuses = [
    ServiceRequestStatus.Accepted,
    ServiceRequestStatus.InProgress,
    ServiceRequestStatus.Completed,
    ServiceRequestStatus.Cancelled
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadRequest(id);
  }

  initForm(): void {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      estimatedCost: [null],
      finalCost: [null],
      notes: ['']
    });
  }

  loadRequest(id: number): void {
    this.loading = true;
    this.serviceRequestService.getServiceRequestById(id).subscribe({
      next: (request) => {
        this.request = request;
        this.statusForm.patchValue({
          status: request.status,
          estimatedCost: request.estimatedCost ?? null,
          finalCost: request.finalCost ?? null,
          notes: request.notes ?? ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading request:', error);
        this.loading = false;
      }
    });
  }

  updateStatus(): void {
    if (this.statusForm.valid && this.request) {
      this.updating = true;
      this.serviceRequestService.updateStatus(this.request.id, this.statusForm.value).subscribe({
        next: (updated) => {
          this.request = updated;
          this.updating = false;
          alert('Request updated successfully!');
        },
        error: (error) => {
          console.error('Error updating request:', error);
          alert('Failed to update request');
          this.updating = false;
        }
      });
    }
  }

  markAsInProgress(): void {
    this.statusForm.patchValue({ status: ServiceRequestStatus.InProgress });
    this.updateStatus();
  }

  completeService(): void {
    if (!this.statusForm.get('finalCost')?.value) {
      alert('Please enter the final cost before completing the service');
      return;
    }
    this.statusForm.patchValue({ status: ServiceRequestStatus.Completed });
    this.updateStatus();
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

  callCustomer(): void {
    if (this.request?.customerPhone) {
      window.location.href = `tel:${this.request.customerPhone}`;
    }
  }

  getDirections(): void {
    if (this.request) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${this.request.latitude},${this.request.longitude}`;
      window.open(url, '_blank');
    }
  }

  getCustomerInitials(): string {
    if (!this.request?.customerName) return '';
    const parts = this.request.customerName.split(' ');
    return parts[0][0] + (parts[1]?.[0] || '');
  }
}
