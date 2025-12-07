Here is a comprehensive context file designed for **Gemini Code Assist** (or Copilot/Cursor) to understand your entire project.

Create a file named **`PROJECT_CONTEXT.md`** (or `.cursorrules`) in the root of your workspace and paste the content below.

---

# HIVEFUND: Project Context & Architecture

## 1\. Project Overview

**HiveFund** is a youth-focused financial inclusion PWA for Zimbabwe. [cite_start]It digitizes _mukando_ (traditional savings circles) to help users save, build a credit history, and unlock micro-loans[cite: 3].

- **Target Audience:** Zimbabwean youth (18-35), students, gig workers.
- [cite_start]**Core Loop:** Join Savings Circle -\> Contribute via EcoCash -\> Build Credit Score -\> Access Loans[cite: 21, 45].

## [cite_start]2. Tech Stack [cite: 232, 233]

- **Frontend:** Angular 17+ (PWA), TypeScript, RxJS, NgRx.
- **Styling:** TailwindCSS 4 (Theme: "Refined Glass & Paper"), Lucide Icons.
- **Backend:** NestJS (Node.js microservices).
- **Database:** PostgreSQL 16.
- **Caching/Queue:** Redis, Bull.
- **Payments:** EcoCash API (REST/SOAP).
- **Infrastructure:** Docker containers.

## 3\. UI/UX Design System

**Theme:** "Modern Fintech" (Clean, Professional, Warm).

- **Primary Color:** Honey/Amber (`#f59e0b` / `var(--color-brand-500)`).
- **Backgrounds:** Light Slate/Gray (`#f8fafc`).
- **Shadows:** Soft, diffused shadows (`shadow-float`).
- **Shapes:** Smooth rounded corners (`rounded-xl`, `rounded-2xl`).
- **Icons:** Lucide React (SVG). No Emojis.

## 4\. Feature Specifications

### [cite_start]A. Mukando Circles (Core) [cite: 21]

- [cite_start]**Structure:** 4-10 members max[cite: 23].
- **Cycles:** Weekly, Monthly, Quarterly. [cite_start]Funds rotate to one member per period[cite: 26, 28].
- [cite_start]**Logic:** Users cannot leave mid-cycle without 75% vote[cite: 37]. [cite_start]Payouts are assigned by lottery[cite: 34].

### [cite_start]B. Credit Scoring Engine [cite: 45]

- [cite_start]**Score Range:** 0 - 1000 points[cite: 504].
- **Tiers:**
  - [cite_start]0-299: Seedling (No loans)[cite: 47].
  - [cite_start]300-499: Growing ($10-$50 loans)[cite: 48].
  - [cite_start]500-699: Established ($50-$200 loans)[cite: 49].
  - [cite_start]700+: Trusted/Elite ($200-$500 loans)[cite: 50, 51].
- [cite_start]**Calculation:** Payment consistency (40%), Months active (20%), Participation (15%), Contribution ratio (15%), Earnings (10%) [cite: 53-57].

### [cite_start]C. Liquidity & Lending [cite: 63]

- [cite_start]**Source:** Temporal liquidity pool (funds resting between contribution and payout)[cite: 4].
- [cite_start]**Tiers:** Micro (5% interest), Short-term (8-12%), Growth (10-15%) [cite: 69-82].
- [cite_start]**Risk:** Circuit breaker pauses loans if reserves dip[cite: 92].

### [cite_start]D. Marketplace & Storefront [cite: 93, 111]

- **Storefront:** Digital shops for users to sell goods. [cite_start]2% transaction fee[cite: 110].
- **Gigs:** Service marketplace (tutoring, design). [cite_start]2.5% fee[cite: 132].
- [cite_start]**Integration:** Earnings are suggested as Mukando contributions[cite: 109].

## [cite_start]5. Frontend Architecture (Angular) [cite: 814]

## [cite_start]6. Database Schema (Key Tables) [cite: 319-801]

- [cite_start]**`users`**: `id`, `phone_number`, `ecocash_number`, `password_hash`[cite: 320].
- [cite_start]**`circles`**: `contribution_amount`, `frequency`, `max_members`, `invite_code`[cite: 368].
- [cite_start]**`circle_members`**: Link user to circle, `payout_position`[cite: 393].
- [cite_start]**`subscriptions`**: Recurring EcoCash payment tracking[cite: 446].
- [cite_start]**`transactions`**: Unified log of all money movement (`type`: contribution, loan, gig)[cite: 459].
- [cite_start]**`credit_scores`**: Current user score and tier[cite: 501].
- [cite_start]**`loans`**: `amount`, `interest_rate`, `outstanding_balance`, `status`[cite: 575].

## 7\. Critical Business Rules

1.  [cite_start]**Invite Only:** Circles are joined via unique invite codes[cite: 24, 376].
2.  **Payment:** All money moves via EcoCash. [cite_start]We use an API Gateway[cite: 252].
3.  [cite_start]**Consistency:** Missing a payment deducts 20 credit points[cite: 43].
4.  [cite_start]**Offline First:** The app is a PWA and must cache critical data (Circle status, Credit Score)[cite: 1146].

## 8\. Coding Standards

- **Styling:** Use the `dashboard-card`, `btn-primary`, and color variables defined in `src/styles.css`. Do not hardcode hex values.
- **State:** Use NgRx for complex data (Circles, Transactions). Use local state for UI toggles.
- **Type Safety:** Strict TypeScript interfaces for all Models (User, Circle, Transaction).
- **Components:** Use Standalone Components where possible.
