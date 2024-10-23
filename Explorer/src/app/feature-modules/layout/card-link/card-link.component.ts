import { Component, Input } from '@angular/core';

@Component({
  selector: 'xp-card-link',
  templateUrl: './card-link.component.html',
  styleUrls: ['./card-link.component.css']
})
export class CardLinkComponent {
  @Input() icon: string;
  @Input() routerLink: string[];
}
