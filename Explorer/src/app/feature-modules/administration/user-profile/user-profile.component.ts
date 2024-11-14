import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { UserProfile } from '../model/userProfile.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Following } from '../model/following.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { SendMessageDialogComponent } from '../send-message-dialog/send-message-dialog.component';

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

  constructor(private service: UserProfileService,
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  openSendMessageDialog(): void {
    const dialogRef = this.dialog.open(SendMessageDialogComponent, {
      data: { senderId: this.tokenStorage.getUserId(), recipientId: this.userProfile.id }
    });
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



