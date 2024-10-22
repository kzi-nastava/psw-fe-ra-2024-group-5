import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceComponent } from './preference/preference.component';



@NgModule({
  declarations: [
    PreferenceComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PreferenceComponent
  ]
})
export class MarketplaceModule { }
