import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourReview } from '../../tour-authoring/model/tour.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiHost + 'tour/review';

  constructor(private http: HttpClient) { }

  createReview(review: TourReview): Observable<TourReview> {
    return this.http.post<TourReview>(this.apiUrl, review);
  }
}