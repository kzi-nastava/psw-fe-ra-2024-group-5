export interface ClaimedReward {
    tourId: number,
    tourName: string,
    image: string,
    couponId: number,
    code: string,
    percentage: number,
    expiredDate: Date
}