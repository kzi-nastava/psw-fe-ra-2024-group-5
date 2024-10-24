import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceComponent } from './preference/preference.component';
import { PreferenceDialogComponent } from './preference-dialog/preference-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRatingFormComponent } from './app-rating-form/app-rating-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
  declarations: [
    PreferenceComponent,
    PreferenceDialogComponent,
    AppRatingFormComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MaterialModule,
    MatOptionModule,
    ReactiveFormsModule,
    
  ],
  exports: [
    PreferenceComponent,
    AppRatingFormComponent,
  ]
})
export class MarketplaceModule { }
