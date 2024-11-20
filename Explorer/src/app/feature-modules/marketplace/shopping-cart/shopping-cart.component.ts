import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { OrderItem } from '../model/order-item.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { Wallet } from '../model/wallet';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart: ShoppingCart | null = null;
  touristId: number ; 
  priceCurrencies: string[] = ['AC', 'Eur', 'Dol','Rsd']
  wallet : Wallet;
  user: User;

  constructor(private shoppingCartService: ShoppingCartService, private tokenStorage: TokenStorage,
    private marketService : MarketplaceService, private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.touristId = this.tokenStorage.getUserId() ?? 0;
    this.getCartItems();
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadWallet();
  });
  
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
  const confirmation = window.confirm('Are you sure you want to remove this item?');
  if (!confirmation) {
    return; 
  }
  if (this.shoppingCart) {
    const index = this.shoppingCart.items.indexOf(item);
    if (index > -1) {
      this.shoppingCart.items.splice(index, 1); 
    }
  }
  // Ažurirajte total price na osnovu novih stavki
  this.updateTotalPrice(); 

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


updateTotalPrice(): void {
  if (this.shoppingCart) {
    let totalAmount = 0;
    this.shoppingCart.items.forEach(item => {
      totalAmount += item.price.amount; 
    });
    this.shoppingCart.totalPrice.amount = totalAmount; 
  }
}

checkout(): void {
  const confirmation = window.confirm('Are you sure you want to complete the purchase?');
  if (!confirmation) {
    return;
  }
  this.shoppingCartService.checkout(this.touristId).subscribe(
    response => {
      console.log('Purchase completed successfully', response);
      this.shoppingCart = null; 
      this.getCartItems(); 
      this.loadWallet();
    },
    error => {
      console.error('Error during checkout', error);
    }
  );
}

loadWallet(): void{
  if(this.user.role === 'tourist' && this.user.id){
    this.marketService.getWalletByTourist().subscribe({
      next: (result: Wallet) => {
        this.wallet = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}

}
