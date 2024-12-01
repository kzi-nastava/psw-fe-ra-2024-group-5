import { Component, OnInit, ViewChild } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { EncounterService } from '../encounter.service';
import { MatDialog } from '@angular/material/dialog';
import { EncounterDetailsComponent } from '../encounter-details/encounter-details.component';
import { Position } from '../../tour-execution/model/position.model';
import { UserPosition } from 'src/app/shared/model/userPosition.model';
import { UserLocationService } from 'src/app/shared/user-location/user-location.service';
import { Participant } from '../model/participant.model';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit{
  activeEncounters: Encounter[] = [];
  userId: number | null = null;
  activatedEncounter: Encounter | null = null;
  participant: Participant | null = null;

  @ViewChild(MapComponent) map: MapComponent;

  constructor(private tokenStorage: TokenStorage, private encounterService: EncounterService,
    public dialog: MatDialog,
    private userLocationService: UserLocationService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();

    if (this.userId !== null) {
      this.loadActiveEncounters();
      
      this.encounterService.getActiveEncounter(this.userId).subscribe({
        next: (response) => {
          if(response)
            this.activatedEncounter = response;
        }
      })

      this.getParticipantByUserId(this.userId);
    }
  }

  encounterStarted(encounter: any): void{
    this.activatedEncounter = encounter;
    console.log(this.activatedEncounter);
  }

  loadActiveEncounters(): void {
    this.encounterService.getAllActive().subscribe({
      next: (encounters: Encounter[]) => {
        this.activeEncounters = encounters;
        console.log('Encounters loaded:', encounters);
      },
      error: (err) => {
        console.error('Error loading encounters:', err);
      }
    });
  }

  getPosition(): Position | null{
    const userPosition: UserPosition | null = this.userLocationService.getUserPosition();
    
    if(!userPosition)
      return null;

    return {
      latitude: userPosition.latitude,
      longitude: userPosition.longitude
    }
  }

  progress(){
    var currentPosition = this.getPosition();

    if(!this.activatedEncounter)
      return;

    if(!this.userId)
      return;

    if(!currentPosition)
      return;

    this.encounterService.progressEncounter(this.activatedEncounter.id, this.userId, currentPosition).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      } 
    })
  }

  showEncounterDetails(encounter: any): void {
    var position = this.getPosition();
    var availability: string = 'Activate';

    if  (this.userId == null)
      return;
    
    if  (position == null){
      availability = 'We are unable to locate you!'
      this.openEncounterDialog(encounter, availability, position);
    }
    else  {
      this.encounterService.checkEncounterAvailability(encounter.id, this.userId, position).subscribe({
        next: () => {
          this.openEncounterDialog(encounter, availability, position);
        },
        error: (err) => {
          let subCode: number | undefined;
          if (err.error && err.error.detail) {    
            const metadataMatch = err.error.detail.match(/\[subCode, (\d+)\]/);
            if (metadataMatch && metadataMatch[1]) {
              subCode = parseInt(metadataMatch[1], 10);
            }
          }
          switch (err.status){
            case 400:
              if (subCode === 2)
                availability = "You have already completed this encounter!";
              else
                availability = "You are too far away!";
              break;
            case 409:
              availability = "Finish or abandon your current encounter to start a new one!";
              break;
            case 404:
              availability = "Encounter not found.";
              break;
          }
          this.openEncounterDialog(encounter, availability, position);
        }
      })
    }
  }

  openEncounterDialog(encounter: any, availability: string, position: Position | null): void {
    const dialogRef = this.dialog.open(EncounterDetailsComponent, {
      data: {
        encounter: encounter,
        availability: availability,
        position: position
      }
    });

    dialogRef.componentInstance.startEncounter.subscribe((response) => {
      this.encounterStarted(response);  // Handle the emitted data here
    });
  }

  getParticipantByUserId(userId: number): void {
    this.encounterService.getParticipantByUserId(userId).subscribe({
      next: (data) => {
        this.participant = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
