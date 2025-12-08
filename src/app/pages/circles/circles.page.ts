import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CircleCard } from '../../components/circle-card/circle-card';
import {
  LucideAngularModule,
  Plus,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  User,
  Check,
  Clock,
  ChevronDown,
  CheckCircle2,
  Award,
} from 'lucide-angular';

interface CircleSummary {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'forming';
  contributionAmount: number;
  frequency: 'weekly' | 'monthly';
  memberCount: number;
  maxMembers: number;
  userPosition: number;
  hasPaidOut: boolean;
  progress: {
    currentRound: number;
    totalRounds: number;
    percentage: number;
  };
  nextPayment?: {
    date: string;
    amount: number;
  };
  nextPayout?: {
    date: string;
    amount: number;
  };
}

interface CircleStats {
  totalContributed: number;
  activeCount: number;
  upcomingPayoutAmount: number;
}

@Component({
  selector: 'app-circles',
  imports: [CommonModule, LucideAngularModule, PageHeaderComponent, CircleCard],
  templateUrl: './circles.page.html',
  styleUrl: './circles.page.css',
})
export class CirclesPage {
  protected readonly Plus = Plus;
  protected readonly DollarSign = DollarSign;
  protected readonly Users = Users;
  protected readonly Calendar = Calendar;
  protected readonly CheckCircle = CheckCircle;
  protected readonly User = User;
  protected readonly Check = Check;
  protected readonly Clock = Clock;
  protected readonly ChevronDown = ChevronDown;
  protected readonly CheckCircle2 = CheckCircle2;
  protected readonly Award = Award;

  showCompleted = signal(false);

  stats: CircleStats = {
    totalContributed: 320,
    activeCount: 2,
    upcomingPayoutAmount: 160,
  };

  get featuredCircle(): CircleSummary | null {
    if (this.activeCircles.length === 0) return null;

    // Find circle with closest payment date
    const circlesWithPayment = this.activeCircles.filter(
      (c) => c.nextPayment?.date,
    );
    if (circlesWithPayment.length === 0) return null;

    return circlesWithPayment.reduce((closest, current) => {
      const closestDate = new Date(closest.nextPayment!.date).getTime();
      const currentDate = new Date(current.nextPayment!.date).getTime();
      return currentDate < closestDate ? current : closest;
    });
  }

  get regularCircles(): CircleSummary[] {
    if (!this.featuredCircle) return this.activeCircles;
    return this.activeCircles.filter((c) => c.id !== this.featuredCircle!.id);
  }

  activeCircles: CircleSummary[] = [
    {
      id: '1',
      name: 'MSU Hustlers',
      status: 'active',
      contributionAmount: 20,
      frequency: 'monthly',
      memberCount: 8,
      maxMembers: 10,
      userPosition: 3,
      hasPaidOut: false,
      progress: {
        currentRound: 4,
        totalRounds: 10,
        percentage: 40,
      },
      nextPayment: {
        date: '2024-12-10',
        amount: 20,
      },
    },
    {
      id: '2',
      name: 'Tech Savers',
      status: 'active',
      contributionAmount: 50,
      frequency: 'monthly',
      memberCount: 6,
      maxMembers: 8,
      userPosition: 2,
      hasPaidOut: true,
      progress: {
        currentRound: 6,
        totalRounds: 8,
        percentage: 75,
      },
      nextPayment: {
        date: '2024-12-15',
        amount: 50,
      },
      nextPayout: {
        date: '2024-12-25',
        amount: 400,
      },
    },
    {
      id: '4',
      name: 'Holiday Fund',
      status: 'active',
      contributionAmount: 100,
      frequency: 'monthly',
      memberCount: 4,
      maxMembers: 5,
      userPosition: 1,
      hasPaidOut: false,
      progress: {
        currentRound: 2,
        totalRounds: 5,
        percentage: 40,
      },
      nextPayment: {
        date: '2024-12-20',
        amount: 100,
      },
      nextPayout: {
        date: '2025-01-15',
        amount: 500,
      },
    },
    {
      id: '5',
      name: 'Family Savings',
      status: 'active',
      contributionAmount: 200,
      frequency: 'monthly',
      memberCount: 10,
      maxMembers: 12,
      userPosition: 5,
      hasPaidOut: false,
      progress: {
        currentRound: 3,
        totalRounds: 12,
        percentage: 25,
      },
      nextPayment: {
        date: '2024-12-22',
        amount: 200,
      },
    },
  ];

  completedCircles: CircleSummary[] = [
    {
      id: '3',
      name: 'Study Group Fund',
      status: 'completed',
      contributionAmount: 30,
      frequency: 'monthly',
      memberCount: 5,
      maxMembers: 5,
      userPosition: 4,
      hasPaidOut: true,
      progress: {
        currentRound: 5,
        totalRounds: 5,
        percentage: 100,
      },
      nextPayout: {
        date: '2024-10-15',
        amount: 150,
      },
    },
  ];

  toggleCompleted(): void {
    this.showCompleted.update((v) => !v);
  }

  getInitials(index: number): string {
    const initials = ['JD', 'SM', 'KL', 'AB', 'CD'];
    return initials[index - 1] || 'U';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  onCreateCircle(): void {
    // TODO: Implement circle creation logic
    console.log('Create circle clicked');
  }

  onCircleClick(circleId: string): void {
    // TODO: Navigate to circle details
    console.log('Circle clicked:', circleId);
  }
}
