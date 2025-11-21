
export enum UserRank {
  NOVICE = 'Novice Recycler',
  CONTRIBUTOR = 'Eco Contributor',
  MASTER = 'Bottle Master',
  WHALE = 'XRP Whale'
}

export enum UserRole {
  ROOT = 'root',
  ADMIN = 'admin',
  PARTICIPANT = 'participant'
}

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentMethod = 'CASH' | 'BOTTLES';

export interface CollectionRecord {
  id: string;
  date: string;
  amount: number;
  valueBWP: number;
  location?: string;
  verifiedBy: string; // Admin ID
}

export interface Expense {
  id: string;
  description: string;
  amount: number; // In BWP
  category: 'collection' | 'transport' | 'admin' | 'other';
  date: string;
  payableTo?: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: 'System Rules' | 'XRP Basics' | 'Recycling Guide' | 'Program Guidelines';
  summary: string;
  content: string;
  author: string;
  dateCreated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  type: 'Announcement' | 'Video' | 'Highlight';
  description: string;
  mediaUrl?: string;
  datePublished: string;
}

export interface SystemSettings {
  siteTitle: string;
  heroTagline: string;
  youtubeVideoId: string;
  defaultBottleValueBWP: number;
  leaderboardSize: number;
  xrpDisplayCurrency: 'USD' | 'BWP';
  registrationFeeBWP: number;
  paymentPhoneNumber: string;
  cycleMonth: number; // 1-5
  totalCycleMonths: number;
  minMonthlyTarget: number;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phonePrimary: string;
  phoneSecondary?: string;
  phoneTertiary?: string;
  avatar: string;
  
  // Registration & Status
  registrationStatus: RegistrationStatus;
  registrationPaymentMethod?: PaymentMethod;
  joinDate: string;

  // Stats
  totalBottles: number;
  bottlesThisMonth: number;
  totalCashBWP: number;
  totalXRP: number;
  
  // History & Logs
  history: { month: string; bottles: number; xrpPrice: number; xrpEarned: number }[];
  collectionRecords: CollectionRecord[];
}

export interface GlobalStats {
  totalParticipants: number;
  totalBottlesCollected: number;
  totalXRPBought: number;
  totalExpenses: number;
  currentXRPPriceBWP: number;
  bottleRateBWP: number; // Cash per bottle
}

export interface ChartDataPoint {
  month: string;
  value: number;
  projected?: number;
}
