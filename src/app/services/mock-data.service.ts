import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Storefront,
  Product,
  Order,
  StorefrontAnalytics,
  Gig,
  Booking,
  LearningContent,
  Badge,
  LeaderboardEntry,
  BudgetProfile,
  BudgetAnalysis,
  UserProfile,
  WalletData,
  Transaction,
  CreditScore,
  CreditHistoryItem,
  LoanProduct,
  Loan,
  ServiceProduct,
} from '../models/hive-data.models';
import { Circle, CircleDetail, CircleMember, PayoutEntry } from '../models/circle.model';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  // BehaviorSubjects for reactive data
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  private walletDataSubject = new BehaviorSubject<WalletData | null>(null);
  private circlesSubject = new BehaviorSubject<Circle[]>([]);
  private creditScoreSubject = new BehaviorSubject<CreditScore | null>(null);
  private creditHistorySubject = new BehaviorSubject<CreditHistoryItem[]>([]);
  private loanProductsSubject = new BehaviorSubject<LoanProduct[]>([]);
  private loansSubject = new BehaviorSubject<Loan[]>([]);
  private storefrontSubject = new BehaviorSubject<Storefront | null>(null);
  private gigsSubject = new BehaviorSubject<Gig[]>([]);
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);

  constructor() {
    // Initialize with Takudzwanashe persona data
    this.initializePersonaData();
    this.initializeStorefrontAndMarketplace();
  }

  get storefront$(): Observable<Storefront | null> {
    return this.storefrontSubject.asObservable();
  }

  getStorefront(): Observable<Storefront> {
    const storefront = this.storefrontSubject.value;
    if (storefront) {
      return of(storefront).pipe(delay(300));
    }
    return of(this.getMockStorefront()).pipe(delay(500));
  }

  getStorefrontAnalytics(): Observable<StorefrontAnalytics> {
    const storefront = this.storefrontSubject.value;
    if (storefront) {
      // Calculate analytics from storefront data
      const totalRevenue = storefront.orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0);
      const completedOrders = storefront.orders.filter(o => o.status === 'completed').length;
      
      return of({
        revenue: totalRevenue,
        totalOrders: storefront.orders.length,
        avgSale: completedOrders > 0 ? totalRevenue / completedOrders : 0,
        mukandoContributionDue: 20.0,
        salesOverTime: [
          { label: 'Nov', amount: totalRevenue * 0.4 },
          { label: 'Dec', amount: totalRevenue * 0.6 },
        ],
        topProducts: storefront.products.map(p => ({
          name: p.name,
          sales: storefront.orders.filter(o => 
            o.items.some(item => item.productName === p.name)
          ).length,
          revenue: storefront.orders
            .filter(o => o.items.some(item => item.productName === p.name))
            .reduce((sum, o) => sum + o.total, 0),
        })),
      }).pipe(delay(300));
    }
    return of(this.getMockAnalytics()).pipe(delay(500));
  }

  getStorefrontBySlug(slug: string): Observable<Storefront | null> {
    // Always use mock data for demo
    if (environment.useMockData) {
      const storefront = this.storefrontSubject.value;
      if (storefront && storefront.slug === slug) {
        return of(storefront).pipe(delay(300));
      }
      const mockStorefront = this.getMockStorefront();
      return of(mockStorefront.slug === slug ? mockStorefront : null).pipe(delay(500));
    }
    // Fallback to HTTP only if useMockData is false
    return this.http.get<Storefront>(`${this.apiUrl}/storefronts/${slug}`).pipe(
      catchError(() => {
        // Even if useMockData is false, fallback to mock on error
        const storefront = this.storefrontSubject.value;
        if (storefront && storefront.slug === slug) {
          return of(storefront).pipe(delay(300));
        }
        const mockStorefront = this.getMockStorefront();
        return of(mockStorefront.slug === slug ? mockStorefront : null).pipe(delay(500));
      })
    );
  }

  private getMockStorefront(): Storefront {
    // Fallback mock data
    return {
      id: '1',
      name: "Boitu's Designs",
      slug: 'boitu-designs',
      description: 'Professional graphic design services...',
      logoUrl: '',
      bannerUrl: '',
      ownerId: 'user-1',
      products: [
        {
          id: '1',
          name: 'Logo Design',
          price: 15.0,
          description: 'Professional logo design service',
          imageUrl: '',
          isAvailable: true,
        },
      ],
      orders: [],
    };
  }

  private getMockAnalytics(): StorefrontAnalytics {
    return {
      revenue: 340.0,
      totalOrders: 23,
      avgSale: 14.78,
      mukandoContributionDue: 20.0,
      salesOverTime: [
        { label: 'Nov', amount: 120 },
        { label: 'Dec', amount: 220 },
      ],
      topProducts: [
        {
          name: 'Logo Design',
          sales: 12,
          revenue: 180.0,
        },
      ],
    };
  }

  // Learning methods
  getLearningContent(): Observable<LearningContent[]> {
    const mockContent: LearningContent[] = [
      // Beginner Tier
      {
        id: '1',
        title: 'Loan Repayment Strategies',
        type: 'article',
        duration: '5 min',
        points: 10,
        tier: 'Beginner',
        isCompleted: false,
        isLocked: false,
        category: 'Finance',
        content:
          "When you take a loan through HiveFund, ensuring you repay on time is critical to maintaining your credit score and accessing better rates in the future. Here are three key strategies to master repayment.\n\nFirst, Auto-Deduct is your friend. Never rely on your memory alone. Our system integrates directly with EcoCash to automate your payments. By setting this up, you avoid the risk of forgetting a due date and losing valuable credit points.\n\nSecond, Pay Early When Possible. Did you know that every early payment earns you +2 bonus points? If you have a good week with your side hustle, consider clearing your debt immediately. This lowers your utilization ratio and boosts your 'Trusted' status faster.\n\nFinally, Communicate if you struggle. Life happens. If you know you will miss a payment, do not default silently. Use the app to request a 3-day grace period. Transparency builds trust, while silence destroys it.",
      },
      {
        id: '2',
        title: 'Building Your First Credit Score',
        type: 'article',
        duration: '8 min',
        points: 15,
        tier: 'Beginner',
        isCompleted: false,
        isLocked: false,
        category: 'Finance',
        content:
          "Building a credit score from scratch can feel daunting, but with HiveFund, your community participation counts. Your score is not just about how much money you have; it is about how reliable you are.\n\nStart by Joining a Mukando Circle. Consistency is king. Making your $20 contribution on time for three months in a row is the fastest way to jump from 'Newbie' to 'Established'.\n\nNext, Complete Learning Modules. You are doing it right now! Every article you read proves you are serious about financial literacy. We reward this curiosity with +5 points per lesson.\n\nLastly, Avoid Over-Borrowing. Just because you are eligible for a $50 loan does not mean you should take it. Only borrow what you can turn into profit or essential value. A paid-off small loan looks better than a struggling large one.",
      },
      {
        id: '3',
        title: 'Scaling Your Side Hustle',
        type: 'video',
        duration: '12 min',
        points: 20,
        tier: 'Growing',
        isCompleted: false,
        isLocked: false,
        category: 'Business',
        content:
          'Learn how to turn your weekend gig into a full-time business. In this comprehensive video lesson, we cover essential strategies for scaling your side hustle:\n\nPricing Strategies: Learn how to price your services to ensure profitability. We discuss cost-plus pricing, value-based pricing, and competitive analysis. Discover how to increase prices without losing customers.\n\nMarketing on a Budget: Master low-cost marketing techniques using WhatsApp Status, Facebook groups, and word-of-mouth. Learn how to create compelling content that attracts customers without expensive advertising.\n\nWhen to Hire Help: Understand the signs that indicate you\'re ready to hire employees or contractors. Learn how to calculate if hiring will increase profits, and how to find reliable help without going into debt.\n\nTime Management: Discover techniques to maximize productivity and balance your side hustle with your day job. Learn when to quit your job and go full-time.\n\nFinancial Management: Understand how to separate business and personal finances, track expenses, and prepare for taxes. Learn when to reinvest profits vs. taking income.',
      },
      {
        id: '4',
        title: 'Understanding Credit Scores',
        type: 'article',
        duration: '10 min',
        points: 15,
        tier: 'Beginner',
        isCompleted: true,
        isLocked: false,
        category: 'Finance',
        content:
          "Your credit score is a number between 300 and 850 that represents your financial trustworthiness. In Zimbabwe, where traditional banking can be challenging, HiveFund uses community-based scoring to help you build credit.\n\nHow It Works: Your score starts at 500 (Newbie) and increases based on your financial behavior. Every on-time payment, completed circle contribution, and finished learning module adds points. Missing payments or defaulting on loans reduces your score.\n\nThe Tiers: Newbie (500-599), Growing (600-649), Established (650-699), and Trusted (700+). Each tier unlocks better loan rates, higher borrowing limits, and exclusive features.\n\nWhy It Matters: A higher credit score means lower interest rates on loans, faster approval times, and access to premium services. In Zimbabwe's economy, building credit through community participation is a powerful way to access financial opportunities.\n\nQuick Tips: Pay on time, join savings circles, complete learning modules, and avoid over-borrowing. Consistency is key - small, regular actions build your score faster than occasional large payments.",
      },
      {
        id: '5',
        title: 'Saving Money Basics',
        type: 'article',
        duration: '7 min',
        points: 10,
        tier: 'Beginner',
        isCompleted: true,
        isLocked: false,
        category: 'Savings',
        content:
          "Saving money is the foundation of financial security. In Zimbabwe, where economic conditions can be unpredictable, having savings provides a crucial safety net.\n\nThe 50/30/20 Rule: Allocate 50% of your income to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings. Adjust these percentages based on your income level.\n\nStart Small: You don't need to save large amounts. Even saving $5-10 per week adds up to $260-520 per year. The key is consistency, not the amount.\n\nUse Savings Circles: Mukando circles are a powerful savings tool in Zimbabwean culture. They provide structure, accountability, and community support. Join a circle that matches your savings goals.\n\nAutomate Your Savings: Set up automatic transfers to your savings account or circle contributions. When savings happen automatically, you're less likely to spend the money.\n\nEmergency Fund First: Before investing, build an emergency fund that covers 3-6 months of expenses. This protects you from unexpected costs like medical bills or job loss.\n\nTrack Your Spending: Use the HiveFund app to track where your money goes. Understanding your spending habits is the first step to saving more effectively.",
      },
      // Growing Tier
      {
        id: '6',
        title: 'Building an Emergency Fund',
        type: 'article',
        duration: '12 min',
        points: 20,
        tier: 'Growing',
        isCompleted: false,
        isLocked: false,
        category: 'Savings',
        content:
          "An emergency fund is your financial safety net. It's money set aside to cover unexpected expenses without going into debt or disrupting your financial goals.\n\nHow Much to Save: Aim for 3-6 months of essential expenses. If you spend $200/month on rent, food, and utilities, target $600-$1,200 in your emergency fund. Start with a smaller goal of $200-300, then build from there.\n\nWhere to Keep It: Your emergency fund should be easily accessible but separate from your daily spending account. Consider a separate EcoCash account or a dedicated savings circle that you don't touch except for true emergencies.\n\nWhat Counts as an Emergency: Medical emergencies, unexpected job loss, urgent home repairs, or family crises. A sale at your favorite store is NOT an emergency.\n\nBuilding Your Fund: Start by saving $10-20 per week. Use the HiveFund app to set up automatic transfers. Every time you receive income, transfer a percentage to your emergency fund first, before spending on anything else.\n\nRebuilding After Use: If you need to use your emergency fund, make rebuilding it a priority. Cut back on non-essential spending temporarily to restore your safety net.\n\nPeace of Mind: Having an emergency fund reduces stress and gives you confidence to make better financial decisions. You'll sleep better knowing you can handle unexpected expenses.",
      },
      {
        id: '7',
        title: 'Credit Card Management',
        type: 'article',
        duration: '8 min',
        points: 15,
        tier: 'Growing',
        isCompleted: false,
        isLocked: false,
        category: 'Credit',
        content:
          "Credit cards can be powerful financial tools when used responsibly, but they can also lead to debt if mismanaged. Here's how to use credit cards wisely.\n\nPay in Full Each Month: The golden rule of credit cards is to pay your full balance every month. This avoids interest charges and builds your credit score. If you can't pay in full, you're spending more than you can afford.\n\nUnderstand Interest Rates: Credit card interest rates in Zimbabwe can be high (often 20-30% annually). Carrying a balance means paying significant interest. Always check the APR (Annual Percentage Rate) before applying.\n\nUse Credit, Not Debit: Use your credit card for purchases you can afford, then pay it off immediately. This builds credit history and provides purchase protection. Never use credit cards for cash advances unless absolutely necessary.\n\nTrack Your Spending: Credit cards make it easy to overspend. Use the HiveFund app to track all credit card purchases. Set a monthly spending limit and stick to it.\n\nAvoid Minimum Payments: Paying only the minimum keeps you in debt longer and costs more in interest. Always pay more than the minimum, ideally the full balance.\n\nRewards and Benefits: Many credit cards offer rewards like cashback or points. Use these benefits, but don't let rewards tempt you into unnecessary spending. The rewards are only valuable if you pay your balance in full.\n\nCredit Utilization: Keep your credit card balance below 30% of your credit limit. High utilization hurts your credit score. If you have a $1,000 limit, try to keep your balance under $300.",
      },
      // Established Tier (Recommended for credit score 650)
      {
        id: '8',
        title: 'Loan Repayment Strategies',
        type: 'article',
        duration: '5 min',
        points: 25,
        tier: 'Established',
        isCompleted: false,
        isLocked: false,
        category: 'Loans',
        content:
          "As an Established member with a credit score of 650+, you have access to better loan terms. Here are advanced strategies to manage and repay loans effectively.\n\nThe Debt Snowball Method: List all your loans from smallest to largest. Pay minimums on all, then put extra money toward the smallest loan. Once it's paid off, roll that payment into the next smallest. This builds momentum and quick wins.\n\nThe Debt Avalanche Method: Focus on loans with the highest interest rates first. Pay minimums on all loans, then put extra money toward the highest-rate loan. This saves the most money on interest over time.\n\nRefinancing Opportunities: With an Established credit score, you may qualify for lower interest rates. Consider refinancing high-interest loans to reduce your monthly payments and total interest paid.\n\nBi-Weekly Payments: Instead of monthly payments, make half-payments every two weeks. This results in 26 half-payments per year (13 full payments), helping you pay off loans faster.\n\nExtra Payments Strategy: Whenever you receive extra income (bonuses, side hustle earnings, tax refunds), apply it directly to your loan principal. This reduces the total interest you'll pay.\n\nLoan Consolidation: If you have multiple loans, consider consolidating them into one loan with a lower interest rate. This simplifies payments and can reduce your total interest burden.\n\nCommunication is Key: If you're struggling with payments, contact your lender immediately. Many lenders offer hardship programs, payment plans, or temporary forbearance. Defaulting should be your last resort.",
      },
      {
        id: '9',
        title: 'Investment Fundamentals',
        type: 'article',
        duration: '8 min',
        points: 30,
        tier: 'Established',
        isCompleted: false,
        isLocked: false,
        category: 'Investing',
        content:
          "Investing is how you make your money work for you. As an Established member, you're ready to start building wealth through smart investments.\n\nStart with the Basics: Before investing, ensure you have an emergency fund (3-6 months expenses) and no high-interest debt. Investing while carrying credit card debt at 25% interest doesn't make sense when most investments return 8-12% annually.\n\nUnderstanding Risk and Return: Higher potential returns come with higher risk. Stocks can grow 10-15% annually but can also lose value. Bonds are safer but offer lower returns (5-8%). Diversification (spreading investments across different assets) reduces risk.\n\nInvestment Options in Zimbabwe: Consider government bonds, stocks on the Zimbabwe Stock Exchange (ZSE), real estate, or international investments through platforms like HiveFund's investment products. Each has different risk levels and potential returns.\n\nThe Power of Compound Interest: When you invest, you earn returns on both your original investment and your previous returns. Over time, this creates exponential growth. Starting early is crucial - a $100 investment at age 25 can grow to $1,700 by age 65 (at 8% annual return).\n\nDollar-Cost Averaging: Instead of investing a large sum at once, invest a fixed amount regularly (monthly or weekly). This reduces the impact of market volatility and helps you buy more shares when prices are low.\n\nLong-Term Thinking: Investing is a marathon, not a sprint. Don't panic during market downturns. Historically, markets recover and grow over the long term. Stay invested and continue regular contributions.\n\nSeek Professional Advice: As you build wealth, consider consulting with a financial advisor. They can help you create an investment strategy tailored to your goals, risk tolerance, and timeline.",
      },
      {
        id: '10',
        title: 'Understanding Mortgage Options',
        type: 'article',
        duration: '15 min',
        points: 35,
        tier: 'Established',
        isCompleted: false,
        isLocked: false,
        category: 'Loans',
        content:
          "A mortgage is likely the largest loan you'll ever take. Understanding your options helps you make the best decision for your financial future.\n\nTypes of Mortgages: Fixed-rate mortgages have the same interest rate for the entire loan term, providing predictable payments. Adjustable-rate mortgages (ARMs) start with lower rates but can increase over time. In Zimbabwe, fixed-rate mortgages are more common and provide stability.\n\nDown Payment Requirements: Most lenders require 10-20% down payment. A larger down payment reduces your monthly payments and total interest. Save aggressively for your down payment - it's the foundation of homeownership.\n\nLoan Terms: Common terms are 15, 20, or 30 years. Shorter terms mean higher monthly payments but less total interest. A 20-year mortgage saves significant interest compared to a 30-year, but requires higher monthly payments.\n\nPre-Approval Process: Get pre-approved before house hunting. This shows sellers you're serious and helps you understand your budget. Pre-approval involves credit checks, income verification, and debt-to-income ratio analysis.\n\nAdditional Costs: Beyond the mortgage payment, budget for property taxes, insurance, maintenance (1-2% of home value annually), and potential homeowners association (HOA) fees. These can add 20-30% to your monthly housing costs.\n\nRefinancing Opportunities: If interest rates drop or your credit score improves, consider refinancing your mortgage. This can lower your monthly payments or shorten your loan term. Calculate if the savings justify the refinancing costs.\n\nBuilding Equity: Each mortgage payment builds equity (ownership) in your home. In the early years, most payments go to interest. As you pay down the principal, more of each payment builds equity. This equity can be used for future investments or emergencies.\n\nRenting vs. Buying: Consider your situation carefully. Renting provides flexibility and no maintenance costs. Buying builds equity but requires commitment and ongoing costs. In Zimbabwe's market, buying often makes sense if you plan to stay 5+ years.",
      },
      // Trusted Tier (Locked - requires higher score)
      {
        id: '11',
        title: 'Advanced Investment Strategies',
        type: 'article',
        duration: '20 min',
        points: 50,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 700,
        category: 'Investing',
        content:
          "As a Trusted member with a credit score of 700+, you have access to advanced investment opportunities and strategies. This lesson covers sophisticated approaches to wealth building.\n\nPortfolio Diversification: Spread investments across asset classes (stocks, bonds, real estate, commodities), sectors (technology, healthcare, finance), and geographic regions. This reduces risk - when one investment underperforms, others may excel.\n\nAsset Allocation by Age: A common rule is to subtract your age from 100 to determine stock allocation. At 30, allocate 70% to stocks and 30% to bonds. At 50, shift to 50/50. Adjust based on your risk tolerance and financial goals.\n\nTax-Efficient Investing: In Zimbabwe, understand capital gains tax implications. Hold investments for longer periods to qualify for lower tax rates. Consider tax-advantaged accounts or investment vehicles that minimize tax burden.\n\nRebalancing Strategy: Review your portfolio quarterly or annually. If one asset class grows significantly, sell some to buy underperforming assets. This maintains your target allocation and forces you to 'sell high, buy low.'\n\nAlternative Investments: As a Trusted member, explore real estate investment trusts (REITs), peer-to-peer lending, cryptocurrency (with caution), or private equity. These offer diversification but require more research and carry higher risk.\n\nDollar-Cost Averaging vs. Lump Sum: For large windfalls (inheritance, bonuses), consider dollar-cost averaging over 6-12 months rather than investing all at once. This reduces timing risk, though historically, lump-sum investing often performs better.\n\nTax-Loss Harvesting: If an investment loses value, sell it to realize the loss, which can offset capital gains taxes. Then reinvest in a similar (but not identical) investment to maintain your portfolio allocation.\n\nEstate Planning: As you build wealth, consider how to pass it to heirs. Understand inheritance laws in Zimbabwe, set up wills, and consider trusts. Proper estate planning ensures your wealth benefits your family as intended.\n\nProfessional Management: Consider hiring a financial advisor or using robo-advisors for portfolio management. They can provide expertise, save you time, and help you avoid emotional investment decisions.\n\nContinuous Learning: Investment strategies evolve. Stay informed about market trends, economic conditions, and new investment opportunities. Join investment clubs, read financial news, and continue learning through HiveFund's advanced courses.",
      },
      {
        id: '12',
        title: 'Tax Optimization Techniques',
        type: 'article',
        duration: '12 min',
        points: 40,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 750,
        category: 'Finance',
        content:
          "Tax optimization is legal tax planning that minimizes your tax burden while maximizing your wealth. As a Trusted member, understanding tax strategies can save you thousands annually.\n\nUnderstand Zimbabwe Tax Laws: Familiarize yourself with income tax brackets, capital gains tax, and deductions available. Tax laws change, so stay updated through ZIMRA (Zimbabwe Revenue Authority) announcements or consult a tax professional.\n\nMaximize Deductions: Keep detailed records of business expenses, charitable donations, medical expenses, and education costs. These may be deductible and reduce your taxable income. Use the HiveFund app to track expenses throughout the year.\n\nRetirement Contributions: Contributions to approved retirement funds are often tax-deductible. Maximize these contributions to reduce current-year taxes while building retirement savings. This is a powerful double benefit.\n\nTiming Income and Expenses: If possible, time large expenses (medical procedures, business investments) in high-income years to maximize deductions. Similarly, consider deferring income to lower-tax years when possible.\n\nCapital Gains Planning: Hold investments for longer periods to qualify for lower long-term capital gains rates. Consider selling losing investments to offset gains (tax-loss harvesting). Plan sales strategically across tax years.\n\nBusiness Structure: If you have side income or a business, consider the most tax-efficient structure (sole proprietorship, partnership, corporation). Each has different tax implications. Consult a tax advisor for your specific situation.\n\nCharitable Giving: Donations to registered charities may be tax-deductible. This allows you to support causes you care about while reducing taxes. Keep receipts and documentation for all charitable contributions.\n\nTax-Advantaged Accounts: Explore investment accounts or savings vehicles that offer tax benefits. Some accounts allow tax-free growth or tax-deductible contributions. Research options available in Zimbabwe.\n\nRecord Keeping: Maintain organized records of all income, expenses, investments, and deductions. Use digital tools like the HiveFund app to track everything. Good records make tax filing easier and help you claim all eligible deductions.\n\nProfessional Help: As your financial situation becomes more complex, consider hiring a tax professional. They can identify deductions you might miss, ensure compliance, and help with tax planning strategies. The cost is often offset by tax savings.\n\nYear-Round Planning: Don't wait until tax season. Review your tax situation quarterly and adjust strategies throughout the year. This proactive approach maximizes savings and avoids year-end surprises.",
      },
      {
        id: '13',
        title: 'Wealth Building Blueprint',
        type: 'article',
        duration: '25 min',
        points: 60,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 750,
        category: 'Investing',
        content:
          "Building lasting wealth requires a comprehensive strategy, discipline, and time. This blueprint provides a roadmap for Trusted members ready to achieve financial independence.\n\nDefine Your Wealth Goals: What does wealth mean to you? Financial independence? Early retirement? Generational wealth? Specific goals guide your strategy. Write down your goals with timelines and dollar amounts.\n\nThe Wealth Building Formula: Income - Expenses = Savings. Increase income, decrease expenses, or both. Focus on maximizing the gap between what you earn and what you spend. This gap is your wealth-building fuel.\n\nMultiple Income Streams: Don't rely on a single income source. Develop side hustles, invest in income-generating assets (rental properties, dividend stocks), or start a business. Multiple streams provide security and accelerate wealth building.\n\nAutomate Your Wealth Building: Set up automatic transfers to investment accounts, savings circles, and retirement funds. Pay yourself first - transfer money to wealth-building accounts before spending on anything else. Automation removes the temptation to spend.\n\nThe 10% Rule: Aim to save and invest at least 10% of your income. As your income grows, increase this percentage. Many wealthy individuals save 20-30% of their income. Start where you can and increase over time.\n\nInvest in Assets, Not Liabilities: Assets put money in your pocket (rental properties, dividend stocks, businesses). Liabilities take money out (cars, consumer debt, expensive hobbies). Focus on acquiring assets that generate income.\n\nLeverage Compound Interest: Start investing early and consistently. Time is your greatest ally. A $100 monthly investment starting at age 25 can grow to over $300,000 by age 65 (at 8% annual return). Starting 10 years later reduces this to $130,000.\n\nReal Estate Investment: Property can be a powerful wealth builder in Zimbabwe. Rental income provides cash flow, while property values may appreciate. Start with one property, learn the business, then scale. Consider real estate investment trusts (REITs) for easier entry.\n\nBusiness Ownership: Starting or buying a business can accelerate wealth building significantly. Use your skills, network, and HiveFund's resources to identify opportunities. Start small, validate the concept, then scale.\n\nContinuous Education: Wealth building requires ongoing learning. Read books, take courses, attend seminars, and learn from successful investors. The HiveFund learning platform offers advanced courses for Trusted members.\n\nNetwork and Mentorship: Surround yourself with successful, wealth-minded individuals. Join investment clubs, attend networking events, and seek mentors. Learning from others' experiences accelerates your progress.\n\nProtect Your Wealth: As you build wealth, protect it with insurance (life, health, property), proper legal structures (wills, trusts), and diversification. Don't put all your eggs in one basket.\n\nGive Back: True wealth includes the ability to help others. As you build wealth, consider charitable giving, mentoring others, or investing in your community. This creates meaning beyond financial accumulation.\n\nPatience and Discipline: Wealth building is a marathon, not a sprint. Stay disciplined during market downturns, avoid get-rich-quick schemes, and stick to your plan. Consistency over decades creates extraordinary results.\n\nReview and Adjust: Review your wealth-building plan annually. Adjust for life changes, market conditions, and new opportunities. A flexible plan adapts to circumstances while maintaining focus on long-term goals.",
      },
      {
        id: '14',
        title: 'Real Estate Investment',
        type: 'article',
        duration: '18 min',
        points: 45,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 700,
        category: 'Investing',
        content:
          "Real estate investment is a proven path to wealth building. In Zimbabwe, property can provide rental income, capital appreciation, and portfolio diversification. This guide covers strategies for Trusted members.\n\nWhy Real Estate: Real estate offers multiple benefits: rental income provides cash flow, property values may appreciate over time, you can leverage (borrow money to buy), and it's a tangible asset you can see and touch. Real estate has historically been a strong wealth builder.\n\nTypes of Real Estate: Residential properties (houses, apartments) are easier to understand and manage. Commercial properties (offices, retail) offer higher returns but require more expertise. Land can appreciate but doesn't generate income. Choose based on your goals and expertise.\n\nLocation, Location, Location: Property value depends heavily on location. Research areas with growing populations, good infrastructure, schools, and employment opportunities. In Harare, areas like Borrowdale, Mount Pleasant, and Avondale have shown strong growth.\n\nFinancing Your Investment: With a Trusted credit score (700+), you qualify for better mortgage rates. Consider a 20-30% down payment to secure favorable terms. Some investors use equity from their primary residence to finance investment properties.\n\nCash Flow Analysis: Before buying, calculate cash flow: Rental Income - (Mortgage + Taxes + Insurance + Maintenance + Vacancy Reserve) = Cash Flow. Positive cash flow means the property pays for itself and generates income. Negative cash flow requires you to subsidize the property.\n\nProperty Management: Decide if you'll manage the property yourself or hire a property manager. Self-management saves money but requires time and expertise. Professional management costs 8-12% of rental income but handles tenant issues, maintenance, and rent collection.\n\nTax Benefits: Rental property offers tax advantages: mortgage interest, property taxes, maintenance, and depreciation may be deductible. Consult a tax professional to understand specific benefits in Zimbabwe.\n\nBuilding a Portfolio: Start with one property, learn the business, then add more. Many successful investors own 3-5 properties before considering larger commercial investments. Each property teaches valuable lessons.\n\nExit Strategies: Plan your exit before buying. Will you hold long-term for rental income? Flip for quick profit? Refinance to pull out equity? Having a clear exit strategy guides your investment decisions.\n\nRisks and Challenges: Real estate isn't without risk: property values can decline, tenants may default, maintenance costs can be high, and properties may sit vacant. Have reserves to cover 3-6 months of expenses.\n\nReal Estate Investment Trusts (REITs): If direct property ownership seems daunting, consider REITs. These are companies that own and manage real estate. You buy shares, receiving dividends from rental income. REITs offer diversification and professional management.\n\nDue Diligence: Before buying, conduct thorough research: property inspection, title search, market analysis, tenant history, and financial review. Don't skip due diligence - it prevents costly mistakes.\n\nNetworking: Connect with real estate agents, property managers, contractors, and other investors. A strong network provides opportunities, advice, and support. Join real estate investment groups in Zimbabwe.\n\nLong-Term Perspective: Real estate is a long-term investment. Don't expect quick profits. Focus on cash flow and long-term appreciation. Properties typically appreciate 3-5% annually, plus rental income provides ongoing returns.\n\nScaling Your Portfolio: As you gain experience and build equity, consider scaling. Use equity from existing properties to finance new purchases. This leverage can accelerate portfolio growth, but increases risk - use carefully.",
      },
    ];
    return of(mockContent).pipe(delay(500));
  }

  getLearningContentById(id: string): Observable<LearningContent | null> {
    return this.getLearningContent().pipe(
      map((content) => content.find((c) => c.id === id) || null),
      delay(300),
    );
  }

  markContentAsComplete(id: string): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  getBadges(): Observable<Badge[]> {
    const mockBadges: Badge[] = [
      {
        id: '1',
        name: 'First Steps',
        icon: '🎯',
        description: 'Complete your first lesson',
        isUnlocked: true,
      },
      {
        id: '2',
        name: 'Budget Master',
        icon: '💰',
        description: 'Complete all budget lessons',
        isUnlocked: false,
      },
    ];
    return of(mockBadges).pipe(delay(500));
  }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    const mockLeaderboard: LeaderboardEntry[] = [
      { userId: 'user-1', name: 'John Doe', points: 150, rank: 1 },
      { userId: 'current-user', name: 'You', points: 60, rank: 5 },
      { userId: 'user-2', name: 'Jane Smith', points: 120, rank: 2 },
    ];
    return of(mockLeaderboard).pipe(delay(500));
  }

  // Marketplace methods
  getGigs(): Observable<Gig[]> {
    return this.gigsSubject.asObservable().pipe(delay(300));
  }

  getGigById(id: string): Observable<Gig | null> {
    return this.getGigs().pipe(
      map((gigs) => gigs.find((g) => g.id === id) || null),
      delay(300),
    );
  }

  getMyBookings(type: 'customer' | 'provider'): Observable<Booking[]> {
    return this.bookingsSubject.asObservable().pipe(
      map((bookings) => bookings.filter(b => b.type === type)),
      delay(300),
    );
  }

  // Budget methods
  analyzeBudget(profile: BudgetProfile): Observable<BudgetAnalysis> {
    const totalExpenses =
      profile.rent +
      profile.groceries +
      profile.transport +
      profile.utilities +
      profile.entertainment;
    const remainingBudget = profile.totalIncome - totalExpenses;
    const savingsRate = (remainingBudget / profile.totalIncome) * 100;
    const healthScore = Math.min(100, Math.max(0, savingsRate * 1.2));

    const analysis: BudgetAnalysis = {
      totalExpenses,
      remainingBudget,
      savingsRate: Math.round(savingsRate * 100) / 100,
      healthScore: Math.round(healthScore),
      recommendations: [
        'Consider reducing entertainment expenses',
        'Try to save at least 20% of your income',
      ],
      breakdown: {
        needs: profile.rent + profile.groceries + profile.utilities,
        wants: profile.entertainment + profile.transport,
        savings: Math.max(0, remainingBudget),
      },
    };

    return of(analysis).pipe(delay(800));
  }

  // ==================== TAKUDZWANASHE PERSONA DATA ====================

  /**
   * Initialize core persona data for Takudzwanashe Mahachi
   */
  private initializePersonaData(): void {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const olderDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User Profile
    const profile: UserProfile = {
      id: 'user-takudzwanashe',
      name: 'Takudzwanashe Mahachi',
      phone: '+263 77 412 3456',
      bio: 'Freelance Tech Consultant in Harare. Building financial freedom through smart savings and side hustles.',
      creditScore: 650,
      tier: 'Established',
      profileImage: 'TM',
    };
    this.userProfileSubject.next(profile);

    // Wallet Data with Transactions
    const transactions: Transaction[] = [
      {
        id: 'txn-1',
        title: 'ZESA Token Purchase',
        subtitle: 'Utilities',
        amount: -20.0,
        date: today,
        type: 'debit',
        category: 'utilities',
      },
      {
        id: 'txn-2',
        title: 'Mukando Contribution',
        subtitle: 'Harare CBD Tech Dealers',
        amount: -50.0,
        date: today,
        type: 'debit',
        category: 'contribution',
      },
      {
        id: 'txn-3',
        title: 'Chicken Inn Avondale',
        subtitle: 'Food',
        amount: -12.5,
        date: yesterday,
        type: 'debit',
        category: 'food',
      },
      {
        id: 'txn-4',
        title: 'Gig Payment',
        subtitle: 'Network Setup - Farai Z.',
        amount: 45.0,
        date: yesterday,
        type: 'credit',
        category: 'gig',
      },
      {
        id: 'txn-5',
        title: 'Storefront Sale',
        subtitle: 'Logo Design - Blessing M.',
        amount: 80.0,
        date: yesterday,
        type: 'credit',
        category: 'storefront',
      },
      {
        id: 'txn-6',
        title: 'Econet Airtime',
        subtitle: 'Mobile',
        amount: -5.0,
        date: olderDate,
        type: 'debit',
        category: 'transport',
      },
      {
        id: 'txn-7',
        title: 'Loan Repayment',
        subtitle: 'Short-term Loan #LN-4567',
        amount: -25.0,
        date: olderDate,
        type: 'debit',
        category: 'loan',
      },
    ];

    const walletData: WalletData = {
      balance: 225.50, // 145.50 + 80 (storefront sale)
      lastUpdated: '2 mins ago',
      transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
    this.walletDataSubject.next(walletData);

    // Savings Circles
    const circles: Circle[] = [
      {
        id: 'circle-1',
        name: 'Harare CBD Tech Dealers',
        status: 'active',
        memberCount: 8,
        maxMembers: 10,
      },
      {
        id: 'circle-2',
        name: 'MSU Alumni Squad',
        status: 'active',
        memberCount: 4,
        maxMembers: 10,
      },
      {
        id: 'circle-3',
        name: 'Ngwenya Family Trust',
        status: 'active',
        memberCount: 9,
        maxMembers: 12,
      },
      {
        id: 'circle-4',
        name: 'Kuwadzana Ride Club',
        status: 'completed',
        memberCount: 10,
        maxMembers: 10,
      },
    ];
    this.circlesSubject.next(circles);

    // Credit Score
    const creditScore: CreditScore = {
      score: 650,
      tier: 'Established',
      nextTier: 'Trusted',
      pointsToNext: 50,
      breakdown: {
        paymentConsistency: { current: 260, max: 400 },
        timeActive: { current: 160, max: 200 },
        circleActivity: { current: 85, max: 100 },
        marketActivity: { current: 60, max: 100 },
      },
    };
    this.creditScoreSubject.next(creditScore);

    // Credit History
    const creditHistory: CreditHistoryItem[] = [
      {
        date: yesterday.toISOString(),
        event: 'Loan Repayment #LN-99',
        pointsChange: 10,
        description: 'On-time payment',
      },
      {
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Joined Harare CBD Tech Dealers',
        pointsChange: 20,
        description: 'Circle participation',
      },
      {
        date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Completed Kuwadzana Ride Club',
        pointsChange: 50,
        description: 'Circle completion',
      },
    ];
    this.creditHistorySubject.next(creditHistory);

    // Loan Products
    const loanProducts: LoanProduct[] = [
      {
        id: 'loan-1',
        name: 'Micro Loan',
        range: '$10-$50',
        interest: '5%',
        duration: '1-3 months',
        isEligible: true,
      },
      {
        id: 'loan-2',
        name: 'Short-Term Loan',
        range: '$50-$200',
        interest: '8%',
        duration: '3-6 months',
        isEligible: true,
      },
      {
        id: 'loan-3',
        name: 'Growth Loan',
        range: '$200-$500',
        interest: '10%',
        duration: '6-12 months',
        isEligible: false,
        lockReason: 'Requires Credit Score 700+',
      },
    ];
    this.loanProductsSubject.next(loanProducts);

    // Loans (Active & Past)
    const loans: Loan[] = [
      {
        id: 'loan-active-1',
        type: 'Short-Term Loan',
        amount: 100,
        remainingAmount: 82.50,
        progress: 18,
        status: 'active',
        nextPaymentDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'loan-completed-1',
        type: 'Micro Loan',
        amount: 25,
        remainingAmount: 0,
        progress: 100,
        status: 'completed',
        completedDate: yesterday.toISOString(),
        creditPoints: 10,
      },
    ];
    this.loansSubject.next(loans);
  }

  /**
   * Initialize Storefront and Marketplace data for Takudzwanashe
   */
  private initializeStorefrontAndMarketplace(): void {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Storefront: Taku's Tech Solutions
    const storefront: Storefront = {
      id: 'storefront-1',
      name: "Taku's Tech Solutions",
      slug: 'takus-tech',
      description: 'Professional IT support and digital services for Harare SMEs.',
      logoUrl: '',
      bannerUrl: '',
      ownerId: 'user-takudzwanashe',
      merchantId: 'ECO-77412',
      products: [
        {
          id: 'prod-1',
          name: 'Basic Website Package',
          price: 80.0,
          description: 'Professional website for small businesses',
          imageUrl: '',
          isAvailable: true,
        },
        {
          id: 'prod-2',
          name: 'Router Config Guide',
          price: 15.0,
          description: 'Step-by-step router configuration service',
          imageUrl: '',
          isAvailable: true,
        },
        {
          id: 'prod-3',
          name: 'On-Site Consultation',
          price: 45.0,
          description: 'In-person IT consultation and setup',
          imageUrl: '',
          isAvailable: false,
        },
      ],
      orders: [
        {
          id: 'ORD-88',
          customerName: 'Blessing M.',
          customerPhone: '+263 77 123 4567',
          date: yesterday.toISOString(),
          status: 'completed',
          total: 80.0,
          items: [
            {
              productName: 'Basic Website Package',
              quantity: 1,
              price: 80.0,
            },
          ],
        },
      ],
    };
    this.storefrontSubject.next(storefront);

    // Gigs
    const gigs: Gig[] = [
      {
        id: 'gig-1',
        title: 'Network & WiFi Installation',
        description: 'Professional network setup and WiFi installation for homes and small businesses in Harare.',
        category: 'Tech',
        rate: 45,
        rateType: 'fixed',
        provider: {
          id: 'user-takudzwanashe',
          name: 'Takudzwanashe Mahachi',
          avatar: 'TM',
          rating: 5.0,
          trustScore: 650,
          isVerified: true,
          memberSince: '2024-01',
          jobsCompleted: 12,
        },
        location: 'Harare',
        availability: 'Weekdays & Weekends',
        reviewCount: 8,
        reviews: [
          {
            name: 'Farai Z.',
            rating: 5,
            comment: 'Excellent service! Network setup was quick and professional.',
          },
        ],
      },
      {
        id: 'gig-2',
        title: 'ZIMSEC Math Tutoring',
        description: 'Expert math tutoring for high school students. Specializing in algebra, calculus, and test prep.',
        category: 'Academic',
        rate: 5,
        rateType: 'hourly',
        provider: {
          id: 'provider-tanaka',
          name: 'Tanaka M.',
          avatar: 'TM',
          rating: 4.8,
          trustScore: 720,
          isVerified: true,
          memberSince: '2023-06',
          jobsCompleted: 47,
        },
        location: 'Remote',
        availability: 'Weekdays 3-6 PM',
        reviewCount: 12,
        reviews: [],
      },
      {
        id: 'gig-3',
        title: 'Event Photography',
        description: 'Professional photography for events, portraits, and product shoots.',
        category: 'Creative',
        rate: 50,
        rateType: 'fixed',
        provider: {
          id: 'provider-rudo',
          name: 'Rudo K.',
          avatar: 'RK',
          rating: 5.0,
          trustScore: 780,
          isVerified: true,
          memberSince: '2023-03',
          jobsCompleted: 35,
        },
        location: 'Harare',
        availability: 'Flexible',
        reviewCount: 15,
        reviews: [],
      },
    ];
    this.gigsSubject.next(gigs);

    // Bookings
    const bookings: Booking[] = [
      {
        id: 'booking-1',
        gigTitle: 'Network Setup',
        otherPartyName: 'Farai Z.',
        date: yesterday.toISOString(),
        duration: 1,
        totalCost: 45.0,
        status: 'completed',
        type: 'provider',
      },
      {
        id: 'booking-2',
        gigTitle: 'Photography Session',
        otherPartyName: 'Rudo K.',
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 2,
        totalCost: 50.0,
        status: 'pending',
        type: 'customer',
      },
    ];
    this.bookingsSubject.next(bookings);
  }

  // ==================== GETTER METHODS ====================

  getUserProfile(): Observable<UserProfile | null> {
    return this.userProfileSubject.asObservable();
  }

  getWalletData(): Observable<WalletData> {
    return this.walletDataSubject.asObservable().pipe(
      map(data => data || { balance: 0, lastUpdated: 'Never', transactions: [] })
    );
  }

  getCircles(): Observable<Circle[]> {
    // Ensure data is initialized
    const currentCircles = this.circlesSubject.value;
    if (currentCircles.length === 0) {
      // Re-initialize if empty (shouldn't happen, but safety check)
      this.initializePersonaData();
      // Get the updated value after initialization
      return of(this.circlesSubject.value);
    }
    // Return current value as a completing Observable
    return of(currentCircles);
  }

  getCreditScore(): Observable<CreditScore | null> {
    return this.creditScoreSubject.asObservable();
  }

  getCreditHistory(): Observable<CreditHistoryItem[]> {
    return this.creditHistorySubject.asObservable();
  }

  getLoanProducts(): Observable<LoanProduct[]> {
    return this.loanProductsSubject.asObservable();
  }

  getLoans(): Observable<Loan[]> {
    return this.loansSubject.asObservable();
  }

  getGigs$(): Observable<Gig[]> {
    return this.gigsSubject.asObservable();
  }

  getBookings$(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }

  // Update methods
  updateUserProfile(profile: UserProfile): void {
    this.userProfileSubject.next(profile);
  }

  addTransaction(transaction: Transaction): void {
    const current = this.walletDataSubject.value;
    if (current) {
      const newBalance = current.balance + transaction.amount;
      const updated: WalletData = {
        ...current,
        balance: newBalance,
        transactions: [transaction, ...current.transactions].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        ),
        lastUpdated: 'Just now',
      };
      this.walletDataSubject.next(updated);
    }
  }

  updateWalletBalance(amount: number): void {
    const current = this.walletDataSubject.value;
    if (current) {
      this.walletDataSubject.next({
        ...current,
        balance: current.balance + amount,
        lastUpdated: 'Just now',
      });
    }
  }

  updateCircle(circle: Circle): void {
    const current = this.circlesSubject.value;
    const index = current.findIndex(c => c.id === circle.id);
    if (index >= 0) {
      const updated = [...current];
      updated[index] = circle;
      this.circlesSubject.next(updated);
    }
  }

  addCircle(circle: Circle): void {
    const current = this.circlesSubject.value;
    this.circlesSubject.next([...current, circle]);
  }

  updateCreditScore(score: CreditScore): void {
    this.creditScoreSubject.next(score);
  }

  addCreditHistoryItem(item: CreditHistoryItem): void {
    const current = this.creditHistorySubject.value;
    this.creditHistorySubject.next([item, ...current]);
  }

  addLoan(loan: Loan): void {
    const current = this.loansSubject.value;
    this.loansSubject.next([...current, loan]);
  }

  updateLoan(loan: Loan): void {
    const current = this.loansSubject.value;
    const index = current.findIndex(l => l.id === loan.id);
    if (index >= 0) {
      const updated = [...current];
      updated[index] = loan;
      this.loansSubject.next(updated);
    }
  }

  // ==================== CIRCLE MOCK DATA METHODS ====================

  getMockCircleDetail(id: string): CircleDetail | null {
    // Normalize circleId (handle both 'circle-1' and '1' formats)
    const normalizedId = id.replace('circle-', '');
    
    const mockDetails: Record<string, CircleDetail> = {
      '1': {
        id: 'circle-1',
        name: 'Harare CBD Tech Dealers',
        description: 'A savings circle for tech professionals and entrepreneurs in Harare CBD. Building wealth together through consistent contributions.',
        contributionAmount: 50,
        frequency: 'monthly',
        maxMembers: 10,
        isPublic: true,
        status: 'active',
        inviteCode: 'CBD2024',
        creatorId: 'blessing-chidziva',
        createdAt: '2024-01-15T10:00:00Z',
      },
      '2': {
        id: 'circle-2',
        name: 'MSU Alumni Squad',
        description: 'Midlands State University alumni supporting each other\'s financial growth. Monthly contributions to help members achieve their goals.',
        contributionAmount: 20,
        frequency: 'monthly',
        maxMembers: 10,
        isPublic: true,
        status: 'active',
        inviteCode: 'MSU2024',
        creatorId: 'chipo-mhere',
        createdAt: '2024-02-01T14:30:00Z',
      },
      '3': {
        id: 'circle-3',
        name: 'Ngwenya Family Trust',
        description: 'Family savings circle for long-term financial planning and wealth building.',
        contributionAmount: 30,
        frequency: 'monthly',
        maxMembers: 12,
        isPublic: false,
        status: 'active',
        inviteCode: 'MAH2024',
        creatorId: 'user-3',
        createdAt: '2023-06-01T09:00:00Z',
      },
      '4': {
        id: 'circle-4',
        name: 'Kuwadzana Ride Club',
        description: 'Completed savings circle for transportation and vehicle expenses.',
        contributionAmount: 25,
        frequency: 'monthly',
        maxMembers: 10,
        isPublic: false,
        status: 'completed',
        inviteCode: 'KWC2023',
        creatorId: 'user-4',
        createdAt: '2023-01-01T09:00:00Z',
      },
    };

    return mockDetails[normalizedId] || null;
  }

  getMockCircleMembers(circleId: string): CircleMember[] {
    // Normalize circleId (handle both 'circle-1' and '1' formats)
    const normalizedId = circleId.replace('circle-', '');
    
    const mockMembers: Record<string, CircleMember[]> = {
      '1': [
        // Harare CBD Tech Dealers (8/10 Members)
        { 
          id: 'm1', 
          name: 'Takudzwanashe M.', 
          avatarUrl: 'TM',
          paymentStatus: 'paid',
          isCreator: false,
          position: 1
        },
        { 
          id: 'm2', 
          name: 'Blessing Chidziva', 
          avatarUrl: 'BC',
          paymentStatus: 'paid',
          isCreator: true,
          position: 2
        },
        { 
          id: 'm3', 
          name: 'Farai Gwaradzimba', 
          avatarUrl: 'FG',
          paymentStatus: 'paid',
          isCreator: false,
          position: 3
        },
        { 
          id: 'm4', 
          name: 'Rudo Kanyemba', 
          avatarUrl: 'RK',
          paymentStatus: 'paid',
          isCreator: false,
          position: 4
        },
        { 
          id: 'm5', 
          name: 'Tendai Zvobgo', 
          avatarUrl: 'TZ',
          paymentStatus: 'paid',
          isCreator: false,
          position: 5
        },
        { 
          id: 'm6', 
          name: 'Nyasha Moyo', 
          avatarUrl: 'NM',
          paymentStatus: 'paid',
          isCreator: false,
          position: 6
        },
        { 
          id: 'm7', 
          name: 'Sipho Ndlovu', 
          avatarUrl: 'SN',
          paymentStatus: 'unpaid',
          isCreator: false,
          position: 7
        },
        { 
          id: 'm8', 
          name: 'Tafadzwa Jere', 
          avatarUrl: 'TJ',
          paymentStatus: 'unpaid',
          isCreator: false,
          position: 8
        },
      ],
      '2': [
        // MSU Alumni Squad (4/10 Members)
        { 
          id: 'm9', 
          name: 'Chipo Mhere', 
          avatarUrl: 'CM',
          paymentStatus: 'paid',
          isCreator: true,
          position: 1
        },
        { 
          id: 'm10', 
          name: 'Takudzwanashe M.', 
          avatarUrl: 'TM',
          paymentStatus: 'paid',
          isCreator: false,
          position: 2
        },
        { 
          id: 'm11', 
          name: 'Brian Tsumba', 
          avatarUrl: 'BT',
          paymentStatus: 'paid',
          isCreator: false,
          position: 3
        },
        { 
          id: 'm12', 
          name: 'Mercy Dube', 
          avatarUrl: 'MD',
          paymentStatus: 'unpaid',
          isCreator: false,
          position: 4
        },
      ],
    };

    return mockMembers[normalizedId] || [];
  }

  getMockCircleTimeline(circleId: string): PayoutEntry[] {
    // Normalize circleId
    const normalizedId = circleId.replace('circle-', '');
    
    const mockTimelines: Record<string, PayoutEntry[]> = {
      '1': [
        {
          turn: 1,
          payoutDate: '2024-02-15',
          memberId: 'm2',
          memberName: 'Blessing Chidziva',
          status: 'completed',
        },
        {
          turn: 2,
          payoutDate: '2024-03-15',
          memberId: 'm3',
          memberName: 'Farai Gwaradzimba',
          status: 'completed',
        },
        {
          turn: 3,
          payoutDate: '2024-04-15',
          memberId: 'm1',
          memberName: 'Takudzwanashe M.',
          status: 'pending',
        },
      ],
      '2': [
        {
          turn: 1,
          payoutDate: '2024-03-01',
          memberId: 'm9',
          memberName: 'Chipo Mhere',
          status: 'completed',
        },
      ],
    };

    return mockTimelines[normalizedId] || [];
  }

  // ==================== SERVICES METHODS ====================

  getServiceProducts(): Observable<ServiceProduct[]> {
    const products: ServiceProduct[] = [
      // Connect (SmartFund Airtime & Data)
      {
        id: 'service-1',
        provider: 'SmartFund',
        name: 'SmartFund 10GB Bundle',
        description: 'Monthly work bundle - 10GB data valid for 30 days',
        price: 10.0,
        category: 'Connect',
        icon: 'wifi',
      },
      {
        id: 'service-2',
        provider: 'SmartFund',
        name: 'SmartFund Daily Boost',
        description: '1GB data valid for 24 hours - perfect for quick tasks',
        price: 1.0,
        category: 'Connect',
        icon: 'zap',
      },
      {
        id: 'service-3',
        provider: 'SmartFund',
        name: 'Airtime Top-up',
        description: 'Top up your mobile phone with airtime credit',
        price: 'Variable',
        category: 'Connect',
        icon: 'phone',
      },
      // Utilities (ZESA)
      {
        id: 'service-4',
        provider: 'ZESA',
        name: 'ZESA Prepaid Token',
        description: 'Purchase electricity tokens for your prepaid meter. Minimum $5',
        price: 'Variable',
        category: 'Utilities',
        icon: 'bolt',
      },
      // Security (EcoSure & Dura)
      {
        id: 'service-5',
        provider: 'EcoSure',
        name: 'EcoSure Funeral Cover',
        description: 'Basic funeral cover - $2/month for peace of mind',
        price: 2.0,
        category: 'Security',
        icon: 'shield',
      },
      {
        id: 'service-6',
        provider: 'EcoSure',
        name: 'EcoSure Health Add-on',
        description: 'Additional health coverage on top of funeral cover',
        price: 5.0,
        category: 'Security',
        icon: 'heart',
      },
      {
        id: 'service-7',
        provider: 'Dura',
        name: 'Dura / Isiphala Pension',
        description: 'Save for retirement with flexible contribution amounts',
        price: 'Variable',
        category: 'Security',
        icon: 'piggy-bank',
      },
    ];
    return of(products).pipe(delay(300));
  }
}
