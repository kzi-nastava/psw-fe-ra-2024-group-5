import { Component, OnInit } from '@angular/core';
import { KeyPoint } from '../model/key-point.model';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-key-points',
  templateUrl: './key-points.component.html',
  styleUrls: ['./key-points.component.css']
})
export class KeyPointsComponent implements OnInit {
  keyPoints: KeyPoint[] = [];
  displayedColumns: string[] = ['name', 'description', 'image']

  constructor(private tourAuthoringService: TourAuthoringService) {} // Ubrizgavanje zavisnosti

  ngOnInit(): void {
    this.tourAuthoringService.getPaged(1).subscribe(
      (data) => {                                      // Aktivira se ako je HTTP zahtev uspesan
        this.keyPoints = data.results;                          // Smesta entitete u entities polje TS klase, kako bi bili dostupni u HTMLu
      },
      (error) => {                                      // Aktivira se ako je doslo do greske
        console.error('Greška pri učitavanju podataka:', error);
      }
    );
  }
}
