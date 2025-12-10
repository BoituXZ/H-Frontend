# HiveFund Frontend

## Project Overview

HiveFund is a Progressive Web App (PWA) designed to foster financial inclusion among Zimbabwean youth. The platform digitizes traditional savings circles (Mukando), facilitates a gig marketplace, and builds credit scores based on participation history. By leveraging modern web technologies, HiveFund creates liquidity and digitizes trust for its users.

## Key Features

*   **Dashboard:** A bento-grid interface providing a comprehensive overview of the user's financial health, active circles, and upcoming tasks.
*   **Circles (Mukando):** Complete management of savings groups, including member invitations, contribution tracking, and automated payout cycles.
*   **Wallet:** Integrated digital wallet supporting EcoCash for deposits, withdrawals, and internal transfers.
*   **Marketplace:** A platform connecting users with gig opportunities to earn income.
*   **Storefront:** Digital tools enabling youth entrepreneurs to list products and manage sales.
*   **Credit Score:** A behavioral scoring engine that calculates creditworthiness based on saving consistency and marketplace activity.

## Technical Stack

*   **Framework:** Angular 17+ (Standalone Components, Signals)
*   **Styling:** Tailwind CSS 4 (Theme: Modern Fintech)
*   **State Management:** Angular Signals / NgRx
*   **Authentication:** Supabase Auth (Phone Number & Password)
*   **Icons:** Lucide-Angular
*   **PWA:** @angular/service-worker

## Prerequisites

Ensure the following tools are installed in your development environment:

*   **Node.js:** v18 or higher
*   **npm:** Package manager included with Node.js
*   **Angular CLI:** Global installation recommended (`npm install -g @angular/cli`)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd H-Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a new file named `environment.ts` in the `src/environments/` directory. Configure your Supabase credentials as follows:

    ```typescript
    export const environment = {
      production: false,
      supabaseUrl: 'YOUR_SUPABASE_URL',
      supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
    };
    ```

## Development

To run the application locally in development mode:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Building for Production

To build the project for production, generating the PWA artifact:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

The codebase follows a feature-based architecture organized logically:

```text
src/app/
├── components/      # Standalone UI components (Layouts, Cards)
├── guards/          # Route guards for authentication and authorization
├── interceptors/    # HTTP interceptors for token handling
├── models/          # TypeScript interfaces and type definitions
├── pages/           # Feature pages (Circles, Dashboard, Wallet)
├── services/        # Singleton services for API and state logic
├── shared/          # Reusable components, pipes, and utilities
└── environments/    # Application configuration settings
```

## Design System

The application utilizes Tailwind CSS with a custom configuration to match the brand identity.

*   **Brand Red:** `#eb2528`
*   **Brand Blue:** `#6dbaff`

Styles are defined in `src/styles.css` and `tailwind.config.js` to ensure consistency across the application.