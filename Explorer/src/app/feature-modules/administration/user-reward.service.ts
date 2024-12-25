import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { UserReward } from './model/user-reward.model';

@Injectable({
  providedIn: 'root'
})
export class UserRewardService {

  constructor(private http: HttpClient) { }
  
    getUserReward(id: number): Observable<UserReward> {
      return this.http.get<UserReward>(environment.apiHost + 'tourist/reward/' + id);
    }
  
}
