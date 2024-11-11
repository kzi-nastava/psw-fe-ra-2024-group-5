import { Component, OnInit } from '@angular/core';
import { Notification } from '../model/notification.model';
import { NotificationService } from '../notification.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum'; 

@Component({
  selector: 'xp-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  userId: number | null;

  constructor(private notificationService: NotificationService,
    private tokenStorage: TokenStorage,
    private router: Router){}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();
    this.loadNotifications();
    console.log(NotificationType.CLUB_MESSAGE); 
  }

  loadNotifications(): void {
    if(this.userId != null)
    {
      this.notificationService.getPagedNotifications(this.userId).subscribe({
        next: (data: PagedResults<Notification>) => {
          this.notifications = data.results.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });   
        },
        error: (err) => {
          console.error('Error loading notifications', err);
        }
      });
    }
  }

  onNotificationClick(notification: Notification): void {
    notification.userReadStatuses?.forEach(status => {
      if (!status.isRead) {
        status.isRead = true;
      }
    });

    if(notification.clubMessageId && notification.clubId)
    {
      this.router.navigate(['/my-clubs', notification.clubId]);
    }
  }

  isNotificationUnread(notification: Notification): boolean {
    const userStatus = notification.userReadStatuses.find(status => status.userId === this.userId);
    return userStatus ? !userStatus.isRead : false;
  }
}
