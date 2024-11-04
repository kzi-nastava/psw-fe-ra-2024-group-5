import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tour-execution.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getActiveTour(userId: number): Observable<TourExecution> {
    return this.http.get<TourExecution>(environment.apiHost + `tour/execution/${userId}`);
  }
}
