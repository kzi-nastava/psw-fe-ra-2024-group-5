import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyPoint } from './model/key-point.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {
  constructor(private http: HttpClient) {}            

  getPaged(tourId: number): Observable<PagedResults<KeyPoint>> {
    return this.http.get<PagedResults<KeyPoint>>(`https://localhost:44333/api/tours/${tourId}/keypoints`);
  }
}
