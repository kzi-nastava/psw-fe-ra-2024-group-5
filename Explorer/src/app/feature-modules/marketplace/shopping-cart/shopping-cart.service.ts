import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Injectable } from '@angular/core';
import { BundleOrderItem, OrderItem } from '../model/order-item.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ShoppingCart } from '../model/shopping-cart.model';
import { Coupon } from '../model/coupon.model';
import { BundleDetailed } from '../model/bundle.models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private itemsCountSubject = new BehaviorSubject<number>(0);
  public itemsCount$ = this.itemsCountSubject.asObservable();

  constructor(private http: HttpClient) { }

    addItemToCart(orderItem: OrderItem,touristId: number) : Observable<ShoppingCart>
    {
      return this.http.post<ShoppingCart>(environment.apiHost + `shopping-cart/addItem/${touristId}`, orderItem);
    }

    addBundleToCart(bundleId : number, touristId: number) : Observable<ShoppingCart>{
      return this.http.post<ShoppingCart>(environment.apiHost + `shopping-cart/addBundle/${touristId}`, bundleId)
    }

    removeItemFromCart(orderItem: OrderItem, touristId: number): Observable<ShoppingCart> {
      return this.http.request<ShoppingCart>('DELETE', environment.apiHost + `shopping-cart/removeItem/${touristId}`, {
        body: orderItem
      });
    }

    removeBundleFromCart(bundleOrderItem: BundleOrderItem, touristId : number): Observable<ShoppingCart>{
      return this.http.delete<ShoppingCart>(environment.apiHost + `shopping-cart/removeBundle/${touristId}`, {
        body: bundleOrderItem
      });
    }

    getByTouristId(touristId: number) : Observable<ShoppingCart>
    {
      return this.http.get<ShoppingCart>(environment.apiHost + `shopping-cart/tourist/${touristId}`);
    }

    checkout(touristId: number, discountCode: string | null): Observable<any> {
      // Ako nema discountCode, šalje se prazan string
      const codeParam = discountCode ? `?code=${discountCode}` : '';
    
      // Slanje POST zahteva sa discountCode u URL-u
      return this.http.post<any>(
        `${environment.apiHost}shopping-cart/checkout/${touristId}${codeParam}`,
        {}  // Telo zahteva može biti prazno, jer se kod šalje kao query parametar
      );
    }

    getCouponByCode(code: string): Observable<Coupon> {
      return this.http.get<Coupon>(`${environment.apiHost}coupon/code?code=${code}`).pipe(
        map((coupon: any) => {
          return {
            id: coupon.id, 
            code: coupon.code,
            percentage: coupon.percentage,
            expiredDate: new Date(coupon.expiredDate), 
            tourIds: coupon.tourIds
          };
        })
      );
    }
    
    getTourImage(tourId: number): Observable<Blob> {
      return this.http.get(`${environment.apiHost}tour/${tourId}/image`, { responseType: 'blob' });
    }

    getItemsCount(touristId: number): Observable<number> {
      return this.http.get<number>(`${environment.apiHost}shopping-cart/items-count/${touristId}`);
    }
    updateItemsCount(userId: number): void {
      console.log(userId);
      this.getItemsCount(userId).subscribe(count => {
        this.itemsCountSubject.next(count);
      });
    }
    updateItemCount(count: number): void {
      this.itemsCountSubject.next(count);
    }

    getBundleById(id : number): Observable<BundleDetailed>{
      return this.http.get<BundleDetailed>(environment.apiHost + `author/bundle/get/${id}`);
    }
}
