import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRequestService } from '../../../Services/service-request-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-create-request-component',
  standalone: false,
  templateUrl: './customer-create-request-component.html',
  styleUrl: './customer-create-request-component.css',
})
export class CustomerCreateRequestComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  requestForm!: FormGroup;
  loading = false;
  errorMessage = '';

  vehicleTypes = ['Car', 'Truck', 'SUV', 'Motorcycle', 'Van'];
  serviceTypes = ['Emergency', 'Scheduled Maintenance', 'Diagnostic', 'Repair', 'Inspection'];

  constructor(
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getCurrentLocation();
  }

  initForm(): void {
    this.requestForm = this.fb.group({
      vehicleType: ['', Validators.required],
      vehicleMake: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: [''],
      issueDescription: ['', [Validators.required, Validators.minLength(10)]],
      serviceType: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      address: ['']
    });
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.requestForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.requestForm.patchValue({
            latitude: 40.7128,
            longitude: -74.0060
          });
        }
      );
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.requestForm.get('vehicleType')?.valid &&
          this.requestForm.get('vehicleMake')?.valid &&
          this.requestForm.get('vehicleModel')?.valid);
      case 2:
        return !!(this.requestForm.get('issueDescription')?.valid &&
          this.requestForm.get('serviceType')?.valid);
      case 3:
        return !!(this.requestForm.get('latitude')?.valid &&
          this.requestForm.get('longitude')?.valid);
      default:
        return false;
    }
  }

  submitRequest(): void {
    if (this.requestForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.serviceRequestService.createServiceRequest(this.requestForm.value).subscribe({
        next: (request) => {
          this.router.navigate(['/customer/requests', request.id]);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create request';
          this.loading = false;
        }
      });
    }
  }
}

