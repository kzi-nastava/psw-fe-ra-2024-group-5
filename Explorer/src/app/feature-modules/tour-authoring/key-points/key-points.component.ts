import { Component } from '@angular/core';
import { KeyPoint } from '../model/key-point.model';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';

@Component({
  selector: 'xp-key-points',
  templateUrl: './key-points.component.html',
  styleUrls: ['./key-points.component.css']
})
export class KeyPointsComponent {
  keyPoints: KeyPoint[] = [];
  formVisible = false;
  displayedColumns: string[] = ['name', 'description', 'latitude', 'longitude', 'image'];

  openForm(){
    this.formVisible = true;
  }

  closeForm(){
    this.formVisible = false;
  }

  onKeyPointAdded(newKeyPoint: any){
    this.keyPoints.push({ ...newKeyPoint });
  }
}
