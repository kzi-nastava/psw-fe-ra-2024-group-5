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
  @Output() cancel = new EventEmitter<any>();
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
        this.cancel.emit();
        this.table.renderRows();
        return;
      }
      console.log(result);
      this.keyPoints.push(result);
      this.table.renderRows();
      console.log(this.keyPoints)
    });
  }

  // saveKeyPoints(tourId: number){
  //   console.log(tourId);
  //   this.keyPoints.forEach(element => {
  //     element.tourId = tourId;
  //   });
  //   this.tourAuthoringService.saveKeyPoints(this.keyPoints, tourId).subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.keyPoints =[];
  //       this.table.renderRows();
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  cancelKeyPoint() {
    //NE radi kako treba radi samo pop poslednjeg
    console.log(this.keyPoints)
    this.keyPoints.pop()
    console.log(this.keyPoints)
    this.cancel.emit();
    this.table.renderRows()
  }

  getKeyPoints(){
    return this.keyPoints;
  }
}
 