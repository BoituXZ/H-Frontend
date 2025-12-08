import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-marketplace',
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './marketplace.page.html',
  styleUrl: './marketplace.page.css',
})
export class MarketplacePage {
  protected readonly Plus = Plus;

  onPostGig(): void {
    // TODO: Implement post gig logic
    console.log('Post gig clicked');
  }
}
