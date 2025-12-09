import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../services/mock-data.service';
import { Storefront, Product } from '../../../models/hive-data.models';

@Component({
  selector: 'app-public-storefront',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-storefront.component.html',
  styleUrl: './public-storefront.component.css',
})
export class PublicStorefrontComponent implements OnInit {
  slug = signal<string>('');
  storefront = signal<Storefront | null>(null);
  loading = signal(true);
  showOrderModal = signal(false);
  selectedProduct = signal<Product | null>(null);

  // Order form
  customerName = signal('');
  customerPhone = signal('');
  customerNotes = signal('');

  constructor(
    private route: ActivatedRoute,
    private mockDataService: MockDataService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'] || '';
      this.slug.set(slug);
      this.loadStorefront(slug);
    });
  }

  loadStorefront(slug: string): void {
    this.loading.set(true);
    this.mockDataService.getStorefrontBySlug(slug).subscribe({
      next: (data) => {
        this.storefront.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading storefront:', err);
        this.loading.set(false);
      },
    });
  }

  openOrderModal(product: Product): void {
    if (!product.isAvailable) return;
    this.selectedProduct.set(product);
    this.showOrderModal.set(true);
    // Reset form
    this.customerName.set('');
    this.customerPhone.set('');
    this.customerNotes.set('');
  }

  closeOrderModal(): void {
    this.showOrderModal.set(false);
    this.selectedProduct.set(null);
  }

  submitOrder(): void {
    if (!this.selectedProduct() || !this.customerName() || !this.customerPhone()) {
      return;
    }

    // TODO: Implement order submission logic
    console.log('Submitting order:', {
      product: this.selectedProduct(),
      customerName: this.customerName(),
      customerPhone: this.customerPhone(),
      notes: this.customerNotes(),
    });

    // Close modal after submission
    this.closeOrderModal();
  }

  getAvailableProducts(): Product[] {
    const store = this.storefront();
    if (!store) return [];
    return store.products.filter((p) => p.isAvailable);
  }
}
