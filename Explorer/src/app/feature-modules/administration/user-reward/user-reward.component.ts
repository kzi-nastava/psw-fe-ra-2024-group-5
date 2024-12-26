import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { UserRewardService } from '../user-reward.service';
import { UserReward } from '../model/user-reward.model';
import { PrizeWheelComponent } from 'src/app/shared/prize-wheel/prize-wheel.component';
import { PrizeSection } from 'src/app/shared/model/prize-section.model';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { Coupon } from '../../marketplace/model/coupon.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { ShoppingCartService } from '../../marketplace/shopping-cart/shopping-cart.service';

@Component({
  selector: 'xp-user-reward',
  templateUrl: './user-reward.component.html',
  styleUrls: ['./user-reward.component.css']
})
export class UserRewardComponent {

  rewards = [
    { name: '50 XP', image: 'assets/images/xp.png', claimable: false, claimed: false },
    { name: '50 AC', image: 'assets/images/coins.png', claimable: false, claimed: false },
    { name: 'Spin the wheel!', image: 'assets/images/wheel.png', claimable: false, claimed: false },
    { name: '100 XP', image: 'assets/images/xp.png', claimable: false, claimed: false },
    { name: '100 AC', image: 'assets/images/coins.png', claimable: false, claimed: false },
    { name: '200 AC', image: 'assets/images/coins.png', claimable: false, claimed: false },
    { name: 'Spin the wheel!', image: 'assets/images/wheel.png', claimable: false, claimed: false }
  ];

  sections: PrizeSection[] = [
    { id: 2, label: '50AC', color: '#4BC0C0' },
    { id: 2, label: '50AC', color: '#4BC0C0' },
    { id: 4, label: 'Coupon', color: '#FF9F40'  },
    { id: 1, label: '50XP', color: '#FF6384' },
    { id: 1, label: '50XP', color: '#FF6384' },
    { id: 4, label: 'Coupon', color: '#FF9F40' },
    { id: 3, label: '100AC', color: '#36A2EB'  },
    { id: 3, label: '100AC', color: '#36A2EB' },
    { id: 5, label: 'Free tour', color: '#FFCE56' }
  ];

  userReward: UserReward;
  showWheel: boolean = false;

  tour: Tour;
  coupon: Coupon;
  tourName: string;

  selectedPrize: PrizeSection | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userReward: any },
  private dialogRef: MatDialogRef<UserRewardComponent>,
  private rewardService: UserRewardService) {
    this.userReward = data.userReward;
  }

  ngOnInit(): void{
    if(this.userReward.canBeClaimed)
      this.rewards[this.userReward.rewardStreak].claimable = true

    this.rewards.forEach((reward, index) => {
      if (index < this.data.userReward.rewardStreak) {
        reward.claimed = true;
      }
    });
  }

  claimReward(): void{
    if(this.userReward.rewardStreak !== 2 && this.userReward.rewardStreak !== 6){
      this.rewardService.claimDailyReward(this.data.userReward.id).subscribe({
        next: () => {
          this.dialogRef.close()
        },
        error: () => {
          console.log('Reward claim failed')
        }
      })
    }
   else{
    this.showWheel = true
   }
    
  }

  onPrizeSelected(prize: PrizeSection) {
    this.selectedPrize = prize;
    this.rewardService.claimWheelOfFortune(this.userReward.id, this.selectedPrize.id).subscribe(
      claimedReward => {
        console.log(claimedReward)
      }
    )
  }

  closeDialog():void{
    this.dialogRef.close()
  }
}
