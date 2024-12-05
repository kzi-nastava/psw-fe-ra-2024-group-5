import { Component, Input, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourLeaderboard } from '../model/tour-leaderboard.model';

@Component({
  selector: 'xp-tour-leaderboard',
  templateUrl: './tour-leaderboard.component.html',
  styleUrls: ['./tour-leaderboard.component.css']
})
export class TourLeaderboardComponent implements OnInit {

  @Input({ required: true }) tourId: number

  leaderboard: TourLeaderboard | undefined

  displayedColumns: string[] = ['position', 'userName', 'time'];

  constructor(private tourService: TourAuthoringService) { }

  ngOnInit(): void {
    this.tourService.getLeaderboard(this.tourId).subscribe(
      (res) => this.leaderboard = res
    )
  }

  formatTime(time: string): string {
    const [timePart] = time.split(".");
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    const formattedParts: string[] = [];
    if (hours > 0) formattedParts.push(`${hours}h`);
    if (minutes > 0) formattedParts.push(`${minutes}m`);
    if (seconds > 0) formattedParts.push(`${seconds}s`);

    return formattedParts.join(" ");
  }

}
