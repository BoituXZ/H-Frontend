import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, History, Link, Smartphone, Plus, Send, ArrowDown, Users, CheckCircle, Clock, XCircle } from 'lucide-angular';

interface WalletData {
  balance: number;
  lastUpdated: string; // ISO Date
  transactions: Array<{
    id: string;
    type: 'contribution' | 'payout' | 'deposit' | 'withdrawal' | 'gig_payment';
    description: string;
    amount: number; // Positive or negative
    date: string; // ISO
    status: 'completed' | 'pending' | 'failed';
  }>;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './wallet.page.html',
  styleUrl: './wallet.page.css',
})
export class WalletPage {
  // Icons
  protected readonly Wallet = Wallet;
  protected readonly ArrowUpRight = ArrowUpRight;
  protected readonly ArrowDownLeft = ArrowDownLeft;
  protected readonly RefreshCw = RefreshCw;
  protected readonly History = History;
  protected readonly Link = Link;
  protected readonly Smartphone = Smartphone;
  protected readonly Plus = Plus;
  protected readonly Send = Send;
  protected readonly ArrowDown = ArrowDown;
  protected readonly Users = Users;
  protected readonly CheckCircle = CheckCircle;
  protected readonly Clock = Clock;
  protected readonly XCircle = XCircle;
// ... rest of the file

  // Data
  data = signal<WalletData>({
    balance: 145.50,
    lastUpdated: new Date().toISOString(),
    transactions: [
      {
        id: '1',
        type: 'deposit',
        description: 'EcoCash Deposit',
        amount: 50.00,
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        status: 'completed'
      },
      {
        id: '2',
        type: 'contribution',
        description: 'Mukando Contribution',
        amount: -20.00,
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        status: 'completed'
      },
      {
        id: '3',
        type: 'gig_payment',
        description: 'Logo Design Payment',
        amount: 85.00,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        status: 'completed'
      },
      {
        id: '4',
        type: 'withdrawal',
        description: 'Cash Out to EcoCash',
        amount: -15.00,
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        status: 'completed'
      },
      {
        id: '5',
        type: 'payout',
        description: 'Circle Payout (Turn 3)',
        amount: 200.00,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        status: 'completed'
      }
    ]
  });

  getTransactionIcon(type: string): any {
    switch (type) {
      case 'deposit':
      case 'gig_payment':
      case 'payout':
        return ArrowDownLeft;
      case 'withdrawal':
      case 'contribution':
        return ArrowUpRight;
      default:
        return Wallet;
    }
  }

  getTransactionIconBg(type: string): string {
    switch (type) {
      case 'deposit':
      case 'gig_payment':
        return 'bg-green-100 text-green-600';
      case 'payout':
      case 'contribution': // Mukando related
        return 'bg-hive-100 text-hive-600'; // Blue for Mukando
      case 'withdrawal':
        return 'bg-honey-100 text-honey-600'; // Red for out
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
  
  // Specific override for icon shape if needed, but color is handled above.
  // Actually, 'contribution' usually means money leaving the wallet INTO the circle, so maybe red?
  // But spec says: "Mukando: Blue bg with users".
  
  getDisplayIcon(type: string): any {
     if (type === 'contribution' || type === 'payout') {
         return Users; // Mukando
     }
     if (type === 'deposit' || type === 'gig_payment') {
         return ArrowDownLeft;
     }
     if (type === 'withdrawal') {
         return ArrowUpRight;
     }
     return Wallet;
  }
  
  getDisplayIconClass(type: string): string {
      if (type === 'contribution' || type === 'payout') {
          return 'bg-hive-100 text-hive-600';
      }
      if (type === 'withdrawal' || (type === 'contribution' && false)) { // Keeping contribution blue as per spec hint "Mukando: Blue bg"
          return 'bg-honey-50 text-honey-600'; 
      }
      if (type === 'deposit' || type === 'gig_payment' || type === 'payout') {
          return 'bg-success-light text-success-dark';
      }
      return 'bg-gray-100 text-gray-600';
  }

  // Refined per "List Items" spec:
  // Incoming: Green bg with arrow-down-left.
  // Outgoing: Red bg with arrow-up-right.
  // Mukando: Blue bg with users.
  
  getSpecIcon(type: string): any {
      if (type === 'contribution' || type === 'payout') return Users;
      if (type === 'deposit' || type === 'gig_payment') return ArrowDownLeft;
      if (type === 'withdrawal') return ArrowUpRight;
      return Wallet;
  }

  getSpecIconClass(type: string): string {
      if (type === 'contribution' || type === 'payout') return 'bg-hive-100 text-hive-600';
      if (type === 'withdrawal') return 'bg-honey-50 text-honey-600';
      if (type === 'deposit' || type === 'gig_payment') return 'bg-success-light text-success-dark';
      return 'bg-gray-100 text-gray-600';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
