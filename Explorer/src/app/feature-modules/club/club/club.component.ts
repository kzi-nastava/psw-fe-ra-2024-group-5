import { Component } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent {
  entities: Club[] = [];                                // ngOnInit metoda aktivira automatski kad se komponenta ucita

  constructor(private clubService: ClubService) {} // Ubrizgavanje zavisnosti

  ngOnInit(): void {
    this.clubService.getAll().subscribe({
      next: (result: PagedResults<Club>) => {
        this.entities = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
