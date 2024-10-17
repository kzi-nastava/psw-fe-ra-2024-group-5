import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Facility } from 'src/app/shared/model/facility';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(private http: HttpClient) { }

  getFacilities(page: number, pageSize: number): Observable<Facility[]> {
    return this.http.get<Facility[]>(environment.apiHost + `facility/${page}/${pageSize}`)
  }

  addFacility(facility: Facility): Observable<Facility> {
    return this.http.post<Facility>(environment.apiHost + 'facility', facility);
  }
  
}