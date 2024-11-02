import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from './tour-card/tour-card.component';
import { ToursPageComponent } from './tours-page/tours-page.component';


@NgModule({
  declarations: [
    TourCardComponent,
    ToursPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TourCardComponent,
  ]
})
export class TourTouristModule { }
