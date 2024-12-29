import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserRewardService } from '../../administration/user-reward.service';
import { UserReward } from '../../administration/model/user-reward.model';
import { MatDialog } from '@angular/material/dialog';
import { UserRewardComponent } from '../../administration/user-reward/user-reward.component';
//import { Blog } from '../../blog/model/blog.model';
import { OnInit } from '@angular/core';

@Component({
  selector: 'xp-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  recommendedTours: TourCard[] = [];
  user: User;
  //recommendedBlogs: Blog[] = [];

  constructor(private tourService: TourAuthoringService, private authService: AuthService, private router: Router, 
    private rewardService: UserRewardService,
    private dialog: MatDialog
  ){
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.loadTours();
  }

  ngOnInit(): void {
    this.loadReward();
  }

  loadTours(): void{
    this.tourService.getPublishedTourCards(1,4).subscribe({
      next: (result: TourCard[]) => {
        this.recommendedTours = result
        console.log(this.recommendedTours)
      },
      error: () => {}
    });
  }

  detailedTour(tour: TourCard): void{
    this.router.navigate(['/tour-detailed-view', tour.id]);
  }

  loadReward(){
    if(this.user && this.user.role === 'tourist'){
      this.rewardService.getUserReward(this.user.id).subscribe( userReward => {
        if(userReward.canBeClaimed){
          this.dialog.open(UserRewardComponent, {
            width: '1000px',
            data: { userReward } // Optional: pass data to the dialog
          });
        }
      })
    }
  }
}
