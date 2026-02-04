import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../../../Models/ServiceRequestModel';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customermy-request-component',
  standalone: false,
  templateUrl: './customermy-request-component.html',
  styleUrl: './customermy-request-component.css',
})
export class CustomermyRequestComponent implements OnInit {
  requests: ServiceRequest[] = [];
  filteredRequests: ServiceRequest[] = [];
  selectedStatus: string = 'All';
  loading = true;
  searchTerm = '';

  statuses = ['All', 'Pending', 'Accepted', 'InProgress', 'Completed', 'Cancelled'];

  statusCounts = {
    all: 0,
    pending: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(
    private serviceRequestService: ServiceRequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.serviceRequestService.getCustomerRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.filteredRequests = requests;
        this.calculateStatusCounts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.loading = false;
      }
    });
  }

  calculateStatusCounts(): void {
    this.statusCounts.all = this.requests.length;
    this.statusCounts.pending = this.requests.filter(r => r.status === ServiceRequestStatus.Pending).length;
    this.statusCounts.accepted = this.requests.filter(r => r.status === ServiceRequestStatus.Accepted).length;
    this.statusCounts.inProgress = this.requests.filter(r => r.status === ServiceRequestStatus.InProgress).length;
    this.statusCounts.completed = this.requests.filter(r => r.status === ServiceRequestStatus.Completed).length;
    this.statusCounts.cancelled = this.requests.filter(r => r.status === ServiceRequestStatus.Cancelled).length;
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.requests;

    // Filter by status
    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.vehicleMake.toLowerCase().includes(term) ||
        r.vehicleModel.toLowerCase().includes(term) ||
        r.issueDescription.toLowerCase().includes(term) ||
        (r.mechanicName && r.mechanicName.toLowerCase().includes(term))
      );
    }

    this.filteredRequests = filtered;
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
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

  viewRequest(id: number): void {
    this.router.navigate(['/customer/requests', id]);
  }

  cancelRequest(request: ServiceRequest, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to cancel this service request?')) {
      this.serviceRequestService.updateStatus(request.id, {
        status: ServiceRequestStatus.Cancelled,
        cancellationReason: 'Cancelled by customer'
      }).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (error) => {
          console.error('Error cancelling request:', error);
          alert('Failed to cancel request. Please try again.');
        }
      });
    }
  }

  createNewRequest(): void {
    this.router.navigate(['/customer/create-request']);
  }
}
