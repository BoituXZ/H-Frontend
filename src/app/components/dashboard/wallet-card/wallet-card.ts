import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Wallet {
  balance: number;
  isConnected: boolean;
}

@Component({
  selector: 'app-wallet-card',
  imports: [CommonModule],
  templateUrl: './wallet-card.html',
  styleUrl: './wallet-card.css',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class WalletCard {
  @Input() wallet: Wallet = { balance: 0, isConnected: false };
}
