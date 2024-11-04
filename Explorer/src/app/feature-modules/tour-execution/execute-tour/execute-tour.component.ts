import { Component } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourExecutionService } from '../tour-execution.service';
import { TourExecution } from '../model/tour-execution.model';

@Component({
  selector: 'xp-execute-tour',
  templateUrl: './execute-tour.component.html',
  styleUrls: ['./execute-tour.component.css']
})
export class ExecuteTourComponent {
  noActiveTours: boolean = true;
  tourExecution: TourExecution;

  constructor(private service: TourExecutionService, private tokenStorage: TokenStorage) { }

  ngOnInit(): void {
    const userId = this.tokenStorage.getUserId();
    if (!userId)
      return;

    this.service.getActiveTourExecution(userId).subscribe({
      next: tourExecution => {
        this.tourExecution = tourExecution;
        this.noActiveTours = false;
      },
      error: error => {
        this.noActiveTours = true;
        console.log('Error fetching active tour:', error.status);
      }
    });
  }
}
