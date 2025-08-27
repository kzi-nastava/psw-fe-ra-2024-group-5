import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TourReview } from '../model/tour.model';
import { UserProfileBasic } from '../../administration/model/userProfileBasic.model';
import { UserProfileService } from '../../administration/user-profile.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourReviewFormComponent } from '../../marketplace/tour-review-form/tour-review-form.component';
@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit {
  @Output() reviewDeleted = new EventEmitter<number>();
  @Output() reviewUpdated = new EventEmitter<TourReview>();
  constructor(private profileService: UserProfileService, private authService: AuthService, private tourAuthoringService: TourAuthoringService, public dialog: MatDialog) { }

  @Input() review: TourReview

  userProfile: UserProfileBasic | undefined
  user: User | undefined

  get profilePicture(): string {
    if (this.userProfile?.profileImage && this.userProfile?.profileImage !== '')
      return 'data:image/png;base64,' + this.userProfile?.profileImage
    else return 'assets/images/profile.jpg'
  }

  get displayName(): string {
    return `${this.userProfile?.name} ${this.userProfile?.surname}`
  }

  get reviewImage(): string {
    if (this.review.image && this.review.image !== '')
      return 'data:image/png;base64,' + this.review.image
    else return 'assets/images/profile.jpg'
  }

  ngOnInit(): void {
    this.loadProfile()
    this.authService.user$.subscribe(user => this.user = user)
  }

  loadProfile() {
    this.profileService.getBasicProfiles([this.review.touristId!]).subscribe(
      {
        next: (res) => this.userProfile = res[0],
        error: (e) => console.error(e)
      }
    )
  }

  deleteReview(): void {
    if (!this.review.id) return;

    if (confirm("Da li ste sigurni da želite obrisati ovu recenziju?")) {
      this.tourAuthoringService.deleteTourReview(this.review.id).subscribe({
        next: () => {
          console.log('Recenzija obrisana');
          this.reviewDeleted.emit(this.review.id);
        },
        error: (err) => {
          console.error('Greška pri brisanju recenzije:', err);
        }
      });
    }
  }

  editReview(): void {
    const dialogRef = this.dialog.open(TourReviewFormComponent, {
      data: { ...this.review },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(updatedReview => {
      if (updatedReview) {
        this.tourAuthoringService.updateTourReview(updatedReview).subscribe({
          next: (result) => {
            console.log('Recenzija ažurirana');
            this.review = result;
            this.reviewUpdated.emit(this.review);
          },
          error: (err) => {
            console.error('Greška pri ažuriranju recenzije:', err);
          }
        });
      }
    });
  }
}
