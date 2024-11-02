import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { TourCard } from './model/tour-card.model';

@Injectable({
  providedIn: 'root'
})
export class TourCardService {

  constructor(private http: HttpClient) { }

  getTourCards(page: number, pageSize: number): Observable<TourCard[]> {
    return this.http.get<TourCard[]>(environment.apiHost + `tour/published/${page}/${pageSize}`)
  }
}
