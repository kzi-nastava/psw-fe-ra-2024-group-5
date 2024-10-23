import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from 'src/app/shared/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentManagementService {

  constructor(private http: HttpClient) { }

    updateTouristEquipment(touristId: number, equipmentIds: number[]) : Observable<boolean>
    {
      return this.http.put<boolean>(environment.apiHost + `tourist/${touristId}/equipment`, equipmentIds);
    }

    getTouristEquipment(touristId: number) : Observable<PagedResults<Equipment>>
    {
      return this.http.get<PagedResults<Equipment>>(environment.apiHost + `tourist/${touristId}/equipment`);
    }

}
