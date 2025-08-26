import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { WeatherChatComponent } from './weather-chat/weather-chat.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    MapComponent,
    WeatherChatComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatCheckboxModule
  ],
  exports: [MapComponent, WeatherChatComponent]
})
export class SharedModule { }
