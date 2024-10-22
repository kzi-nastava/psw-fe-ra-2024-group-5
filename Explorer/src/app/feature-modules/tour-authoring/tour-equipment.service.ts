import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Facility } from 'src/app/shared/model/facility';
import { Equipment } from 'src/app/shared/model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourEquipmentService {

  constructor(private http: HttpClient) { }

  getAllEquipment(): Observable<PagedResults<Equipment>> {
	  return this.http.get<PagedResults<Equipment>>(environment.apiHost + `tour/equipment`)
  }

}