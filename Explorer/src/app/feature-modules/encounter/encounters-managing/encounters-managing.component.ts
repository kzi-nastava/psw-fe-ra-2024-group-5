import { Component, OnInit, ViewChild } from '@angular/core';
import { EncounterType } from '../enum/encounter-type.enum';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Encounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { EncounterStatus } from '../enum/encounter-status.enum';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-encounters-managing',
  templateUrl: './encounters-managing.component.html',
  styleUrls: ['./encounters-managing.component.css']
})
export class EncountersManagingComponent implements OnInit {

  constructor(private encounterService: EncounterService,
    private tokenStorage: TokenStorage,
    private fb: FormBuilder ) {}

  @ViewChild(MapComponent) map: MapComponent;

  encounterTypes: string[] = ['MISC', 'SOCIAL', 'HIDDEN LOCATION'];
  selectedEncounterType: string | null = null;
  miscModalVisible = false;
  userId: number | null = null;
  encounterForm: FormGroup;
  encountersByCreator: Encounter[];
  long: number = 0;
  lat: number = 0;
  ngOnInit(): void {
    this.setEncounterFormFields();

    this.userId = this.tokenStorage.getUserId();
    this.loadEncountersByCreator();
  }

  openCreateEncounterModal(): void {
    if (this.selectedEncounterType === 'MISC') {
      this.miscModalVisible = true; 
    } 
  }

  createEncounter(): void {
    if(this.encounterForm.invalid)
    {
      return;
    }

    const encounter: Encounter = {
      id:0,
      name: this.encounterForm.value.name,
      description: this.encounterForm.value.description,
      location: {
        longitude: this.encounterForm.value.longitude,  
        latitude: this.encounterForm.value.latitude      
      },
      xp: this.encounterForm.value.xp,
      status: EncounterStatus.ACTIVE,
      type: EncounterType.MISC,  
      creatorId: this.userId ?? 0
    }

    this.encounterService.create(encounter).subscribe({
      next: (createdEncounter) => {
        this.miscModalVisible = false;  
        this.setEncounterFormFields();

        this.loadEncountersByCreator();
      },
      error: (err) => {
        console.error('Error creating encounter:', err);
      }
    });

  }

  cancelCreateEncounter() {
    this.miscModalVisible = false;  
   
    this.setEncounterFormFields();
  }

  setEncounterFormFields(): void {
    this.encounterForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      xp: [NaN, [Validators.required, this.xpValidator]],
      longitude: [0, Validators.required],  
      latitude: [0, Validators.required]   
    });
  }

  xpValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value && !isNaN(control.value) && control.value > 0) {
      return null;   
    }
    return { 'invalidXp': true };  
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
