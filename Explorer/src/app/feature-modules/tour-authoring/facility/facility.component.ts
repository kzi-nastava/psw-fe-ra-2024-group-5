import { Component, ViewChild  } from '@angular/core';
import { Facility } from 'src/app/shared/model/facility';
import { FacilityService } from '../facility.service';
import { MatDialog } from '@angular/material/dialog';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css'],
})
export class FacilityComponent {
  facilities: Facility[];
  displayedColumns: string[] = ['name', 'description', 'type', 'latitude', 'longitude', 'update'];
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  facilityTypes: string[] = ['Wc', 'Restaurant', 'Parking', 'Other'];
  
  showOnMap: boolean = false;

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
    this.showOnMap = false;

    const dialogRef = this.dialog.open(FacilityDialogComponent, {
      width: '600px',
      data: {selectedFacility : null}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result)
        this.loadFacilities();
    });
  }

  onUpdate(facility: Facility): void {
    this.showOnMap = false;

    const dialogRef = this.dialog.open(FacilityDialogComponent, {
      width: '600px',
      data: {selectedFacility : facility}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result)
        this.loadFacilities();
    });
  }
}
