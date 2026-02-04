import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  standalone: false,
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  currentUser: any = null;
  userName: string|null = null;


  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.userName = user?.firstName || null;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  get userInitials(): string {
    if (!this.userName) return '';
    return this.userName.charAt(0).toUpperCase();
  }
}
