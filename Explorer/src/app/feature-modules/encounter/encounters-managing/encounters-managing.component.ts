import { Component, OnInit, ViewChild } from '@angular/core';
import { EncounterType } from '../enum/encounter-type.enum';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Encounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { EncounterStatus } from '../enum/encounter-status.enum';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/shared/map/map.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-encounters-managing',
  templateUrl: './encounters-managing.component.html',
  styleUrls: ['./encounters-managing.component.css']
})
export class EncountersManagingComponent implements OnInit {

  constructor(private encounterService: EncounterService,
    private tokenStorage: TokenStorage,
    private fb: FormBuilder,
    private mapService: MapService,
    private authService: AuthService) {}

  @ViewChild(MapComponent) map: MapComponent;

  encounterTypes: string[] = ['MISC', 'SOCIAL', 'HIDDEN LOCATION'];
  selectedEncounterType: string | null = null;
  miscModalVisible = false;
  userId: number | null = null;
  encounterForm: FormGroup;
  encountersByCreator: Encounter[] = [];
  long: number = 0;
  lat: number = 0;
  isViewOnly: boolean = true;
  user: User | null;

  ngOnInit(): void {
    this.setEncounterFormFields();

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.userId = this.tokenStorage.getUserId();
    this.loadEncountersByCreator();
  }

  openCreateEncounterModal(): void {
    if (this.selectedEncounterType === 'MISC') {
      this.miscModalVisible = true;
      this.isViewOnly = false;
    }
  }

  createEncounter(): void {
    if(this.encounterForm.invalid)
    {
      return;
    }

    const encounter: Encounter = {
      type: EncounterType.MISC,
      id:0,
      name: this.encounterForm.value.name,
      description: this.encounterForm.value.description,
      location: {
        longitude: this.encounterForm.value.longitude,
        latitude: this.encounterForm.value.latitude
      },
      xp: this.encounterForm.value.xp,
      status: this.user?.role === 'administrator' ? EncounterStatus.ACTIVE : EncounterStatus.DRAFT,
      creatorId: this.userId ?? 0
    }

    if(this.user && this.user.role == 'administrator')
    {
      this.encounterService.create(encounter).subscribe({
        next: (createdEncounter) => {
          this.miscModalVisible = false;
          this.isViewOnly = true;
          this.setEncounterFormFields();
          this.loadEncountersByCreator();
        },
        error: (err) => {
          console.error('Error creating encounter:', err);
        }
      });
    }else if(this.user && this.user.role == 'tourist')
    {
      this.encounterService.createByTourist(encounter).subscribe({
        next: (createdEncounter) => {
          this.miscModalVisible = false;
          this.isViewOnly = true;
          this.setEncounterFormFields();
          this.loadEncountersByCreator();
        },
        error: (err) => {
          console.error('Error creating encounter:', err);
        }
      });
    }
  }

  cancelCreateEncounter() {
    this.miscModalVisible = false;
    this.isViewOnly = true;
    this.setEncounterFormFields();
  }

  setEncounterFormFields(): void {
    this.encounterForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      xp: [NaN, [Validators.required, this.xpValidator]],
      longitude: ['',Validators.required],
      latitude: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  xpValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value && !isNaN(control.value) && control.value > 0) {
      return null;
    }
    return { 'invalidXp': true };
  }

  loadEncountersByCreator(): void {
    if (this.userId && this.user && this.user.role == "administrator") {
      this.encounterService.getByCreatorId(this.userId).subscribe({
        next: (encounters: Encounter[]) => {
          this.encountersByCreator = encounters;
          console.log('Encounters loaded:', encounters);
        },
        error: (err) => {
          console.error('Error loading encounters:', err);
        }
      });
    } else if(this.userId && this.user && this.user.role == "tourist") {
      this.encounterService.getByTouristCreatorId(this.userId).subscribe({
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

  changeLongLat(latLong: number[]): void{
    const [lat,long] = latLong;

    this.mapService.reverseSearch(lat, long).subscribe((res) => {
      this.encounterForm.patchValue({
        location: res.display_name,
        longitude: long,
        latitude: lat
      })
    });
  }

  searchLocation(): void{
    const location = this.encounterForm.value.location
    if(!location)
      return;
    
    this.mapService.search(location).subscribe((res) => {
      if(res.length == 0){
        this.encounterForm.patchValue({
          Location: ''
        });
        this.encounterForm.controls['location'].markAsTouched();
      }
      else{
        this.map.search(location)
        this.encounterForm.patchValue({
          longitude: res[0].lon,
          latitude: res[0].lat
        });
      }
    });  
    this.encounterForm.updateValueAndValidity();
  }
}
