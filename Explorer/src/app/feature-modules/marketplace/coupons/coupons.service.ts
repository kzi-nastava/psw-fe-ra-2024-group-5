import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';
import { environment } from 'src/env/environment';
import { Coupon } from '../model/coupon.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { UserProfile } from '../../administration/model/userProfile.model';


@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor(private http: HttpClient) { }

  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${environment.apiHost}coupon/getAll`).pipe(
      tap(response => console.log(response)),  // Proveri šta tačno vraća API
      catchError(error => {
        console.error('Error fetching coupons:', error);
        return of([]);
      })
    );
  }

  getToursByIds(tourIds: number[]): Observable<Tour[]> {

    const params = new HttpParams().set('tourIds', tourIds.join(','));

    return this.http.get<Tour[]>(`${environment.apiHost}coupon/tours`, { params }).pipe(
      tap(response => console.log('Tours fetched:', response)),
      catchError(error => {
        console.error('Error fetching tours:', error);
        return of([]);  
      })
    );
  }

  updateCoupon(id: number, updatedCoupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(`${environment.apiHost}coupon/update/${id}`, updatedCoupon);
  }

  deleteCoupon(id: number): Observable<any> {
    return this.http.delete(`${environment.apiHost}coupon/delete/${id}`).pipe(
      tap(() => console.log(`Coupon with ID ${id} deleted`)),
      catchError(error => {
        console.error('Error deleting coupon:', error);
        return of(null);  
      })
    );
  }

  getUserProfile(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(environment.apiHost + 'administration/profile/' + id);
  }

  getTourImage(tourId: number): Observable<Blob> {
    return this.http.get(`${environment.apiHost}tour/${tourId}/image`, { responseType: 'blob' });
  }
  
}
