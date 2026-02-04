import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})

export class HomeComponent {
  features = [
    {
      icon: 'location',
      title: 'Find Nearby Mechanics',
      description: 'Locate experienced mechanics in your area with real-time availability.'
    },
    {
      icon: 'clock',
      title: 'Quick Response',
      description: 'Get immediate assistance for emergency repairs and scheduled maintenance.'
    },
    {
      icon: 'verified',
      title: 'Verified Professionals',
      description: 'All mechanics are verified and rated by customers for quality assurance.'
    },
    {
      icon: 'price',
      title: 'Transparent Pricing',
      description: 'See upfront pricing and estimates before committing to any service.'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Customer',
      rating: 5,
      comment: 'Found a great mechanic within minutes! The service was quick and professional.',
      avatar: 'SJ'
    },
    {
      name: 'Mike Wilson',
      role: 'Mechanic',
      rating: 5,
      comment: 'QuickMech helped me grow my business and connect with customers easily.',
      avatar: 'MW'
    },
    {
      name: 'David Brown',
      role: 'Customer',
      rating: 5,
      comment: 'Emergency breakdown and got help in 20 minutes. Highly recommend!',
      avatar: 'DB'
    }
  ];

  stats = [
    { value: '5000+', label: 'Verified Mechanics' },
    { value: '50000+', label: 'Happy Customers' },
    { value: '100000+', label: 'Services Completed' },
    { value: '4.9/5', label: 'Average Rating' }
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
    private snack: MatSnackBar
  ) { }

  navigateToRegister(): void {
    this.snack.open("Going on registration page....", "Close", {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snack']
    })
    setTimeout(() => {
      this.router.navigate(['/register'], { skipLocationChange: true });
    }, 2500)
  }
}
