import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { Product } from '../../../models/hive-data.models';

@Component({
  selector: 'app-create-storefront',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './create-storefront.component.html',
  styleUrl: './create-storefront.component.css',
})
export class CreateStorefrontComponent {
  currentStep = signal<1 | 2 | 3>(1);

  // Step 1: Details
  storeName = signal('');
  description = signal('');
  slug = signal('');

  // Step 2: Products
  products = signal<Product[]>([]);
  showAddProductForm = signal(false);
  newProductName = signal('');
  newProductPrice = signal(0);
  newProductDescription = signal('');

  // Step 3: Payment
  ecocashAccount = '0771234567';

  constructor() {
    // Generate slug from store name using effect
    effect(() => {
      const name = this.storeName();
      if (name) {
        this.slug.set(
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        );
      } else {
        this.slug.set('');
      }
    });
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.set((this.currentStep() + 1) as 1 | 2 | 3);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set((this.currentStep() - 1) as 1 | 2 | 3);
    }
  }

  addProduct(): void {
    if (
      this.newProductName().trim() &&
      this.newProductPrice() > 0 &&
      this.newProductDescription().trim()
    ) {
      const product: Product = {
        id: Date.now().toString(),
        name: this.newProductName(),
        price: this.newProductPrice(),
        description: this.newProductDescription(),
        imageUrl: '',
        isAvailable: true,
      };
      this.products.update((products) => [...products, product]);
      this.newProductName.set('');
      this.newProductPrice.set(0);
      this.newProductDescription.set('');
      this.showAddProductForm.set(false);
    }
  }

  removeProduct(productId: string): void {
    this.products.update((products) =>
      products.filter((p) => p.id !== productId),
    );
  }

  toggleAddProductForm(): void {
    this.showAddProductForm.update((show) => !show);
  }

  createStorefront(): void {
    // TODO: Implement storefront creation logic
    console.log('Creating storefront:', {
      name: this.storeName(),
      description: this.description(),
      slug: this.slug(),
      products: this.products(),
    });
  }

  canProceedToStep2(): boolean {
    return this.storeName().trim().length > 0 && this.description().trim().length > 0;
  }

  canCreate(): boolean {
    return this.products().length > 0;
  }
}
