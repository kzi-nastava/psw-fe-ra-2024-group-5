import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface IpLocation {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

@Injectable({ providedIn: 'root' })
export class GeoLocatorService {
  constructor(private http: HttpClient) {}

  // Uses ipwho.is (no key, permissive CORS). Fallbacks can be added if needed.
  locateByIp(): Observable<IpLocation> {
    return this.http.get<any>('https://ipwho.is/').pipe(
      map((res) => ({
        latitude: Number(res?.latitude) || 0,
        longitude: Number(res?.longitude) || 0,
        city: res?.city,
        region: res?.region,
        country: res?.country,
      }))
    );
  }
}

