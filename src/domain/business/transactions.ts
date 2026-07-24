import { Identifiable, Timestamped } from '../shared';
import { Currency } from '../shared/currency';

// Transaction types
export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 'subscription' | 'entry_fee' | 'prize' | 'refund' | 'withdrawal' | 'deposit' | 'transfer' | 'fee' | 'tax';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Transaction extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  type: TransactionType;
  category: TransactionCategory;
  status: TransactionStatus;
  
  // Amount
  amount: number;
  currency: Currency;
  fee: number;
  tax: number;
  netAmount: number;
  
  // Reference
  referenceId?: string;
  referenceType?: 'fantasy_league' | 'fantasy_contest' | 'subscription' | 'withdrawal' | 'deposit' | 'transfer';
  referenceData?: any;
  
  // Payment
  paymentMethod?: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  
  // Timing
  processedAt?: string;
  completedAt?: string;
  
  // Notes
  description?: string;
  notes?: string;
}

export interface Transfer extends Identifiable, Timestamped {
  type: 'internal' | 'external';
  direction: 'in' | 'out';
  
  amount: number;
  currency: Currency;
  fee: number;
  netAmount: number;
  
  // Accounts
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  failedReason?: string;
  
  // Timing
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  
  // Reference
  transactionId?: string;
  reference?: string;
}

export interface Fee extends Identifiable, Timestamped {
  type: 'platform' | 'payment' | 'tax' | 'withdrawal' | 'conversion';
  name: string;
  
  amount: number;
  currency: Currency;
  rate: number; // percentage or fixed
  
  // Applied to
  appliedToId: string;
  appliedToType: 'transaction' | 'withdrawal' | 'deposit';
  appliedToAmount: number;
  
  // Timing
  appliedAt: string;
  
  // Status
  isPaid: boolean;
  paidAt?: string;
}

export interface Tax extends Identifiable, Timestamped {
  type: 'income' | 'gst' | 'service' | 'withholding';
  name: string;
  
  amount: number;
  currency: Currency;
  rate: number;
  
  // Applied to
  appliedToId: string;
  appliedToType: 'transaction' | 'prize' | 'withdrawal';
  appliedToAmount: number;
  
  // Jurisdiction
  jurisdiction: string;
  taxId?: string;
  
  // Timing
  appliedAt: string;
  
  // Status
  isPaid: boolean;
  paidAt?: string;
  paymentReference?: string;
}

export interface TransactionReport extends Identifiable, Timestamped {
  title: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  
  // Summary
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  totalTax: number;
  netVolume: number;
  currency: Currency;
  
  // Breakdown
  byType: TransactionBreakdown[];
  byCategory: TransactionBreakdown[];
  byStatus: TransactionBreakdown[];
  
  // Daily
  dailyVolume: DailyVolume[];
}

export interface TransactionBreakdown {
  label: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
}

export interface DailyVolume extends Identifiable {
  date: string;
  volume: number;
  transactions: number;
  fees: number;
}