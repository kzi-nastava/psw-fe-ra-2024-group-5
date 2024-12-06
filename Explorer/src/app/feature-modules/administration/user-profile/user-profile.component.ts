import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { UserProfile } from '../model/userProfile.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Following } from '../model/following.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { SendMessageDialogComponent } from '../send-message-dialog/send-message-dialog.component';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Wallet } from '../../marketplace/model/wallet';
import { AppRating } from '../../marketplace/model/app-rating.model';
import { AppRatingDialogComponent } from '../../marketplace/app-rating-form/app-rating-dialog/app-rating-dialog.component';
import { AppRatingFormComponent } from '../../marketplace/app-rating-form/app-rating-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | undefined;
  isOwnProfile: boolean = false;
  isFollowing: boolean = false;
  isFollower: boolean = false;
  followersCount: number = 0;
  userId: number | null;
  user: User;
  userRating: AppRating | null = null;
  wallet: Wallet | null = null;
  currencies: string[] = ['AC', 'EUR', 'DOL', 'RSD'];

  constructor(private service: UserProfileService,
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private marketplaceService: MarketplaceService,
    private snackBar: MatSnackBar,
    private marketService: MarketplaceService,
    private authService: AuthService) { }

  openSendMessageDialog(): void {
    const dialogRef = this.dialog.open(SendMessageDialogComponent, {
      data: { senderId: this.tokenStorage.getUserId(), recipientId: this.userProfile?.id }
    });
  }

  loadUserRating(): void {
    // Only load rating for non-admin users
    if (this.user && this.user.role !== 'administrator') {
      this.marketplaceService.getUserAppRating().subscribe({
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
  }


  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('id');

    const parsedProfileId = profileId ? parseInt(profileId, 10) : null;

    

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

        //console.log(`IS ${this.userId} FOLLOWING ${currentUserId}`)
        this.service.isFollowing(this.userId, currentUserId!).subscribe(
          {
            next: (res) => this.isFollower = res,
            error: (err) => console.error("Error checking following status", err)
          }
        )
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
    this.loadUserRating();

    this.authService.user$.subscribe(user => {
      this.user = user;

      if (user && user.role !== 'administrator') {
        this.loadUserRating();
      }
      
      if(user.role === 'tourist' && user.id){
        this.marketService.getWalletByTourist().subscribe({
          next: (result: Wallet) => {
            this.wallet = result;
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      }
    });
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


 

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

 

  openRatingDialog(): void {
    if (this.user.role === 'administrator') {
      return;
    }
    
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
    if (this.user.role === 'administrator' || !this.userRating) {
      return;
    }
    
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
    if (this.user.role === 'administrator' || !this.userRating?.id) {
      return;
    }

    this.marketplaceService.deleteAppRating(this.userRating.id).subscribe({
      next: () => {
        this.userRating = null;
        this.showNotification('Your review has been deleted');
      },
      error: (err) => console.error('Error deleting app rating:', err)
    });
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



