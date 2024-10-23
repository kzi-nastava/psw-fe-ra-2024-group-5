import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LandingComponent } from './landing/landing.component';
import { CardLinkComponent } from './card-link/card-link.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LandingComponent,
    CardLinkComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent
  ]
})
export class LayoutModule { }
