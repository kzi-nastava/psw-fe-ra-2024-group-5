import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Coupon } from '../model/coupon.model';
import { Observable, catchError, of, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CouponFormService {

  constructor(private http: HttpClient) { }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    coupon.expiredDate = new Date(coupon.expiredDate);

    return this.http.post<Coupon>(`${environment.apiHost}coupon/create`, coupon).pipe(
      tap(response => console.log('Coupon created successfully:', response)),
      catchError(error => {
        console.error('Error creating coupon:', error);
        return throwError(error);  // Prebacuje grešku dalje
      })
    );
  }
    
}
