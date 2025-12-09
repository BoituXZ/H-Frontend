import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { Gig } from '../../../models/hive-data.models';
import { LucideAngularModule, Star, Plus } from 'lucide-angular';

@Component({
  selector: 'app-browse-gigs',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './browse-gigs.component.html',
  styleUrl: './browse-gigs.component.css',
})
export class BrowseGigsComponent implements OnInit {
  protected readonly Star = Star;
  protected readonly Plus = Plus;

  gigs = signal<Gig[]>([]);
  filteredGigs = signal<Gig[]>([]);
  selectedCategory = signal<string>('All');
  loading = signal(true);

  categories = ['All', 'Academic', 'Creative', 'Tech'];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadGigs();
  }

  loadGigs(): void {
    this.loading.set(true);
    this.mockDataService.getGigs().subscribe({
      next: (data: Gig[]) => {
        this.gigs.set(data);
        this.filteredGigs.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading gigs:', err);
        this.loading.set(false);
      },
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
    if (category === 'All') {
      this.filteredGigs.set(this.gigs());
    } else {
      this.filteredGigs.set(
        this.gigs().filter((gig) => gig.category === category),
      );
    }
  }

  formatRate(gig: Gig): string {
    if (gig.rateType === 'hourly') {
      return `$${gig.rate.toFixed(2)}/hour`;
    }
    return `$${gig.rate.toFixed(2)}/session`;
  }
}
