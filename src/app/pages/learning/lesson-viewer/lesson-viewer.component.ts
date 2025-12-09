import { Component, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { LearningContent } from '../../../models/hive-data.models';
import { LucideAngularModule, ArrowLeft, Check, X } from 'lucide-angular';

@Component({
  selector: 'app-lesson-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './lesson-viewer.component.html',
  styleUrl: './lesson-viewer.component.css',
})
export class LessonViewerComponent implements OnInit, OnDestroy, AfterViewInit {
  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Check = Check;
  protected readonly X = X;

  @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef<HTMLDivElement>;

  content = signal<LearningContent | null>(null);
  loading = signal(true);
  showSuccess = signal(false);
  nextContent = signal<LearningContent | null>(null);

  // Typewriter effect state
  protected displayedContent = signal<string>('');
  protected isTyping = signal<boolean>(false);
  protected fullArticleContent = signal<string>('');
  private typingTimer: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
  ) {}

  ngOnInit(): void {
    // Route parameter is 'id', not 'contentId'
    const contentId = this.route.snapshot.paramMap.get('id');
    if (contentId) {
      this.loadContent(contentId);
    } else {
      console.error('No content ID found in route parameters');
      this.loading.set(false);
    }
  }

  ngAfterViewInit(): void {
    // Auto-scroll will be handled in the typing function
  }

  ngOnDestroy(): void {
    this.stopTyping();
  }

  loadContent(id: string): void {
    this.loading.set(true);
    this.displayedContent.set(''); // Reset displayed content
    this.isTyping.set(false);
    this.stopTyping();

    console.log('Loading content with ID:', id); // Debug log

    this.mockDataService.getLearningContentById(id).subscribe({
      next: (data: LearningContent | null) => {
        console.log('Content loaded:', data); // Debug log
        if (!data) {
          console.warn('No content found for ID:', id);
          this.loading.set(false);
          return;
        }

        this.content.set(data);
        this.loadNextContent(data);
        this.loading.set(false);

        // Start typewriter effect for article content
        if (data && data.type === 'article') {
          // Use setTimeout to ensure the view has updated
          setTimeout(() => {
            this.initializeArticleContent(data);
          }, 50);
        } else if (data && data.type === 'video') {
          // For video content, show description if available
          if (data.content && data.content.trim().length > 0) {
            this.displayedContent.set(data.content);
            this.fullArticleContent.set(data.content);
          } else {
            this.displayedContent.set('');
          }
        }
      },
      error: (err: any) => {
        console.error('Error loading content:', err);
        this.loading.set(false);
      },
    });
  }

  initializeArticleContent(lesson: LearningContent): void {
    // Get the full article content (currently hardcoded, but can be from API)
    const fullText = this.getArticleContent(lesson);
    
    if (!fullText || fullText.trim().length === 0) {
      console.warn('No article content found for lesson:', lesson.id);
      return;
    }
    
    this.fullArticleContent.set(fullText);
    this.displayedContent.set('');
    this.isTyping.set(true);
    
    // Start typing immediately with a small delay to ensure DOM is ready
    setTimeout(() => {
      if (this.isTyping()) {
        this.simulateTyping(fullText);
      }
    }, 100);
  }

  getArticleContent(lesson: LearningContent): string {
    // Use content from the lesson if available, otherwise return default placeholder
    if (lesson.content && lesson.content.trim().length > 0) {
      return lesson.content;
    }
    
    // Fallback placeholder content (should not be used if content is properly set)
    return `Content for ${lesson.title} is being prepared. Please check back soon.`;
  }

  simulateTyping(fullText: string): void {
    if (!fullText || fullText.length === 0) {
      this.isTyping.set(false);
      return;
    }

    let currentIndex = 0;
    const textLength = fullText.length;

    const typeNextChar = () => {
      if (currentIndex < textLength && this.isTyping()) {
        this.displayedContent.set(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        
        // Randomize typing speed between 20ms and 50ms
        const delay = Math.random() * 30 + 20;
        this.typingTimer = setTimeout(typeNextChar, delay);

        // Auto-scroll to bottom (less frequently to avoid performance issues)
        if (currentIndex % 10 === 0) {
          this.scrollToBottom();
        }
      } else {
        this.isTyping.set(false);
        // Final scroll when done
        this.scrollToBottom();
      }
    };

    // Start typing immediately
    typeNextChar();
  }

  stopTyping(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  showFullContent(): void {
    this.stopTyping();
    this.isTyping.set(false);
    this.displayedContent.set(this.fullArticleContent());
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      if (this.contentContainer) {
        const element = this.contentContainer.nativeElement;
        const articleText = element.querySelector('.article-text');
        
        if (articleText) {
          // Scroll the article text into view smoothly
          articleText.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          
          // Also scroll window if article is near bottom
          const rect = articleText.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const distanceFromBottom = windowHeight - rect.bottom;
          
          if (distanceFromBottom < 200) {
            window.scrollBy({ top: 100, behavior: 'smooth' });
          }
        }
      }
    }, 50);
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

  formatArticleContent(text: string): string {
    // Convert plain text to HTML paragraphs
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    return paragraphs.map(p => `<p class="article-paragraph">${p.trim().replace(/\n/g, '<br>')}</p>`).join('');
  }
}
