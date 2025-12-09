import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { LearningContent } from '../../../models/hive-data.models';
import { CreditService } from '../../../services/credit.service';
import {
  LucideAngularModule,
  Check,
  BookOpen,
  Video,
  Award,
  Lock,
  Zap,
  GraduationCap,
  CheckCircle,
  FileText,
  PlayCircle,
  Trophy
} from 'lucide-angular';
import { BudgetAssistantComponent } from '../budget-assistant/budget-assistant.component';

// Badge interface for gamification
interface Badge {
  id: string;
  name: string;
  icon: string;
  isUnlocked: boolean;
}

// Learning Data structure following Modern Fintech design system
interface LearningData {
  progress: {
    lessonsCompleted: number;
    points: number;
    currentRank: string;
  };
  badges: Array<{ id: string; name: string; icon: string; isUnlocked: boolean }>;
  recommended: Array<LearningContent>;
  library: {
    beginner: Array<LearningContent>;
    growing: Array<LearningContent>;
    established: Array<LearningContent>;
    trusted: Array<LearningContent>;
  };
}

@Component({
  selector: 'app-learning-library',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BudgetAssistantComponent],
  templateUrl: './learning-library.component.html',
  styleUrl: './learning-library.component.css',
})
export class LearningLibraryComponent implements OnInit {
  // Lucide icons
  protected readonly Check = Check;
  protected readonly BookOpen = BookOpen;
  protected readonly Video = Video;
  protected readonly Award = Award;
  protected readonly Lock = Lock;
  protected readonly Zap = Zap;
  protected readonly GraduationCap = GraduationCap;
  protected readonly CheckCircle = CheckCircle;
  protected readonly FileText = FileText;
  protected readonly PlayCircle = PlayCircle;
  protected readonly Trophy = Trophy;

  activeTab = signal<'library' | 'budget' | 'progress'>('library');

  allContent = signal<LearningContent[]>([]);
  recommendedContent = signal<LearningContent[]>([]);
  filteredContent = signal<LearningContent[]>([]);
  selectedTier = signal<string>('All');
  loading = signal(true);
  creditScore = signal<number>(650);
  completedCount = signal<number>(12);
  totalPoints = signal<number>(60);
  currentRank = signal<string>('Scholar');

  // Badges for gamification
  badges = signal<Badge[]>([
    { id: '1', name: 'First Lesson', icon: 'book-open', isUnlocked: true },
    { id: '2', name: 'Knowledge Seeker', icon: 'graduation-cap', isUnlocked: true },
    { id: '3', name: 'Point Master', icon: 'zap', isUnlocked: false },
    { id: '4', name: 'Scholar', icon: 'award', isUnlocked: true },
    { id: '5', name: 'Expert', icon: 'trophy', isUnlocked: false },
  ]);

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
    return type === 'article' ? this.FileText : this.PlayCircle;
  }

  getContentTypeLabel(type: 'article' | 'video'): string {
    return type === 'article' ? 'Article' : 'Video';
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
