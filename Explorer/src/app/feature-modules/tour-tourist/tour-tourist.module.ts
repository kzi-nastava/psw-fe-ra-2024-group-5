import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from './tour-card/tour-card.component';
import { TourViewComponent } from './tour-view/tour-view.component';


@NgModule({
  declarations: [
    TourCardComponent,
    TourViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TourCardComponent,
  ]
})
export class TourTouristModule { }
