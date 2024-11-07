import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubComponent } from './club/club.component';
import { FormsModule } from '@angular/forms';
import { MyClubsComponent } from './my-clubs/my-clubs.component'; // Import FormsModule
import { RouterModule } from '@angular/router';
import { ClubPageComponent } from './club-page/club-page.component';

@NgModule({
  declarations: [
    ClubComponent,
    MyClubsComponent,
    ClubPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  exports: [
    ClubComponent,
    MyClubsComponent,
    ClubPageComponent
  ]
})
export class ClubModule { }
