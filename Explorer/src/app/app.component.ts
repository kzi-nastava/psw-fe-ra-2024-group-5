import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import 'leaflet-routing-machine';
import { WeatherNotifierService } from './shared/service/weather-notifier.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Explorer';
  itemsCount: number = 0;

  constructor(
    private authService: AuthService,
    public weatherNotifier: WeatherNotifierService,
  ) {}


  ngOnInit(): void {
    this.checkIfUserExists();
    this.weatherNotifier.start();
  }

  ngOnDestroy(): void {
    this.weatherNotifier.stop();
  }
  
  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }
  handleItemsCountUpdate(count: number): void {
    this.itemsCount = count;
    console.log('Ažuriran broj stavki u korpi:', this.itemsCount);
  }
}
