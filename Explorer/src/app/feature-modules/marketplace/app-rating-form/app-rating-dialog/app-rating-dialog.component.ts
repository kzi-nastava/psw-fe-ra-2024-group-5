// app-rating-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../../marketplace.service';
import { AppRating } from '../../model/app-rating.model';
import { AuthService } from '../../../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-app-rating-dialog',
  templateUrl: './app-rating-dialog.component.html',
  styleUrls: ['./app-rating-dialog.component.css']
})
export class AppRatingDialogComponent {
  appRatingForm = new FormGroup({
    grade: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(5)
    ]),
    comment: new FormControl('')
  });

  constructor(
    private dialogRef: MatDialogRef<AppRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appRating?: AppRating, shouldEdit: boolean },
    private service: MarketplaceService,
    private authService: AuthService
  ) {
    if (this.data.shouldEdit && this.data.appRating) {
      this.appRatingForm.patchValue({
        grade: this.data.appRating.grade,
        comment: this.data.appRating.comment
      });
    }
  }

  onSubmit(): void {
    if (this.appRatingForm.valid) {
      const userId = this.authService.user$.value.id;
      const appRating: AppRating = {
        grade: Number(this.appRatingForm.value.grade),
        comment: this.appRatingForm.value.comment || '',
        userId: userId,
      };

      this.service.addAppRating(appRating).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => console.error('Error adding app rating:', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}