import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { UserProfile } from '../model/userProfile.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile;
  isOwnProfile: boolean = false;
  isFollowing: boolean = false;

  constructor(private service: UserProfileService, 
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('id');
    let userId: number | null;

    if (profileId) {
      userId = +profileId;  
      this.isOwnProfile = false; 
      
      const currentUserId = this.tokenStorage.getUserId();
      if(currentUserId)
      {
        this.service.isFollowing(currentUserId, userId).subscribe({
          next: (result) => {
            this.isFollowing = result;  
          },
          error: (err) => {
            console.error("Error checking following status", err);
          }
        });
      }
    } else {
      userId = this.tokenStorage.getUserId();  
      this.isOwnProfile = true;  
    }

    if (userId) {
      this.service.getUserProfile(+userId).subscribe({
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
      if(this.isFollowing)
      {
        this.service.unfollowUser(userId, +followedUserId).subscribe({
          next: (result) => {
            console.log("User unfollowed successfully", result);
            this.isFollowing = false;
          },
          error: (err) => {
            console.error("Error unfollowing user", err);
          }
        });
      } else 
      {
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

}
