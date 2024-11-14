import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { UserProfileService } from '../user-profile.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Following } from '../model/following.model';
import { UserProfile } from '../model/userProfile.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-followers-list',
  templateUrl: './followers-list.component.html',
  styleUrls: ['./followers-list.component.css']
})
export class FollowersListComponent implements OnInit {
  userId: number | null;
  profiles: UserProfile[] = [];

  constructor(private service: UserProfileService, 
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorage: TokenStorage) {}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();

    this.loadFollowers();
  }

  loadFollowers(page: number = 1, pageSize: number = 10): void {
    if (this.userId) { 
      this.service.getAllFollowers(this.userId, page, pageSize).subscribe(
        (result: PagedResults<UserProfile>) => {
          this.profiles = result.results;  
        },
        error => {
          console.error('Error downloading followers', error);
        }
      );
    } else {
      console.error("User ID is null, cannot load followers.");
    }
  }
}
