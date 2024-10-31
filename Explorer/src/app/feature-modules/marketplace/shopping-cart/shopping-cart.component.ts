import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { Currency } from '../model/money.model';
import { OrderItem } from '../model/order-item.model';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart: ShoppingCart | null = null;
  touristId: number = 1; // popraviti
  Currency = Currency;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.getCartItems();
  
}
getCartItems(): void {
  this.shoppingCartService.getByTouristId(this.touristId).subscribe(
    (data: ShoppingCart) => {      
      this.shoppingCart = data;
    },
    error => console.error('Error fetching cart items', error)
  );
}
removeItem(item: OrderItem): void {
  if (this.shoppingCart) {
    const index = this.shoppingCart.items.indexOf(item);
    if (index > -1) {
      this.shoppingCart.items.splice(index, 1); 
    }
  }

  this.shoppingCartService.removeItemFromCart(item, this.touristId).subscribe(
    response => {
      console.log('Item removed successfully', response);
    },
    error => {
      console.error('Error removing item', error);
      if (this.shoppingCart) {
        this.shoppingCart.items.push(item); 
      }
    }
  );
}

}
