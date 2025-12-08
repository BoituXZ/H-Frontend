import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LucideAngularModule, ArrowDownToLine } from 'lucide-angular';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './wallet.page.html',
  styleUrl: './wallet.page.css',
})
export class WalletPage {
  protected readonly ArrowDownToLine = ArrowDownToLine;

  onWithdraw(): void {
    // TODO: Implement withdraw logic
    console.log('Withdraw clicked');
  }
}
