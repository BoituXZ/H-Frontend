import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { MockDataService } from '../../../services/mock-data.service';
import {
  Storefront,
  Product,
  Order,
  StorefrontAnalytics,
} from '../../../models/hive-data.models';
import {
  LucideAngularModule,
  ShoppingBag,
  Tag,
  BarChart2,
  Package,
  ExternalLink,
  Settings,
  Edit,
  Trash2,
  Image,
} from 'lucide-angular';

@Component({
  selector: 'app-manage-storefront',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './manage-storefront.component.html',
  styleUrl: './manage-storefront.component.css',
})
export class ManageStorefrontComponent implements OnInit {
  // Lucide icons
  protected readonly ShoppingBag = ShoppingBag;
  protected readonly Tag = Tag;
  protected readonly BarChart2 = BarChart2;
  protected readonly Package = Package;
  protected readonly ExternalLink = ExternalLink;
  protected readonly Settings = Settings;
  protected readonly Edit = Edit;
  protected readonly Trash2 = Trash2;
  protected readonly Image = Image;

  activeTab = signal<'products' | 'orders' | 'analytics'>('products');
  storefront = signal<Storefront | null>(null);
  analytics = signal<StorefrontAnalytics | null>(null);
  loading = signal(true);
  orderFilter = signal<'all' | 'pending' | 'completed'>('all');

  constructor(
    private mockDataService: MockDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.mockDataService.getStorefront().subscribe({
      next: (data) => {
        this.storefront.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading storefront:', err);
        this.loading.set(false);
      },
    });

    this.mockDataService.getStorefrontAnalytics().subscribe({
      next: (data) => {
        this.analytics.set(data);
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
      },
    });
  }

  setActiveTab(tab: 'products' | 'orders' | 'analytics'): void {
    this.activeTab.set(tab);
  }

  toggleProductAvailability(productId: string): void {
    if (this.storefront()) {
      const updatedProducts = this.storefront()!.products.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p,
      );
      this.storefront.set({
        ...this.storefront()!,
        products: updatedProducts,
      });
    }
  }

  deleteProduct(productId: string): void {
    if (this.storefront()) {
      const updatedProducts = this.storefront()!.products.filter(
        (p) => p.id !== productId,
      );
      this.storefront.set({
        ...this.storefront()!,
        products: updatedProducts,
      });
    }
  }

  markOrderComplete(orderId: string): void {
    if (this.storefront()) {
      const updatedOrders = this.storefront()!.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'completed' as const } : o,
      );
      this.storefront.set({
        ...this.storefront()!,
        orders: updatedOrders,
      });
    }
  }

  getFilteredOrders(): Order[] {
    if (!this.storefront()) return [];
    const orders = this.storefront()!.orders;

    if (this.orderFilter() === 'pending') {
      return orders.filter((order) => order.status === 'pending');
    }

    if (this.orderFilter() === 'completed') {
      return orders.filter((order) => order.status === 'completed');
    }

    return orders;
  }

  getCurrentMonth(): string {
    return new Date().toLocaleDateString('en-US', { month: 'long' });
  }

  getOrderItemsSummary(order: Order): string {
    return order.items
      .map((item) => `${item.productName} x${item.quantity}`)
      .join(', ');
  }

  getMukandoProgress(): number {
    const analytics = this.analytics();
    if (!analytics || !analytics.mukandoContributionDue) return 100;

    return Math.min(
      (analytics.revenue / analytics.mukandoContributionDue) * 100,
      100,
    );
  }

  canContributeToMukando(): boolean {
    const analytics = this.analytics();
    if (!analytics || !analytics.mukandoContributionDue) return false;

    return analytics.revenue >= analytics.mukandoContributionDue;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  viewLiveStore(): void {
    const store = this.storefront();
    if (store) {
      const url = `/store/${store.slug}`;
      window.open(url, '_blank');
    }
  }
}
