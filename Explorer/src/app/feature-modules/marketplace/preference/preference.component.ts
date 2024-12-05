import { Component, OnInit } from '@angular/core';
import { Preference } from '../model/preference.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ChangeDetectorRef } from '@angular/core';
import { TourDifficulty } from '../enum/tour-difficulty.enum';
import { FilterService } from 'src/app/shared/service/filter.service';

@Component({
  selector: 'xp-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  preferences: Preference[] = [];

  constructor(private service: MarketplaceService, private cdr: ChangeDetectorRef, private filterService: FilterService) { }
  ngOnInit(): void {
    this.getPreference(); 
  }

  getPreference(): void {
    this.service.getPreference().subscribe({
      next: (result: PagedResults<Preference>) => {
        this.preferences = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onPreferenceToggled(): void {
    this.getPreference(); 
  }
  

  deletePreference(preference: Preference): void {
    if (preference.id === undefined) {
      console.error('Preference ID is undefined');
      return; 
    }
  
    this.service.deletePreference(preference.id).subscribe({
      next: () => {
        this.preferences = this.preferences.filter(p => p.id !== preference.id);
        console.log('Preference deleted');
      },
      error: (err) => {
        console.error('Error deleting preference:', err);
      }
    });
  }

  toggleActivation(preference: Preference): void {
    if (!preference.id) {
      console.error('Preference ID is undefined');
      return;
    }
    if (preference.isActive) {
      this.service.deactivatePreference(preference.id).subscribe({
        next: () => {
          console.log(`Preference ${preference.id} deactivated`);
          preference.isActive = false; 
        },
        error: (err) => {
          console.error('Error deactivating preference:', err);
        },
      });
    } else {
      const activePreferences = this.preferences.filter(p => p.isActive && p.id !== preference.id);
  
      const deactivateObservables = activePreferences.map(p => {
        if (p.id) {
          return this.service.deactivatePreference(p.id).subscribe({
            next: () => {
              console.log(`Preference ${p.id} deactivated`);
              p.isActive = false; 
            },
            error: (err) => {
              console.error(`Error deactivating preference ${p.id}:`, err);
            },
          });
        }
        return null;
      });
  
      this.service.activatePreference(preference.id).subscribe({
        next: () => {
          console.log(`Preference ${preference.id} activated`);
          preference.isActive = true; 
        },
        error: (err) => {
          console.error('Error activating preference:', err);
        },
        complete: () => {
          this.getPreference(); 
        },
      });
    }
  }
  
  difficultyMap: { [key: number]: string } = {
    [TourDifficulty.Beginner]: 'BEGINNER',
    [TourDifficulty.Intermediate]: 'INTERMEDIATE',
    [TourDifficulty.Advanced]: 'ADVANCED'
  };

  
  
 
  
}  
