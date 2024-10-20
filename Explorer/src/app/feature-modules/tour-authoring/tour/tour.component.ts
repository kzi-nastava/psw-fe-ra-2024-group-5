import { Component } from '@angular/core';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent {
  tours: Tour[] = [{id: 0, name: "Tura 1", description: "Opis 1", tag: "Nesto, nesto 2", level: "intermidiate", status: "ACtive", price: 1010.0, authorId: 1},
  {id: 1, name: "Tura 2", description: "Opis 2", tag: "Nesto 1, nesto 3", level: "Advanced", status: "Cancelled", price: 2200.0, authorId: 2}]
}
