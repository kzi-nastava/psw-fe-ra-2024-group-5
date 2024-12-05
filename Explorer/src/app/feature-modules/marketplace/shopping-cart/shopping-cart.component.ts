import { Component, OnInit, ViewChild } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { BundleOrderItem, OrderItem } from '../model/order-item.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { Router } from '@angular/router';
import { Tour } from '../../tour-authoring/model/tour.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Wallet } from '../model/wallet';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Coupon } from '../model/coupon.model';
import { BundleDetailed } from '../model/bundle.models';


@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart: ShoppingCart | null = null;

  
  touristId: number;
  priceCurrencies: string[] = ['AC', 'Eur', 'Dol', 'Rsd']
  wallet: Wallet;
  user: User;
  tourImageUrl: SafeUrl | null = null;
  tourImage: string | ArrayBuffer | null = null;

  discountCode: string = ''; // Kod kupona koji korisnik unosi

  isCheckoutModalOpen: boolean = false; // Da li je modal otvoren

  imagePreview: string | null = null; // Ovo drži URL za prikaz slike
  tours: TourCard[] = [];

  discountApplied: boolean = false; // Flag koji označava da li je popust primenjen
  discountedPrice: number = 0; 
  coupon: Coupon;
  

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent | undefined; // Dodaj ViewChild za NavbarComponent


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

  constructor(private shoppingCartService: ShoppingCartService, private tokenStorage: TokenStorage, private router: Router,
    private sanitizer: DomSanitizer, private marketService: MarketplaceService, private authService: AuthService, private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.touristId = this.tokenStorage.getUserId() ?? 0;
    this.getCartItems();

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadWallet();
    });

  }

  loadTourImages(): void {
    if (this.shoppingCart?.tourItems) {
      this.shoppingCart.tourItems.forEach(item => {
        this.shoppingCartService.getTourImage(item.tourId).subscribe(
          (response: Blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              item.imageUrl = reader.result as string; 
            };
            reader.readAsDataURL(response); 
          },
          error => {
            console.error('Error fetching image for tour:', item.tourId, error);
            item.imageUrl = '';
          }
        );
      });
    }
    if(this.shoppingCart?.bundleItems){
      this.shoppingCart.bundleItems.forEach(item => {
        this.shoppingCartService.getBundleById(item.bundleId).subscribe({
          next: (result: BundleDetailed) => {
            console.log(result);
            this.shoppingCartService.getTourImage(result.bundleItems[0]).subscribe(
              (response: Blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  item.imageUrl = reader.result as string; 
                };
                reader.readAsDataURL(response); 
              },
              error => {
                console.error('Error fetching image for tour:', result.bundleItems[0], error);
                item.imageUrl = '';
              }
            );
          },
          error: () => {}
        });
      });
    }
  }

  getCartItems(): void {
    this.shoppingCartService.getByTouristId(this.touristId).subscribe(
      (data: ShoppingCart) => {
        this.shoppingCart = data;
        console.log(this.shoppingCart)
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
      const index = this.shoppingCart.tourItems.indexOf(item);
      if (index > -1) {
        this.shoppingCart.tourItems.splice(index, 1);
      }
    }
    this.updateTotalPrice();

    this.shoppingCartService.removeItemFromCart(item, this.touristId).subscribe(
      response => {

        console.log('Item removed successfully', response);
        const newCount = this.shoppingCart?.tourItems.length || 0;
        //this.shoppingCartService.updateItemsCount(newCount);
        this.shoppingCartService.updateItemCount(this.shoppingCart?.tourItems.length || 0);

      },
      error => {
        console.error('Error removing item', error);
        if (this.shoppingCart) {
          this.shoppingCart.tourItems.push(item);
        }
      }
    );
  }

  removeBundle(item: BundleOrderItem): void {
    const confirmation = window.confirm('Are you sure you want to remove this item?');
    if (!confirmation) {
      return;
    }
    if (this.navbarComponent) {
      this.navbarComponent.decreaseItemsCount();
    }
    if (this.shoppingCart) {
      const index = this.shoppingCart.bundleItems.indexOf(item);
      if (index > -1) {
        this.shoppingCart.tourItems.splice(index, 1);
      }
    }
    this.updateTotalPrice();

    this.shoppingCartService.removeBundleFromCart(item, this.touristId).subscribe(
      response => {

        console.log('Item removed successfully', response);
        const newCount = this.shoppingCart?.tourItems.length || 0;
        //this.shoppingCartService.updateItemsCount(newCount);
        this.shoppingCartService.updateItemCount(this.shoppingCart?.tourItems.length || 0);

      },
      error => {
        console.error('Error removing item', error);
        if (this.shoppingCart) {
          this.shoppingCart.bundleItems.push(item);
        }
      }
    );
  }


  updateTotalPrice(): void {
    if (this.shoppingCart) {
      let totalAmount = 0;
      this.shoppingCart.tourItems.forEach(item => {
        totalAmount += item.price.amount;
      });
      this.shoppingCart.bundleItems.forEach(item => {
        totalAmount += item.price.amount;
      });
      this.shoppingCart.totalPrice.amount = totalAmount;
    }
  }

  checkout(): void {
    
    const discountCodeToUse = this.discountCode && this.discountCode.trim() !== '' ? this.discountCode : null; 
      this.shoppingCartService.checkout(this.touristId, this.discountCode).subscribe(
      response => {
        console.log('Purchase completed successfully', response);
        
        this.shoppingCart = null;
        this.getCartItems(); 
        this.loadWallet();    
        this.closeCheckoutModal(); 
      },
      error => {
        if (error.status === 400 && error.error?.error === "Not enough funds in wallet.") {
          console.error('Insufficient funds error:', error);
          this.showErrorAlert('You do not have enough funds in your wallet to complete this purchase.');
        } else {
          console.error('Error during checkout', error);
        }
      }
    );
  }

  private showErrorAlert(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['alert-danger', 'custom-snackbar']
    });
  }
  

  detailedAboutTour(tourId: number): void {
    this.router.navigate(['/tour-detailed-view', tourId]);
  }

  loadWallet(): void {
    if (this.user.role === 'tourist' && this.user.id) {
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

    openCheckoutModal(): void {
      this.isCheckoutModalOpen = true;
    }

  closeCheckoutModal(): void {
    this.isCheckoutModalOpen = false;
  }

  applyDiscount(): void {
    if (this.discountCode.trim() !== '') {
      this.shoppingCartService.getCouponByCode(this.discountCode).subscribe(
        (data: Coupon) => {
          this.coupon = data;
  
          if (this.coupon && this.coupon.percentage) {
            const discountPercentage = this.coupon.percentage;
  
            if (this.shoppingCart) {
              let totalAmount = 0;
              
              this.shoppingCart.tourItems.forEach(item => {
                //totalAmount += item.price.amount;
  
                //var discountedAmount;
                if(this.coupon.tourIds.includes(item.tourId))
                  {
                    const discountedAmount = item.price.amount - (item.price.amount * (discountPercentage / 100));
                    item.discountedPrice = discountedAmount;
                    item.showOldPrice = true;
                    totalAmount += item.discountedPrice;
                  }
                else
                {
                  item.discountedPrice = item.price.amount;
                  item.showOldPrice = false;
                  totalAmount += item.price.amount;
                }
                  
              });

              this.shoppingCart.totalPrice.amount = totalAmount;
              this.discountApplied = true;
              this.closeCheckoutModal();
            }

          } else {
            console.error('Coupon or percentage is undefined.');
            alert('Invalid coupon or no percentage defined.');
          }
        },
        error => {
          console.error('Error fetching coupon:', error);
          alert('Error fetching coupon: ' + error.message);
        }
      );
    } else {
      alert('Please enter a valid discount code');
    }
  }

}

