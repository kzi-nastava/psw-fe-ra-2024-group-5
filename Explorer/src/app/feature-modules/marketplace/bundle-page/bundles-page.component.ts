import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BundleCard, BundleDetailed } from '../model/bundle.models';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { MarketplaceService } from '../marketplace.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { BundleStatus } from '../model/bundle.models';

@Component({
  selector: 'xp-bundles-page',
  templateUrl: './bundles-page.component.html',
  styleUrls: ['./bundles-page.component.css']
})
export class BundlesPageComponent {
  bundles : BundleCard[] = [];
  detailedBundles : BundleDetailed[] = [];
  currentPage = 1;
  user!: User;
  isAuthorView = false;

  constructor(private marketplaceService : MarketplaceService, private tourService : TourAuthoringService, private router: Router, private authService: AuthService){
   // this.loadBundles();
  }
   ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isAuthorView = user.role === 'author';
      this.loadBundles();
    });
  }

  loadBundles(): void{
    this.bundles = [];
      if (this.isAuthorView) {
      this.marketplaceService.getBundlesByAuthor(this.user.id, this.currentPage, 6).subscribe({
        next: (detailedBundles) => {
          console.log('Author bundles response:', detailedBundles);
          this.processDetailedBundles(detailedBundles);
        },
        error: (err) => {
          console.error('Error loading author bundles:', err);
        }
      });
    } else {
      this.marketplaceService.getBundles(this.currentPage, 6).subscribe({
        next: (detailedBundles: BundleDetailed[]) => {
          console.log('Tourist bundles response:', detailedBundles);
          this.processDetailedBundles(detailedBundles);
        },
        error: (err) => {
          console.error('Error loading tourist bundles:', err);
        }
      });
    }
  }

  processDetailedBundles(detailedBundles: BundleDetailed[]): void {
    this.detailedBundles = detailedBundles;
    
    if (!detailedBundles || detailedBundles.length === 0) {
      console.log('No bundles found');
      return;
    }

    const tourRequests = detailedBundles.map(bundle => {
      console.log('Processing bundle:', bundle.id, 'with items:', bundle.bundleItems);
      
      if (!bundle.bundleItems || bundle.bundleItems.length === 0) {
        return new Promise<{ bundle: BundleDetailed; tours: TourCard[] }>((resolve) => {
          resolve({ bundle, tours: [] });
        });
      }
      return this.tourService.getBundleTours(bundle.bundleItems).toPromise()
        .then(tours => ({ bundle, tours: tours || [] }))
        .catch(err => {
          console.error('Error loading tours for bundle', bundle.id, err);
          return { bundle, tours: [] };
        });
    });

    Promise.all(tourRequests).then(results => {
      results.forEach(({ bundle, tours }) => {
        const bundleCard: BundleCard = {
          id: bundle.id,
          name: bundle.name,
          price: bundle.price,
          authorId: bundle.authorId,
          tours: tours,
          status: bundle.status
        };
        
        console.log('Created bundle card:', bundleCard);
        this.bundles.push(bundleCard);
      });
      
      console.log('Final bundles array:', this.bundles);
    });
  }

 archiveBundle(bundle: BundleCard): void {
  this.marketplaceService.archiveBundle(bundle.id, bundle.authorId).subscribe({
    next: () => bundle.status = BundleStatus.ARCHIVED,   
    error: (err) => console.error(err)
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

  onBundleDeleted(bundleId: number): void {
  this.bundles = this.bundles.filter(b => b.id !== bundleId);
}

}
