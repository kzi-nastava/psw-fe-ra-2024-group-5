import { Component, OnInit } from '@angular/core';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ClubMembership } from '../model/membership.model';

@Component({
  selector: 'xp-my-clubs',
  templateUrl: './my-clubs.component.html',
  styleUrls: ['./my-clubs.component.css']
})
export class MyClubsComponent implements OnInit {
  userClubs: Club[] = [];
  userId: number | null = null;
  loading: boolean = false;
  filterOption: 'all' | 'my' = 'all';

  constructor(private clubService: ClubService, private tokenStorage: TokenStorage) {}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();

    if (this.userId !== null) {
      this.loadClubs();
    } else {
      console.error('User ID is not available');
      this.loading = false;
    }
  }

  loadClubs(): void {
    this.loading = true;

    if (this.filterOption === 'all') {
      this.clubService.getAllMemberships().subscribe(
        (memberships) => {
          const userMemberships = memberships.filter(membership => membership.userId === this.userId);
          const clubIds = userMemberships.map(membership => membership.clubId);

          this.clubService.getAll().subscribe(
            (data) => {
              this.userClubs = data.results.filter(club => 
                club.id != null && (clubIds.includes(club.id) || club.ownerId === this.userId)
              );

              if (this.userClubs.length === 0) {
                this.userClubs = [];
              }
              this.loading = false;
            },
            (error) => {
              console.error('Error fetching clubs', error);
              this.loading = false;
            }
          );
        },
        (error) => {
          console.error('Error fetching memberships', error);
          this.loading = false;
        }
      );
    } else if (this.filterOption === 'my' && this.userId !== null) {
      this.clubService.getUserClubs(this.userId).subscribe(
        (clubs) => {
          this.userClubs = clubs.filter(club => club.ownerId === this.userId);

          if (this.userClubs.length === 0) {
            this.userClubs = [];
          }

          this.loading = false;
        },
        (error) => {
          console.error('Error fetching user clubs', error);
          this.loading = false;
        }
      );
    }
  }

  filterClubs(option: 'all' | 'my'): void {
    this.filterOption = option;
    this.loadClubs();
  }
}
