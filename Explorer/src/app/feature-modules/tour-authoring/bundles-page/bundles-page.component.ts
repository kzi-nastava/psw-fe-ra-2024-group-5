import { Component } from '@angular/core';
import { BundleCard, BundleDetailed } from '../model/bundle.models';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { TourCard } from '../model/tour-card.model';

@Component({
  selector: 'xp-bundles-page',
  templateUrl: './bundles-page.component.html',
  styleUrls: ['./bundles-page.component.css']
})
export class BundlesPageComponent {
  bundles : BundleCard[] = [];
  detailedBundles : BundleDetailed[] = [];
  currentPage = 1;

  constructor(private tourService: TourAuthoringService, private router: Router){
    this.loadBundles();
  }

  loadBundles(): void{
    this.tourService.getBundles(this.currentPage, 2).subscribe({
      next: (result: BundleDetailed[]) => {
        this.detailedBundles = result;
        // console.log(this.detailedBundles);
        for(let db of this.detailedBundles){
          // console.log(db);
          this.tourService.getBundleTours(db.bundleItems).subscribe({
            next: (result2: TourCard[]) => {
              console.log(result2);
              let tours : TourCard[] = result2;
              let bundleCard : BundleCard = {id : db.id, name : db.name, price: db.price, tours: tours};
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
