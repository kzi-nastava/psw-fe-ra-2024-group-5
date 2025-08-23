import { Injectable, EventEmitter } from '@angular/core';
import { TourCard } from '../model/tour-card.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesServiceService {

  private favorites: TourCard[] = [];
  favoritesChanged = new EventEmitter<void>(); // emitovaće promenu

  addFavorite(tour: TourCard): void {
    if (!this.favorites.find(t => t.id === tour.id)) {
      this.favorites.push(tour);
      this.favoritesChanged.emit();
    }
  }
  
  removeFavorite(tourId: number): void {
    this.favorites = this.favorites.filter(t => t.id !== tourId);
    this.favoritesChanged.emit();
  }  

  getFavorites(): TourCard[] {
    return this.favorites;
  }

  isFavorite(tourId: number): boolean {
    return this.favorites.some(t => t.id === tourId);
  }
}
