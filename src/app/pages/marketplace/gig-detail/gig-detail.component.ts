import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { Gig } from '../../../models/hive-data.models';
import { LucideAngularModule, Star, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-gig-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './gig-detail.component.html',
  styleUrl: './gig-detail.component.css',
})
export class GigDetailComponent implements OnInit {
  protected readonly Star = Star;
  protected readonly ArrowLeft = ArrowLeft;

  gig = signal<Gig | null>(null);
  loading = signal(true);
  hours = signal<number>(1);
  showBookingSection = signal(true);

  totalCost = computed(() => {
    const gigData = this.gig();
    if (!gigData) return 0;
    if (gigData.rateType === 'fixed') {
      return gigData.rate;
    }
    return gigData.rate * this.hours();
  });

  // Mock reviews data
  reviews = [
    { name: 'John D.', rating: 5, comment: 'Excellent tutor, very patient and clear explanations.' },
    { name: 'Sarah M.', rating: 5, comment: 'Helped my child improve significantly in math.' },
    { name: 'Mike T.', rating: 4, comment: 'Good service, would recommend.' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
  ) {}

  ngOnInit(): void {
    const gigId = this.route.snapshot.paramMap.get('gigId');
    if (gigId) {
      this.loadGig(gigId);
    }
  }

  loadGig(id: string): void {
    this.loading.set(true);
    this.mockDataService.getGigById(id).subscribe({
      next: (data) => {
        this.gig.set(data);
        if (data?.rateType === 'fixed') {
          this.hours.set(1);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading gig:', err);
        this.loading.set(false);
      },
    });
  }

  updateHours(value: number): void {
    if (value >= 1 && value <= 5) {
      this.hours.set(value);
    }
  }

  bookGig(): void {
    // TODO: Implement booking logic
    console.log('Booking gig:', {
      gigId: this.gig()?.id,
      hours: this.hours(),
      totalCost: this.totalCost(),
    });
    // Navigate to bookings page or show success message
    this.router.navigate(['/app/earn/marketplace/bookings']);
  }

  goBack(): void {
    this.router.navigate(['/app/earn/marketplace']);
  }

  formatRate(gig: Gig | null): string {
    if (!gig) return '';
    if (gig.rateType === 'hourly') {
      return `$${gig.rate.toFixed(2)}/hour`;
    }
    return `$${gig.rate.toFixed(2)}/session`;
  }
}
