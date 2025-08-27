import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { EncounterType } from '../enum/encounter-type.enum';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Encounter, SocialEncounter, RiddleEncounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { EncounterStatus } from '../enum/encounter-status.enum';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/shared/map/map.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EncounterDetailsComponent } from '../encounter-details/encounter-details.component';
import { Position } from '../../tour-execution/model/position.model';
import { UserPosition } from 'src/app/shared/model/userPosition.model';
import { UserLocationService } from 'src/app/shared/user-location/user-location.service';
import { EncounterManagingDetailsComponent } from '../encounter-managing-details/encounter-managing-details.component';
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
    private authService: AuthService,
    public dialog: MatDialog,
    private userLocationService: UserLocationService) {}

  @ViewChild(MapComponent) map: MapComponent;

  encounterTypes: string[] = ['MISC', 'SOCIAL', 'HIDDEN LOCATION', 'RIDDLE'];
  selectedEncounterType: string | null = null;
  miscModalVisible = false;
  userId: number | null = null;
  encounterForm: FormGroup;
  encountersByCreator: Encounter[] = [];
  long: number = 0;
  lat: number = 0;
  isViewOnly: boolean = true;
  user: User | null;
  typeErrorMessage: boolean = false;
  showHiddenLocationEncounterParams: boolean = false;
  showSocialEncounterParams: boolean = false;
  showRiddleEncounterParams: boolean = false;
  newPotentialAnswer: string = '';
  potentialAnswers: string[] = [];

  ngOnInit(): void {
    this.setEncounterFormFields();

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.userId = this.tokenStorage.getUserId();
    this.loadEncountersByCreator();
  }

  openCreateEncounterModal(): void {
    this.miscModalVisible = true;
    this.isViewOnly = false;
    this.typeErrorMessage = false;
    this.selectedEncounterType = this.encounterForm.value.selectedEncounterType;
  }

  createEncounter(): void {
    if(this.encounterForm.invalid)
    {
      return;
    }

    let encounter: Encounter | SocialEncounter | RiddleEncounter;
    const selectedType = this.encounterForm.value.selectedEncounterType;

    if(selectedType == 'MISC')
    {
      encounter = {
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
    } else if(selectedType == 'SOCIAL')
    {
      encounter = {
        type: EncounterType.SOCIAL,
        id:0,
        name: this.encounterForm.value.name,
        description: this.encounterForm.value.description,
        location: {
          longitude: this.encounterForm.value.longitude,
          latitude: this.encounterForm.value.latitude
        },
        xp: this.encounterForm.value.xp,
        status: this.user?.role === 'administrator' ? EncounterStatus.ACTIVE : EncounterStatus.DRAFT,
        creatorId: this.userId ?? 0,
        radius: this.encounterForm.value.radius,
        peopleCount: this.encounterForm.value.peopleCount,
        currentPeopleCount: 0
      }
    } else 
    {
      encounter = {
        type: EncounterType.RIDDLE,
        id:0,
        name: this.encounterForm.value.name,
        description: this.encounterForm.value.description,
        location: {
          longitude: this.encounterForm.value.longitude,
          latitude: this.encounterForm.value.latitude
        },
        xp: this.encounterForm.value.xp,
        status: this.user?.role === 'administrator' ? EncounterStatus.ACTIVE : EncounterStatus.DRAFT,
        creatorId: this.userId ?? 0,
        riddle: this.encounterForm.value.riddle,
        Answer: this.encounterForm.value.correctAnswer,
        potentialAnswers: this.potentialAnswers
      }
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
      radius: [null],
      peopleCount: [null],
      riddle: [null],
      correctAnswer: [null],
      potentialAnswersControl: [null],
      selectedEncounterType: [null, Validators.required]
    });

  this.encounterForm.get('radius')?.setValidators(
    this.selectedEncounterType === 'SOCIAL' ? [Validators.required, this.xpValidator] : []
  );
  this.encounterForm.get('peopleCount')?.setValidators(
    this.selectedEncounterType === 'SOCIAL' ? [Validators.required, this.xpValidator] : []
  );
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

    this.openCreateEncounterModal();
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

  showEncounterDetails(encounter: any): void {
    const dialogRef = this.dialog.open(EncounterManagingDetailsComponent, {
      data: {
        encounter: encounter
      }
    });

  }

  onEncounterTypeChange(): void {
    const selectedType = this.encounterForm.value.selectedEncounterType;
    this.selectedEncounterType = selectedType;

    // reset flegova
    this.showHiddenLocationEncounterParams = false;
    this.showSocialEncounterParams = false;
    this.showRiddleEncounterParams = false;

    // reset validatora
    this.encounterForm.get('radius')?.clearValidators();
    this.encounterForm.get('peopleCount')?.clearValidators();
    this.encounterForm.get('riddle')?.clearValidators();
    this.encounterForm.get('correctAnswer')?.clearValidators();
    this.encounterForm.get('potentialAnswersControl')?.clearValidators();

    if(selectedType  == 'SOCIAL')
    {
      this.showSocialEncounterParams = true;

      this.encounterForm.get('radius')?.setValidators([Validators.required, this.xpValidator]);
      this.encounterForm.get('peopleCount')?.setValidators([Validators.required, this.xpValidator]);
    } else if(selectedType  == "RIDDLE")
    {
      this.showRiddleEncounterParams = true;
      this.encounterForm.get('riddle')?.setValidators([Validators.required]);
      this.encounterForm.get('correctAnswer')?.setValidators([Validators.required]);
      this.encounterForm.get('potentialAnswersControl')?.setValidators([Validators.required]); 
    } else if(selectedType  == "LOCATION")
    {
      this.showHiddenLocationEncounterParams = true;
    }

    this.encounterForm.get('radius')?.updateValueAndValidity();
    this.encounterForm.get('peopleCount')?.updateValueAndValidity();
    this.encounterForm.get('riddle')?.updateValueAndValidity();
    this.encounterForm.get('correctAnswer')?.updateValueAndValidity();
    this.encounterForm.get('potentialAnswersControl')?.updateValueAndValidity();

    this.encounterForm.updateValueAndValidity();
  }

  addPotentialAnswer(): void {
    if (this.newPotentialAnswer.trim() !== '') {
      this.potentialAnswers.push(this.newPotentialAnswer.trim());
      this.newPotentialAnswer = '';  

      this.encounterForm.get('potentialAnswersControl')?.setValue(this.potentialAnswers.length > 0 ? true : null);
      this.encounterForm.get('potentialAnswersControl')?.markAsTouched();
    }
  }

  removePotentialAnswer(index: number): void {
    this.potentialAnswers.splice(index, 1);
    this.encounterForm.get('potentialAnswersControl')?.setValue(this.potentialAnswers.length > 0 ? true : null);
    this.encounterForm.get('potentialAnswersControl')?.markAsTouched();
  }
}
