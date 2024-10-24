import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ClubMembership } from '../model/membership.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  entities: Club[] = [];
  membershipEntities: ClubMembership[] = [];
  newClub: Club = { id: 0, name: '', description: '', imageDirectory: '', ownerId: 0 };
  selectedClub: Club | null = null; // for editing an existing club
  currentUser: User | null = null; // Store the current logged-in user's info
  showTouristForm = false; // Flag to show/hide tourist form
  touristUsers: User[] = []; // Array to hold tourist users

  constructor(private clubService: ClubService, private authService: AuthService) {} // Inject AuthService

  ngOnInit(): void {
    this.getCurrentUser(); // Get the current logged-in user
    this.getClubs();
    this.getMemberships(); 
  }

  getClubs(): void {
    this.clubService.getAll().subscribe({
      next: (result: PagedResults<Club>) => {
        this.entities = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getMemberships(): void {
    this.clubService.getAllMemberships().subscribe({
      next: (memberships: ClubMembership[]) => {
        this.membershipEntities = memberships;
      },
      error: (err: any) => {
        console.error('Error fetching memberships:', err);
      }
    });
  }

  createClub(): void {
    const currentUser = this.authService.user$.value;
  
    if (currentUser.role === 'tourist') {

      this.newClub.ownerId = currentUser.id;

      this.clubService.create(this.newClub).subscribe({
        next: (club: Club) => {
          this.entities.push(club);
          this.resetNewClub();
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.log('Only users with the role of "Tourist" can create a new club.');
    }
  }
  
  updateClub(): void {
    if (this.selectedClub) {
      const currentUserId = this.authService.user$.value.id;
  
      // Check if the current user is the owner of the club
      if (this.selectedClub.ownerId === currentUserId) {
        this.clubService.update(this.selectedClub).subscribe({
          next: (club: Club) => {
            const index = this.entities.findIndex(c => c.id === club.id);
            if (index !== -1) {
              this.entities[index] = club;
            }
            this.selectedClub = null; // Reset the form after update
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      } else {
        console.log('You do not have permission to update this club.');
      }
    }
  }
  

  deleteClub(id: number): void {
    const currentUserId = this.authService.user$.value.id;
  
    // Check if the club exists and if the current user is the owner
    if (this.selectedClub?.ownerId === currentUserId) {
      this.clubService.delete(id).subscribe({
        next: () => {
          this.entities = this.entities.filter(c => c.id !== id);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.log('You do not have permission to delete this club.');
    }
  }
  
  //unimplemented
  createMembership(clubId: number, userId: number): void {
    const currentUserId = this.authService.user$.value.id; 
    // Check if the current user is the owner of the club
    if (this.selectedClub && this.selectedClub.ownerId === currentUserId) {
      this.clubService.createMembership(clubId, userId).subscribe({
        next: (membership: ClubMembership) => {
          this.membershipEntities.push(membership);
          console.log('Membership created successfully');
        },
        error: (err: any) => {
          console.error('Error creating membership:', err);
        }
      });
    } else {
      console.log('You do not have permission to create a membership for this club.');
    }
  }
  
  //unimplemented
  deleteMembership(clubId: number, userId: number): void {
    const currentUserId = this.authService.user$.value.id;
  
    // Check if the current user is the owner of the club
    if (this.selectedClub && this.selectedClub.ownerId === currentUserId) {
      this.clubService.deleteMembership(clubId, userId).subscribe({
        next: () => {
          this.membershipEntities = this.membershipEntities.filter(m => m.clubId !== clubId || m.userId !== userId);
          console.log(`Membership deleted successfully for Club ID ${clubId} and User ID ${userId}`);
        },
        error: (err: any) => {
          console.error('Error deleting membership:', err);
        }
      });
    } else {
      console.log('You do not have permission to delete a membership for this club.');
    }
  }
  

  selectClubForEdit(club: Club): void {
    this.selectedClub = { ...club };
    this.showTouristForm = false; // Close tourist form
    this.resetNewClub(); // Close create club form
}

  // Reset the new club form
  resetNewClub(): void {
    this.newClub = { id: 0, name: '', description: '', imageDirectory: '', ownerId: 0 };
  }

  // Get the current user info
  private getCurrentUser(): void {
    this.authService.user$.subscribe({
      next: (user: User) => {
        this.currentUser = user; // Store the current user information
        console.log('Logged-in user:', this.currentUser);
      },
      error: (err: any) => {
        console.error('Error fetching current user:', err);
      }
    });
  }

}
