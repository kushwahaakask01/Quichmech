import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../../../Models/ServiceRequestModel';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { MechanicService } from '../../../Services/mechanic-service';
import { Mechanic } from '../../../Models/MechanicModel';

@Component({
  selector: 'app-mechanic-dashboard-component',
  standalone: false,
  templateUrl: './mechanic-dashboard-component.html',
  styleUrl: './mechanic-dashboard-component.css',
})
export class MechanicDashboardComponent implements OnInit {
  profile: Mechanic | null = null;
  stats = {
    totalJobs: 0,
    activeJobs: 0,
    earnings: 0,
    rating: 0
  };
  nearbyRequests: ServiceRequest[] = [];
  activeJobs: ServiceRequest[] = [];
  loading = true;

  constructor(
    private mechanicService: MechanicService,
    private serviceRequestService: ServiceRequestService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    forkJoin({
      profile: this.mechanicService.getProfile(),
      nearbyRequests: this.serviceRequestService.getNearbyPendingRequests(20),
      myRequests: this.serviceRequestService.getMechanicRequests()
    }).subscribe({
      next: (data) => {
        this.profile = data.profile;
        this.nearbyRequests = data.nearbyRequests.slice(0, 5);
        this.activeJobs = data.myRequests.filter(r =>
          r.status === ServiceRequestStatus.Accepted ||
          r.status === ServiceRequestStatus.InProgress
        );
        this.calculateStats(data.myRequests);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(requests: ServiceRequest[]): void {
    this.stats.totalJobs = requests.filter(r =>
      r.status === ServiceRequestStatus.Completed
    ).length;
    this.stats.activeJobs = this.activeJobs.length;
    this.stats.earnings = requests
      .filter(r => r.finalCost)
      .reduce((sum, r) => sum + (r.finalCost || 0), 0);
    this.stats.rating = this.profile?.averageRating || 0;
  }

  toggleAvailability(): void {
    if (this.profile) {
      const newStatus = !this.profile.isAvailable;
      this.mechanicService.updateAvailability({ isAvailable: newStatus }).subscribe({
        next: () => {
          this.profile!.isAvailable = newStatus;
        },
        error: (error) => {
          console.error('Error updating availability:', error);
        }
      });
    }
  }

  acceptRequest(requestId: number): void {
    if (this.profile) {
      this.serviceRequestService.assignMechanic(requestId, { mechanicId: this.profile.id }).subscribe({
        next: () => {
          this.loadDashboard();
        },
        error: (error) => {
          console.error('Error accepting request:', error);
          alert('Failed to accept request');
        }
      });
    }
  }

  viewRequest(id: number): void {
    this.router.navigate(['/mechanic/requests', id]);
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

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
