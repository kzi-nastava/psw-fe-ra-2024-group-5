import { Component, OnInit } from '@angular/core';
import { EquipmentManagementService } from '../equipment-management.service';
import { Equipment } from '../../administration/model/equipment.model';
import { AdministrationService } from '../../administration/administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.css']
})
export class EquipmentManagementComponent implements OnInit {

  equipmentList: Equipment[] = [];
  selectedEquipmentIds: number[] = [];
  touristId: number = 1;

  constructor(private administrationService: AdministrationService, private equipmentManagementService: EquipmentManagementService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user.role !== 'tourist') {
        console.error('Pristup dozvoljen samo turistima.');
        //this.router.navigate(['/home']);
      } else {
        this.loadEquipmentList();
        this.loadTouristEquipment();
      }
    });
  }

  loadEquipmentList(): void 
  {
    this.administrationService.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipmentList = result.results
      },
      error: (err) => {
        console.error('Error loading equipment', err);
      }
    })
  }

  loadTouristEquipment(): void 
  {
    this.equipmentManagementService.getTouristEquipment(this.touristId).subscribe({
      next: (result: PagedResults<Equipment>) => {
        console.log("API Response:", result);

        this.selectedEquipmentIds = result.results
        .map(equipment => equipment.id)
        .filter((id): id is number => id !== undefined);
      },
      error: (err) => {
        console.error('Error loading tourist equipments', err);
      }
    })
  }

  onEquipmentSelectionChange(equipmentId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    if (isChecked) {
      this.selectedEquipmentIds.push(equipmentId);
    } else {
      this.selectedEquipmentIds = this.selectedEquipmentIds.filter(id => id !== equipmentId);
    }
  }

  saveTouristEquipment(): void {
    console.log(this.touristId);
    console.log(this.selectedEquipmentIds);
    this.equipmentManagementService.updateTouristEquipment(this.touristId, this.selectedEquipmentIds).subscribe({
      next: (success: boolean) => {
        if (success) {
          alert('Tourist equipment updated successfully.');
          console.log('Tourist equipment updated successfully.');
        }
      },
      error: (err) => {
        console.error('Error updating tourist equipment', err);
      }
    });
  }

}
