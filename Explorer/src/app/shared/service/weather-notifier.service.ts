import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer, switchMap, of } from 'rxjs';
import { GeoLocatorService } from './geo-locator.service';
import { WeatherService, DailyWeatherSummary } from './weather.service';

@Injectable({ providedIn: 'root' })
export class WeatherNotifierService {
  private _visible$ = new BehaviorSubject<boolean>(true);
  private _minimized$ = new BehaviorSubject<boolean>(false);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _summary$ = new BehaviorSubject<DailyWeatherSummary | null>(null);
  private _location$ = new BehaviorSubject<{lat: number, lon: number} | null>(null);
  private sub: Subscription | null = null;

  visible$ = this._visible$.asObservable();
  minimized$ = this._minimized$.asObservable();
  loading$ = this._loading$.asObservable();
  summary$ = this._summary$.asObservable();
  location$ = this._location$.asObservable();

  constructor(private geo: GeoLocatorService, private weather: WeatherService) {}

  start(): void {
    if (this.sub) return;
    this._visible$.next(true);
    this._minimized$.next(false);
    this._loading$.next(true);
    this.sub = timer(0, 2 * 60 * 60 * 1000) // every 2 hours
      .pipe(
        switchMap(() => this.geo.locateByIp()),
        switchMap((loc) => {
          this._location$.next({lat: loc.latitude, lon: loc.longitude});
          return this.weather.getTodaySummary(loc.latitude, loc.longitude);
        })
      )
      .subscribe({
        next: (summary) => { this._summary$.next(summary); this._loading$.next(false); },
        error: () => { this._loading$.next(false); }
      });
  }

  stop(): void {
    if (this.sub) { this.sub.unsubscribe(); this.sub = null; }
  }

  minimize(): void { this._minimized$.next(true); }
  restore(): void { this._minimized$.next(false); }
  close(): void { this.minimize(); }
}

