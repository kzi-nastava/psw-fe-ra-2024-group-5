import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyPointsComponent } from './key-points/key-points.component';
import { KeyPointFormComponent } from './key-point-form/key-point-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityComponent } from './facility/facility.component';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TourMapComponent } from './tour-map/tour-map.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    KeyPointsComponent,
    KeyPointFormComponent,
    FacilityComponent,
    FacilityDialogComponent,
    TourMapComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    KeyPointsComponent,
    KeyPointFormComponent,
  ]
})
export class TourAuthoringModule { }
