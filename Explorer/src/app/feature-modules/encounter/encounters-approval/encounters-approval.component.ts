import { Component, OnInit } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { MapService } from 'src/app/shared/map/map.service';

@Component({
  selector: 'xp-encounters-approval',
  templateUrl: './encounters-approval.component.html',
  styleUrls: ['./encounters-approval.component.css']
})
export class EncountersApprovalComponent implements OnInit {
  draftEncounters: Encounter[] = [];  
  encounterAddresses: { [id: number]: string } = {}; 

  constructor(private encounterService: EncounterService, private mapService: MapService) {}

  ngOnInit(): void {
    this.loadDraftEncounters();
  }

  loadDraftEncounters(): void {
    this.encounterService.getAllDraft().subscribe(
      (encounters) => {
        this.draftEncounters = encounters;
        this.draftEncounters.forEach((encounter) => {
          this.getAddress(encounter);
        });
      },
      (error) => {
        console.error('Error loading draft encounters', error);
      }
    );
  }

  acceptEncounter(id: number): void {
    this.encounterService.acceptEncounter(id).subscribe(
      () => {
        console.log('Encounter is accepted');
        this.loadDraftEncounters();  
      },
      (error) => {
        console.error('Error accepting encounter', error);
      }
    );
  }

  rejectEncounter(id: number): void {
    this.encounterService.rejectEncounter(id).subscribe(
      () => {
        console.log('Encounter is rejected');
        this.loadDraftEncounters();  
      },
      (error) => {
        console.error('Error rejectin encounter', error);
      }
    );
  }

  getAddress(encounter: Encounter): void {
    this.mapService.reverseSearch(encounter.location.latitude, encounter.location.longitude).subscribe(
      (response) => {
        if (response && response.address) {
          // Dodeljujemo adresu u objekat encounterAddresses po ID-u encountera
          this.encounterAddresses[encounter.id] = `${response.address.road} ${response.address.house_number ? ' ' + response.address.house_number : ''}, ${response.address.city}, ${response.address.country}`;
        } else {
          this.encounterAddresses[encounter.id] = 'Address not found';
        }
      },
      (error) => {
        console.error('Error getting address from coordinates', error);
      }
    );
  }
}
