import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tour-execution.model';
import { Observable } from 'rxjs';
import { TourExecutionStart } from './model/tour-execution-start.model';
import { Position } from './model/position.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getActiveTourExecution(userId: number): Observable<TourExecution> {
    return this.http.get<TourExecution>(environment.apiHost + `tour/execution/${userId}`);
  }

  startTour(userId: number, tourId: number): Observable<TourExecution> {
    const start: TourExecutionStart = {
      userId: userId,
      tourId: tourId
    };

    return this.http.post<TourExecution>(environment.apiHost + `tour/execution`, start);
  }

  progressTour(position: Position, tourExecutionId: number): Observable<any> {
    return this.http.patch(environment.apiHost + `tour/execution/${tourExecutionId}`, position);
  }
}
