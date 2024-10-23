import { Component, OnInit } from '@angular/core';
import { Preference } from '../model/preference.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  preferences: Preference[] = [];

  constructor(private service: MarketplaceService) { }
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
}
