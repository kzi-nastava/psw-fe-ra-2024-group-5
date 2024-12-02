import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private activeFilterSubject = new BehaviorSubject<number | null>(null); // Čuvamo ID aktivnog filtera
  activeFilter$ = this.activeFilterSubject.asObservable();

  setActiveFilter(filterId: number): void {
    this.activeFilterSubject.next(filterId);
  }

  clearFilter(): void {
    this.activeFilterSubject.next(null);
  }
}
