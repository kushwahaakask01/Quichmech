import { Injectable } from '@angular/core';
import { environment } from '../Environment';
import { HttpClient } from '@angular/common/http';
import { AssignMechanic, CreateServiceRequest, ServiceRequest, UpdateServiceRequestStatus } from '../Models/ServiceRequestModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceRequestService {
  private apiUrl = `${environment.apiUrl}/servicerequests`;

  constructor(private http: HttpClient) { }

  createServiceRequest(request: CreateServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, request);
  }

  getServiceRequestById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`);
  }

  getCustomerRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.apiUrl}/customer/my-requests`);
  }

  getMechanicRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.apiUrl}/mechanic/my-requests`);
  }

  getNearbyPendingRequests(radiusKm: number = 20): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(
      `${this.apiUrl}/mechanic/nearby-pending?radiusKm=${radiusKm}`
    );
  }

  assignMechanic(requestId: number, data: AssignMechanic): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(`${this.apiUrl}/${requestId}/assign`, data);
  }

  updateStatus(requestId: number, status: UpdateServiceRequestStatus): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.apiUrl}/${requestId}/status`, status);
  }
}
