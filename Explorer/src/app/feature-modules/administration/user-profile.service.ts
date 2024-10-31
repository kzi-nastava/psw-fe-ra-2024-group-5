import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { UserProfile } from './model/userProfile.model';
import { Following } from './model/following.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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

  followUser(userId: number, followedUserId: number): Observable<Following> {
    return this.http.post<Following>(`${environment.apiHost}administration/followers/follow/${userId}/${followedUserId}`, {});
  }

  unfollowUser(userId: number, followedUserId: number): Observable<Following> {
    return this.http.delete<Following>(`${environment.apiHost}administration/followers/unfollow/${userId}/${followedUserId}`, {});
  }

  isFollowing(userId: number, followedUserId: number): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiHost}administration/followers/isFollowing/${userId}/${followedUserId}`);
  }

  getAllFollowers(userId: number, page: number, pageSize: number): Observable<PagedResults<UserProfile>> {
    return this.http.get<PagedResults<UserProfile>>(
      `${environment.apiHost}administration/followers/${userId}`,
      {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString()
        }
      }
    );
  }
}
