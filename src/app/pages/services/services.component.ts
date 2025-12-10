import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { ServiceProduct } from '../../models/hive-data.models';
import {
  LucideAngularModule,
  Wifi,
  Zap,
  Phone,
  Bolt,
  Shield,
  Heart,
  PiggyBank,
  X,
  Wallet,
  Users,
} from 'lucide-angular';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

type ServiceCategory = 'Connect' | 'Utilities' | 'Security';
type PaymentSource = 'wallet' | 'circle';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeaderComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  private mockDataService = inject(MockDataService);

  // Icons
  protected readonly Wifi = Wifi;
  protected readonly Zap = Zap;
  protected readonly Phone = Phone;
  protected readonly Bolt = Bolt;
  protected readonly Shield = Shield;
  protected readonly Heart = Heart;
  protected readonly PiggyBank = PiggyBank;
  protected readonly X = X;
  protected readonly Wallet = Wallet;
  protected readonly Users = Users;

  activeTab = signal<ServiceCategory>('Connect');
  products = signal<ServiceProduct[]>([]);
  loading = signal(true);
  
  // Modal state
  showModal = signal(false);
  selectedProduct = signal<ServiceProduct | null>(null);
  paymentSource = signal<PaymentSource>('wallet');
  paymentSourceInput = signal<PaymentSource>('wallet');
  variableAmount = signal<number>(0);
  variableAmountInput = signal<number>(0);
  walletBalance = signal<number>(0);

  // Computed
  filteredProducts = computed(() => {
    return this.products().filter(p => p.category === this.activeTab());
  });

  ngOnInit(): void {
    this.loadProducts();
    this.loadWalletBalance();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.mockDataService.getServiceProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load services:', err);
        this.loading.set(false);
      },
    });
  }

  loadWalletBalance(): void {
    this.mockDataService.getWalletData().subscribe({
      next: (wallet) => {
        this.walletBalance.set(wallet.balance);
      },
    });
  }

  setActiveTab(tab: ServiceCategory): void {
    this.activeTab.set(tab);
  }

  openModal(product: ServiceProduct): void {
    this.selectedProduct.set(product);
    this.variableAmount.set(0);
    this.variableAmountInput.set(0);
    this.paymentSource.set('wallet');
    this.paymentSourceInput.set('wallet');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedProduct.set(null);
    this.variableAmount.set(0);
    this.variableAmountInput.set(0);
    this.paymentSource.set('wallet');
    this.paymentSourceInput.set('wallet');
  }

  protected updateVariableAmount(value: number): void {
    this.variableAmountInput.set(value);
    this.variableAmount.set(value);
  }

  protected updatePaymentSource(value: PaymentSource): void {
    this.paymentSourceInput.set(value);
    this.paymentSource.set(value);
  }

  getProviderColor(provider: ServiceProduct['provider']): string {
    const colors: Record<ServiceProduct['provider'], string> = {
      SmartFund: 'border-l-orange-500',
      EcoSure: 'border-l-blue-500',
      ZESA: 'border-l-green-500',
      Dura: 'border-l-purple-500',
    };
    return colors[provider] || 'border-l-gray-500';
  }


  getActionLabel(product: ServiceProduct): string {
    if (product.provider === 'Dura') {
      return 'Contribute';
    }
    return 'Buy Now';
  }

  canProceed(): boolean {
    const product = this.selectedProduct();
    if (!product) return false;
    
    if (product.price === 'Variable') {
      const minAmount = product.provider === 'ZESA' ? 5 : 1;
      return this.variableAmountInput() >= minAmount;
    }
    return true;
  }

  getTotalAmount(): number {
    const product = this.selectedProduct();
    if (!product) return 0;
    
    if (product.price === 'Variable') {
      return this.variableAmountInput();
    }
    return product.price as number;
  }

  processPayment(): void {
    const product = this.selectedProduct();
    if (!product || !this.canProceed()) return;

    const amount = this.getTotalAmount();
    const source = this.paymentSourceInput();
    
    // TODO: Implement actual payment processing
    console.log('Processing payment:', {
      product: product.name,
      amount,
      source,
    });

    // Simulate payment success
    alert(`Payment successful! ${product.name} has been activated.`);
    this.closeModal();
  }

  getPaymentSourceLabel(): string {
    const balance = this.walletBalance();
    if (this.paymentSourceInput() === 'wallet') {
      return `Wallet Balance ($${balance.toFixed(2)})`;
    }
    return 'Savings Circle Payout';
  }
}
