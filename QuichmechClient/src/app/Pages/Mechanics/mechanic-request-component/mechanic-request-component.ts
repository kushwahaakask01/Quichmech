import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceRequestStatus } from '../../../Models/ServiceRequestModel';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { MechanicService } from '../../../Services/mechanic-service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mechanic-request-component',
  standalone: false,
  templateUrl: './mechanic-request-component.html',
  styleUrl: './mechanic-request-component.css',
})
export class MechanicRequestComponent implements OnInit {
  nearbyRequests: ServiceRequest[] = [];
  myRequests: ServiceRequest[] = [];
  selectedTab: 'nearby' | 'mine' = 'nearby';
  loading = true;
  radiusKm = 20;

  constructor(
    private serviceRequestService: ServiceRequestService,
    private mechanicService: MechanicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    forkJoin({
      nearby: this.serviceRequestService.getNearbyPendingRequests(this.radiusKm),
      mine: this.serviceRequestService.getMechanicRequests()
    }).subscribe({
      next: (data) => {
        this.nearbyRequests = data.nearby;
        this.myRequests = data.mine;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.loading = false;
      }
    });
  }

  acceptRequest(requestId: number): void {
    this.mechanicService.getProfile().subscribe({
      next: (profile) => {
        this.serviceRequestService.assignMechanic(requestId, { mechanicId: profile.id }).subscribe({
          next: () => {
            this.loadRequests();
            alert('Request accepted successfully!');
          },
          error: (error) => {
            console.error('Error accepting request:', error);
            alert('Failed to accept request');
          }
        });
      }
    });
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

  updateRadius(): void {
    this.loadRequests();
  }
}
