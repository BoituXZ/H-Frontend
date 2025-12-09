import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { GigCard } from '../../components/gig-card/gig-card';
import { PostGigModalComponent } from '../../shared/components/post-gig-modal/post-gig-modal';
import { BookingModalComponent } from '../../shared/components/booking-modal/booking-modal';
import { LucideAngularModule, Plus, CheckCircle2 } from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Gig, GigCategory, GigType } from '../../models/gig.model';

const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
]);

const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(1)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(0.9)', opacity: 0 }),
    ),
  ]),
]);

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    GigCard,
    PostGigModalComponent,
    BookingModalComponent,
    LucideAngularModule,
  ],
  templateUrl: './marketplace.page.html',
  styleUrl: './marketplace.page.css',
  animations: [fadeInAnimation, scaleAnimation],
})
export class MarketplacePage {
  protected readonly Plus = Plus;
  protected readonly CheckCircle2 = CheckCircle2;
  protected readonly GigCategory = GigCategory;

  // Modal states
  showPostGigModal = signal(false);
  showBookingModal = signal(false);
  showCompletionModal = signal(false);
  selectedGig = signal<Gig | null>(null);
  bookingStatus = signal<'pending' | 'deposit_paid' | 'completed'>('pending');

  // Filter state
  selectedCategory = signal<GigCategory | 'all'>('all');

  // Dummy data
  allGigs = signal<Gig[]>([
    {
      id: '1',
      title: 'Math Tutoring for Grade 10',
      description: 'Need help with algebra and geometry',
      price: 50,
      category: GigCategory.ACADEMIC,
      providerName: 'Sarah M.',
      rating: 4.8,
      creditScore: 750,
      isMukandoMember: true,
      type: GigType.SKILL,
      skills: ['Mathematics', 'Tutoring'],
    },
    {
      id: '2',
      title: 'Logo Design for Small Business',
      description: 'Looking for a professional logo design',
      price: 150,
      category: GigCategory.CREATIVE,
      providerName: 'John D.',
      rating: 4.9,
      creditScore: 680,
      isMukandoMember: false,
      type: GigType.GIG,
    },
    {
      id: '3',
      title: 'Website Development',
      description: 'Need a responsive website built',
      price: 500,
      category: GigCategory.TECH,
      providerName: 'Tech Solutions',
      rating: 5.0,
      creditScore: 800,
      isMukandoMember: true,
      type: GigType.SKILL,
      skills: ['Web Development', 'React', 'Angular'],
    },
    {
      id: '4',
      title: 'Event Photography',
      description: 'Need photographer for wedding',
      price: 300,
      category: GigCategory.EVENTS,
      providerName: 'Capture Moments',
      rating: 4.7,
      creditScore: 720,
      isMukandoMember: true,
      type: GigType.SKILL,
      skills: ['Photography', 'Event Coverage'],
    },
    {
      id: '5',
      title: 'Moving Assistance',
      description: 'Need help moving furniture',
      price: 80,
      category: GigCategory.PHYSICAL,
      providerName: 'Mike T.',
      rating: 4.5,
      creditScore: 650,
      isMukandoMember: false,
      type: GigType.GIG,
    },
    {
      id: '6',
      title: 'Essay Writing Help',
      description: 'Need assistance with research paper',
      price: 60,
      category: GigCategory.ACADEMIC,
      providerName: 'Academic Help',
      rating: 4.6,
      creditScore: 690,
      isMukandoMember: false,
      type: GigType.SKILL,
      skills: ['Writing', 'Research'],
    },
    {
      id: '7',
      title: 'Graphic Design Services',
      description: 'Professional graphic design for marketing materials',
      price: 200,
      category: GigCategory.CREATIVE,
      providerName: 'Design Pro',
      rating: 4.9,
      creditScore: 780,
      isMukandoMember: true,
      type: GigType.SKILL,
      skills: ['Graphic Design', 'Branding'],
    },
    {
      id: '8',
      title: 'Mobile App Development',
      description: 'Need iOS app developed',
      price: 800,
      category: GigCategory.TECH,
      providerName: 'App Dev Co',
      rating: 4.8,
      creditScore: 760,
      isMukandoMember: true,
      type: GigType.SKILL,
      skills: ['iOS Development', 'Swift'],
    },
  ]);

  // Filtered and sorted gigs
  filteredGigs = computed(() => {
    let gigs = this.allGigs();
    
    // Filter by category
    if (this.selectedCategory() !== 'all') {
      gigs = gigs.filter(gig => gig.category === this.selectedCategory());
    }

    // Sort: Featured/Verified first, then by rating
    return gigs.sort((a, b) => {
      const aIsFeatured = a.isMukandoMember || a.creditScore >= 700;
      const bIsFeatured = b.isMukandoMember || b.creditScore >= 700;
      
      if (aIsFeatured && !bIsFeatured) return -1;
      if (!aIsFeatured && bIsFeatured) return 1;
      
      return b.rating - a.rating;
    });
  });

  // Featured gigs (first one)
  featuredGig = computed(() => {
    const gigs = this.filteredGigs();
    return gigs.length > 0 && (gigs[0].isMukandoMember || gigs[0].creditScore >= 700) 
      ? gigs[0] 
      : null;
  });

  // Regular gigs (rest)
  regularGigs = computed(() => {
    const gigs = this.filteredGigs();
    const featured = this.featuredGig();
    if (featured) {
      return gigs.slice(1);
    }
    return gigs;
  });

  onPostGig(): void {
    this.showPostGigModal.set(true);
  }

  onClosePostGigModal(): void {
    this.showPostGigModal.set(false);
  }

  onGigPosted(gigData: any): void {
    // Add new gig to the list
    const newGig: Gig = {
      id: Date.now().toString(),
      title: gigData.title,
      description: gigData.description,
      price: gigData.price,
      category: gigData.category,
      providerName: 'You', // Current user
      rating: 0,
      creditScore: 650, // Default
      isMukandoMember: false,
      type: gigData.type,
      skills: gigData.skills || [],
    };
    
    this.allGigs.update(gigs => [newGig, ...gigs]);
    this.showPostGigModal.set(false);
  }

  onGigClick(gigId: string): void {
    const gig = this.allGigs().find(g => g.id === gigId);
    if (gig) {
      this.selectedGig.set(gig);
      this.bookingStatus.set('pending');
      this.showBookingModal.set(true);
    }
  }

  onCloseBookingModal(): void {
    this.showBookingModal.set(false);
    this.selectedGig.set(null);
  }

  onPayDeposit(): void {
    // Simulate payment
    this.bookingStatus.set('deposit_paid');
  }

  onReleaseRemaining(): void {
    // Simulate completion
    this.showBookingModal.set(false);
    this.showCompletionModal.set(true);
  }

  onCloseCompletionModal(): void {
    this.showCompletionModal.set(false);
    this.selectedGig.set(null);
    this.bookingStatus.set('pending');
  }

  onCategoryChange(category: GigCategory | 'all'): void {
    this.selectedCategory.set(category);
  }
}
