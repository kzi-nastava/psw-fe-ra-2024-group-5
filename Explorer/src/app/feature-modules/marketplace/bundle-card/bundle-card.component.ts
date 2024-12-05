import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BundleCard } from '../model/bundle.models';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';

@Component({
  selector: 'xp-bundle-card',
  templateUrl: './bundle-card.component.html',
  styleUrls: ['./bundle-card.component.css'],
})
export class BundleCardComponent {
  @Input() bundleCard: BundleCard;
  @Input() itemCard: OrderItem | null = null;
  @Output() bundleSelected = new EventEmitter<number>();

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent | null = null; 
  user: User | undefined;
  currencies: string[] = ['AC','e','$','rsd'];
  constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService){}
    ngOnInit(): void {
      if(!this.bundleCard)
        return;

      this.authService.user$.subscribe(user => {
        this.user = user;
      });
  }

  viewMore(): void {
    this.bundleSelected.emit(this.bundleCard.id);
  }
  addToCart(): void{
    if(!this.bundleCard || !this.bundleCard.id || !this.user)
      return;
    

    this.shoppingCartService.addBundleToCart(this.bundleCard.id, this.user?.id).subscribe({
      next: () => {
         if (this.navbarComponent) {
          this.navbarComponent.itemsCount++;
          this.navbarComponent.getItemsCount();
        }
        if (this.user?.id) {
          this.shoppingCartService.updateItemsCount(this.user.id); // Ažuriranje preko BehaviorSubject-a
        }
      },
      error: (err: any) => {
          console.log(err);
      }
  });
  }
}
