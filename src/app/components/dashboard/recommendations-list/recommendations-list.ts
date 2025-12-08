import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

interface Recommendation {
  title: string;
  reward: number;
  type: 'gig' | 'sale';
}

@Component({
  selector: 'app-recommendations-list',
  imports: [CommonModule],
  templateUrl: './recommendations-list.html',
  styleUrl: './recommendations-list.css',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query(
          '.recommendation-item',
          [
            style({ opacity: 0, transform: 'translateX(-20px)' }),
            stagger(100, [
              animate(
                '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                style({ opacity: 1, transform: 'translateX(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class RecommendationsList {
  @Input() recommendations: Recommendation[] = [];

  getTypeIcon(type: string): string {
    return type === 'gig' ? '⚡' : '💰';
  }

  getTypeBg(type: string): string {
    return type === 'gig'
      ? 'bg-honey-100 text-honey-700'
      : 'bg-hive-100 text-hive-700';
  }
}
