import { Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA,} from '@angular/material/dialog';

@Component({
  selector: 'xp-encounter-managing-details',
  templateUrl: './encounter-managing-details.component.html',
  styleUrls: ['./encounter-managing-details.component.css']
})
export class EncounterManagingDetailsComponent {

constructor(@Inject(MAT_DIALOG_DATA) public data: any){}

}
