import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  LucideAngularModule,
  Plus,
  Star,
  User,
  CreditCard,
  Tag,
  Check,
} from 'lucide-angular';

interface Gig {
  id: string;
  title: string;
  price: number;
  providerName: string;
  currency: 'ZWL' | 'USD';
  rating: number;
  creditScore: number;
  isMukandoMember: boolean;
  category: string;
}

@Component({
  selector: 'app-marketplace',
  imports: [CommonModule, LucideAngularModule, PageHeaderComponent],
  templateUrl: './marketplace.page.html',
  styleUrl: './marketplace.page.css',
})
export class MarketplacePage {
  protected readonly Plus = Plus;
  protected readonly Star = Star;
  protected readonly User = User;
  protected readonly CreditCard = CreditCard;
  protected readonly Tag = Tag;
  protected readonly Check = Check;

  // Categories
  categories = ['All', 'Academic', 'Creative', 'Tech', 'Physical', 'Events'];
  selectedCategory = signal<string>('All');

  // Booking modal state
  showModal = signal<boolean>(false);
  selectedGig = signal<Gig | null>(null);
  bookingState = signal<'idle' | 'paidDeposit' | 'completed' | 'released'>('idle');
  showEarningsMsg = signal<boolean>(false);
  // Last auto-assigned rating and credit delta after release
  lastAssignedRating = signal<number | null>(null);
  lastCreditDelta = signal<number | null>(null);

  // Post gig modal state
  showPostGigModal = signal<boolean>(false);
  postGigForm = signal({
    title: '',
    price: '',
    category: 'Academic',
    currency: 'ZWL',
    isMukandoMember: 'no',
    providerName: '',
  });

  // Dummy data
  gigs = signal<Gig[]>([
    {
      id: 'g1',
      title: 'Write Research Summary (3 pages)',
      price: 25,
      currency: 'USD',
      providerName: 'Acme Tutors',
      rating: 4.8,
      creditScore: 780,
      isMukandoMember: true,
      category: 'Academic',
    },
    {
      id: 'g2',
      title: 'Logo Design - Social Media Pack',
      price: 40,
      currency: 'ZWL',
      providerName: 'CreativeCo',
      rating: 4.6,
      creditScore: 690,
      isMukandoMember: false,
      category: 'Creative',
    },
    {
      id: 'g3',
      title: 'Bug Fix: Angular Payment Module',
      price: 80,
      currency: 'USD',
      providerName: 'DevWorks Ltd',
      rating: 4.9,
      creditScore: 820,
      isMukandoMember: false,
      category: 'Tech',
    },
    {
      id: 'g4',
      title: 'Event Flyer Distribution (100 flyers)',
      price: 20,
      currency: 'ZWL',
      providerName: 'StreetPromos',
      rating: 4.2,
      creditScore: 640,
      isMukandoMember: false,
      category: 'Events',
    },
    {
      id: 'g5',
      title: 'Move Small Apartment (2 people)',
      price: 60,
      currency: 'ZWL',
      providerName: "HandyHands",
      rating: 4.5,
      creditScore: 710,
      isMukandoMember: true,
      category: 'Physical',
    },
  ]);

  // Determine featured providers (creditScore high or mukando member)
  isFeatured = (gig: Gig) => gig.isMukandoMember || gig.creditScore >= 750;

  // Computed filtered and sorted gigs (featured first)
  filteredGigs = computed(() => {
    const cat = this.selectedCategory();
    const list = this.gigs().filter((g) => (cat === 'All' ? true : g.category === cat));

    // sort: featured first, then by rating desc
    return list.sort((a, b) => {
      const fa = this.isFeatured(a) ? 1 : 0;
      const fb = this.isFeatured(b) ? 1 : 0;
      if (fa !== fb) return fb - fa; // featured first
      return b.rating - a.rating;
    });
  });

  // UI actions
  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  onPostGig(): void {
    this.showPostGigModal.set(true);
  }

  closePostGigModal(): void {
    this.showPostGigModal.set(false);
    this.resetPostGigForm();
  }

  resetPostGigForm(): void {
    this.postGigForm.set({
      title: '',
      price: '',
      category: 'Academic',
      currency: 'ZWL',
      isMukandoMember: 'no',
      providerName: '',
    });
  }

  submitPostGig(): void {
    const form = this.postGigForm();

    // Validate required fields
    if (!form.title.trim() || !form.price || !form.category || !form.providerName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      alert('Price must be a positive number');
      return;
    }

    // Create new gig (system assigns a mock rating and credit score; isMukandoMember comes from form)
    const newGig: Gig = {
      id: 'g-' + Date.now(),
      title: form.title.trim(),
      price: price,
      providerName: form.providerName.trim(),
      // auto-assign mock rating between 3.5 and 5.0 (one decimal)
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      // mock credit score between 550 and 820
      creditScore: Math.floor(550 + Math.random() * 270),
      isMukandoMember: form.isMukandoMember === 'yes',
      currency: (form.currency === 'USD' ? 'USD' : 'ZWL'),
      category: form.category,
    };

    // Add to gigs list
    this.gigs.update((g) => [newGig, ...g]);

    // Close modal and reset form
    this.closePostGigModal();

    // Show success message
    alert('Gig posted successfully! Rating and credit score will be assigned by the system.');
  }

  updatePostGigForm(field: string, value: string): void {
    this.postGigForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  openBooking(gig: Gig): void {
    this.selectedGig.set(gig);
    this.bookingState.set('idle');
    this.showEarningsMsg.set(false);
    this.lastAssignedRating.set(null);
    this.lastCreditDelta.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedGig.set(null);
    this.lastAssignedRating.set(null);
    this.lastCreditDelta.set(null);
  }

  // Payment logic simulation
  payDeposit(): void {
    this.bookingState.set('paidDeposit');
    console.log('Simulated EcoCash 50% deposit paid');
  }

  simulateProviderComplete(): void {
    this.bookingState.set('completed');
  }

  releaseAndRate(): void {
    // Simulate releasing payment and auto-rating the provider
    this.bookingState.set('released');

    const gig = this.selectedGig();
    if (gig) {
      // Simulate a user rating between 4.0 and 5.0 (one decimal)
      const simulatedRating = Math.round((4 + Math.random() * 1) * 10) / 10;

      // Compute new rating: if existing rating is 0, use simulatedRating, otherwise average
      const newRating = gig.rating && gig.rating > 0 ? Math.round(((gig.rating + simulatedRating) / 2) * 10) / 10 : simulatedRating;

      // Adjust credit score based on rating (higher rating => bigger increase)
      const creditDelta = Math.floor((simulatedRating - 3.5) * 40); // ~20-60 points
      const newCredit = Math.min(900, gig.creditScore + creditDelta);

      // Update gigs list immutably
      this.gigs.update((list) =>
        list.map((g) => (g.id === gig.id ? { ...g, rating: newRating, creditScore: newCredit } : g))
      );

      // Update selectedGig to reflect changes
      const updated = { ...gig, rating: newRating, creditScore: newCredit };
      this.selectedGig.set(updated);

      // Save last assigned values for UI display
      this.lastAssignedRating.set(simulatedRating);
      this.lastCreditDelta.set(creditDelta);

      console.log(`Auto-rated gig ${gig.id}: rating=${newRating}, creditScore=${newCredit}, delta=${creditDelta}`);
    }

    this.showEarningsMsg.set(true);

    // Optionally close after short delay
    setTimeout(() => this.closeModal(), 2200);
  }
}

