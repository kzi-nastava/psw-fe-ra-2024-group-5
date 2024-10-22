import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourEquipmentService } from '../tour-equipment.service';
import { Equipment } from 'src/app/shared/model/equipment.model';

@Component({
  selector: 'xp-tour-equipment-dialog',
  templateUrl: './tour-equipment-dialog.component.html',
  styleUrls: ['./tour-equipment-dialog.component.css']
})

export class TourEquipmentDialogComponent {
	form: FormGroup;
	allEquipment: Equipment[] = [];
	selectedEquipment: Equipment[] = [];
	displayedColumns: string[] = ['select', 'name', 'description'];
	tourId: number = 1;

	constructor(
		public dialogRef: MatDialogRef<TourEquipmentDialogComponent>,
		private formBuilder: FormBuilder,
		private tourEquipmentService: TourEquipmentService
	) {

	}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			Equipment: ['', Validators.required]
		});

		this.tourEquipmentService.getAllEquipment().subscribe(res => {
			this.allEquipment = res.results;
		});
	}

	isSelected(equipment: Equipment): boolean {
		return this.selectedEquipment.includes(equipment);
	}

	toggleSelection(equipment: Equipment): void {
        const index = this.selectedEquipment.indexOf(equipment);
        if (index === -1) {
            this.selectedEquipment.push(equipment);
        } else {
            this.selectedEquipment.splice(index, 1);
        }
    }

	saveEquipment(): void {
		this.tourEquipmentService.saveTourEquipment(this.tourId, this.selectedEquipment).subscribe(() => {
			this.dialogRef.close();
		});
	}

	closeDialog(): void {
		this.dialogRef.close();
	}
}