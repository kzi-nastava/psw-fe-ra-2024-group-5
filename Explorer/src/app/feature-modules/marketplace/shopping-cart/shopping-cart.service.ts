import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Injectable } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../model/shopping-cart.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

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
}
