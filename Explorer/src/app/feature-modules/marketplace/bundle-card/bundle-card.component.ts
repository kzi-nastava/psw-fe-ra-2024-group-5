import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BundleCard } from '../model/bundle.models';

@Component({
  selector: 'xp-bundle-card',
  templateUrl: './bundle-card.component.html',
  styleUrls: ['./bundle-card.component.css'],
})
export class BundleCardComponent {
  @Input() bundleCard: BundleCard;
  @Input() itemCard: OrderItem | null = null;
  @Output() bundleSelected = new EventEmitter<number>();

  user: User | undefined;
  currencies: string[] = ['AC','e','$','rsd'];
  constructor(private authService: AuthService){}
    ngOnInit(): void {
      if(!this.bundleCard)
        return;

      this.authService.user$.subscribe(user => {
        this.user = user;
      });
  }

  viewMore(): void {
    this.bundleSelected.emit(this.bundleCard.id);
  }
}
