import { Component, ViewChild  } from '@angular/core';
import { Facility } from 'src/app/shared/model/facility';
import { FacilityService } from '../facility.service';
import { MatDialog } from '@angular/material/dialog';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';
import { MapComponent } from 'src/app/shared/map/map.component';
import { MapService } from 'src/app/shared/map/map.service';

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
  facilityAddresses: { [key: number]: string } = {};
  
  showOnMap: boolean = false;

  constructor(
    private facilityService: FacilityService, 
    public dialog: MatDialog,
    private mapService: MapService
  ){
    this.loadFacilities()
  }

  loadFacilities(): void{
    this.facilityService.getFacilities(1,16).subscribe({
      next: (result: Facility[]) => {
        this.facilities = result;
        this.loadAddresses();
      },
      error: () => {}
    });
  }

  loadAddresses(): void {
    this.facilities.forEach(facility => {
      this.getAddress(facility);
    });
  }

  getAddress(facility: Facility): void {
    this.mapService.reverseSearch(facility.latitude, facility.longitude).subscribe(
      (response) => {
        if (response && response.display_name) {
          this.facilityAddresses[facility.id!] = response.display_name;
        } else {
          this.facilityAddresses[facility.id!] = 'Address not found';
        }
      },
      (error) => {
        console.error('Error getting address from coordinates', error);
        this.facilityAddresses[facility.id!] = 'Address not found';
      }
    );
  }

  getTypeIcon(type: number): string {
    switch(type) {
      case 0: return 'wc';
      case 1: return 'restaurant';
      case 2: return 'local_parking';
      case 3: default: return 'location_city';
    }
  }

  viewOnMap(facility: Facility): void {
    this.showOnMap = true;
    // You could add logic here to center the map on this specific facility
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
