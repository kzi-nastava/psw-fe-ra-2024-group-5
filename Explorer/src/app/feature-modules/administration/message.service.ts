import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileMessage } from './model/profile-message.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(message: ProfileMessage): Observable<Object> {
    return this.http.post(environment.apiHost + 'messages/profile/message/send', message);
  }
}
