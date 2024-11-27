import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { EncounterService } from '../encounter.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { Encounter } from '../model/encounter.model';

@Component({
  selector: 'xp-encounter-details',
  templateUrl: './encounter-details.component.html',
  styleUrls: ['./encounter-details.component.css']
})
export class EncounterDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private encounterService: EncounterService,
              private tokenStorage: TokenStorage){}
  userId: number | null = this.tokenStorage.getUserId();

  @Output() startEncounter = new EventEmitter<any>();

  start(encounter: any){
    if(!this.userId)
      return;
    this.encounterService.startEncounter(encounter.id, this.userId, this.data.position).subscribe({
      next: (response) => {
        this.startEncounter.emit(response);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
