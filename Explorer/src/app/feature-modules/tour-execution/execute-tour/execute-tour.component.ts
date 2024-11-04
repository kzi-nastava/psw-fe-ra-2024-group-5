import { Component } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourExecutionService } from '../tour-execution.service';

@Component({
  selector: 'xp-execute-tour',
  templateUrl: './execute-tour.component.html',
  styleUrls: ['./execute-tour.component.css']
})
export class ExecuteTourComponent {
  noActiveTours: boolean = true;

  constructor(private service: TourExecutionService, private tokenStorage: TokenStorage) { }

  ngOnInit(): void {
    const userId = this.tokenStorage.getUserId();
    if (userId) {
      this.service.getActiveTour(userId).subscribe(
        tour => {
          console.log(tour);
        },
        error => {
          this.noActiveTours = true;
          console.log('Error fetching active tour:', error.status);
        }
      );
    }
  }

  startTour(): void {
    console.log('Starting tour...');
  }
}
