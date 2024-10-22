import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyPointsComponent } from './key-points/key-points.component';
import { KeyPointFormComponent } from './key-point-form/key-point-form.component';
import { TourComponent } from './tour/tour.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityComponent } from './facility/facility.component';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourCreationComponent } from './tour-creation/tour-creation.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { TourMapComponent } from './tour-map/tour-map.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    KeyPointsComponent,
    KeyPointFormComponent,
    TourComponent,
    FacilityComponent,
    FacilityDialogComponent,
    TourFormComponent,
    TourCreationComponent,
    TourEditComponent,
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
    TourComponent,
  ]
})
export class TourAuthoringModule { }
