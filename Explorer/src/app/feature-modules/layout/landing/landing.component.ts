import { Component } from '@angular/core';

@Component({
  selector: 'xp-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  recommendedTours: Object[] = [{}];
  recommendedBlogs: Object[] = [{}];
}
