import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { Gig } from '../../../models/hive-data.models';
import { LucideAngularModule, Star, ArrowLeft, MapPin, Clock, Award, CheckCircle, Calendar } from 'lucide-angular';

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
  protected readonly MapPin = MapPin;
  protected readonly Clock = Clock;
  protected readonly Award = Award;
  protected readonly CheckCircle = CheckCircle;
  protected readonly Calendar = Calendar;

  gig = signal<Gig | null>(null);
  loading = signal(true);
  hours = signal<number>(2);
  selectedDate = signal<string>('');

  totalCost = computed(() => {
    const gigData = this.gig();
    if (!gigData) return 0;
    if (gigData.rateType === 'fixed') {
      return gigData.rate;
    }
    return gigData.rate * this.hours();
  });

  depositAmount = computed(() => {
    return this.totalCost() / 2;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
  ) {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate.set(tomorrow.toISOString().split('T')[0]);
  }

  ngOnInit(): void {
    const gigId = this.route.snapshot.paramMap.get('gigId');
    if (gigId) {
      this.loadGig(gigId);
    }
  }

  loadGig(id: string): void {
    this.loading.set(true);
    this.mockDataService.getGigById(id).subscribe({
      next: (data: Gig | null) => {
        this.gig.set(data);
        if (data?.rateType === 'fixed') {
          this.hours.set(1);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading gig:', err);
        this.loading.set(false);
      },
    });
  }

  updateHours(value: number): void {
    if (value >= 1 && value <= 10) {
      this.hours.set(value);
    }
  }

  bookGig(): void {
    // TODO: Implement booking logic with payment
    console.log('Booking gig:', {
      gigId: this.gig()?.id,
      date: this.selectedDate(),
      hours: this.hours(),
      totalCost: this.totalCost(),
      depositAmount: this.depositAmount(),
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
      return `$${gig.rate.toFixed(2)}/hr`;
    }
    return `$${gig.rate.toFixed(2)}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getRatingArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}
