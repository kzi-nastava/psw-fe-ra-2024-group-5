import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { UserProfile } from '../model/userProfile.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile;

  constructor(private service: UserProfileService, 
    private tokenStorage: TokenStorage) {}

  ngOnInit(): void {
    const userId = this.tokenStorage.getUserId();

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
}
