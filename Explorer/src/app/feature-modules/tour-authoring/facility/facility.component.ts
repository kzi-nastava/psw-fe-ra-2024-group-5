import { Component } from '@angular/core';
import { Facility } from 'src/app/shared/model/facility';
import { FacilityService } from '../facility.service';
import { MatDialog } from '@angular/material/dialog';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';

@Component({
  selector: 'xp-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css'],
})
export class FacilityComponent {
  facilities: Facility[];
  displayedColumns: string[] = ['name', 'description', 'type', 'latitude', 'longitude'];

  constructor(private facilityService: FacilityService, public dialog: MatDialog){
    this.loadFacilities()
  }

  loadFacilities(): void{
    this.facilityService.getFacilities(1,16).subscribe({
      next: (result: Facility[]) => {
        this.facilities = result
      },
      error: () => {}
    });
  }

  openDialog(): void{
    const latitude = 10;  // First number
    const longitude = 10;

    const dialogRef = this.dialog.open(FacilityDialogComponent, {
      width: '600px',
      data: {latitude, longitude}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadFacilities();
    });
  }
}
