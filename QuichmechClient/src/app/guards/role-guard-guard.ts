import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../Services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.authService.userRole;

    if (!this.authService.isLoggedIn || this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles?.includes(userRole!)) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
