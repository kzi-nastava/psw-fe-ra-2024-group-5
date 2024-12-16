import { Component, Input, OnInit } from '@angular/core';
import { TourReview } from '../model/tour.model';
import { UserProfileBasic } from '../../administration/model/userProfileBasic.model';
import { UserProfileService } from '../../administration/user-profile.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit {

  constructor(private profileService: UserProfileService, private authService: AuthService,) { }

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
    console.log('delete')
  }

  editReview(): void {
    console.log('edit')
  }

}
