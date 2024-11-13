import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AppRating } from '../../marketplace/model/app-rating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model'; 


@Component({
  selector: 'xp-app-rating',
  templateUrl: './app-rating.component.html',
  styleUrls: ['./app-rating.component.css']
})
export class AppRatingComponent implements OnInit {
  appRating: AppRating[] = [];
  userNames: { [key: number]: string } = {};


  constructor(private authService: AuthService, private service: AdministrationService) { }

  ngOnInit(): void {
    this.getAppRating();
  }

  

  getAppRating(): void {
    this.service.getAppRating().subscribe({
      next: (result: PagedResults<AppRating>) => {
        this.appRating = result.results;
        this.loadUserNames();
      },
      error: () => {
        
      },
    });
  }

  loadUserNames(): void {
    this.appRating.forEach((appRating) => {
      this.authService.getUserById(appRating.userId).subscribe((user: User) => {
        this.userNames[appRating.userId] = user.username;
      });
    });
  }

  getUserName(userId: number): string {
    if (this.userNames[userId]) {
      return this.userNames[userId];
    }
    return 'Unknown';
  }

}
