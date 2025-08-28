import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface DailyWeatherSummary {
  date: string;
  temperatureMaxC: number | null;
  temperatureMinC: number | null;
  precipitationMm: number | null;
  precipitationProbPct: number | null;
  windSpeedMaxKph: number | null;
  weatherCode: number | null;
  message: string;
  conditionLabel?: string;
  iconKey?: string;
  tips?: string[];
  latitude?: number;
  longitude?: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  getTodaySummary(lat: number, lon: number): Observable<DailyWeatherSummary> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('daily', [
        'weathercode',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'windspeed_10m_max'
      ].join(','))
      .set('timezone', 'auto');

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((data) => this.toSummary(data))
    );
  }

  private toSummary(api: any): DailyWeatherSummary {
    const idx = 0;
    const date = api?.daily?.time?.[idx] ?? new Date().toISOString().slice(0,10);
    const tempMax = this.safeNumber(api?.daily?.temperature_2m_max?.[idx]);
    const tempMin = this.safeNumber(api?.daily?.temperature_2m_min?.[idx]);
    const precip = this.safeNumber(api?.daily?.precipitation_sum?.[idx]);
    const precipProb = this.safeNumber(api?.daily?.precipitation_probability_max?.[idx]);
    const windMax = this.safeNumber(api?.daily?.windspeed_10m_max?.[idx]);
    const code = this.safeNumber(api?.daily?.weathercode?.[idx]);

    const message = this.generateMessage({
      temperatureMaxC: tempMax,
      temperatureMinC: tempMin,
      precipitationMm: precip,
      precipitationProbPct: precipProb,
      windSpeedMaxKph: windMax,
      weatherCode: code,
    });

    const meta = this.mapWeatherMeta(code ?? 0, precipProb ?? 0, windMax ?? 0, tempMax ?? 0, tempMin ?? 0);

    return {
      date,
      temperatureMaxC: tempMax,
      temperatureMinC: tempMin,
      precipitationMm: precip,
      precipitationProbPct: precipProb,
      windSpeedMaxKph: windMax,
      weatherCode: code,
      message,
      conditionLabel: meta.label,
      iconKey: meta.icon,
      tips: meta.tips,
      latitude: api?.latitude,
      longitude: api?.longitude,
    };
  }

  private safeNumber(value: any): number | null {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  private generateMessage(summary: Omit<DailyWeatherSummary, 'date' | 'message'>): string {
    const parts: string[] = [];

    const meta = this.mapWeatherMeta(
      summary.weatherCode ?? 0,
      summary.precipitationProbPct ?? 0,
      summary.windSpeedMaxKph ?? 0,
      summary.temperatureMaxC ?? 0,
      summary.temperatureMinC ?? 0
    );

    parts.push(meta.headline);

    return parts.join(' • ');
  }

  private mapWeatherMeta(code: number, precipProb: number, windMax: number, tMax: number, tMin: number): { icon: string; label: string; headline: string; tips: string[] } {
    // Simplified Open-Meteo weather code groupings
    // 0: Clear, 1-3: Mainly clear/partly cloudy/overcast, 45-48: Fog, 51-57: Drizzle,
    // 61-67: Rain, 71-77: Snow, 80-82: Rain showers, 85-86: Snow showers, 95-99: Thunder
    let icon = 'sunny';
    let label = 'Clear skies';
    let headline = 'Crystal clear views — ideal for exploring';
    const tips: string[] = [];

    const hot = tMax >= 30;
    const cold = tMax <= 5;
    const veryWindy = windMax >= 50;
    const windy = windMax >= 30;
    const rainy = precipProb >= 50;

    if (code === 0) {
      icon = 'sunny';
      label = 'Clear skies';
      headline = hot ? 'Blazing sunshine — hydrate and wear sunscreen' : 'Bluebird day — perfect for sightseeing';
    } else if ([1,2,3].includes(code)) {
      icon = 'cloudy';
      label = 'Cloudy';
      headline = rainy ? 'Clouds with a chance of showers — pack a light shell' : 'Soft light — great for photos';
    } else if (code === 45 || code === 48) {
      icon = 'fog';
      label = 'Foggy';
      headline = 'Low visibility — take it slow and enjoy the mood';
      tips.push('Use landmarks and stay on marked paths');
    } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      icon = 'rain';
      label = 'Rainy';
      headline = 'Showers expected — bring an umbrella or waterproof';
      tips.push('Waterproof footwear keeps adventures comfy');
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      icon = 'snow';
      label = 'Snowy';
      headline = 'Snow in the air — layer up and mind traction';
      tips.push('Consider traction aids on slippery paths');
    } else if (code >= 95 && code <= 99) {
      icon = 'storm';
      label = 'Thunderstorms';
      headline = 'Thunder nearby — seek indoor attractions when possible';
      tips.push('Avoid exposed ridgelines and tall solitary trees');
    }

    if (veryWindy) {
      tips.push('Strong winds — secure hats and loose items');
    } else if (windy) {
      tips.push('Breezy — a windbreaker can help');
    }

    if (hot) {
      tips.push('Sunscreen, hat, and extra water recommended');
    }
    if (cold) {
      tips.push('Insulating layers and gloves recommended');
    }

    if (!rainy && icon === 'cloudy') {
      tips.push('Diffused light — excellent conditions for photos');
    }

    return { icon, label, headline, tips };
  }
}

