import { Component } from '@angular/core';
import { Notification } from '../model/notification.model';

@Component({
  selector: 'xp-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications: Notification[] = [];

  onNotificationClick(notification: Notification) {
    
  }
}
