import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, QrCode, Smartphone, ArrowRightLeft, ShieldCheck, Contact, Building2, Share2 } from 'lucide-angular';

interface TransactState {
  mode: 'pay' | 'receive';
  amount: number;
  recipient: string; // Phone or Merchant ID
  isLoading: boolean; // For the USSD trigger state
  myQrData: string; // The string to encode (e.g., "HIVE:26377123456")
}

@Component({
  selector: 'app-transact',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './transact.page.html',
  styleUrls: ['./transact.page.css']
})
export class TransactPage implements OnInit {
  // Icons for template
  readonly QrCode = QrCode;
  readonly Smartphone = Smartphone;
  readonly ArrowRightLeft = ArrowRightLeft;
  readonly ShieldCheck = ShieldCheck;
  readonly Contact = Contact;
  readonly Building2 = Building2;
  readonly Share2 = Share2;

  // Component state
  state: TransactState = {
    mode: 'pay',
    amount: 0,
    recipient: '',
    isLoading: false,
    myQrData: ''
  };

  // Payment mode toggle
  isPayBillMode: boolean = false;

  // Mock user data (replace with actual auth service)
  currentUser = {
    name: 'John Mutasa',
    phone: '+263771234567'
  };

  ngOnInit(): void {
    this.generateMyQrData();
  }

  /**
   * Switch between Pay and Receive tabs
   */
  switchMode(mode: 'pay' | 'receive'): void {
    this.state.mode = mode;
  }

  /**
   * Toggle between Send Money and Pay Merchant modes
   */
  togglePayBillMode(): void {
    this.isPayBillMode = !this.isPayBillMode;
    this.state.recipient = ''; // Clear recipient when switching
  }

  /**
   * Generate QR data string for receiving payments
   */
  generateMyQrData(): void {
    // Format: HIVE:263771234567 (remove + and spaces)
    const cleanPhone = this.currentUser.phone.replace(/[\s+]/g, '');
    this.state.myQrData = `HIVE:${cleanPhone}`;
  }

  /**
   * Get QR code URL using a QR code generation API
   */
  getQrCodeUrl(): string {
    // Using quickchart.io API for QR generation
    const encodedData = encodeURIComponent(this.state.myQrData);
    return `https://quickchart.io/qr?text=${encodedData}&size=250&margin=2`;
  }

  /**
   * Validate payment form
   */
  isPaymentValid(): boolean {
    return this.state.amount > 0 && this.state.recipient.trim().length > 0;
  }

  /**
   * Trigger EcoCash USSD payment
   */
  async triggerPayment(): Promise<void> {
    if (!this.isPaymentValid()) {
      alert('Please enter amount and recipient details');
      return;
    }

    this.state.isLoading = true;

    try {
      // Simulate USSD trigger API call
      // In production, this would call your backend which triggers EcoCash USSD push
      await this.mockUssdTrigger();

      alert(`Payment request sent!\nAmount: $${this.state.amount}\nRecipient: ${this.state.recipient}\n\nCheck your phone for EcoCash confirmation.`);

      // Reset form
      this.state.amount = 0;
      this.state.recipient = '';
    } catch (error) {
      alert('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Mock USSD trigger (replace with actual API call)
   */
  private mockUssdTrigger(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('USSD Push Triggered:', {
          amount: this.state.amount,
          recipient: this.state.recipient,
          type: this.isPayBillMode ? 'bill_payment' : 'send_money'
        });
        resolve();
      }, 1500);
    });
  }

  /**
   * Share payment link/QR
   */
  sharePaymentLink(): void {
    const shareText = `Pay me via HiveFund\nPhone: ${this.currentUser.phone}\n${this.state.myQrData}`;

    if (navigator.share) {
      navigator.share({
        title: 'My HiveFund Payment Details',
        text: shareText
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Payment details copied to clipboard!');
      });
    }
  }

  /**
   * Format amount display with currency
   */
  getFormattedAmount(): string {
    return this.state.amount > 0 ? `$${this.state.amount.toFixed(2)}` : '$0.00';
  }
}
