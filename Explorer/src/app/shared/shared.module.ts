import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrizeWheelComponent } from './prize-wheel/prize-wheel.component';


@NgModule({
  declarations: [
    MapComponent,
    PrizeWheelComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatCheckboxModule
  ],
  exports: [MapComponent,PrizeWheelComponent]
})
export class SharedModule { }
