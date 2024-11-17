import { Component, OnInit, ViewChild } from '@angular/core';
import { EncounterType } from '../enum/encounter-type.enum';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Encounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { EncounterStatus } from '../enum/encounter-status.enum';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-encounters-managing',
  templateUrl: './encounters-managing.component.html',
  styleUrls: ['./encounters-managing.component.css']
})
export class EncountersManagingComponent implements OnInit {

  constructor(private encounterService: EncounterService,
    private tokenStorage: TokenStorage) {}

  @ViewChild(MapComponent) map: MapComponent;
  encounterTypes: string[] = ['MISC', 'SOCIAL', 'HIDDEN LOCATION'];
  selectedEncounterType: string | null = null;
  miscModalVisible = false;
  userId: number | null = null;
  encounter: Encounter = {
    id: 0,
    name: '',
    description: '',
    location: { latitude: 0, longitude: 0 },
    xp: NaN, // mora da bi lijepo pisao placeholder a ne 0
    Status: EncounterStatus.ACTIVE,
    Type: EncounterType.MISC,  
    creatorId: 0 
  };
  encountersByCreator: Encounter[];

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();
    this.loadEncountersByCreator();
  }

  openCreateEncounterModal(): void {
    if (this.selectedEncounterType === 'MISC') {
      this.miscModalVisible = true; 
    } 
  }

  createEncounter(): void {
    this.encounter.Type = EncounterType[this.selectedEncounterType as keyof typeof EncounterType];
    this.encounter.creatorId = this.userId ?? 0;
    this.encounter.Status = EncounterStatus.ACTIVE;
    this.encounterService.create(this.encounter).subscribe({
      next: (createdEncounter) => {
        this.miscModalVisible = false;  

        this.encounter = {
          id: 0,
          name: '',
          description: '',
          location: { latitude: 0, longitude: 0 },
          xp: NaN,  
          Status: EncounterStatus.ACTIVE,
          Type: EncounterType.MISC,  
          creatorId: 0 
        };

        this.loadEncountersByCreator();
      },
      error: (err) => {
        console.error('Error creating encounter:', err);
      }
    });

  }

  cancelCreateEncounter() {
    this.miscModalVisible = false;  
  }

  loadEncountersByCreator(): void {
    if (this.userId) {
      this.encounterService.getByCreatorId(this.userId).subscribe({
        next: (encounters: Encounter[]) => {
          this.encountersByCreator = encounters;
          console.log('Encounters loaded:', encounters);
        },
        error: (err) => {
          console.error('Error loading encounters:', err);
        }
      });
    }
  }
}
