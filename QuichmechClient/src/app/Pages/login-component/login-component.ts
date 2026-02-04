import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.navigateBasedOnRole();
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm?.controls || {};
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.navigateBasedOnRole(),
      error: err => {
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  private navigateBasedOnRole(): void {
    if (this.authService.isCustomer()) {
      this.router.navigate(['/customer/dashboard']);
    } else if (this.authService.isMechanic()) {
      this.router.navigate(['/mechanic/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

