import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompletedKeyPoint } from '../model/completed-key-point.model';
import { MatCard, MatCardHeader } from '@angular/material/card';

@Component({
  selector: 'xp-completed-key-point-details',
  templateUrl: './completed-key-point-details.component.html',
  styleUrls: ['./completed-key-point-details.component.css']
})
export class CompletedKeyPointDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<CompletedKeyPointDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompletedKeyPoint
  ) {}
}
