import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BundleCard, BundleDetailed } from '../model/bundle.models';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { MarketplaceService } from '../marketplace.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

@Component({
  selector: 'xp-bundles-page',
  templateUrl: './bundles-page.component.html',
  styleUrls: ['./bundles-page.component.css']
})
export class BundlesPageComponent {
  bundles : BundleCard[] = [];
  detailedBundles : BundleDetailed[] = [];
  currentPage = 1;

  constructor(private marketplaceService : MarketplaceService, private tourService : TourAuthoringService, private router: Router){
    this.loadBundles();
  }

  loadBundles(): void{
    this.bundles = [];
    this.marketplaceService.getBundles(this.currentPage, 2).subscribe({
      next: (result: BundleDetailed[]) => {
        this.detailedBundles = result;
        // console.log(this.detailedBundles);
        for(let db of this.detailedBundles){
          // console.log(db);
          this.tourService.getBundleTours(db.bundleItems).subscribe({
            next: (result2: TourCard[]) => {
              console.log(result2);
              let tours : TourCard[] = result2;
              let bundleCard : BundleCard = {id : db.id, name : db.name, price: db.price, authorId: db.authorId, tours: tours, status: db.status};
              this.bundles.push(bundleCard)
            },
            error: () => {}
          });
        }
      },
      error: () => {}
    });
  }
  nextPage(): void {
    this.currentPage++;      
    this.loadBundles();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBundles();
    }
  }

  detailedBundle(bundle: BundleCard): void {
    this.router.navigate(['/bundle-detailed-view', bundle.id]);
  }
}
