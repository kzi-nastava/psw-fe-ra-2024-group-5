import { Component, Input, OnInit } from '@angular/core';
import { Encounter } from '../model/encounter.model';

@Component({
  selector: 'xp-hidden-location-encounter',
  templateUrl: './hidden-location-encounter.component.html',
  styleUrls: ['./hidden-location-encounter.component.css']
})
export class HiddenLocationEncounterComponent {
  @Input() activatedEncounter: Encounter | null = null;
  @Input() userId: number | null = null;
  remainingTime: number = 30;
  progressValue: number = 0;
  isComplete: boolean = false;
  isTimerActive: boolean = false;
  private timerInterval: any;

  ngOnInit(): void {

  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.progressValue = ((30 - this.remainingTime) / 30) * 100;
      } else {
        this.completeTimer();
      }
    }, 1000);
  }

  private completeTimer() {
    this.clearTimer();
    this.progressValue = 100;
    this.isComplete = true;
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private resetTimer(){
    this.clearTimer();
    this.startTimer();
  }
}
