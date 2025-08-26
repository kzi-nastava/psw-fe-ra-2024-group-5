import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BundleCard } from '../model/bundle.models';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { MarketplaceService } from '../marketplace.service';
import { BundleStatus } from '../model/bundle.models';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-bundle-card',
  templateUrl: './bundle-card.component.html',
  styleUrls: ['./bundle-card.component.css'],
})
export class BundleCardComponent {
  BundleStatus = BundleStatus; 
  @Input() bundleCard: BundleCard;
  @Input() itemCard: OrderItem | null = null;
  @Output() bundleSelected = new EventEmitter<number>();
  @Output() bundleDeleted = new EventEmitter<number>();
  @Output() bundleUpdated = new EventEmitter<BundleCard>();
  @Input() isAuthorView: boolean = false;


  showEditDialog: boolean = false;
  editForm = {
    name: '',
    price: 0
  };
 
  showDeleteDialog: boolean = false;


  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent | null = null; 
  user: User | undefined;
  currencies: string[] = ['AC','e','$','rsd'];
  canPublishFlag: boolean = false;
  showAllTours: boolean = false;
  currentTourIndex: number = 0;
  Math = Math; 

  constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService, private marketplaceService: MarketplaceService,   private router: Router){}
    ngOnInit(): void {
      if(!this.bundleCard)
        return;

      this.authService.user$.subscribe(user => {
        this.user = user;
      });
      if (this.isAuthorView && this.bundleCard.id) {
    this.marketplaceService.canPublishBundle(this.bundleCard.id)
      .subscribe({
        next: (result) => this.canPublishFlag = result,
        error: (err) => console.error('Greška prilikom provere publish statusa:', err)
      });
  }
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

deleteBundle(): void {
  this.marketplaceService.deleteBundle(this.bundleCard.id, this.bundleCard.authorId)
    .subscribe({
      next: () => {
        console.log(`Bundle ${this.bundleCard.id} obrisan!`);
        this.bundleDeleted.emit(this.bundleCard.id); 
      },
      error: (err) => console.error('Greška prilikom brisanja:', err)
    });
}

publishBundle(): void {
  this.marketplaceService.publishBundle(this.bundleCard.id, this.bundleCard.authorId)
    .subscribe({
      next: () => {
        console.log(`Bundle ${this.bundleCard.id} objavljen!`);
        this.bundleCard.status = BundleStatus.PUBLISHED;
      },
      error: (err) => console.error('Greška prilikom objavljivanja:', err)
    });
}


archiveBundle(): void {
  this.marketplaceService.archiveBundle(this.bundleCard.id, this.bundleCard.authorId)
    .subscribe({
      next: () => {
        console.log(`Bundle ${this.bundleCard.id} arhiviran!`);
        this.bundleCard.status = BundleStatus.ARCHIVED;
      },
      error: (err) => console.error('Greška prilikom arhiviranja:', err)
    });
}
 editBundle(): void {
    this.editForm.name = this.bundleCard.name;
    this.editForm.price = this.bundleCard.price.amount;
    this.showEditDialog = true;
  }

  saveEdit(): void {
    if (!this.editForm.name.trim()) {
      alert('Bundle name is required');
      return;
    }

    if (this.editForm.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    const updateDto = {
      id: this.bundleCard.id,
      authorId: this.bundleCard.authorId,
      name: this.editForm.name,
      price: {
        amount: this.editForm.price,
        currency: this.bundleCard.price.currency
      }
    };

    this.marketplaceService.updateBundle(updateDto).subscribe({
      next: (updatedBundle) => {
        this.bundleCard.name = this.editForm.name;
        this.bundleCard.price.amount = this.editForm.price;
        
        this.bundleUpdated.emit(this.bundleCard);
        
        this.showEditDialog = false;
        console.log('Bundle updated successfully!');
      },
      error: (err) => {
        console.error('Error updating bundle:', err);
        alert('Failed to update bundle. Please try again.');
      }
    });
  }

  cancelEdit(): void {
    this.showEditDialog = false;
  }

  closeEditDialog(event: Event): void {
    if (event.target === event.currentTarget) {
      this.showEditDialog = false;
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }
  viewTour(tourId: number): void {
    this.router.navigate(['/tour-detailed-view', tourId]);
  }

getMaxToursToShow(): number {
    if (this.bundleCard.tours.length <= 3) return this.bundleCard.tours.length;
    return 4;
  }

removeTour(tourId: number, event: Event): void {
  event.stopPropagation(); 

  if (!confirm('Are you sure you want to remove this tour from the bundle?')) return;

  if (!this.bundleCard.id || !this.user?.id) return;

  this.marketplaceService.removeTourFromBundle(this.bundleCard.id, tourId, this.user.id)
    .subscribe({
      next: (updatedBundle) => {
        this.bundleCard.tours = this.bundleCard.tours.filter(t => t.id !== tourId);
        this.bundleUpdated.emit(this.bundleCard);
        console.log(`Tour ${tourId} removed from bundle ${this.bundleCard.id}`);
      },
      error: (err) => console.error('Error removing tour from bundle:', err)
    });
}


getVisibleToursCount(): number {
    if (this.bundleCard.tours.length === 2) return 2;
    if (this.bundleCard.tours.length === 3) return 3;
    return 4; 
}

getTourGridClass(): string {
    const count = this.bundleCard.tours.length;
    if (count === 2) return 'two-tours';
    if (count === 3) return 'three-tours';
    return 'four-plus-tours';
}

getVisibleTours(): any[] {
    const visibleCount = this.getVisibleToursCount();
    return this.bundleCard.tours.slice(this.currentTourIndex, this.currentTourIndex + visibleCount);
}

nextTours(): void {
    const maxIndex = this.bundleCard.tours.length - this.getVisibleToursCount();
    if (this.currentTourIndex < maxIndex) {
        this.currentTourIndex += this.getVisibleToursCount();
    }
}

previousTours(): void {
    if (this.currentTourIndex > 0) {
        this.currentTourIndex -= this.getVisibleToursCount();
    }
}
getTotalPages(): number[] {
    const totalPages = Math.ceil(this.bundleCard.tours.length / this.getVisibleToursCount());
    return Array(totalPages).fill(0).map((x, i) => i);
}

getCurrentPage(): number {
    return Math.floor(this.currentTourIndex / this.getVisibleToursCount());
}

goToPage(pageIndex: number): void {
    this.currentTourIndex = pageIndex * this.getVisibleToursCount();
}
}
