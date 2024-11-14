import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { MapService } from 'src/app/shared/map/map.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.css']
})
export class TourCardComponent {
  @Input() tourCard: TourCard;
  @Output() tourSelected = new EventEmitter<number>();

  user: User | undefined;
  tourLevels: string[] = ['Beginner','Intermediate','Expert'];
  location: string = 'Location unknown';
  currencies: string[] = ['rsd','e','$'];
  imageSource: string = '';
  

  constructor(private mapService: MapService,private authService: AuthService){}

  ngOnInit(): void {
    if(!this.tourCard)
      return;

    if(!this.tourCard.firstKeypoint)
      return;

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.imageSource = `data:image/jpeg;base64,${this.tourCard.firstKeypoint.image}`;

    this.mapService.reverseSearch(this.tourCard.firstKeypoint.latitude, this.tourCard.firstKeypoint.longitude).subscribe((res) => {
      const city = res.address?.city || res.address?.town || res.address?.village || 'Unknown City';
      const state = res.address?.state || 'Unknown State';
      
      this.location = `${city}, ${state}`;
    });
  }

  addToCart(): void {
    this.tourSelected.emit(this.tourCard.id);
  }
}
