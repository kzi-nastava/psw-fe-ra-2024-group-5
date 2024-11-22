import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AppRating } from '../../marketplace/model/app-rating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppRatingFormComponent } from '../../marketplace/app-rating-form/app-rating-form.component';

@Component({
  selector: 'xp-app-rating',
  templateUrl: './app-rating.component.html',
  styleUrls: ['./app-rating.component.css'],
})
export class AppRatingComponent implements OnInit {
  appRatings: AppRating[] = [];
  userNames: { [key: number]: string } = {}; 
  isAdmin: boolean = false; 
  isLoading: boolean = false; 
  searchQuery: string = ''; 
  page: number = 1; 
  pageSize: number = 10; 

  
  user$: Observable<User>;

  constructor(
    private authService: AuthService,
    private service: AdministrationService,
    public dialog: MatDialog
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    
    this.user$.subscribe((user) => {
      this.isAdmin = user.role === 'administrator';
    });

    
    this.getAppRatings();
  }

  getAppRatings(): void {
    this.isLoading = true; 
    const params = {
      searchQuery: this.searchQuery,
      page: this.page,
      pageSize: this.pageSize,
    };
  
    this.service.getAppRating().subscribe({
      next: (result: PagedResults<AppRating>) => {
        this.appRatings = result.results;
        this.loadUserNames();
        this.isLoading = false; 
      },
      error: () => {
        console.error('Failed to fetch app ratings');
        this.isLoading = false; 
      },
    });
  }
  

  private loadUserNames(): void {
    this.appRatings.forEach((appRating) => {
      if (!this.userNames[appRating.userId]) {
        this.authService
          .getUserById(appRating.userId)
          .subscribe((user: User) => {
            this.userNames[appRating.userId] = user.username;
          });
      }
    });
  }

  getUserName(userId: number): string {
    return this.userNames[userId] || 'Unknown';
  }

  openRatingDialog(existingRating?: { grade: number, comment: string }): void {
    const dialogRef = this.dialog.open(AppRatingFormComponent, {
      width: '400px',
      data: existingRating 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitRating(result); 
      }
    });
  }
  

  hasMoreResults(): boolean {
    return this.appRatings.length === this.pageSize;
  }
  

  submitRating(ratingData: { grade: number, comment: string }): void {
    const newRating: AppRating = {
      grade: ratingData.grade,
      comment: ratingData.comment,
      userId: 1, 
    };

   
    this.service.addAppRating(newRating).subscribe({
      next: () => {
        alert('Your review has been submitted!');
        this.getAppRatings(); 
      },
      error: () => {
        alert('Failed to submit the review');
      }
    });
  }

  refreshRatings(): void {
    this.getAppRatings(); 
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getAppRatings(); 
  }

  onSearchChange(): void {
    this.page = 1; 
    this.getAppRatings(); 
  }
}
