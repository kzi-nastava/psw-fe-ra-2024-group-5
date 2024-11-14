import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LandingComponent } from './landing/landing.component';
import { CardLinkComponent } from './card-link/card-link.component';
import { FooterComponent } from './footer/footer.component';
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationModule } from '../notification/notification.module';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LandingComponent,
    CardLinkComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TourAuthoringModule,
    SharedModule,
    NotificationModule
],
  exports: [
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ]
})
export class LayoutModule { }
