import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { UserRewardService } from '../user-reward.service';
import { UserReward } from '../model/user-reward.model';

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

  userReward: UserReward;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userReward: any },
  private dialogRef: MatDialogRef<UserRewardComponent>,
  private rewardService: UserRewardService) {
    this.userReward = data.userReward;

    if(data.userReward.canBeClaimed)
      this.rewards[data.userReward.rewardStreak].claimable = true

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
          console.log('Reward succesfully claimed')
        },
        error: () => {
          console.log('Reward claim failed')
        }
      })
    }
   else{
    console.log('spin tha weel')
   }
    
  }
}
