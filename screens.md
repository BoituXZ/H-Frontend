3.1 DASHBOARD /dashboard
Purpose: Central hub showing overview of user's financial activity
Layout:
┌─────────────────────────────────────────────────┐
│ [☰] HiveFund [🔔] [👤] │
├─────────────────────────────────────────────────┤
│ │
│ Good afternoon, Boitu! 👋 │
│ │
│ ┌─────────────────────────────────────────┐ │
│ │ Your Credit Score │ │
│ │ │ │
│ │ ⬡ 650 ⬡ │ │
│ │ ESTABLISHED │ │
│ │ │ │
│ │ 🎯 45 points to Trusted tier │ │
│ │ [View Details →] │ │
│ └─────────────────────────────────────────┘ │
│ │
│ Quick Actions │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 💰 Join │ │ 📊 View │ │ 💵 Apply│ │
│ │ Circle │ │ Circles │ │ Loan │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ My Circles (3) │
│ ┌───────────────────────────────────────┐ │
│ │ MSU Squad [Active] │ │
│ │ Next payment: Dec 10 ($20) │ │
│ │ Progress: ████████░░ 8/10 │ │
│ └───────────────────────────────────────┘ │
│ ┌───────────────────────────────────────┐ │
│ │ Side Hustle Crew [Active] │ │
│ │ Your turn: Jan 5 ($120) │ │
│ │ Progress: ██████░░░░ 6/10 │ │
│ └───────────────────────────────────────┘ │
│ │
│ Upcoming Payments │
│ • Dec 10: MSU Squad ($20) │
│ • Dec 15: Loan Repayment ($27) │
│ • Jan 1: Side Hustle Crew ($15) │
│ │
│ Recent Earnings │
│ • Dec 5: Storefront sale (+$15) │
│ • Dec 3: Tutoring gig (+$20) │
│ │
└─────────────────────────────────────────────────┘

Widgets:
Credit Score Display (prominent, visual)
Quick Actions (shortcuts to key features)
Active Circles Summary
Payment Reminders
Recent Activity Feed
Backend Needs:
GET /api/dashboard
Response: {
user: {
name: string,
creditScore: number,
tier: string
},
circles: {
id: string,
name: string,
status: string,
nextPayment: { date: Date, amount: number },
progress: { current: number, total: number },
nextPayout?: { date: Date, amount: number }
}[],
upcomingPayments: {
type: string, // 'contribution', 'loan_repayment'
description: string,
date: Date,
amount: number
}[],
recentEarnings: {
type: string, // 'storefront', 'gig'
description: string,
date: Date,
amount: number
}[]
}

4. CIRCLE SCREENS
   4.1 MY CIRCLES /circles
   Purpose: List all circles user is part of
   Layout:
   ┌─────────────────────────────────────────────────┐
   │ [←] My Circles [+ Create] │
   ├─────────────────────────────────────────────────┤
   │ │
   │ Active Circles (2) │
   │ │
   │ ┌───────────────────────────────────────┐ │
   │ │ 💰 MSU Squad │ │
   │ │ 8 members • $20/month │ │
   │ │ │ │
   │ │ Your Position: #3 (Paid ✓) │ │
   │ │ Progress: ████████░░ 8/10 │ │
   │ │ Next Payment: Dec 10 │ │
   │ │ │ │
   │ │ [View Details] │ │
   │ └───────────────────────────────────────┘ │
   │ │
   │ ┌───────────────────────────────────────┐ │
   │ │ 🌾 Side Hustle Crew │ │
   │ │ 10 members • $15/month │ │
   │ │ │ │
   │ │ Your Position: #7 (Upcoming) │ │
   │ │ Progress: ██████░░░░ 6/10 │ │
   │ │ Next Payout: Jan 5 ($150) │ │
   │ │ │ │
   │ │ [View Details] │ │
   │ └───────────────────────────────────────┘ │
   │ │
   │ Completed Circles (1) │
   │ │
   │ ┌───────────────────────────────────────┐ │
   │ │ 🎓 Study Group Fund │ │
   │ │ Completed: Oct 2024 │ │
   │ │ +50 credit score │ │
   │ │ [View History] │ │
   │ └───────────────────────────────────────┘ │
   │ │
   │ [Join a Circle] │
   └─────────────────────────────────────────────────┘

Filters:
Active / Completed / All
Sort by: Next payment, Creation date
Backend Needs:
GET /api/circles/my-circles?status=active
Response: {
circles: {
id: string,
name: string,
memberCount: number,
contributionAmount: number,
frequency: string,
userPosition: number,
hasPaidOut: boolean,
progress: { current: number, total: number },
nextPayment?: { date: Date },
nextPayout?: { date: Date, amount: number },
status: string
}[]
}

4.2 CREATE CIRCLE /circles/create
Purpose: Form to create new mukando circle
Layout:
┌─────────────────────────────────────────────────┐
│ [←] Create Circle │
├─────────────────────────────────────────────────┤
│ │
│ Circle Details │
│ │
│ Circle Name \_ │
│ [MSU Hustlers_______________] │
│ │
│ Description (optional) │
│ [Our savings group for... ] │
│ │
│ Contribution Amount _ │
│ [$] [20.00__] │
│ │
│ Frequency _ │
│ ○ Weekly ● Monthly ○ Quarterly ○ Annual │
│ │
│ Maximum Members \_ │
│ [Slider: 4 ----●---- 10] 8 members │
│ │
│ ℹ️ Cycle Duration: 8 months │
│ Total per member: $160 │
│ Payout amount: $160 │
│ │
│ Position Assignment │
│ ● Lottery (random) │
│ ○ Auction (highest bid) │
│ ○ Vote (circle decides) │
│ │
│ First Contribution Date │
│ [📅 Dec 20, 2024_____] │
│ │
│ [Cancel] [Create Circle] │
└─────────────────────────────────────────────────┘

Validation:
Name: Required, 3-50 chars
Amount: $5-$100
Members: 4-10
Date: Must be future date
Backend Needs:
POST /api/circles
Body: {
name: string,
description?: string,
contributionAmount: number,
frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual',
maxMembers: number,
positionMethod: 'lottery' | 'auction' | 'vote',
firstContributionDate: Date
}
Response: {
circle: CircleD
