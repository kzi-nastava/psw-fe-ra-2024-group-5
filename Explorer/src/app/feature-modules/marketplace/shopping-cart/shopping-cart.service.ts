import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Injectable } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ShoppingCart } from '../model/shopping-cart.model';

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

    removeItemFromCart(orderItem: OrderItem, touristId: number): Observable<ShoppingCart> {
      return this.http.request<ShoppingCart>('DELETE', environment.apiHost + `shopping-cart/removeItem/${touristId}`, {
        body: orderItem
      });
    }

    getByTouristId(touristId: number) : Observable<ShoppingCart>
    {
      return this.http.get<ShoppingCart>(environment.apiHost + `shopping-cart/tourist/${touristId}`);
    }

    checkout(touristId: number): Observable<any> {
      return this.http.post<any>(environment.apiHost + `shopping-cart/checkout/${touristId}`, {});
    }
    getTourImage(tourId: number): Observable<Blob> {
      return this.http.get(`${environment.apiHost}tour/${tourId}/image`, { responseType: 'blob' });
    }

    getItemsCount(touristId: number): Observable<number> {
      return this.http.get<number>(`${environment.apiHost}shopping-cart/items-count/${touristId}`);
    }
    updateItemsCount(userId: number): void {
      this.getItemsCount(userId).subscribe(count => {
        this.itemsCountSubject.next(count);
      });
    }
    updateItemCount(count: number): void {
      this.itemsCountSubject.next(count);
    }
  
   
}
