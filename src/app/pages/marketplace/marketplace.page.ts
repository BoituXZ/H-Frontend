import { Component } from '@angular/core';

@Component({
  selector: 'app-marketplace',
  imports: [],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-display font-bold text-text-primary mb-6">
          Marketplace
        </h1>

        <div class="card p-8 text-center">
          <div class="mb-4 text-honey-500">
            <svg
              class="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-text-primary mb-2">
            Marketplace Coming Soon
          </h2>
          <p class="text-text-secondary">
            Browse gigs, offer services, and earn money to support your
            contributions.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MarketplacePage {}
