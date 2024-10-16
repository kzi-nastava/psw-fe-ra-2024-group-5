import { Component } from '@angular/core';
import { Facility } from 'src/app/shared/model/facility';
import { FacilityService } from './facility.service';

@Component({
  selector: 'xp-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css'],
})
export class FacilityComponent {
  facilities: Facility[];
  displayedColumns: string[] = ['name', 'description', 'type', 'latitude', 'longitude'];

  constructor(private facilityService: FacilityService){
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
  
  }
}
