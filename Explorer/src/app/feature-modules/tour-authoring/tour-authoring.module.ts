import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyPointsComponent } from './key-points/key-points.component';
import { KeyPointFormComponent } from './key-point-form/key-point-form.component';
import { TourComponent } from './tour/tour.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityComponent } from './facility/facility.component';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { TourEquipmentDialogComponent } from './tour-equipment-dialog/tour-equipment-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourCreationComponent } from './tour-creation/tour-creation.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TourMapComponent } from './tour-map/tour-map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublishedTourComponent } from './published-tour/published-tour.component';

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
    TourEquipmentDialogComponent,
    TourMapComponent,
    PublishedTourComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SharedModule
  ],
  exports: [
    KeyPointsComponent,
    KeyPointFormComponent,
    TourComponent,
  ]
})
export class TourAuthoringModule { }
