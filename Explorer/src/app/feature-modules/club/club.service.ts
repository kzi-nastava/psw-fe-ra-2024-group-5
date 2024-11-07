import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Club } from './model/club.model';
import { ClubMembership } from './model/membership.model'
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { map, mergeMap } from 'rxjs/operators';
import { ClubMessage } from './model/clubMessage.model';

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

  getUserClubs(userId: number): Observable<Club[]> {
    return this.getAllMemberships().pipe(
      mergeMap((memberships) => {
        const userMemberships = memberships.filter(membership => membership.userId === userId);
        const clubIds = userMemberships.map(membership => membership.clubId);
  
        return this.getAll().pipe(
          map((pagedResults) => {
            if (!pagedResults || !pagedResults.results) {
              throw new Error('Paged results undefined.');
            }
  
            const userClubs = pagedResults.results.filter(club => 
              club.id != null && 
              (clubIds.includes(club.id) || club.ownerId === userId)
            );
            return userClubs;
          })
        );
      })
    );
  }
  
  getAllMemberships(): Observable<ClubMembership[]> {
    return this.http.get<ClubMembership[]>(this.membershipApiUrl); 
  }  
  
  getById(clubId: number): Observable<Club | null> {
    return this.getAll().pipe(
      map((pagedResults) => {
        return pagedResults.results.find(club => club.id === clubId) || null;
      })
    );
  }

  // ***************** Club Messages *****************
  addMessageToClub(clubId: number, messageDto: ClubMessage, userId: number): Observable<ClubMessage> {
    const url = `${this.apiUrl}/messages?clubId=${clubId}&userId=${userId}`;
    return this.http.post<ClubMessage>(url, messageDto);
  }

  updateMessageInClub(clubId: number, messageId: number, userId: number, newContent: string): Observable<ClubMessage> {
    const url = `${this.apiUrl}/messages?clubId=${clubId}&messageId=${messageId}&userId=${userId}`;
    
    return this.http.put<ClubMessage>(url, newContent, {
      headers: {
        'Content-Type': 'application/json'  
      }
    });
  }

  removeMessageFromClub(clubId: number, messageId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/messages?clubId=${clubId}&messageId=${messageId}&userId=${userId}`;
    
    return this.http.delete<ClubMessage>(url);
  }
       
  getPagedMessagesByClubId(clubId: number, page: number, pageSize: number): Observable<any> {
    const url = `${this.apiUrl}/messages`;   
    return this.http.get<any>(url, {
      params: {
        clubId: clubId.toString(),
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }
 
  //temp function name,this should sent invitation to another tourist to join the club
  // createMembership(clubId: number, userId: number): Observable<ClubMembership> {
  //   const url = `${this.membershipApiUrl}?clubId=${clubId}&userId=${userId}`;
  //   return this.http.post<ClubMembership>(url, {});
  // }
  
  // //this function needs to be refactored in fe and be
  // deleteMembership(clubId: number, userId: number): Observable<boolean> {
  //   const url = `${this.membershipApiUrl}?clubId=${clubId}&userId=${userId}`;
  //   return this.http.delete<boolean>(url);
  // }
}

