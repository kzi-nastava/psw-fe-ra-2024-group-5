import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceComponent } from './preference/preference.component';
import { PreferenceDialogComponent } from './preference-dialog/preference-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';


@NgModule({
  declarations: [
    PreferenceComponent,
    PreferenceDialogComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    
  ],
  exports: [
    PreferenceComponent
  ]
})
export class MarketplaceModule { }
