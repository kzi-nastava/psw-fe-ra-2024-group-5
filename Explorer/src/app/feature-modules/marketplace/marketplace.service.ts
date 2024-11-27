import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Preference } from './model/preference.model';
import { environment } from 'src/env/environment';
import { AppRating } from './model/app-rating.model';
import { Wallet } from './model/wallet';
import { Money } from 'src/app/shared/model/money';
import { createBundle } from './model/create-bundle.model';

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

  addAppRating(appRating: AppRating): Observable<AppRating> {
    return this.http.post<AppRating>(environment.apiHost + 'tourist/appRating', appRating);
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

  createBundle(dto: createBundle): Observable<createBundle> {
    return this.http.post<createBundle>(environment.apiHost + 'author/bundle/create', dto);
  }
}
