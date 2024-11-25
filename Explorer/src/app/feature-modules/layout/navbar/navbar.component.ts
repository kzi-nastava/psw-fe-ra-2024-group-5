import { Component, OnInit, ViewChild  } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { TourEquipmentDialogComponent } from '../../tour-authoring/tour-equipment-dialog/tour-equipment-dialog.component';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationComponent } from '../../notification/notification/notification.component';
import { ShoppingCartService } from '../../marketplace/shopping-cart/shopping-cart.service';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  routerSubscription: Subscription;
  itemsCount: number = 0;  // Dodajte promenljivu za broj stavki u korpi


  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private shoppingCartService: ShoppingCartService,  // Uvoz ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user && user.id) {  // Kada korisnik bude prijavljen, pozivamo metod za broj stavki
        this.getItemsCount(user.id);
      }
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeNotifications();
      }
    });
  }

     // Pozivanje API-ja za broj stavki u korpi
     getItemsCount(userId?: number): void {
      if (!userId) {
        console.log('Korisnički ID nije definisan.');
        return;
      }
    
      this.shoppingCartService.getItemsCount(userId).subscribe({
        next: (count: number) => {
          this.itemsCount = count; // Ažuriranje broja stavki
        },
        error: (err: any) => {
          console.log('Greška pri učitavanju broja stavki:', err);
        }
      });
    }
    

  openTourEquipmentDialog(): void {
    this.dialog.open(TourEquipmentDialogComponent, {
      width: '500px',
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  showNotifications = false;
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  @ViewChild(NotificationComponent) notificationComponent: NotificationComponent;

  getUnreadCount(): number {
    return this.notificationComponent ? this.notificationComponent.getUnreadNotificationsCount() : 0;
  }

}
