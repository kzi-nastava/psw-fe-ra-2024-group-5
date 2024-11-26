import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceComponent } from './preference/preference.component';
import { PreferenceDialogComponent } from './preference-dialog/preference-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AppRatingFormComponent } from './app-rating-form/app-rating-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatChipsModule } from '@angular/material/chips';


import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TourReviewFormComponent } from '../marketplace/tour-review-form/tour-review-form.component';
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { AddFundsDialogComponent } from './add-funds-dialog/add-funds-dialog.component';


@NgModule({
  declarations: [
    PreferenceComponent,
    PreferenceDialogComponent,
    AppRatingFormComponent,
    ShoppingCartComponent,
    TourReviewFormComponent,
    AddFundsDialogComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    TourAuthoringModule,
    MatChipsModule
],
  exports: [
    PreferenceComponent,
    AppRatingFormComponent,
    AddFundsDialogComponent
  ]
})
export class MarketplaceModule { }
