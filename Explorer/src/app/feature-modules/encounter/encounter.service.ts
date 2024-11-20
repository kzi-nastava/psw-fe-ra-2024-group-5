import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encounter } from './model/encounter.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private readonly administrationBaseUrl  = 'https://localhost:44333/api/administration/encounter';
  private readonly touristBaseUrl  = 'https://localhost:44333/api/tourist/encounter';

  constructor(private http: HttpClient) {}

  getByCreatorId(creatorId: number): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${this.administrationBaseUrl}/creator/${creatorId}`);
  }

  create(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(this.administrationBaseUrl, encounter);
  }

  update(id: number, encounter: Encounter): Observable<Encounter> {
    return this.http.put<Encounter>(`${this.administrationBaseUrl}/${id}`, encounter);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.administrationBaseUrl}/${id}`);
  }

  getAllActive(): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${this.touristBaseUrl}/active`);
  }
}
