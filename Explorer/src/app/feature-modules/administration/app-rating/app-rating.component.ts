import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AppRating } from '../../marketplace/model/app-rating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppRatingDialogComponent } from './app-rating-dialog/app-rating-dialog.component';

@Component({
  selector: 'xp-app-rating',
  templateUrl: './app-rating.component.html',
  styleUrls: ['./app-rating.component.css'],
})
export class AppRatingComponent implements OnInit {
  appRatings: AppRating[] = [];
  userNames: { [key: number]: string } = {}; // Cache usernames
  isAdmin: boolean = false; // Whether the user is an admin
  isLoading: boolean = false; // Loading state
  searchQuery: string = ''; // Filter by username or grade
  page: number = 1; // Current page for pagination
  pageSize: number = 10; // Number of ratings per page

  // Observable for the current user
  user$: Observable<User>;

  constructor(
    private authService: AuthService,
    private service: AdministrationService,
    public dialog: MatDialog // Inject MatDialog for dialog functionality
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // Subscribe to user information and determine admin status
    this.user$.subscribe((user) => {
      this.isAdmin = user.role === 'administrator';
    });

    // Fetch app ratings on component initialization
    this.getAppRatings();
  }

  getAppRatings(): void {
    this.isLoading = true; // Start loading
    const params = {
      searchQuery: this.searchQuery,
      page: this.page,
      pageSize: this.pageSize,
    };
  
    this.service.getAppRating().subscribe({
      next: (result: PagedResults<AppRating>) => {
        this.appRatings = result.results;
        this.loadUserNames();
        this.isLoading = false; // Stop loading
      },
      error: () => {
        console.error('Failed to fetch app ratings');
        this.isLoading = false; // Stop loading
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
    const dialogRef = this.dialog.open(AppRatingDialogComponent, {
      width: '400px',
      data: existingRating // Pass existing rating data to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitRating(result); // Submit the rating if available
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
      userId: 1, // Assuming the user is logged in, replace this with the actual user ID
    };

    // Call addAppRating to submit the rating
    this.service.addAppRating(newRating).subscribe({
      next: () => {
        alert('Your review has been submitted!');
        this.getAppRatings(); // Refresh the list after submission
      },
      error: () => {
        alert('Failed to submit the review');
      }
    });
  }

  refreshRatings(): void {
    this.getAppRatings(); // Refresh the list of ratings
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getAppRatings(); // Fetch ratings for the new page
  }

  onSearchChange(): void {
    this.page = 1; // Reset to the first page
    this.getAppRatings(); // Fetch ratings with the updated search query
  }
}
