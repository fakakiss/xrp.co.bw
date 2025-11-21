
import { User, UserRank, UserRole, SystemSettings, KnowledgeBaseArticle, NewsItem } from './types';

export const MOCK_XRP_PRICE_BWP = 32.50; // 1 XRP = ~32.50 Pula
export const TARGET_BOTTLES_PER_MONTH = 250;

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  siteTitle: "Gemini 3 Challenge",
  heroTagline: "The race to 100 pioneers is on. Recycle bottles, earn BWP, and build your XRP portfolio.",
  youtubeVideoId: "Q8Cpa1-8jRA",
  defaultBottleValueBWP: 1.00,
  leaderboardSize: 25,
  xrpDisplayCurrency: 'USD',
  registrationFeeBWP: 100,
  paymentPhoneNumber: "74470304",
  cycleMonth: 2, // Currently in Month 2 of 5
  totalCycleMonths: 5,
  minMonthlyTarget: 250
};

export const MOCK_KB_ARTICLES: KnowledgeBaseArticle[] = [
  {
    id: 'kb-1',
    category: 'System Rules',
    title: 'Cycle 1: The Pioneer Rules',
    summary: 'Understanding the 5-month cycle and 250 bottle requirement.',
    content: 'The first cycle requires 100 participants to collect 250 bottles monthly for 4 months. The 5th month is for processing. All value is converted to XRP and locked for 24 months.',
    author: 'Root',
    dateCreated: '2023-09-01'
  },
  {
    id: 'kb-2',
    category: 'XRP Basics',
    title: 'Why XRP?',
    summary: 'Why we chose XRP for the 24-month growth plan.',
    content: 'XRP offers fast transaction speeds and low fees, making it ideal for micro-transactions. We believe in its long-term utility for cross-border value transfer.',
    author: 'Admin 1',
    dateCreated: '2023-09-05'
  },
  {
    id: 'kb-3',
    category: 'Recycling Guide',
    title: 'Accepted Bottle Types',
    summary: 'What counts towards your 250 quota?',
    content: 'We accept PET plastic bottles (Coke, Water types) and Glass beverage bottles. Please remove caps and rinse before delivery.',
    author: 'Admin 2',
    dateCreated: '2023-09-10'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Cycle Month 1 Complete!',
    type: 'Highlight',
    description: 'We have successfully collected over 15,000 bottles in the first month. Great job pioneers!',
    datePublished: '2023-10-01'
  },
  {
    id: 'news-2',
    title: 'New Collection Center Open',
    type: 'Announcement',
    description: 'You can now drop off bottles at the Gaborone North depot every Saturday.',
    datePublished: '2023-10-05'
  }
];

export const MOCK_USERS: User[] = Array.from({ length: 100 }).map((_, i) => {
  // REALISTIC DATA: Range between 1000 and 1500 total bottles
  const totalBottles = Math.floor(Math.random() * 501) + 1000; 
  
  const history = [];
  let runningXRP = 0;
  
  // Generate 4 months of active history to sum up to totalBottles (approx)
  const monthsActive = 4;
  const avgPerMonth = Math.floor(totalBottles / monthsActive);

  for (let m = 0; m < monthsActive; m++) {
    // Vary slightly per month
    const variation = Math.floor(Math.random() * 50) - 25; 
    const bottles = avgPerMonth + variation;
    const xrpEarned = (bottles * 1.00) / (MOCK_XRP_PRICE_BWP + (Math.random() * 2 - 1));
    runningXRP += xrpEarned;
    history.push({
      month: `Month ${m + 1}`,
      bottles,
      xrpPrice: MOCK_XRP_PRICE_BWP,
      xrpEarned
    });
  }

  let role = UserRole.PARTICIPANT;
  let name = `Participant ${i + 1}`;
  let email = `user${i}@xrp.co.bw`;
  let status: 'PENDING' | 'APPROVED' = 'APPROVED';

  // Assign Roles
  if (i === 0) {
    role = UserRole.ROOT;
    name = "System Root";
    email = "root@xrp.co.bw";
  } else if (i <= 5) {
    role = UserRole.ADMIN;
    name = `Admin ${i}`;
    email = `admin${i}@xrp.co.bw`;
  } else if (i === 6) {
     name = "Keabetswe Molefe"; // Top player placeholder
     email = "keabetswe@example.bw";
  } else if (i > 90) {
      // Make the last 10 users PENDING for demo purposes
      status = 'PENDING';
  }
  
  // Phone numbers
  const phoneSuffix = 1000000 + i;
  const phonePrimary = `7${phoneSuffix}`; // Simplified for login testing (e.g. 71000000)

  return {
    id: `user-${i}`,
    role,
    name: name,
    email: email,
    phonePrimary: phonePrimary,
    phoneSecondary: Math.random() > 0.7 ? `7${Math.floor(Math.random() * 9000000) + 1000000}` : undefined,
    avatar: `https://picsum.photos/seed/${i}/200/200`,
    registrationStatus: status,
    registrationPaymentMethod: i % 2 === 0 ? 'CASH' : 'BOTTLES',
    totalBottles,
    bottlesThisMonth: history[history.length - 1].bottles, // Use the latest month from history
    totalCashBWP: totalBottles * 1.00,
    totalXRP: runningXRP,
    joinDate: '2023-09-01',
    history,
    collectionRecords: [
        {
            id: `col-${i}-1`,
            date: '2023-09-15',
            amount: Math.floor(totalBottles * 0.4), // 40% collected previously
            valueBWP: Math.floor(totalBottles * 0.4) * 1.00,
            verifiedBy: 'Admin 1'
        },
        {
            id: `col-${i}-2`,
            date: '2023-10-02',
            amount: Math.ceil(totalBottles * 0.6), // 60% collected recently
            valueBWP: Math.ceil(totalBottles * 0.6) * 1.00,
            verifiedBy: 'Admin 2'
        }
    ]
  };
});

export const getRank = (bottles: number): UserRank => {
  if (bottles >= 1450) return UserRank.WHALE;
  if (bottles >= 1250) return UserRank.MASTER;
  if (bottles > 500) return UserRank.CONTRIBUTOR;
  return UserRank.NOVICE;
};
