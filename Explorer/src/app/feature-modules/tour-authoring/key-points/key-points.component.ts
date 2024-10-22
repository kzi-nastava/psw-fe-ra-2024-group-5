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
  displayedColumns: string[] = ['name', 'description', 'image']
  @Input() coordinates: number[] | null = null;
  @Input() isTourBeingCreated: boolean = false;
  @Output() cancel = new EventEmitter<any>();
  @ViewChild(MatTable) table: MatTable<KeyPoint>;

  constructor(private tourAuthoringService: TourAuthoringService, 
              public dialog: MatDialog) {} // Ubrizgavanje zavisnosti

  ngOnInit(): void {
    if(this.isTourBeingCreated)
      return;
    this.tourAuthoringService.getPaged(12).subscribe(
      (data) => {                                      // Aktivira se ako je HTTP zahtev uspesan
        this.keyPoints = data.results;                          // Smesta entitete u entities polje TS klase, kako bi bili dostupni u HTMLu
      },
      (error) => {                                      // Aktivira se ako je doslo do greske
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
        return;
      }
      console.log(result);
      this.keyPoints.push(result);
      this.table.renderRows();
      console.log(this.keyPoints)
    });
  }

  saveKeyPoints(tourId: number){
    console.log(tourId);
    this.keyPoints.forEach(element => {
      element.tourId = tourId;
    });
    this.tourAuthoringService.saveKeyPoints(this.keyPoints, tourId).subscribe(
      (data) => {
        console.log(data);
        this.keyPoints =[];
        this.table.renderRows();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
 