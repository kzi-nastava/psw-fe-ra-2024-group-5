import { Component, OnInit, ViewChild } from '@angular/core';
import { Encounter, isSocialEncounter, SocialEncounter } from '../model/encounter.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { EncounterService } from '../encounter.service';
import { MatDialog } from '@angular/material/dialog';
import { EncounterDetailsComponent } from '../encounter-details/encounter-details.component';
import { Position } from '../../tour-execution/model/position.model';
import { UserPosition } from 'src/app/shared/model/userPosition.model';
import { UserLocationService } from 'src/app/shared/user-location/user-location.service';
import { Participant } from '../model/participant.model';
import { EncounterType, encounterTypeToString } from '../enum/encounter-type.enum';

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
  isSocialEncounter = isSocialEncounter;
  encounterTypeToString = encounterTypeToString;
  remainingTime: number = 30;
  progressValue: number = 0;
  isComplete: boolean = false;
  isTimerActive: boolean = false;
  private timerInterval: any;

  @ViewChild(MapComponent) map: MapComponent;

  constructor(private tokenStorage: TokenStorage, private encounterService: EncounterService,
    public dialog: MatDialog,
    private userLocationService: UserLocationService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();

    if (this.userId !== null) {
      this.loadActiveEncounters(this.userId);

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

  loadActiveEncounters(userId: number): void {
    this.encounterService.getAllActive(userId).subscribe({
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
        if (this.activatedEncounter?.type == 2 && response.inRange){
          this.startTimer();
        }
          
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private startTimer() {
    this.isTimerActive = true;
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.progressValue = ((30 - this.remainingTime) / 30) * 100;
      } else {
        this.completeTimer();
      }
    }, 1000);
  }

  completeTimer() {
    this.isTimerActive = false;
    this.clearTimer();
    this.progressValue = 100;
    this.isComplete = true;
    var position = this.getPosition();
    if (this.activatedEncounter && this.userId && position){
      console.log(this.activatedEncounter.id)
      console.log(this.userId)
      console.log(position)
      this.encounterService.completeHiddenLocationEncounter(this.activatedEncounter?.id, this.userId, position).subscribe({
        next: (response) => {
          console.log('Request successful:', response);
        },
        error: (err) => {
          console.error('Request failed:', err);
          // Handle the error (e.g., show a message to the user)
        }
      });
    }
      
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.isTimerActive = false;
    }
  }

  private resetTimer(){
    this.clearTimer();
    this.startTimer();
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

  abandonEncounterExecution(): void {
    if (!this.userId) {
      return;
    }

    this.encounterService.abandonEncounterExecution(this.userId).subscribe({
      next: () => {
        this.activatedEncounter = null;
      },
    });
  }
}
