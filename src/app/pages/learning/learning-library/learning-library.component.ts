import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { LearningContent } from '../../../models/hive-data.models';
import { CreditService } from '../../../services/credit.service';
import { LucideAngularModule, Check, BookOpen, Video } from 'lucide-angular';
import { BudgetAssistantComponent } from '../budget-assistant/budget-assistant.component';

@Component({
  selector: 'app-learning-library',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BudgetAssistantComponent],
  templateUrl: './learning-library.component.html',
  styleUrl: './learning-library.component.css',
})
export class LearningLibraryComponent implements OnInit {
  protected readonly Check = Check;
  protected readonly BookOpen = BookOpen;
  protected readonly Video = Video;

  activeTab = signal<'library' | 'budget' | 'progress'>('library');

  allContent = signal<LearningContent[]>([]);
  recommendedContent = signal<LearningContent[]>([]);
  filteredContent = signal<LearningContent[]>([]);
  selectedTier = signal<string>('All');
  loading = signal(true);
  creditScore = signal<number>(650);
  completedCount = signal<number>(12);
  totalPoints = signal<number>(60);

  tiers = ['All', 'Beginner', 'Growing', 'Established', 'Trusted'];

  constructor(
    private mockDataService: MockDataService,
    private creditService: CreditService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    // Load credit score
    this.creditService.getCreditScore().subscribe({
      next: (data) => {
        this.creditScore.set(data.score);
      },
      error: (err) => {
        console.error('Error loading credit score:', err);
      },
    });

    // Load learning content
    this.mockDataService.getLearningContent().subscribe({
      next: (data: LearningContent[]) => {
        this.allContent.set(data);
        // Recommended content: Established tier items that are not completed
        this.recommendedContent.set(
          data.filter(
            (item: LearningContent) => item.tier === 'Established' && !item.isCompleted,
          ),
        );
        this.filteredContent.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading learning content:', err);
        this.loading.set(false);
      },
    });
  }

  filterByTier(tier: string): void {
    this.selectedTier.set(tier);
    if (tier === 'All') {
      this.filteredContent.set(this.allContent());
    } else {
      this.filteredContent.set(
        this.allContent().filter((item) => item.tier === tier),
      );
    }
  }

  getContentIcon(type: 'article' | 'video') {
    return type === 'article' ? BookOpen : Video;
  }

  setActiveTab(tab: 'library' | 'budget' | 'progress'): void {
    if (tab === 'progress') {
      // Navigate to progress page
      this.router.navigate(['/app/learning/progress']);
    } else {
      this.activeTab.set(tab);
    }
  }
}
