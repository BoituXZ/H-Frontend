import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CircleDetail,
  CircleMember,
  CircleTransaction,
  CircleVote,
} from '../models/circle.model';

@Injectable({
  providedIn: 'root',
})
export class CirclesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCircleById(id: string): Observable<CircleDetail> {
    if (environment.useMockData) {
      return of(this.getMockCircleDetail(id)).pipe(delay(800));
    }
    return this.http.get<CircleDetail>(`${this.apiUrl}/circles/${id}`);
  }

  submitVote(
    circleId: string,
    voteId: string,
    vote: 'yes' | 'no',
  ): Observable<{ success: boolean }> {
    if (environment.useMockData) {
      return of({ success: true }).pipe(delay(500));
    }
    return this.http.post<{ success: boolean }>(
      `${this.apiUrl}/circles/${circleId}/votes/${voteId}`,
      { vote },
    );
  }

  private getMockCircleDetail(id: string): CircleDetail {
    const mockMembers: CircleMember[] = [
      {
        id: '1',
        name: 'John Doe',
        initials: 'JD',
        role: 'admin',
        status: 'paid',
        position: 1,
        joinedDate: '2025-09-01',
        isCurrentUser: false,
      },
      {
        id: '2',
        name: 'Jane Smith',
        initials: 'JS',
        role: 'member',
        status: 'paid',
        position: 2,
        joinedDate: '2025-09-01',
        isCurrentUser: false,
      },
      {
        id: '3',
        name: 'You',
        initials: 'ME',
        role: 'member',
        status: 'paid',
        position: 3,
        joinedDate: '2025-09-01',
        isCurrentUser: true,
      },
      {
        id: '4',
        name: 'Mike Johnson',
        initials: 'MJ',
        role: 'member',
        status: 'pending',
        position: 4,
        joinedDate: '2025-09-01',
        isCurrentUser: false,
      },
      {
        id: '5',
        name: 'Sarah Williams',
        initials: 'SW',
        role: 'member',
        status: 'pending',
        position: 5,
        joinedDate: '2025-09-05',
        isCurrentUser: false,
      },
      {
        id: '6',
        name: 'David Brown',
        initials: 'DB',
        role: 'member',
        status: 'pending',
        position: 6,
        joinedDate: '2025-09-05',
        isCurrentUser: false,
      },
      {
        id: '7',
        name: 'Emily Davis',
        initials: 'ED',
        role: 'member',
        status: 'pending',
        position: 7,
        joinedDate: '2025-09-10',
        isCurrentUser: false,
      },
      {
        id: '8',
        name: 'Robert Taylor',
        initials: 'RT',
        role: 'member',
        status: 'pending',
        position: 8,
        joinedDate: '2025-09-10',
        isCurrentUser: false,
      },
    ];

    const mockTransactions: CircleTransaction[] = [
      {
        id: 't1',
        date: '2025-12-01',
        type: 'contribution',
        amount: 20,
        status: 'completed',
        memberId: '1',
        memberName: 'John Doe',
        description: 'Monthly contribution - Month 4',
      },
      {
        id: 't2',
        date: '2025-12-01',
        type: 'contribution',
        amount: 20,
        status: 'completed',
        memberId: '2',
        memberName: 'Jane Smith',
        description: 'Monthly contribution - Month 4',
      },
      {
        id: 't3',
        date: '2025-12-01',
        type: 'contribution',
        amount: 20,
        status: 'completed',
        memberId: '3',
        memberName: 'You',
        description: 'Monthly contribution - Month 4',
      },
      {
        id: 't4',
        date: '2025-12-01',
        type: 'payout',
        amount: 160,
        status: 'completed',
        memberId: '4',
        memberName: 'Mike Johnson',
        description: 'Monthly payout - Position 4',
      },
      {
        id: 't5',
        date: '2025-11-01',
        type: 'contribution',
        amount: 20,
        status: 'completed',
        memberId: '1',
        memberName: 'John Doe',
        description: 'Monthly contribution - Month 3',
      },
      {
        id: 't6',
        date: '2025-11-01',
        type: 'payout',
        amount: 160,
        status: 'completed',
        memberId: '3',
        memberName: 'You',
        description: 'Monthly payout - Position 3',
      },
      {
        id: 't7',
        date: '2025-10-01',
        type: 'contribution',
        amount: 20,
        status: 'completed',
        memberId: '2',
        memberName: 'Jane Smith',
        description: 'Monthly contribution - Month 2',
      },
      {
        id: 't8',
        date: '2025-10-01',
        type: 'payout',
        amount: 160,
        status: 'completed',
        memberId: '2',
        memberName: 'Jane Smith',
        description: 'Monthly payout - Position 2',
      },
    ];

    const mockVotes: CircleVote[] = [
      {
        id: 'v1',
        title: 'Exit Request: Sarah Williams',
        description:
          'Sarah has requested to exit the circle due to financial difficulties. Member vote required.',
        type: 'exit_request',
        deadline: '2025-12-15',
        yesVotes: 3,
        noVotes: 1,
        totalMembers: 8,
        hasVoted: false,
        status: 'active',
        createdDate: '2025-12-07',
        createdBy: 'Sarah Williams',
      },
      {
        id: 'v2',
        title: 'Increase Contribution Amount',
        description:
          'Proposal to increase monthly contribution from $20 to $25 starting next cycle.',
        type: 'rule_change',
        deadline: '2025-12-20',
        yesVotes: 2,
        noVotes: 0,
        totalMembers: 8,
        hasVoted: true,
        userVote: 'yes',
        status: 'active',
        createdDate: '2025-12-05',
        createdBy: 'John Doe',
      },
    ];

    return {
      id,
      name: 'MSU Squad',
      status: 'active',
      myPosition: 3,
      contributionAmount: 20,
      potValue: 160,
      cycle: {
        current: 4,
        total: 10,
        nextDueDate: '2025-12-10',
      },
      members: mockMembers,
      transactions: mockTransactions,
      votes: mockVotes,
      payoutTimeline: [
        {
          position: 1,
          memberId: '1',
          memberName: 'John Doe',
          amount: 160,
          date: '2025-09-01',
          status: 'completed',
        },
        {
          position: 2,
          memberId: '2',
          memberName: 'Jane Smith',
          amount: 160,
          date: '2025-10-01',
          status: 'completed',
        },
        {
          position: 3,
          memberId: '3',
          memberName: 'You',
          amount: 160,
          date: '2025-11-01',
          status: 'completed',
        },
        {
          position: 4,
          memberId: '4',
          memberName: 'Mike Johnson',
          amount: 160,
          date: '2025-12-01',
          status: 'completed',
        },
        {
          position: 5,
          memberId: '5',
          memberName: 'Sarah Williams',
          amount: 160,
          date: '2026-01-01',
          status: 'upcoming',
        },
        {
          position: 6,
          memberId: '6',
          memberName: 'David Brown',
          amount: 160,
          date: '2026-02-01',
          status: 'upcoming',
        },
        {
          position: 7,
          memberId: '7',
          memberName: 'Emily Davis',
          amount: 160,
          date: '2026-03-01',
          status: 'upcoming',
        },
        {
          position: 8,
          memberId: '8',
          memberName: 'Robert Taylor',
          amount: 160,
          date: '2026-04-01',
          status: 'upcoming',
        },
      ],
      createdDate: '2025-09-01',
      description: 'A monthly savings circle for MSU students and alumni',
    };
  }
}
