import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-circle-carousel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './circle-carousel.component.html',
  styleUrls: ['./circle-carousel.component.css']
})
export class CircleCarouselComponent {
  circles = [
    { name: 'Vacation Fund', progress: 75, balance: 1500, goal: 2000, color: 'bg-blue-500' },
    { name: 'New Car', progress: 40, balance: 8000, goal: 20000, color: 'bg-red-500' },
    { name: 'Emergency Fund', progress: 95, balance: 9500, goal: 10000, color: 'bg-green-500' },
    { name: 'Dream Gadgets', progress: 60, balance: 900, goal: 1500, color: 'bg-purple-500' }
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.circles.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.circles.length) % this.circles.length;
  }
}
