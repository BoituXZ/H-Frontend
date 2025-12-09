import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../services/mock-data.service';
import { Badge, LeaderboardEntry } from '../../../models/hive-data.models';
import { LucideAngularModule, Lock } from 'lucide-angular';

@Component({
  selector: 'app-my-progress',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './my-progress.component.html',
  styleUrl: './my-progress.component.css',
})
export class MyProgressComponent implements OnInit {
  protected readonly Lock = Lock;

  badges = signal<Badge[]>([]);
  leaderboard = signal<LeaderboardEntry[]>([]);
  loading = signal(true);

  // Stats
  lessonsCompleted = signal<number>(12);
  totalPoints = signal<number>(60);
  badgesUnlocked = computed(() => {
    return this.badges().filter((b) => b.isUnlocked).length;
  });

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.mockDataService.getBadges().subscribe({
      next: (data) => {
        this.badges.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading badges:', err);
        this.loading.set(false);
      },
    });

    this.mockDataService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard.set(data);
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
      },
    });
  }

  isCurrentUser(entry: LeaderboardEntry): boolean {
    return entry.userId === 'current-user';
  }
}
