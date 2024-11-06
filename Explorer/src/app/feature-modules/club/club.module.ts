import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubComponent } from './club/club.component';
import { FormsModule } from '@angular/forms';
import { MyClubsComponent } from './my-clubs/my-clubs.component'; // Import FormsModule
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ClubComponent,
    MyClubsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  exports: [
    ClubComponent,
    MyClubsComponent
  ]
})
export class ClubModule { }
