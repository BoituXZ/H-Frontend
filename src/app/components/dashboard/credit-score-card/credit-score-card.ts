import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-credit-score-card',
  imports: [CommonModule],
  templateUrl: './credit-score-card.html',
  styleUrl: './credit-score-card.css',
  animations: [
    trigger('scoreAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class CreditScoreCard implements OnInit {
  @Input() creditScore: number = 0;
  @Input() tier: string = 'Bronze';
  @Input() level: string = 'Builder';
  @Input() nextTierScore: number = 700;

  animatedScore = signal(0);
  progress = signal(0);
  circumference = 2 * Math.PI * 70; // radius = 70

  ngOnInit() {
    this.animateScore();
    this.calculateProgress();
  }

  animateScore() {
    const duration = 2000;
    const steps = 60;
    const increment = this.creditScore / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= this.creditScore) {
        this.animatedScore.set(this.creditScore);
        clearInterval(interval);
      } else {
        this.animatedScore.set(Math.floor(current));
      }
    }, duration / steps);
  }

  calculateProgress() {
    const tierRanges: Record<string, { min: number; max: number }> = {
      Bronze: { min: 300, max: 699 },
      Silver: { min: 700, max: 799 },
      Gold: { min: 800, max: 900 },
    };

    const range = tierRanges[this.tier] || tierRanges['Bronze'];
    const scoreInRange = this.creditScore - range.min;
    const rangeSize = range.max - range.min;
    const percentage = (scoreInRange / rangeSize) * 100;

    this.progress.set(Math.min(Math.max(percentage, 0), 100));
  }

  getStrokeDashoffset(): number {
    return this.circumference - (this.progress() / 100) * this.circumference;
  }

  getTierColor(): string {
    const colors: Record<string, string> = {
      Bronze: '#CD7F32',
      Silver: '#C0C0C0',
      Gold: '#FFD700',
    };
    return colors[this.tier] || colors['Bronze'];
  }
}
