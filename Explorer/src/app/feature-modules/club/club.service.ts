import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Club } from './model/club.model';
import { ClubMembership } from './model/membership.model'
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = 'https://localhost:44333/api/tourist/club';
  private membershipApiUrl = 'https://localhost:44333/api/tourist/membership'

  constructor(private http: HttpClient) {}

  getAll(): Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>(this.apiUrl);
  }

  create(club: Club): Observable<Club> {
    return this.http.post<Club>(this.apiUrl, club);
  }

  update(club: Club): Observable<Club> {
    return this.http.put<Club>(`${this.apiUrl}/${club.id}`, club);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getAllMemberships(): Observable<ClubMembership[]> {
    return this.http.get<ClubMembership[]>(this.membershipApiUrl);
  }
   
  //temp function name,this should sent invitation to another tourist to join the club
  createMembership(clubId: number, userId: number): Observable<ClubMembership> {
    const url = `${this.membershipApiUrl}?clubId=${clubId}&userId=${userId}`;
    return this.http.post<ClubMembership>(url, {});
  }
  
  //this function needs to be refactored in fe and be
  deleteMembership(clubId: number, userId: number): Observable<boolean> {
    const url = `${this.membershipApiUrl}?clubId=${clubId}&userId=${userId}`;
    return this.http.delete<boolean>(url);
  }
}

