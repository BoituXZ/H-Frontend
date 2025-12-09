import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../services/mock-data.service';
import { BudgetProfile, BudgetAnalysis } from '../../../models/hive-data.models';
import { LucideAngularModule, Check, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-budget-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './budget-assistant.component.html',
  styleUrl: './budget-assistant.component.css',
})
export class BudgetAssistantComponent {
  protected readonly Check = Check;
  protected readonly AlertTriangle = AlertTriangle;

  // Form inputs
  totalIncome = signal<number>(0);
  rent = signal<number>(0);
  groceries = signal<number>(0);
  transport = signal<number>(0);
  utilities = signal<number>(0);
  entertainment = signal<number>(0);
  savingsGoal = signal<number>(0);

  // Analysis results
  analysis = signal<BudgetAnalysis | null>(null);
  loading = signal(false);
  hasAnalyzed = signal(false);

  constructor(private mockDataService: MockDataService) {}

  analyzeBudget(): void {
    const profile: BudgetProfile = {
      totalIncome: this.totalIncome(),
      rent: this.rent(),
      groceries: this.groceries(),
      transport: this.transport(),
      utilities: this.utilities(),
      entertainment: this.entertainment(),
      savingsGoal: this.savingsGoal(),
    };

    this.loading.set(true);
    this.hasAnalyzed.set(false);

    this.mockDataService.analyzeBudget(profile).subscribe({
      next: (result: BudgetAnalysis) => {
        this.analysis.set(result);
        this.loading.set(false);
        this.hasAnalyzed.set(true);
      },
      error: (err: any) => {
        console.error('Error analyzing budget:', err);
        this.loading.set(false);
      },
    });
  }

  getBreakdownPercentages() {
    const analysisData = this.analysis();
    const income = this.totalIncome();
    if (!analysisData || income === 0) return { needs: 0, wants: 0, savings: 0 };

    // Calculate percentages based on income
    const needsPercent = (analysisData.breakdown.needs / income) * 100;
    const wantsPercent = (analysisData.breakdown.wants / income) * 100;
    const savingsPercent = analysisData.breakdown.savings > 0
      ? (analysisData.breakdown.savings / income) * 100
      : 0;

    return {
      needs: Math.min(100, needsPercent),
      wants: Math.min(100, wantsPercent),
      savings: Math.min(100, savingsPercent),
    };
  }
}
