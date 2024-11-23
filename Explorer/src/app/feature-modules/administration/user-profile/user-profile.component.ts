import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { UserProfile } from '../model/userProfile.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Following } from '../model/following.model';
import { PagedResults } from '../../../shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { SendMessageDialogComponent } from '../send-message-dialog/send-message-dialog.component';
import { AppRatingFormComponent } from '../../marketplace/app-rating-form/app-rating-form.component';
import { User } from '../../../infrastructure/auth/model/user.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile;
  isOwnProfile: boolean = false;
  isFollowing: boolean = false;
  isFollower: boolean = false;
  followersCount: number = 0;
  userId: number | null;
  userRating: { grade: number; comment: string } | null = null;
  isAdmin: boolean = false; // Add this property
  user$: Observable<User>;

  constructor(private service: UserProfileService,
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog) { this.user$ = this.authService.user$;
     }

  openSendMessageDialog(): void {
    const dialogRef = this.dialog.open(SendMessageDialogComponent, {
      data: { senderId: this.tokenStorage.getUserId(), recipientId: this.userProfile.id }
    });
  }

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('id');

    
  
    const parsedProfileId = profileId ? parseInt(profileId, 10) : null;
  
    const storedRating = localStorage.getItem('userRating');
    if (storedRating) {
      this.userRating = JSON.parse(storedRating);
    }
    
    this.userId = this.tokenStorage.getUserId();
 
  
    if (profileId && parsedProfileId != this.userId) {
      this.userId = parsedProfileId;
      this.isOwnProfile = false;
  
      const currentUserId = this.tokenStorage.getUserId();
      if (currentUserId && this.userId) {
        this.service.isFollowing(currentUserId, this.userId).subscribe({
          next: (result) => {
            this.isFollowing = result;
          },
          error: (err) => {
            console.error("Error checking following status", err);
          }
        });
  
        this.service.isFollowing(this.userId, currentUserId!).subscribe({
          next: (res) => this.isFollower = res,
          error: (err) => console.error("Error checking following status", err)
        });
      }
    } else {
      this.isOwnProfile = true;
    }
  
    this.loadFollowers();
  
    if (this.userId) {
      this.service.getUserProfile(+this.userId).subscribe({
        next: (result: UserProfile) => {
          this.userProfile = result;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error("User ID is null");
    }


    this.user$.subscribe((user) => {
      this.isAdmin = user.role === 'administrator';
    });
  }
  
 
  

  openRatingDialog(): void {
    const dialogRef = this.dialog.open(AppRatingFormComponent, {
      width: '400px',
      data: { grade: this.userRating?.grade || 0, comment: this.userRating?.comment || '' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userRating = { grade: result.grade, comment: result.comment };
        console.log('Rating:', result.grade, 'Comment:', result.comment);
      }
    });
  }
  

  openReviewDialog(): void {
    if (this.userRating) {
      const dialogRef = this.dialog.open(AppRatingFormComponent, {
        width: '400px',
        data: { grade: this.userRating.grade, comment: this.userRating.comment }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userRating = { grade: result.grade, comment: result.comment };
          console.log('Updated Rating:', result.grade, 'Updated Comment:', result.comment);
        }
      });
    }
  }

  deleteReview(): void {
    this.userRating = null;
    console.log('Review deleted');
  }
  
  

  followOrUnfollow(): void {
    const userId = this.tokenStorage.getUserId();
    const followedUserId = this.route.snapshot.paramMap.get('id');

    if (followedUserId && userId) {
      if (this.isFollowing) {
        this.service.unfollowUser(userId, +followedUserId).subscribe({
          next: (result) => {
            console.log("User unfollowed successfully", result);
            this.isFollowing = false;
          },
          error: (err) => {
            console.error("Error unfollowing user", err);
          }
        });
      } else {
        this.service.followUser(userId, +followedUserId).subscribe({
          next: (result) => {
            console.log("User followed successfully", result);
            this.isFollowing = true;
          },
          error: (err) => {
            console.error("Error following user", err);
          }
        });
      }

    } else {
      console.error("Followed user ID is null");
    }
  }

  loadFollowers(page: number = 1, pageSize: number = 10): void {
    if (this.userId) {
      this.service.getAllFollowers(this.userId, page, pageSize).subscribe(
        (followers: PagedResults<UserProfile>) => {
          this.followersCount = followers.totalCount | 0;
        },
        error => {
          console.error('Error downloading followers', error);
        }
      );
    } else {
      console.error("User ID is null, cannot load followers.");
    }
  }

  navigateToFollowers(): void {
    if (this.userId) {
      this.router.navigate(['/followers', this.userId]);
    }
  }

}



