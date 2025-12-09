import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { MockDataService } from '../../../services/mock-data.service';
import { Booking } from '../../../models/hive-data.models';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent implements OnInit {
  protected readonly AlertCircle = AlertCircle;

  activeTab = signal<'customer' | 'provider'>('customer');
  customerBookings = signal<Booking[]>([]);
  providerBookings = signal<Booking[]>([]);
  loading = signal(true);

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);

    this.mockDataService.getMyBookings('customer').subscribe({
      next: (data: Booking[]) => {
        this.customerBookings.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading customer bookings:', err);
        this.loading.set(false);
      },
    });

    this.mockDataService.getMyBookings('provider').subscribe({
      next: (data: Booking[]) => {
        this.providerBookings.set(data);
      },
      error: (err: any) => {
        console.error('Error loading provider bookings:', err);
      },
    });
  }

  setActiveTab(tab: 'customer' | 'provider'): void {
    this.activeTab.set(tab);
  }

  getPendingRequests(): Booking[] {
    return this.providerBookings().filter((b) => b.status === 'pending');
  }

  getUpcomingBookings(): Booking[] {
    return this.providerBookings().filter((b) => b.status === 'confirmed');
  }

  contactProvider(bookingId: string): void {
    // TODO: Implement contact provider logic
    console.log('Contact provider for booking:', bookingId);
  }

  cancelRequest(bookingId: string): void {
    // TODO: Implement cancel request logic
    console.log('Cancel booking:', bookingId);
  }

  acceptRequest(bookingId: string): void {
    // TODO: Implement accept request logic
    console.log('Accept booking:', bookingId);
  }

  declineRequest(bookingId: string): void {
    // TODO: Implement decline request logic
    console.log('Decline booking:', bookingId);
  }

  markComplete(bookingId: string): void {
    // TODO: Implement mark complete logic
    console.log('Mark booking complete:', bookingId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
