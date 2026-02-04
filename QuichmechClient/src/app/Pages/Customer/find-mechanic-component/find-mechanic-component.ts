import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Mechanic, NearbyMechanicsQuery } from '../../../Models/MechanicModel';
import { MechanicService } from '../../../Services/mechanic-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-mechanic-component',
  standalone: false,
  templateUrl: './find-mechanic-component.html',
  styleUrls: ['./find-mechanic-component.css'],
})
export class FindMechanicComponent implements OnInit {
  searchForm!: FormGroup;
  mechanics: Mechanic[] = [];
  loading = false;
  currentLocation = { lat: 0, lng: 0 };
  showFilters = false;
  viewMode: 'list' | 'grid' = 'grid';

  specializations = [
    'Engine Repair',
    'Transmission',
    'Brakes',
    'Electrical',
    'Oil Change',
    'Tire Service',
    'AC Repair',
    'Body Work',
    'Diagnostics'
  ];

  constructor(
    private fb: FormBuilder,
    private mechanicService: MechanicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getCurrentLocation();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      latitude: [0],
      longitude: [0],
      radiusKm: [10],
      specialization: [''],
      maxHourlyRate: [null],
      minRating: [null],
      isAvailable: [true]
    });
  }

  getCurrentLocation(): void {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.searchForm.patchValue({
            latitude: this.currentLocation.lat,
            longitude: this.currentLocation.lng
          });
          this.searchMechanics();
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default location (you can change this)
          this.currentLocation = { lat: 40.7128, lng: -74.0060 }; // New York
          this.searchForm.patchValue({
            latitude: this.currentLocation.lat,
            longitude: this.currentLocation.lng
          });
          this.searchMechanics();
        }
      );
    } else {
      this.currentLocation = { lat: 40.7128, lng: -74.0060 };
      this.searchForm.patchValue({
        latitude: this.currentLocation.lat,
        longitude: this.currentLocation.lng
      });
      this.searchMechanics();
    }
  }

  searchMechanics(): void {
    this.loading = true;
    const query: NearbyMechanicsQuery = this.searchForm.value;

    this.mechanicService.findNearbyMechanics(query).subscribe({
      next: (mechanics) => {
        this.mechanics = mechanics;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching mechanics:', error);
        this.loading = false;
      }
    });
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.searchForm.patchValue({
      specialization: '',
      maxHourlyRate: null,
      minRating: null,
      isAvailable: true
    });
    this.searchMechanics();
  }

  viewMechanicProfile(mechanicId: number): void {
    this.router.navigate(['/customer/mechanic-profile', mechanicId]);
  }

  contactMechanic(mechanic: Mechanic): void {
    // Navigate to create request with pre-selected mechanic
    this.router.navigate(['/customer/create-request'], {
      queryParams: { mechanicId: mechanic.id }
    });
  }
}
