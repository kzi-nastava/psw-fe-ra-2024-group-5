import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DailyWeatherSummary } from '../service/weather.service';
import { WeatherNotifierService } from '../service/weather-notifier.service';

@Component({
  selector: 'xp-weather-chat',
  templateUrl: './weather-chat.component.html',
  styleUrls: ['./weather-chat.component.css']
})
export class WeatherChatComponent {
  @Input() visible = false;
  @Input() loading = false;
  @Input() summary: DailyWeatherSummary | null = null;
  @Output() closed = new EventEmitter<void>();

  constructor(public weatherNotifier: WeatherNotifierService) {}

  close(): void {
    this.closed.emit();
  }
}

