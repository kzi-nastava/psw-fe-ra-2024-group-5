import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { UserProfile } from './model/userProfile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(environment.apiHost + 'administration/profile/' + id);
  }

  updateUserProfile(id: number, userProfile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(environment.apiHost + 'administration/profile/' + id, userProfile);
  }
}
