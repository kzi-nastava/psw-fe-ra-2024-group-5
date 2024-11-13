import { Component, OnInit, ViewChild  } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { TourEquipmentDialogComponent } from '../../tour-authoring/tour-equipment-dialog/tour-equipment-dialog.component';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationComponent } from '../../notification/notification/notification.component';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  routerSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeNotifications();
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
