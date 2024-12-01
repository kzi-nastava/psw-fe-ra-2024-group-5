import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AppRating } from '../../marketplace/model/app-rating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ConfirmDialogComponent } from './app-rating-confirmation/app-rating-confirm-dialog.component';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-app-rating',
  templateUrl: './app-rating.component.html',
  styleUrls: ['./app-rating.component.css']
})
export class AppRatingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<AppRating>([]);
  displayedColumns: string[] = ['user', 'grade', 'comment', 'date', 'actions'];
  appRating: AppRating[] = [];
  userNames: { [key: number]: string } = {};
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  isLoading: boolean = false;

  searchForm = new FormGroup({
    username: new FormControl(''),
    grade: new FormControl('', [
      Validators.min(1),
      Validators.max(5)
    ])
  });

  constructor(
    private authService: AuthService, 
    private service: AdministrationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource.sortingDataAccessor = (item: AppRating, property: string) => {
      switch(property) {
        case 'user': 
          return this.getUserName(item.userId).toLowerCase();
        case 'grade': 
          return Number(item.grade);
        case 'date': 
          return new Date(item.timeStamp || '').getTime();
        default: 
          return item[property as keyof AppRating];
      }
    };

    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  ngOnInit(): void {
    this.getAppRating();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  limitGradeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value);
    
    if (value > 5) {
      input.value = '5';
      this.searchForm.get('grade')?.setValue('5');  // Convert to string
    } else if (value < 1 && value !== 0) {
      input.value = '1';
      this.searchForm.get('grade')?.setValue('1');  // Convert to string
    }
  }

  getAppRating(): void {
    this.isLoading = true;
    this.service.getAppRating().subscribe({
      next: (result: PagedResults<AppRating>) => {
        this.appRating = result.results;
        this.dataSource.data = this.appRating;
        this.totalItems = result.totalCount;
        this.loadUserNames();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ratings:', error);
        this.showNotification('Error loading ratings', 'error');
        this.isLoading = false;
      },
    });
  }

  loadUserNames(): void {
    let loadedCount = 0;
    const totalCount = this.appRating.length;
    
    this.appRating.forEach((rating) => {
      this.authService.getUserById(rating.userId).subscribe({
        next: (user: User) => {
          this.userNames[rating.userId] = user.username;
          loadedCount++;
          
          if (loadedCount === totalCount) {
            this.dataSource.data = [...this.appRating];
            if (this.sort) {
              this.dataSource.sort = this.sort;
              this.sort.sortChange.emit();
            }
          }
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.userNames[rating.userId] = 'Unknown';
          loadedCount++;
          
          if (loadedCount === totalCount) {
            this.dataSource.data = [...this.appRating];
            if (this.sort) {
              this.dataSource.sort = this.sort;
              this.sort.sortChange.emit();
            }
          }
        }
      });
    });
  }

  applyFilter(): void {
    this.dataSource.filterPredicate = (data: AppRating, filter: string) => {
      const searchTerm = JSON.parse(filter);
      
      const usernameMatch = searchTerm.username ? 
        this.getUserName(data.userId).toLowerCase().includes(searchTerm.username.toLowerCase()) : 
        true;
      
      const gradeMatch = searchTerm.grade ? 
        data.grade === Number(searchTerm.grade) : 
        true;

      return usernameMatch && gradeMatch;
    };

    const filterValue = {
      username: this.searchForm.get('username')?.value || '',
      grade: this.searchForm.get('grade')?.value || ''
    };

    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.dataSource.filter = '';
  }

  getUserName(userId: number): string {
    return this.userNames[userId] || 'Unknown';
  }

  deleteRating(ratingId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this rating?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteAppRating(ratingId).subscribe({
          next: () => {
            this.showNotification('Rating deleted successfully');
            this.getAppRating();
          },
          error: (error) => {
            console.error('Error deleting rating:', error);
            this.showNotification('Error deleting rating', 'error');
          }
        });
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAppRating();
  }

  getStarArray(grade: number): number[] {
    return Array(grade).fill(0);
  }
}