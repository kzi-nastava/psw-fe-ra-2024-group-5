import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyPoint } from './model/key-point.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour, TourCreation, TourTourist } from './model/tour.model';
import { TourCard } from './model/tour-card.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Currency } from './model/tour.enums';
import { TourLeaderboard } from './model/tour-leaderboard.model';
import { TourSearchParams } from './model/tour-search.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {
  constructor(private http: HttpClient) { }

  getPaged(tourId: number): Observable<PagedResults<KeyPoint>> {
    return this.http.get<PagedResults<KeyPoint>>(`https://localhost:44333/api/tours/${tourId}/keypoints`);
  }

  saveKeyPoints(keyPoints: KeyPoint[], tourId: number): Observable<KeyPoint[]> {
    return this.http.post<KeyPoint[]>(`https://localhost:44333/api/tours/${tourId}/keypoints`, keyPoints);
  }

  getAuthorTours(user: User, page: number, pageSize: number): Observable<TourCard[]> {
    if (user.role === 'author')
      return this.http.get<TourCard[]>(`${environment.apiHost}tour/author/${user.id}/${page}/${pageSize}`);
    else {
      console.log('Nije dobra rola');
      throw console.error('Nije dobra rola');
    }
  }

  getAuthorTourCardsFiltered(user: User, searchParams: {
    page: number,
    pageSize: number,
    startLat: number,
    endLat: number,
    startLong: number,
    endLong: number
  }): Observable<TourCard[]> {
    const url = `${environment.apiHost}tour/author/filtered/${user.id}`;
    return this.http.post<TourCard[]>(url, searchParams);
  }

  getPublishedTourCardsFiltered(searchParams: TourSearchParams): Observable<TourCard[]> {
    const url = `${environment.apiHost}tour/published/filtered`;
    return this.http.post<TourCard[]>(url, searchParams);
}



  getPublishedTourCards(page: number, pageSize: number): Observable<TourCard[]> {
    return this.http.get<TourCard[]>(environment.apiHost + `tour/published/${page}/${pageSize}`)
  }

  addTour(tour: TourCreation): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'tour/', tour)
  }

  getTourbyId(id: number): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'tour/' + id)
  }

  getTourForTouristById(id: number, touristId: number): Observable<TourTourist> {
    return this.http.get<TourTourist>(environment.apiHost + 'tour/tourist/' + id + '/' + touristId)
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'tour/' + tour.id, tour)
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'tour/' + id)
  }

  publishTour(id: number, newPrice: number, newCurrency: Currency): Observable<any> {
    const payload = {
      amount: newPrice,
      currency: newCurrency
    };

    return this.http.post(`${environment.apiHost}tour/publish/${id}`, payload);
  }

  archiveTour(id: number): Observable<any> {
    return this.http.post(`${environment.apiHost}tour/archive/${id}`, {});
  }

  getLeaderboard(tourId: number): Observable<TourLeaderboard> {
    return this.http.get<TourLeaderboard>(environment.apiHost + `tour/${tourId}/leaderboard`);
  }

  getToursByActivePreference(touristId: number, page: number, pageSize: number): Observable<TourCard[]> {
    return this.http.get<TourCard[]>(`${environment.apiHost}tour/tourist/${touristId}/preferences/${page}/${pageSize}`);
  }

}
