import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { TourFormComponent } from '../tour-form/tour-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{

  user: User | undefined;
  tours: Tour[] = [];

  constructor(private service: TourAuthoringService, private authService: AuthService, private router: Router, public dialog: MatDialog) { }

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
  openDialog(): void{
    if(this.user?.role !== 'author'){
      alert("Nemate potrebnu rolu");
      return;
    }
    const u = this.user
    console.log(u)

    const dialogRef = this.dialog.open(TourFormComponent, {
      width: '600px',
      data: {u}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  
  onAddTour(): void{
    this.router.navigate(['/tour-creation'])
  }
  onEditTour(t: Tour): void{
    this.router.navigate(['/tour-edit', t.id])
  }
}
