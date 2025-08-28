export interface UserReward {
    id: number,
    lastSession: Date,
    rewardStreak: number,
    lastRewardClaimed: Date,
    canBeClaimed: boolean,
}