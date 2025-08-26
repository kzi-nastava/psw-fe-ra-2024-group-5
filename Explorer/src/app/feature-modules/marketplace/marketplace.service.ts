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
import { BundleDetailed } from './model/bundle.models';
import { BundleCard } from './model/bundle.models';
import { map, switchMap, forkJoin, of } from 'rxjs';
import { TourCard } from '../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring/tour-authoring.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient, private tourService: TourAuthoringService) { }

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
  
  activatePreference(id: number): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}tourist/preference/activate/${id}`, {});
  }

  deactivatePreference(id: number): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}tourist/preference/deactivate/${id}`, {});
  }

  deletePreference(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiHost}tourist/preference/${id}`);
  }

  createBundle(dto: createBundle): Observable<createBundle> {
    return this.http.post<createBundle>(environment.apiHost + 'author/bundle/create', dto);
  }

  getBundles(page: number, pageSize: number) : Observable<BundleDetailed[]>{
    return this.http.get<BundleDetailed[]>(environment.apiHost +`tourist/bundle/all/${page}/${pageSize}`);
  }

getBundlesByAuthor(authorId: number, page: number, pageSize: number): Observable<BundleDetailed[]> {
    return this.http.get<BundleDetailed[]>(
      `${environment.apiHost}author/bundle/authors/${authorId}/bundles`,
      { params: { page: page.toString(), pageSize: pageSize.toString() } }
    ).pipe(
      map(response => {
        console.log('API response for author bundles:', response);
      
        return (response || []).map((dto: any) => ({
          id: dto.id,
          name: dto.name,
          price: dto.price,
          authorId: authorId,
          bundleItems: dto.bundleItems || [], 
          status: dto.status
        } as BundleDetailed));
      })
    );
  }

archiveBundle(bundleId: number, authorId: number) {
  return this.http.put(
    `${environment.apiHost}author/bundle/${bundleId}/archive`,
    {},
    { params: { authorId: authorId.toString() } }
  );
}

deleteBundle(bundleId: number, authorId: number) {
  return this.http.delete(
    `${environment.apiHost}author/bundle/${bundleId}/delete`,
    { params: { authorId: authorId.toString() } }
  );
}

canPublishBundle(bundleId: number): Observable<boolean> {
  return this.http.get<boolean>(`${environment.apiHost}author/bundle/${bundleId}/can-publish`);
}

publishBundle(bundleId: number, authorId: number) {
  const newStatus = 1; 
  return this.http.patch(
    `${environment.apiHost}author/bundle/${bundleId}/status`,
    newStatus, 
    { params: { authorId: authorId.toString() } }
  );
}
updateBundle(dto: any): Observable<any> {
  return this.http.put(`${environment.apiHost}author/bundle/update`, dto);
}

removeTourFromBundle(bundleId: number, tourId: number, authorId: number) {
  return this.http.delete<BundleCard>(
    `${environment.apiHost}author/bundle/${bundleId}/tour/${tourId}`,
    { params: { authorId: authorId.toString() } }
  );
}

}

