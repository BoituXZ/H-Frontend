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
  Star,
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Users,
} from 'lucide-angular';
import { Circle, CircleDetail } from '../../models/circle.model';
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

  // Icons
  protected readonly Plus = Plus;
  protected readonly Star = Star;
  protected readonly Calendar = Calendar;
  protected readonly TrendingUp = TrendingUp;
  protected readonly DollarSign = DollarSign;
  protected readonly ArrowRight = ArrowRight;
  protected readonly Users = Users;

  showCreateModal = signal(false);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Data Signals
  featuredCircle = signal<CircleDetail | null>(null);
  otherCircles = signal<Circle[]>([]);
  completedCircles = signal<Circle[]>([]);

  ngOnInit(): void {
    this.loadCircles();
  }

  loadCircles(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.featuredCircle.set(null);

    this.circlesService
      .getCircles()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (circles) => {
          const active = circles.filter((c) => c.status !== 'completed');
          const completed = circles.filter((c) => c.status === 'completed');
          
          this.completedCircles.set(completed);

          if (active.length > 0) {
            // Pick the first active circle as featured and fetch details
            const [first, ...rest] = active;
            this.otherCircles.set(rest);
            
            // Fetch full details for the featured circle
            this.circlesService.getCircleById(first.id).subscribe({
              next: (detail) => this.featuredCircle.set(detail),
              error: (err) => console.error('Failed to load featured circle details', err)
            });
          } else {
            this.otherCircles.set([]);
          }
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

  getFeaturedPotValue(circle: CircleDetail): number {
    return circle.contributionAmount * circle.maxMembers;
  }
}
