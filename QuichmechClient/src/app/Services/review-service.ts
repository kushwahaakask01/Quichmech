import { Injectable } from '@angular/core';
import { environment } from '../Environment';
import { HttpClient } from '@angular/common/http';
import { CreateReview, Review } from '../Models/ReviewModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) { }

  createReview(review: CreateReview): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getMechanicReviews(mechanicId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/mechanic/${mechanicId}`);
  }
}
