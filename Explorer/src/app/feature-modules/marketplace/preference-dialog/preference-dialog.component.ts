import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourDifficulty } from '../enum/tour-difficulty.enum';
import { MarketplaceService } from '../marketplace.service';
import { Preference } from '../model/preference.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-preference-dialog',
  templateUrl: './preference-dialog.component.html',
  styleUrls: ['./preference-dialog.component.css']
})
export class PreferenceDialogComponent {

  @Output() preferenceUpdated = new EventEmitter<null>();


  touristId: number; 
  public TourDifficulty = TourDifficulty; 
  preferences: Preference[] = [];
  isFormVisible: boolean = false;


  constructor(private service: MarketplaceService, private authService: AuthService) {
    this.touristId = this.authService.user$.value.id; 
  }
  
  preferenceDialog = new FormGroup({
    preferredDifficulty: new FormControl(TourDifficulty.Beginner, [Validators.required]),
    walkRating: new FormControl(0, [Validators.required]),
    bikeRating: new FormControl(0, [Validators.required]),
    carRating: new FormControl(0, [Validators.required]),
    boatRating: new FormControl(0, [Validators.required]),
    interestTags: new FormControl('', [Validators.required]),
    isActive: new FormControl(false, [Validators.required])

  });

  addPreference(): void {
    console.log(this.preferenceDialog.value);

    
    const interestTags = this.preferenceDialog.value.interestTags
        ? this.preferenceDialog.value.interestTags.split(',').map(tag => tag.trim())
        : []; 

    const preference: Preference = {
        touristId: this.touristId,
        preferredDifficulty: this.preferenceDialog.value.preferredDifficulty || TourDifficulty.Beginner,
        walkRating: this.preferenceDialog.value.walkRating || 0,
        bikeRating: this.preferenceDialog.value.bikeRating || 0,
        carRating: this.preferenceDialog.value.carRating || 0,
        boatRating: this.preferenceDialog.value.boatRating || 0,
        interestTags: interestTags, 
        isActive: this.preferenceDialog.value.isActive || false

    };

    this.service.addPreference(preference).subscribe({
        next: (_) => {
           this.preferenceUpdated.emit()
        },
        error: (err) => {
            console.error("Greška pri slanju: ", err);
            if (err.error && err.error.errors) {
                console.error("Detalji greške: ", err.error.errors);
            } else {
                console.error("Nepoznata greška: ", err);
            }
        }
    });
}

toggleFormVisibility(): void {
  this.isFormVisible = !this.isFormVisible; 
}

  }

