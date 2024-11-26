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
import { AppRatingDialogComponent } from './app-rating-form/app-rating-dialog/app-rating-dialog.component';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { AddFundsDialogComponent } from './add-funds-dialog/add-funds-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationDialogComponent } from '../../../assets/notifications/notification-dialog.component';

@NgModule({
  declarations: [
    PreferenceComponent,
    PreferenceDialogComponent,
    AppRatingFormComponent,
    AppRatingDialogComponent,
    ShoppingCartComponent,
    TourReviewFormComponent,
    NotificationDialogComponent,
    AddFundsDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MaterialModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    PreferenceComponent,
    AppRatingFormComponent,
    AddFundsDialogComponent
  ]
})
export class MarketplaceModule { }