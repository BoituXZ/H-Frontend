import { Component } from '@angular/core';

@Component({
  selector: 'app-circles',
  imports: [],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-display font-bold text-text-primary mb-6">
          My Circles
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-text-primary mb-2">
            Circles Coming Soon
          </h2>
          <p class="text-text-secondary">
            Join savings circles, contribute together, and build your credit
            score.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CirclesPage {}
