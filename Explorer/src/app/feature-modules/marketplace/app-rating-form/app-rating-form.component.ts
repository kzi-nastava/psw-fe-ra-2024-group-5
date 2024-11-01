import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MarketplaceService } from '../marketplace.service';
import { ThisReceiver } from '@angular/compiler';
import { AppRating } from '../model/app-rating.model';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 


@Component({
  selector: 'xp-app-rating-form',
  templateUrl: './app-rating-form.component.html',
  styleUrls: ['./app-rating-form.component.css']
})
export class AppRatingFormComponent{

  @Input() appRating: AppRating;
  @Input() shouldEdit: boolean = false;
  @Output() appRatingUpdated = new EventEmitter<null>();

  constructor(private service: MarketplaceService, private authService: AuthService) {
  }


  appRatingForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl(''),
  });

  addAppRating(): void {
    const userId = this.authService.user$.value.id;

    const appRating: AppRating = {
      grade: Number(this.appRatingForm.value.grade) || 0,
      comment: this.appRatingForm.value.comment || "",
      userId: userId

    };
  
    this.service.addAppRating(appRating).subscribe({
      next: () => {
        this.appRatingUpdated.emit();
      }
    });
  }
  

  }
