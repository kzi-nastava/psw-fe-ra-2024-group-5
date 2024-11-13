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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourDetailedViewComponent } from './tour-view/tour-view.component';
import { ToursPageComponent } from './tours-page/tours-page.component';
import { TourCardComponent } from './tour-card/tour-card.component';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    KeyPointsComponent,
    KeyPointFormComponent,
    TourComponent,
    FacilityComponent,
    FacilityDialogComponent,
    TourFormComponent,
    TourCreationComponent,
    TourDetailedViewComponent,
    TourEquipmentDialogComponent,
    ToursPageComponent,
    TourCardComponent
    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    KeyPointsComponent,
    KeyPointFormComponent,
    TourComponent,
    TourCardComponent
  ]
})
export class TourAuthoringModule { }
