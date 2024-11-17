import { Component, OnInit, ViewChild } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { EncounterService } from '../encounter.service';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit{
  activeEncounters: Encounter[] = [];
  userId: number | null = null;

  @ViewChild(MapComponent) map: MapComponent;

  constructor(private tokenStorage: TokenStorage, private encounterService: EncounterService) {}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();

    if (this.userId !== null) {
      this.loadActiveEncounters();
    }
  }

  loadActiveEncounters(): void {
    
  }

}
