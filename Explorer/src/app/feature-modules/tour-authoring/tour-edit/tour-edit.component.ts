import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-edit',
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.css']
})
export class TourEditComponent implements OnInit{

  user : User | undefined
  tour : Tour | undefined;
  tourId: number;

  constructor(private service: TourAuthoringService, private route: ActivatedRoute, private authService: AuthService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tourId'); // 'id' is the name used in the route definition
      this.tourId = Number(id)
      console.log(this.tourId)
    });
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getTourbyId(this.tourId).subscribe({
        next: (result: Tour) => {
          this.tour = result
          console.log(result)
        },
        error: (err: any) => {
          console.log(err)
        }
      })
    });
  }

  
}
