import { Identifiable, Timestamped } from '../shared';
import { Currency } from '../shared/currency';

// Revenue types
export type RevenueType = 'subscription' | 'entry_fee' | 'prize_pool' | 'sponsorship' | 'broadcast' | 'merchandise' | 'other';
export type RevenueCategory = 'direct' | 'indirect' | 'operational' | 'non_operational';
export type RevenueFrequency = 'one_time' | 'recurring' | 'variable';

export interface Revenue extends Identifiable, Timestamped {
  name: string;
  type: RevenueType;
  category: RevenueCategory;
  
  // Amount
  amount: number;
  currency: Currency;
  tax: number;
  netAmount: number;
  
  // Source
  sourceId: string;
  sourceName: string;
  sourceType: 'fantasy' | 'ticket' | 'sponsor' | 'broadcast' | 'merch' | 'other';
  
  // Period
  periodStart: string;
  periodEnd: string;
  recordedAt: string;
  
  // Status
  isRecognized: boolean;
  recognizedAt?: string;
  
  // Notes
  description?: string;
  reference?: string;
}

export interface RevenueStream extends Identifiable, Timestamped {
  name: string;
  type: RevenueType;
  frequency: RevenueFrequency;
  
  // Pricing
  amount: number;
  currency: Currency;
  billingPeriod?: string; // e.g., 'monthly', 'yearly'
  
  // Status
  isActive: boolean;
  
  // Source
  sourceId: string;
  sourceName?: string;
  
  // Stats
  totalRevenue: number;
  activeSubscribers?: number;
  transactionsCount?: number;
}

export interface RevenueReport extends Identifiable, Timestamped {
  title: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  
  // Summary
  totalRevenue: number;
  totalTax: number;
  totalNet: number;
  currency: Currency;
  
  // Breakdown
  byType: RevenueBreakdown[];
  byCategory: RevenueBreakdown[];
  bySource: RevenueBreakdown[];
  byPeriod?: RevenueByPeriod[];
  
  // Stats
  transactionCount: number;
  averageTransaction: number;
  topSource: string;
}

export interface RevenueBreakdown {
  label: string;
  amount: number;
  percentage: number;
  count?: number;
}

export interface RevenueByPeriod extends Identifiable {
  period: string;
  revenue: number;
  tax: number;
  net: number;
  transactions: number;
}

export interface RevenueForecast extends Identifiable, Timestamped {
  title: string;
  periodStart: string;
  periodEnd: string;
  
  // Forecasts
  revenue: number;
  tax: number;
  net: number;
  currency: Currency;
  
  // Assumptions
  growthRate: number;
  seasonalityFactor: number;
  
  // Confidence
  confidenceLevel: number;
  confidenceRange: {
    low: number;
    high: number;
  };
  
  // Factors
  factors: ForecastFactor[];
}

export interface ForecastFactor extends Identifiable {
  name: string;
  impact: number;
  direction: 'positive' | 'negative';
  weight: number;
  confidence: number;
}