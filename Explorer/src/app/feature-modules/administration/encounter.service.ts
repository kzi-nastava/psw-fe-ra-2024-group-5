import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encounter } from './model/encounter.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private readonly baseUrl = 'https://localhost:44333/api/encounter';

  constructor(private http: HttpClient) {}

  getByCreatorId(creatorId: number): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${this.baseUrl}/creator/${creatorId}`);
  }

  create(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(this.baseUrl, encounter);
  }

  update(id: number, encounter: Encounter): Observable<Encounter> {
    return this.http.put<Encounter>(`${this.baseUrl}/${id}`, encounter);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
