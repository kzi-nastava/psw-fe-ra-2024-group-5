import { Component } from '@angular/core';
import { TourCard } from '../../model/tour-card.model';
import { FavoritesServiceService } from '../favorites-service.service';

@Component({
  selector: 'xp-favorites-page-component',
  templateUrl: './favorites-page-component.component.html',
  styleUrls: ['./favorites-page-component.component.css']
})
export class FavoritesPageComponentComponent {
  favorites: TourCard[] = [];

  constructor(private favoritesService: FavoritesServiceService) {}

  ngOnInit(): void {
    this.loadFavorites();
  
    // Pretplata da se osveži lista kad se promeni
    this.favoritesService.favoritesChanged.subscribe(() => {
      this.loadFavorites();
    });
  }
  
  loadFavorites(): void {
    this.favorites = this.favoritesService.getFavorites();
  }
}
