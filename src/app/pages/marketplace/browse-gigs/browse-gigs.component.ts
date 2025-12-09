import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../services/mock-data.service';
import { Gig } from '../../../models/hive-data.models';
import { LucideAngularModule, Star, Plus, Search, MapPin, Clock, Briefcase } from 'lucide-angular';

@Component({
  selector: 'app-browse-gigs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './browse-gigs.component.html',
  styleUrl: './browse-gigs.component.css',
})
export class BrowseGigsComponent implements OnInit {
  protected readonly Star = Star;
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  protected readonly MapPin = MapPin;
  protected readonly Clock = Clock;
  protected readonly Briefcase = Briefcase;

  gigs = signal<Gig[]>([]);
  filteredGigs = signal<Gig[]>([]);
  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');
  loading = signal(true);

  categories = ['All', 'Academic', 'Creative', 'Tech', 'Physical'];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadGigs();
  }

  loadGigs(): void {
    this.loading.set(true);
    this.mockDataService.getGigs().subscribe({
      next: (data: Gig[]) => {
        this.gigs.set(data);
        this.applyFilters();
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
    this.applyFilters();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.gigs();

    // Filter by category
    if (this.selectedCategory() !== 'All') {
      filtered = filtered.filter((gig) => gig.category === this.selectedCategory());
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (gig) =>
          gig.title.toLowerCase().includes(query) ||
          gig.description.toLowerCase().includes(query) ||
          gig.provider.name.toLowerCase().includes(query)
      );
    }

    this.filteredGigs.set(filtered);
  }

  formatRate(gig: Gig): string {
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
}
