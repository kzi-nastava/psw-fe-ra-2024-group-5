import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppRatingDialogComponent } from './app-rating-dialog/app-rating-dialog.component';
import { AppRating } from '../model/app-rating.model';
import { MarketplaceService } from '../marketplace.service';

@Component({
  selector: 'xp-app-rating-form',
  templateUrl: './app-rating-form.component.html',
  styleUrls: ['./app-rating-form.component.css']
})
export class AppRatingFormComponent implements OnInit {
  userRating: AppRating | null = null;

  constructor(
    private dialog: MatDialog,
    private service: MarketplaceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserRating();
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  loadUserRating(): void {
    this.service.getUserAppRating().subscribe({
      next: (rating) => {
        this.userRating = rating;
      },
      error: (err) => {
        if (err.status !== 404) {
          console.error('Error fetching user rating:', err);
        }
        this.userRating = null;
      }
    });
  }

  openRatingDialog(): void {
    const dialogRef = this.dialog.open(AppRatingDialogComponent, {
      data: {
        shouldEdit: false,
        appRating: null
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserRating();
        this.showNotification('Your review has been submitted');
      }
    });
  }

  editRating(): void {
    if (!this.userRating) return;
    
    const dialogRef = this.dialog.open(AppRatingDialogComponent, {
      data: {
        shouldEdit: true,
        appRating: this.userRating
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserRating();
        this.showNotification('Your review has been updated');
      }
    });
  }

  deleteRating(): void {
    if (this.userRating?.id) {
      this.service.deleteAppRating(this.userRating.id).subscribe({
        next: () => {
          this.userRating = null;
          this.showNotification('Your review has been deleted');
        },
        error: (err) => console.error('Error deleting app rating:', err)
      });
    }
  }
}