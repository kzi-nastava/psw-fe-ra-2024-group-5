import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from '../../shared/model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Account } from './model/account.model';
import { AppRating } from './../marketplace/model/app-rating.model';


@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  getAccounts(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>(environment.apiHost + 'administration/accounts');
  }

  blockAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(environment.apiHost + 'administration/accounts/block/' + account.id, account);
  }

  getAppRating(): Observable<PagedResults<AppRating>> {
    return this.http.get<PagedResults<AppRating>>(environment.apiHost + 'tourist/appRating');
  }

  deleteAppRating(id: number): Observable<AppRating> {
    return this.http.delete<AppRating>(environment.apiHost + 'tourist/appRating' + id);
  }

  addAppRating(appRating: AppRating): Observable<AppRating> {
    return this.http.post<AppRating>(environment.apiHost + 'tourist/appRating', appRating);
  }

  updateAppRating(appRating: AppRating): Observable<AppRating> {
    return this.http.put<AppRating>(environment.apiHost + 'tourist/appRating' + appRating.id, appRating);
  }



}
