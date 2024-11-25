import { Component, OnInit, ViewChild } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { OrderItem } from '../model/order-item.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { Router } from '@angular/router';
import { Tour } from '../../tour-authoring/model/tour.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../../layout/navbar/navbar.component';



@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart: ShoppingCart | null = null;
  touristId: number ; 
  priceCurrencies: string[] = ['AC', 'Eur', 'Dol','Rsd']
  tourImageUrl: SafeUrl | null = null;
  tourImage: string | ArrayBuffer | null = null;


  imagePreview: string | null = null; // Ovo drži URL za prikaz slike
  tours: TourCard[] = [];

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent  | undefined; // Dodaj ViewChild za NavbarComponent


  detailedTour(tour: TourCard): void {
    this.router.navigate(['/tour-detailed-view', tour.id]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.convertToBase64(file);
    }
  }
  
  private convertToBase64(file: File): void {
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagePreview = base64String; // Postavlja preview slike
    };
  
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  
    reader.readAsDataURL(file); // Konvertuje fajl u Base64 format
  }

  constructor(private shoppingCartService: ShoppingCartService,private tokenStorage: TokenStorage,private router: Router,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    this.touristId = this.tokenStorage.getUserId() ?? 0;
    this.getCartItems();
}

loadTourImages(): void {
  if (this.shoppingCart?.items) {
    this.shoppingCart.items.forEach(item => {
      this.shoppingCartService.getTourImage(item.tourId).subscribe(
        (response: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            item.imageUrl = reader.result as string; // Postavljanje slike na nivou stavke
          };
          reader.readAsDataURL(response); // Pretvaranje Blob-a u Data URL
        },
        error => {
          console.error('Error fetching image for tour:', item.tourId, error);
          item.imageUrl = '';
        }
      );
    });
  }
}

getCartItems(): void {
  this.shoppingCartService.getByTouristId(this.touristId).subscribe(
    (data: ShoppingCart) => {      
      this.shoppingCart = data;
      this.loadTourImages();
    },
    error => console.error('Error fetching cart items', error)
  );
}
removeItem(item: OrderItem): void {
  const confirmation = window.confirm('Are you sure you want to remove this item?');
  if (!confirmation) {
    return; 
  }
   if (this.navbarComponent) {
    this.navbarComponent.decreaseItemsCount();
  }
  if (this.shoppingCart) {
    const index = this.shoppingCart.items.indexOf(item);
    if (index > -1) {
      this.shoppingCart.items.splice(index, 1); 
    }
  }
  this.updateTotalPrice(); 

  this.shoppingCartService.removeItemFromCart(item, this.touristId).subscribe(
    response => {
      
      console.log('Item removed successfully', response);
      const newCount = this.shoppingCart?.items.length || 0;
      //this.shoppingCartService.updateItemsCount(newCount);
      this.shoppingCartService.updateItemCount(this.shoppingCart?.items.length || 0);

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
    },
    error => {
      console.error('Error during checkout', error);
    }
  );
  
}

detailedAboutTour(tourId: number): void{
  this.router.navigate(['/tour-detailed-view', tourId]);
}

}
