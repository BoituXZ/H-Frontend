import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { LearningContent } from '../../../models/hive-data.models';
import { LucideAngularModule, ArrowLeft, Check } from 'lucide-angular';

@Component({
  selector: 'app-lesson-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './lesson-viewer.component.html',
  styleUrl: './lesson-viewer.component.css',
})
export class LessonViewerComponent implements OnInit {
  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Check = Check;

  content = signal<LearningContent | null>(null);
  loading = signal(true);
  showSuccess = signal(false);
  nextContent = signal<LearningContent | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
  ) {}

  ngOnInit(): void {
    const contentId = this.route.snapshot.paramMap.get('contentId');
    if (contentId) {
      this.loadContent(contentId);
    }
  }

  loadContent(id: string): void {
    this.loading.set(true);
    this.mockDataService.getLearningContentById(id).subscribe({
      next: (data: LearningContent | null) => {
        this.content.set(data);
        this.loadNextContent(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading content:', err);
        this.loading.set(false);
      },
    });
  }

  loadNextContent(currentContent: LearningContent | null): void {
    if (!currentContent) return;

    this.mockDataService.getLearningContent().subscribe({
      next: (allContent: LearningContent[]) => {
        const currentIndex = allContent.findIndex((c: LearningContent) => c.id === currentContent.id);
        if (currentIndex >= 0 && currentIndex < allContent.length - 1) {
          this.nextContent.set(allContent[currentIndex + 1]);
        }
      },
    });
  }

  markAsComplete(): void {
    const contentData = this.content();
    if (!contentData || contentData.isCompleted) return;

    this.mockDataService.markContentAsComplete(contentData.id).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.showSuccess.set(true);
          // Update local content
          this.content.set({ ...contentData, isCompleted: true });
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.showSuccess.set(false);
          }, 3000);
        }
      },
      error: (err: any) => {
        console.error('Error marking content as complete:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/app/learning']);
  }

  getMetadata(): string {
    const contentData = this.content();
    if (!contentData) return '';
    const readType = contentData.type === 'article' ? 'read' : 'watch';
    return `${contentData.duration} ${readType} • ${contentData.tier} tier • +${contentData.points} points`;
  }
}
