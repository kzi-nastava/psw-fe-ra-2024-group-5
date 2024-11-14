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
  markAllAsRead = false;

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
      if (!status.isRead && notification.id != null && this.userId != null) {
        status.isRead = true;
        this.notificationService.markNotificationAsRead(notification.id, this.userId).subscribe({
          next: () => {
            console.log('Notification marked as read');
          },
          error: (error) => {
            console.error('Error marking notification as read', error);
          }
        });
      }
    });

    if(notification.clubId)
    {
      this.router.navigate(['/my-clubs', notification.clubId]);
    }
  }

  isNotificationUnread(notification: Notification): boolean {
    const userStatus = notification.userReadStatuses.find(status => status.userId === this.userId);
    return userStatus ? !userStatus.isRead : false;
  }

  onMarkAllAsRead() {
    if (this.markAllAsRead && this.userId != null) {
      this.notificationService.markAllNotificationsAsRead(this.userId).subscribe({
        next: () => {
          console.log('All notifications marked as read');
          this.notifications.forEach(notification => {
            notification.userReadStatuses?.forEach(status => {
              if (status.userId === this.userId) {
                status.isRead = true;  
              }
            });
          });
        },
        error: (err) => {
          console.error('Error marking all notifications as read', err);
        }
      });
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(notification => 
      this.isNotificationUnread(notification)
    ).length;
  }
}
