import { Component } from '@angular/core';
import { KeyPoint } from '../model/key-point.model';
import { PublishedTour } from '../model/published-tour.model';
@Component({
  selector: 'xp-published-tour',
  templateUrl: './published-tour.component.html',
  styleUrls: ['./published-tour.component.css']
})

export class PublishedTourComponent {
  tours: PublishedTour[] = [
    {
      id: 1,
      name: 'Tura 1',
      description: 'Opis ture 1',
      tags: 'tag1, tag2',
      level: 1,
      status: 1,
      price: { amount: 100, currency: 1 },
      authorId: 1,
      keyPoints: [
        {
          latitude: 44.7866,
          longitude: 20.4489,
          name: 'Ključna tačka 1',
          description: 'Opis ključne tačke 1'
        },
        {
          latitude: 44.8176,
          longitude: 20.4633,
          name: 'Ključna tačka 2',
          description: 'Opis ključne tačke 2'
        }
      ],
      transport: 1,
      length: 5,
      duration: 2,
      publishedTime: new Date(),
      archivedTime: new Date(0),
    },
    {
      id: 2,
      name: 'Tura 2',
      description: 'Opis ture 2',
      tags: 'tag3, tag4',
      level: 2,
      status: 1,
      price: { amount: 150, currency: 1 },
      authorId: 1,
      keyPoints: [
        {
          id: 3,
          latitude: 44.8176,
          longitude: 20.4633,
          name: 'Ključna tačka 3',
          description: 'Opis ključne tačke 3',
          image: 'url-do-slike3.jpg',
          tourId: 2,
        },
        {
          id: 4,
          latitude: 44.8355,
          longitude: 20.5469,
          name: 'Ključna tačka 4',
          description: 'Opis ključne tačke 4',
          image: 'url-do-slike4.jpg',
          tourId: 2,
        }
      ],
      transport: 2,
      length: 10,
      duration: 3,
      publishedTime: new Date(),
      archivedTime: new Date(0)
    }
  ];

  archiveTour(tour: PublishedTour) {
    console.log(`Arhiviranje ture: ${tour.name}`);
    tour.archivedTime = new Date(); 
    tour.status = 0; 
  }
}
