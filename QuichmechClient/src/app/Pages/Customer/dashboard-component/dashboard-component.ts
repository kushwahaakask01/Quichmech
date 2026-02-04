import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../../../Models/ServiceRequestModel';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-dashboard-component',
  standalone: false,
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  loading = true;
  requests: ServiceRequest[] = [];
  stats = {
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  };

  constructor(
    private serviceRequestService: ServiceRequestService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.serviceRequestService.getCustomerRequests().subscribe({
      next: (requests) => {
        this.requests = requests.slice(0, 5); // Show latest 5
        this.calculateStats(requests);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(requests: ServiceRequest[]): void {
    this.stats.total = requests.length;
    this.stats.pending = requests.filter(r => r.status === ServiceRequestStatus.Pending).length;
    this.stats.active = requests.filter(r =>
      r.status === ServiceRequestStatus.Accepted ||
      r.status === ServiceRequestStatus.InProgress
    ).length;
    this.stats.completed = requests.filter(r => r.status === ServiceRequestStatus.Completed).length;
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

  navigateToRequest(id: number): void {
    this.router.navigate(['/customer/requests', id]);
  }

  createNewRequest(): void {
    this.router.navigate(['/customer/create-request']);
  }

  findMechanics(): void {
    this.router.navigate(['/customer/find-mechanics']);
  }
}
