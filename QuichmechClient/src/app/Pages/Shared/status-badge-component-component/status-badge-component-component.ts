import { Component, Input } from '@angular/core';
import { ServiceRequestStatus } from '../../../Models/ServiceRequestModel';

@Component({
  selector: 'app-status-badge-component-component',
  standalone: false,
  templateUrl: './status-badge-component-component.html',
  styleUrl: './status-badge-component-component.css',
})
export class StatusBadgeComponentComponent {
  @Input() status!: ServiceRequestStatus;

  getStatusClass(): string {
    const statusMap: { [key in ServiceRequestStatus]: string } = {
      [ServiceRequestStatus.Pending]: 'status-pending',
      [ServiceRequestStatus.Accepted]: 'status-accepted',
      [ServiceRequestStatus.InProgress]: 'status-inprogress',
      [ServiceRequestStatus.Completed]: 'status-completed',
      [ServiceRequestStatus.Cancelled]: 'status-cancelled',
      [ServiceRequestStatus.Rejected]: 'status-cancelled'
    };
    return statusMap[this.status] || 'status-pending';
  }
}
