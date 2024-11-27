import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Preference } from './model/preference.model';
import { environment } from 'src/env/environment';
import { AppRating } from './model/app-rating.model';
import { Wallet } from './model/wallet';
import { Money } from 'src/app/shared/model/money';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getPreference() : Observable<PagedResults<Preference>> {
    return this.http.get<PagedResults<Preference>>('https://localhost:44333/api/tourist/preference');
  }

  addPreference(preference: Preference): Observable<Preference> {
    return this.http.post<Preference>(environment.apiHost + 'tourist/preference', preference);
  }

   getUserAppRating(): Observable<AppRating> {
    return this.http.get<AppRating>(`${environment.apiHost}tourist/appRating/user`);
  }

  addAppRating(appRating: AppRating): Observable<AppRating> {
    return this.http.post<AppRating>(environment.apiHost + 'tourist/appRating', appRating);
  }

  updateAppRating(id: number, appRating: AppRating): Observable<AppRating> {
    return this.http.put<AppRating>(`${environment.apiHost}tourist/appRating/${id}`, appRating);
  }

  deleteAppRating(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiHost}tourist/appRating/${id}`);
  }

  getWalletByAdmin(touristId: number) : Observable<Wallet> {
    return this.http.get<Wallet>(environment.apiHost + 'wallet/admin/' + touristId);
  }

  addFunds(money: Money, touristId: number): Observable<Wallet>{
    return this.http.post<Wallet>(environment.apiHost +'wallet/addFunds/' + touristId, money);
  }

  getWalletByTourist() : Observable<Wallet> {
    return this.http.get<Wallet>(environment.apiHost + 'wallet');
  }
}
