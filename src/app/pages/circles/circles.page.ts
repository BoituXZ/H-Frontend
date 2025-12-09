import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CircleCard } from '../../components/circle-card/circle-card';
import { CreateCircleModalComponent } from '../../shared/components/create-circle-modal/create-circle-modal';
import { CirclesService } from '../../services/circles.service';
import {
  LucideAngularModule,
  Plus,
} from 'lucide-angular';
import { Circle } from '../../models/circle.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-circles',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    PageHeaderComponent,
    CircleCard,
    CreateCircleModalComponent,
  ],
  templateUrl: './circles.page.html',
  styleUrl: './circles.page.css',
})
export class CirclesPage implements OnInit {
  private router = inject(Router);
  private circlesService = inject(CirclesService);

  protected readonly Plus = Plus;

  showCreateModal = signal(false);
  isLoading = signal(true);
  error = signal<string | null>(null);

  allCircles = signal<Circle[]>([]);

  activeCircles = signal<Circle[]>([]);
  completedCircles = signal<Circle[]>([]);

  ngOnInit(): void {
    this.loadCircles();
  }

  loadCircles(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.circlesService
      .getCircles()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (circles) => {
          this.allCircles.set(circles);
          this.activeCircles.set(
            circles.filter((c) => c.status !== 'completed'),
          );
          this.completedCircles.set(
            circles.filter((c) => c.status === 'completed'),
          );
        },
        error: () => {
          this.error.set('Failed to load circles. Please try again.');
        },
      });
  }

  onCreateCircle(): void {
    this.showCreateModal.set(true);
  }

  onCloseModal(): void {
    this.showCreateModal.set(false);
  }

  onCircleCreated(): void {
    this.showCreateModal.set(false);
    this.loadCircles();
  }

  onCircleClick(circleId: string): void {
    this.router.navigate(['/app/circles', circleId]);
  }
}
