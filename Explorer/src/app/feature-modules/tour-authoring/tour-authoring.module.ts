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
import { ToursAuthorPageComponent } from './tours-author-page/tours-author-page.component';
import { TourLeaderboardComponent } from './tour-leaderboard/tour-leaderboard.component';
import { BundlesPageComponent } from './bundles-page/bundles-page.component';
import { BundleCardComponent } from './bundle-card/bundle-card.component'; 
import {MatGridListModule} from '@angular/material/grid-list';

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
    TourCardComponent,
    ToursAuthorPageComponent,
    TourLeaderboardComponent,
    BundlesPageComponent,
    BundleCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SharedModule,
    FormsModule,
    MatGridListModule
  ],
  exports: [
    KeyPointsComponent,
    KeyPointFormComponent,
    TourComponent,
    TourCardComponent
  ]
})
export class TourAuthoringModule { }
