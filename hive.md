## Inspiration

When looking at the challenge of "Youth Financial Inclusion," we hit a hard realization: **You cannot budget zero dollars.**

Existing solutions focus heavily on teaching youth how to _save_ or _budget_, but they often ignore the elephant in the room: **Income Generation.** In a high-unemployment environment, the primary problem isn't just managing money; it's getting it in the first place. We asked ourselves: _"We can create a savings platform, but where is the youth getting said money?"_

This inspired us to build **HiveFund**. We didn't just want to build a digital piggy bank; we wanted to build a self-sustaining micro-economy. And as they say, charity begins at home so we looked at our local solutions. _Mukando_ (traditional community savings circles)—a system built on trust and community—and realized that if we digitized this and coupled it with a way to **earn**, we could solve the liquidity crisis for Zimbabwean youth.

## What it does

HiveFund is a comprehensive financial inclusion PWA that combines social savings, a gig marketplace, and digital commerce, creating a self-sustaining ecosystem built on EcoCash payment rails.

1.  **Digitized Mukando (Savings Circles):** Users form private savings circles. We automate the monthly contributions directly from their EcoCash wallets and manage the payout rotation.
2.  **The Temporal Liquidity Pool:** This is the heart of our innovation. We utilize the time delay between when a contribution is made and when a payout occurs (averaging 15 days). This money sits in a "Temporal Liquidity Pool," which we use to fund instant micro-loans for high-credit users, ensuring zero capital risk for the platform.
3.  **The Hustle Marketplace (Earning):** To solve the "income" problem, we built a gig marketplace. Users can post skills (tutoring, errands) and get hired. Every transaction flows through EcoCash, generating revenue via a 2.5% transaction fee.
4.  **EcoCash Revenue Engine:** HiveFund isn't just a tool; it's a business generator for EcoCash. We modeled a recurring revenue stream through monthly user subscriptions ($0.50/month) and transaction fees (1.5-2.5%) on every store sale and gig payment.
5.  **The Trust Score:** We introduced an internal credit scoring system. By tracking savings consistency and earning history, we generate a score that allows circles to confidently lend to each other.

## How we built it

We built HiveFund as a **Progressive Web App (PWA)** to ensure accessibility for youth on low-end devices with limited data.

- **Frontend:** Angular 17 with TailwindCSS for a "Modern Fintech" aesthetic.
- **Backend:** NestJS (Node.js) microservices architecture with a PostgreSQL database.
- **EcoCash Integration:** We utilized the EcoCash API for the core wallet functionality.
  - _Subscriptions:_ We automated monthly Mukando contributions using recurring payment endpoints.
  - _Marketplace Escrow:_ For gigs, we implemented a deposit system where 50% is paid upfront via EcoCash and released upon completion.

We mathematically modeled the "Trust Score" ($T_s$) to reward consistent behavior:

$$T_s = \alpha(C_{freq}) + \beta(E_{vol}) + \gamma(S_{ocial})$$

Where $C_{freq}$ is contribution frequency (40% weight), $E_{vol}$ is earning volume (10%), and $S_{ocial}$ is participation consistency (15%).

## Challenges we ran into

Our biggest hurdle was gaining full access to the granular features of the live EcoCash platform for complex group transactions (splitting one payment into a holding pool). To overcome this for the hackathon:

1.  We fully integrated the **EcoCash Payment API** for individual wallet transactions (deposits/payments).
2.  We built a **Simulation Engine** for the Liquidity Pool logic. We had to calculate exactly how much of the "floating" cash could be safely lent out without affecting the scheduled Mukando payouts (targeted at 25% of the pool).

## Accomplishments that we're proud of

- **"Apples-to-Apples" Credit Benchmarking:** Traditional banks judge students against homeowners, which is unfair. We created a context-aware scoring system that compares youth to _other youth_. If a student consistently contributes their $20 share on time, they are mathematically proven to be high-trust within their economic bracket, regardless of assets.
- **The Business Case for EcoCash:** We demonstrated that this isn't just charity. With just 40,000 users, our model projects ~$732K in annual revenue for EcoCash through fees and interest, proving the viability of the youth market.
- **Solving the "Zero Dollar" Problem:** We are proud that we didn't just build a bank; we built a job creator. A student can earn $10 tutoring via our marketplace, and the app immediately suggests routing that earning to their savings circle.

## What we learned

We learned deeply about the structural issues of youth unemployment. We realized that **financial inclusion is impossible without economic inclusion**. A savings app is useless to a user with no income. This validated our decision to pivot from a pure "Savings App" to a "Savings & Earnings Ecosystem."

## What's next for HiveFund

- **University Pilot:** We plan to roll this out at a local university (e.g., UZ or MSU) where the _Mukando_ culture is already strong among students.
- **Circuit Breaker Implementation:** Finalizing the risk management algorithms that automatically pause lending if the liquidity pool reserves dip below 70%, ensuring payouts are never missed.
- **AI Financial Advisor:** Implementing an AI that analyzes a user's spending/earning patterns to suggest the optimal contribution amount for their circle.z`
