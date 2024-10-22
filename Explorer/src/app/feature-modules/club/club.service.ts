import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Club } from './model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = 'https://localhost:44333/api/tourist/club'; // URL ka kontroleru koji smo napravili

  constructor(private http: HttpClient) {}               // Dependency injection Angular mehanizma za pravljenje HTTP zahteva

  getAll(): Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>(this.apiUrl);              // Upotreba HTTP servisa za pravljenje GET zahteva na dati URL
  }
}
