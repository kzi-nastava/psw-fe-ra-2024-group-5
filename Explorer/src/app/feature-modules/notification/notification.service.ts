import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Notification } from './model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://localhost:44333/api/notifications';

  constructor(private http: HttpClient) {}

  getPagedNotifications(userId: number, page: number = 1, pageSize: number = 10): Observable<PagedResults<Notification>> {
    return this.http.get<PagedResults<Notification>>(`${this.apiUrl}/${userId}/paged?page=${page}&pageSize=${pageSize}`);
  }

  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllNotificationsAsRead(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/mark-all-read`, {});
  }

  sendNotification(userId: number, notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/${userId}/send`, notification);
  }
}
