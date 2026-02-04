import { Injectable } from '@angular/core';
import { environment } from '../Environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mechanic, MechanicProfile, NearbyMechanicsQuery, UpdateAvailability } from '../Models/MechanicModel';

@Injectable({
  providedIn: 'root',
})
export class MechanicService {
  private apiUrl = `${environment.apiUrl}/mechanics`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: MechanicProfile): Observable<Mechanic> {
    return this.http.put<Mechanic>(`${this.apiUrl}/profile`, profile);
  }

  updateAvailability(availability: UpdateAvailability): Observable<any> {
    return this.http.patch(`${this.apiUrl}/availability`, availability);
  }

  findNearbyMechanics(query: NearbyMechanicsQuery): Observable<Mechanic[]> {
    return this.http.post<Mechanic[]>(`${this.apiUrl}/nearby`, query);
  }

  getMechanicById(id: number): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.apiUrl}/${id}`);
  }
}
