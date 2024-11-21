import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { AppRating } from '../model/app-rating.model';
import { AuthService } from '../../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-app-rating-form',
  templateUrl: './app-rating-form.component.html',
  styleUrls: ['./app-rating-form.component.css'],
})
export class AppRatingFormComponent implements OnChanges {
  @Input() appRating: AppRating | null = null; // Rating to edit
  @Input() shouldEdit: boolean = false; // Edit mode toggle
  @Output() appRatingUpdated = new EventEmitter<void>(); // Notify parent

  appRatingForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private service: MarketplaceService,
    private authService: AuthService
  ) {
    this.appRatingForm = new FormGroup({
      grade: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
      comment: new FormControl('', [Validators.maxLength(250)]),
    });
  }

  ngOnChanges(): void {
    if (this.shouldEdit && this.appRating) {
      this.appRatingForm.patchValue({
        grade: this.appRating.grade,
        comment: this.appRating.comment,
      });
    }
  }

  onSubmit(): void {
    if (this.appRatingForm.invalid) return;

    this.isLoading = true;

    const userId = this.authService.user$.value.id;

    const appRating: AppRating = {
      grade: this.appRatingForm.value.grade,
      comment: this.appRatingForm.value.comment || '',
      userId,
    };

    this.service.addAppRating(appRating).subscribe({
      next: () => {
        this.isLoading = false;
        this.appRatingUpdated.emit(); // Notify parent
        this.appRatingForm.reset();
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to submit app rating. Please try again.');
      },
    });
  }
}
