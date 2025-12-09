import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { CreditService } from '../../../services/credit.service';
import { LucideAngularModule, Info } from 'lucide-angular';

@Component({
  selector: 'app-create-gig',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './create-gig.component.html',
  styleUrl: './create-gig.component.css',
})
export class CreateGigComponent implements OnInit {
  protected readonly Info = Info;

  // Form fields
  title = signal('');
  description = signal('');
  category = signal('Academic');
  rate = signal<number>(0);
  rateType = signal<'hourly' | 'fixed'>('hourly');
  availability = signal('');

  // Credit score for tip widget
  creditScore = signal<number | null>(null);
  loadingCreditScore = signal(true);

  categories = ['Academic', 'Creative', 'Tech'];

  constructor(
    private router: Router,
    private creditService: CreditService,
  ) {}

  ngOnInit(): void {
    this.loadCreditScore();
  }

  loadCreditScore(): void {
    this.loadingCreditScore.set(true);
    this.creditService.getCreditScore().subscribe({
      next: (data) => {
        this.creditScore.set(data.score);
        this.loadingCreditScore.set(false);
      },
      error: (err) => {
        console.error('Error loading credit score:', err);
        this.loadingCreditScore.set(false);
      },
    });
  }

  onSubmit(): void {
    // TODO: Implement gig creation logic
    console.log('Creating gig:', {
      title: this.title(),
      description: this.description(),
      category: this.category(),
      rate: this.rate(),
      rateType: this.rateType(),
      availability: this.availability(),
    });
    // Navigate back to marketplace or show success message
    this.router.navigate(['/app/earn/marketplace']);
  }

  canSubmit(): boolean {
    return (
      this.title().trim().length > 0 &&
      this.description().trim().length > 0 &&
      this.rate() > 0 &&
      this.availability().trim().length > 0
    );
  }

  onCancel(): void {
    this.router.navigate(['/app/earn/marketplace']);
  }
}
