
export enum CalculationType {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  RENTAL = 'RENTAL',
  FLIP = 'FLIP'
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  plan: 'free' | 'pro' | 'premium';
  creditsUsed: number;
  maxCredits: number; // -1 for unlimited
  avatar?: string;
  isDemo?: boolean;
  // Stripe fields
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd?: number; // Unix timestamp
}

export interface BuyerResult {
  monthlyPayment: number;
  imt: number;
  stampDuty: number;
  totalUpfront: number;
  loanAmount: number;
}

export interface RentalResult {
  grossYield: number;
  netYield: number;
  monthlyCashflow: number;
  annualNOI: number; // Net Operating Income
  rating: 'Excelente' | 'Bom' | 'Fraco';
  totalInvestment: number;
}

export interface SellerResult {
  salePrice: number;
  commission: number;
  commissionVAT: number;
  netSale: number;
}

export interface FlipResult {
  purchasePrice: number;
  renovationCost: number;
  buyingCosts: number; // IMT + IS
  totalInvestment: number;
  sellingPrice: number;
  sellingCosts: number; // Commission
  netProfit: number;
  roi: number;
}

export interface AIAnalysisResponse {
  analysis: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'caution';
}

export interface HistoryItem {
  id: string;
  type: CalculationType;
  date: string; // Display Date string
  timestamp: number; // For sorting/charting
  summary: string;
  value: string; // Display value
  numericValue: number; // For charts
}

export interface SavedProperty {
  id: string;
  name: string;
  type: CalculationType;
  price: number;
  date: string;
  metrics: {
    label: string;
    value: string | number;
    subtext?: string;
    highlight?: boolean;
    color?: string;
  }[];
}