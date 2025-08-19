import { Component, OnInit } from '@angular/core';
import { Preference } from '../model/preference.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ChangeDetectorRef } from '@angular/core';
import { TourDifficulty } from '../enum/tour-difficulty.enum';
import { FilterService } from 'src/app/shared/service/filter.service';
import { forkJoin } from 'rxjs';

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
      // Deaktivacija
      this.service.deactivatePreference(preference.id).subscribe({
        next: (response) => {
          console.log(`Preference ${preference.id} deactivated`);
          // Lokalno ažuriranje umesto ponovnog učitavanja
          preference.isActive = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          // Proverava da li je HTTP status 200 uprkos grešci parsiranja
          if (err.status === 200) {
            console.log(`Preference ${preference.id} deactivated (text response)`);
            preference.isActive = false;
            this.cdr.detectChanges();
          } else {
            console.error('Error deactivating preference:', err);
          }
        }
      });
    } else {
      // Aktivacija - optimizovana verzija
      const activePreferences = this.preferences.filter(p => p.isActive && p.id !== preference.id);
      
      if (activePreferences.length > 0) {
        // Koristi forkJoin za paralelno izvršavanje deaktivacija
        const deactivationObservables = activePreferences.map(p => 
          this.service.deactivatePreference(p.id!)
        );

        forkJoin(deactivationObservables).subscribe({
          next: (responses) => {
            // Prvo lokalno ažuriraj deaktivirane
            activePreferences.forEach(p => p.isActive = false);
            
            // Zatim aktiviraj trenutnu
            this.service.activatePreference(preference.id!).subscribe({
              next: (response) => {
                console.log(`Preference ${preference.id} activated`);
                preference.isActive = true;
                this.cdr.detectChanges();
              },
              error: (err) => {
                // Proverava da li je HTTP status 200 uprkos grešci parsiranja
                if (err.status === 200) {
                  console.log(`Preference ${preference.id} activated (text response)`);
                  preference.isActive = true;
                  this.cdr.detectChanges();
                } else {
                  console.error('Error activating preference:', err);
                }
              }
            });
          },
          error: (err) => {
            // Ako je deaktivacija uspešna (status 200) uprkos parsing grešci
            if (err.status === 200) {
              activePreferences.forEach(p => p.isActive = false);
              // Nastavi sa aktivacijom
              this.service.activatePreference(preference.id!).subscribe({
                next: (response) => {
                  preference.isActive = true;
                  this.cdr.detectChanges();
                },
                error: (activationErr) => {
                  if (activationErr.status === 200) {
                    preference.isActive = true;
                    this.cdr.detectChanges();
                  }
                }
              });
            } else {
              console.error('Error during deactivation:', err);
            }
          }
        });
      } else {
        // Nema aktivnih preferencija, samo aktiviraj trenutnu
        this.service.activatePreference(preference.id!).subscribe({
          next: (response) => {
            console.log(`Preference ${preference.id} activated`);
            preference.isActive = true;
            this.cdr.detectChanges();
          },
          error: (err) => {
            // Proverava da li je HTTP status 200 uprkos grešci parsiranja
            if (err.status === 200) {
              console.log(`Preference ${preference.id} activated (text response)`);
              preference.isActive = true;
              this.cdr.detectChanges();
            } else {
              console.error('Error activating preference:', err);
            }
          }
        });
      }
    }
  }

  
  difficultyMap: { [key: number]: string } = {
    [TourDifficulty.Beginner]: 'BEGINNER',
    [TourDifficulty.Intermediate]: 'INTERMEDIATE',
    [TourDifficulty.Advanced]: 'ADVANCED'
  };

  
  
  
 
  
}  
