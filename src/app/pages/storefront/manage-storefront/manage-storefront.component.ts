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

@Component({
  selector: 'app-manage-storefront',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './manage-storefront.component.html',
  styleUrl: './manage-storefront.component.css',
})
export class ManageStorefrontComponent implements OnInit {
  activeTab = signal<'products' | 'orders' | 'analytics'>('products');
  storefront = signal<Storefront | null>(null);
  analytics = signal<StorefrontAnalytics | null>(null);
  loading = signal(true);
  orderFilter = signal<'all' | 'this-month'>('this-month');

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
    if (this.orderFilter() === 'this-month') {
      const now = new Date();
      return orders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    }
    return orders;
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
