import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Preference } from './model/preference.model';
import { environment } from 'src/env/environment';

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
}
