import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarketplaceService } from '../../marketplace.service';
import { AppRating } from '../../model/app-rating.model';
import { AuthService } from '../../../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-app-rating-dialog',
  templateUrl: './app-rating-dialog.component.html',
  styleUrls: ['./app-rating-dialog.component.css']
})
export class AppRatingDialogComponent {
  stars: number[] = [1, 2, 3, 4, 5];
  hoveredRating: number = 0;

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
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    if (this.data.shouldEdit && this.data.appRating) {
      this.appRatingForm.patchValue({
        grade: this.data.appRating.grade,
        comment: this.data.appRating.comment
      });
    }
  }

  rate(rating: number): void {
    this.appRatingForm.get('grade')?.setValue(rating);
  }

  hover(rating: number): void {
    this.hoveredRating = rating;
  }

  resetHover(): void {
    this.hoveredRating = 0;
  }

  isStarred(rating: number): boolean {
    if (this.hoveredRating >= rating) {
      return true;
    }
    const gradeValue = this.appRatingForm.get('grade')?.value;
    return gradeValue ? gradeValue >= rating : false;
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

onSubmit(): void {
  if (this.appRatingForm.valid) {
    const userId = this.authService.user$.value.id;
    const appRating: AppRating = {
      id: this.data.shouldEdit ? this.data.appRating?.id : undefined,
      grade: Number(this.appRatingForm.value.grade) || 0,
      comment: this.appRatingForm.value.comment || '',
      userId: userId,
      timeStamp: new Date().toISOString(), // Convert to ISO string for consistent date handling
    };

    if (this.data.shouldEdit && this.data.appRating?.id) {
      this.service.updateAppRating(this.data.appRating.id, appRating).subscribe({
        next: () => {
          this.showNotification('Rating updated successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error updating app rating:', err);
          
        }
      });
    } else {
      this.service.addAppRating(appRating).subscribe({
        next: () => {
          this.showNotification('Rating added successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error adding app rating:', err);
          
        }
      });
    }
  }
}

  onDelete(): void {
    if (this.data.appRating?.id) {
      this.service.deleteAppRating(this.data.appRating.id).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => console.error('Error deleting app rating:', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}