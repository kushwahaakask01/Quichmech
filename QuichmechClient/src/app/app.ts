import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App  implements OnInit{
  protected readonly title = signal('QuichmechClient');

  constructor(private router : Router){}

  ngOnInit(): void {
    // this.router.navigate(['/driver/requests'],{skipLocationChange:true})
  }
}
