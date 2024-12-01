interface LeaderboardEntry {
    position: number,
    userId: number,
    userName: string,
    profileImage: string | null,
    time: string
}

export interface TourLeaderboard {
    tourId: number,
    entries: LeaderboardEntry[]
}