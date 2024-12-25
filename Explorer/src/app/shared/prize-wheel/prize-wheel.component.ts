import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrizeSection } from '../model/prize-section.model';

@Component({
  selector: 'xp-prize-wheel',
  templateUrl: './prize-wheel.component.html',
  styleUrls: ['./prize-wheel.component.css']
})
export class PrizeWheelComponent {
@Input() sections: PrizeSection[] = [
    { id: 1, label: 'Prize 1', color: '#FF6384' },
    { id: 2, label: 'Prize 2', color: '#36A2EB' },
    { id: 3, label: 'Prize 3', color: '#FFCE56' },
    { id: 4, label: 'Prize 4', color: '#4BC0C0' }
  ];
  @Input() maxSpins: number = Infinity;

  @Output() prizeSelected = new EventEmitter<number>();

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  currentRotation = 0;
  spinning = false;
  numberOfSpins: number = 0;

  ngAfterViewInit() {
    this.canvas = document.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.drawWheel();
    console.log(this.maxSpins)
  }

  drawWheel() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = 180;
    const sectionAngle = (2 * Math.PI) / this.sections.length;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sections.forEach((section, index) => {
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(
        centerX,
        centerY,
        radius,
        index * sectionAngle,
        (index + 1) * sectionAngle
      );
      this.ctx.closePath();

      this.ctx.fillStyle = section.color;
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(index * sectionAngle + sectionAngle / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '16px Arial';
      this.ctx.fillText(section.label, radius - 10, 5);
      this.ctx.restore();
    });
  }

  spin() {
    if (this.spinning || this.numberOfSpins == this.maxSpins) 
      return;
    
    this.numberOfSpins+= 1;
    this.spinning = true;
    const extraSpins = 10;
    const randomDegrees = Math.random() * 360;
    const totalDegrees = (360 * extraSpins) + randomDegrees;
    
    this.currentRotation += totalDegrees;
  }

  onSpinComplete() {
    this.spinning = false;
    const normalizedRotation = this.currentRotation % 360;
    const sectionAngle = 360 / this.sections.length;
    const sectionIndex = Math.floor(
      (360 + 270 - normalizedRotation) % 360 / sectionAngle
    );

    const topIndex = sectionIndex % this.sections.length
    console.log(sectionIndex)
    console.log(topIndex)

    this.prizeSelected.emit(this.sections[topIndex].id);
  }
}
