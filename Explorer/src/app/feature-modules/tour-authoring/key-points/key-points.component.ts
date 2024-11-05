import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { KeyPoint } from '../model/key-point.model';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourAuthoringService } from '../tour-authoring.service';
import { KeyPointFormComponent } from '../key-point-form/key-point-form.component';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'xp-key-points',
  templateUrl: './key-points.component.html',
  styleUrls: ['./key-points.component.css']
})
export class KeyPointsComponent implements OnInit {
  keyPoints: KeyPoint[] = [];
  displayedColumns: string[] = ['name', 'description', 'image', 'deleteButton']
  @Input() coordinates: number[] | null = null;
  @Input() tourId: number | null = null;
  @Output() cancel = new EventEmitter<number[]>();
  @Output() displayKeyPoints = new EventEmitter<KeyPoint[]>();
  @ViewChild(MatTable) table: MatTable<KeyPoint>;

  constructor(private tourAuthoringService: TourAuthoringService, 
              public dialog: MatDialog) {} // Ubrizgavanje zavisnosti

  ngOnInit(): void {
    if(this.tourId == null)
      return;
    this.tourAuthoringService.getPaged(this.tourId).subscribe(
      (data) => {                                     
        this.keyPoints = data.results;         
        this.displayKeyPoints.emit(this.keyPoints);
      },
      (error) => {                                      
        console.error('Greška pri učitavanju podataka:', error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['coordinates'] && changes['coordinates'].currentValue) {
      console.log('dobio sam koordinate')
      this.openDialog();
    }
  }

  openDialog() {
    if(!this.coordinates)
      return;
    const dialogRef = this.dialog.open(KeyPointFormComponent, {
      width: '50%',
      data: {latitude: this.coordinates[0], longitude: this.coordinates[1]}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        this.cancel.emit([]);
        this.table.renderRows();
        return;
      }
      console.log(result);
      this.keyPoints.push(result);
      this.table.renderRows();
      console.log(this.keyPoints)
    });
  }

  resetkeyPoints(){

        this.keyPoints =[];
        this.table.renderRows();
  
  }

  deleteKeyPoint(kp: KeyPoint): void {
    // Log the keyPoints array before removal for debugging
    console.log('Before removal:', this.keyPoints);
  
    // Find the index of the keyPoint in the keyPoints array
    const index = this.keyPoints.findIndex(k => k === kp);
  
    // If the keyPoint exists in the array (index >= 0), remove it
    if (index !== -1) {
      this.keyPoints.splice(index, 1); // Remove 1 element at the found index
    }
  
    // Log the updated keyPoints array for debugging
    console.log('After removal:', this.keyPoints);
  
    // Emit cancel event (if necessary)
    this.cancel.emit([kp.latitude, kp.longitude]);
  
    // Re-render table (if using Angular Material Table, for example)
    this.table.renderRows();
  }
  

  getKeyPoints(){
    return this.keyPoints;
  }
}
 