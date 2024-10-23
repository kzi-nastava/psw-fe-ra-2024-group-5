import { Component } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ClubMembership } from '../model/membership.model'
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent {
  entities: Club[] = [];
  newClub: Club = { id: 0, name: '', description: '', imageDirectory: '' }; // for creating a new club
  selectedClub: Club | null = null; // for editing an existing club

  constructor(private clubService: ClubService) {}

  ngOnInit(): void {
    this.getClubs();
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

  createClub(): void {
    this.clubService.create(this.newClub).subscribe({
      next: (club: Club) => {
        this.entities.push(club);
        this.resetNewClub();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  updateClub(): void {
    if (this.selectedClub) {
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
    }
  }

  deleteClub(id: number): void {
    this.clubService.delete(id).subscribe({
      next: () => {
        this.entities = this.entities.filter(c => c.id !== id);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  selectClubForEdit(club: Club): void {
    this.selectedClub = { ...club };
  }

  resetNewClub(): void {
    this.newClub = { id: 0, name: '', description: '', imageDirectory: '' };
  }
}

