import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class guestGuardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.authService.userRole;

    if (!this.authService.isLoggedIn || this.authService.isTokenExpired()) {
      return true;
    }

    if (userRole === "Mechanic") {
      this.router.navigate(['/customer/dashboard'], { skipLocationChange: true });
      return false;
    } else {
      this.router.navigate(['/customer/dashboard'], { skipLocationChange: true });
      return false;
    }
  }
};
