import { Component, OnInit, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { KeyPoint } from '../model/key-point.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourLevel, TourStatus, Currency, TourTransport } from '../model/tour.enums'; // Import the enums



@Component({
  selector: 'xp-tour-author-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourAuthorViewComponent implements OnInit {
  isEditable: boolean = false;
  user: User | undefined;
  tour: Tour | undefined;
  tourId: number;
  @ViewChild(MapComponent) map: MapComponent;

  constructor(
    private service: TourAuthoringService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tourId');
      this.tourId = Number(id);
      this.loadTourDetails(this.tourId);
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  private loadTourDetails(tourId: number): void {
    this.service.getTourbyId(tourId).subscribe({
        next: (result: Tour) => {
            this.tour = {
                ...result,
                level: result.level as TourLevel, // Ensure it's cast to enum
                status: result.status as TourStatus, // Ensure it's cast to enum
                price: {
                    ...result.price,
                    currency: result.price.currency as Currency // Ensure it's cast to enum
                }
            };
            console.log('Loaded Tour:', this.tour);
        },
        error: (err: any) => {
            console.log(err);
        }
    });
}



  displayKeyPoints(): void {
    this.tour?.keyPoints.forEach(element => {
      this.map.addKeyPointMarker([element.latitude, element.longitude], element.name);
    });
  }

  back(): void {
    this.router.navigate(['/tours']);
  }

  getTourLevel(level: number | undefined): string {
    if (level === undefined) return 'N/A';
    return TourLevel[level] !== undefined ? TourLevel[level] : 'N/A';
}

getTourStatus(status: number | undefined): string {
    if (status === undefined) return 'N/A';
    return TourStatus[status] !== undefined ? TourStatus[status] : 'N/A';
}

getCurrency(currency: number | undefined): string {
    if (currency === undefined) return 'N/A';
    return Currency[currency] !== undefined ? Currency[currency] : 'N/A';
}

getTransport(transport: number | undefined): string {
    if (transport === undefined) return 'N/A';
    return TourTransport[transport] !== undefined ? TourTransport[transport] : 'N/A';
}



}
