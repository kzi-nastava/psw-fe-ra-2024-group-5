import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encounter, SocialEncounter } from './model/encounter.model';
import { Position } from '../tour-execution/model/position.model';
import { Participant } from './model/participant.model';

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

  getAllActive(userId: number): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${this.touristBaseUrl}/active/${userId}`);
  }

  abandonEncounterExecution(userId: number): Observable<any> {
    return this.http.delete(`${this.touristBaseUrl}/execution/${userId}`);
  }

  checkEncounterAvailability(encounterId: number, userId: number, position: Position): Observable<string>{

    return this.http.post<string>(`${this.touristBaseUrl}/execution/check-availability`, {
      encounterId: encounterId,
      userId: userId,
      location: position
    })
  }

  startEncounter(encounterId: number, userId: number, position: Position): Observable<Encounter>{
    return this.http.post<Encounter>(`${this.touristBaseUrl}/execution`, {
      encounterId: encounterId,
      userId: userId,
      location: position
    })
  }

  getActiveEncounter(userId: number): Observable<Encounter>{
    return this.http.get<Encounter>(`${this.touristBaseUrl}/execution/${userId}`);
  }

  progressEncounter(encounterId: number, userId: number, position: Position): Observable<any>{
    return this.http.patch(`${this.touristBaseUrl}/execution`, {
      encounterId: encounterId,
      userId: userId,
      location: position
    })
  }

  completeHiddenLocationEncounter(encounterId: number, userId: number, position: Position): Observable<any>{
    return this.http.patch(`${this.touristBaseUrl}/execution/complete-hle`, {
      encounterId: encounterId,
      userId: userId,
      location: position
    })
  }
  getParticipantByUserId(userId: number): Observable<Participant> {
    return this.http.get<Participant>(`${this.touristBaseUrl}/participant?userId=${userId}`);
  }

  getByTouristCreatorId(creatorId: number): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${this.touristBaseUrl}/creator/${creatorId}`);
  }

  createByTourist(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(this.touristBaseUrl, encounter);
  }

  getAllDraft(): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${this.administrationBaseUrl}/draft`);
  }

  acceptEncounter(id: number): Observable<any> {
    return this.http.put(`${this.administrationBaseUrl}/${id}/accept`, {});
  }

  rejectEncounter(id: number): Observable<any> {
    return this.http.put(`${this.administrationBaseUrl}/${id}/reject`, {});
  }

  completeMiscEncounter(encounterId: number, userId: number): Observable<any> {
    return this.http.patch(`${this.touristBaseUrl}/execution/complete-misc?encounterId=${encounterId}&userId=${userId}`, {});
  }
}
