import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getTours(user: User) : Observable<PagedResults<Tour>>{
    if(user.role === 'author')
      return this.http.get<PagedResults<Tour>>(environment.apiHost + 'tour/' + user.id);
    else{
      console.log('Nije dobra rola');
      throw console.error('Nije dobra rola');
    }
  }

  addTour(tour: Tour) : Observable<Tour>{
    console.log(tour)
    return this.http.post<Tour>(environment.apiHost + 'tour/', tour)
  }
}
