import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mechanic } from '../../../Models/MechanicModel';
import { Review } from '../../../Models/ReviewModel';
import { MechanicService } from '../../../Services/mechanic-service';
import { ReviewService } from '../../../Services/review-service';

@Component({
  selector: 'app-mechanic-profile-component',
  standalone: false,
  templateUrl: './mechanic-profile-component.html',
  styleUrl: './mechanic-profile-component.css',
})
export class MechanicProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = true;
  editing = false;
  saving = false;
  currentProfile: Mechanic | null = null;
  reviews: Review[] = [];
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private mechanicService: MechanicService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      shopName: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      specialization: [''],
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      licenseNumber: [''],
      hourlyRate: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.mechanicService.getProfile().subscribe({
      next: (profile) => {
        this.currentProfile = profile;
        this.profileForm.patchValue({
          shopName: profile.shopName || '',
          address: profile.address || '',
          latitude: profile.latitude,
          longitude: profile.longitude,
          specialization: profile.specialization || '',
          yearsOfExperience: profile.yearsOfExperience,
          licenseNumber: '',
          hourlyRate: profile.hourlyRate
        });
        this.loadReviews(profile.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  loadReviews(mechanicId: number): void {
    this.reviewService.getMechanicReviews(mechanicId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  enableEdit(): void {
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    this.loadProfile();
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.profileForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.saving = true;
      this.errorMessage = '';

      this.mechanicService.updateProfile(this.profileForm.value).subscribe({
        next: (profile) => {
          this.currentProfile = profile;
          this.editing = false;
          this.saving = false;
          alert('Profile updated successfully!');
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update profile';
          this.saving = false;
        }
      });
    }
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
