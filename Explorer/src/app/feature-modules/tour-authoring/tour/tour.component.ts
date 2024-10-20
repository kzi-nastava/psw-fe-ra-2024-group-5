import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{

  user: User | undefined;
  tours: Tour[] = [];

  constructor(private service: TourAuthoringService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getTours(this.user).subscribe({
        next: (result: PagedResults<Tour>) => {
          this.tours = result.results
          console.log(result)
        },
        error: (err: any) => {
          console.log(err)
        }
     });
    });
  }

  // tours: Tour[] = [{id: 0, name: "Tura 1", description: "Opis 1", tag: "Nesto, nesto 2", level: "intermidiate", status: "ACtive", price: 1010.0, authorId: 1},
  // {id: 1, name: "Tura 2", description: "Opis 2", tag: "Nesto 1, nesto 3", level: "Advanced", status: "Cancelled", price: 2200.0, authorId: 2}]
}
