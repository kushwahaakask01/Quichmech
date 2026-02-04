import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-component',
  standalone: false,
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css'],
})
export class RegisterComponent implements OnInit {
  loading = false;
  selectedRole: string = '';

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Convenience getter for template
  get f() { return this.registerForm.controls; }

  // Password matching validator
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  selectRole(role: 'Customer' | 'Mechanic') {
    this.registerForm.patchValue({ role });
    this.selectedRole = role;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open("Registration successfully...", "Close", {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: "bottom",
          panelClass: ['success-snack']
        })
        setTimeout(() => {
          this.router.navigate(['/login'], { skipLocationChange: true });// redirect after success
        }, 2500)
      },
      error: err => {
        this.loading = false;
        this.snack.open("Registration failed !", "Close", {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: "bottom",
          panelClass: ['error-snack']
        })
      }
    });
  }
}
