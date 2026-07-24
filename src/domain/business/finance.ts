import { Identifiable, Timestamped } from '../shared';
import { Currency } from '../shared/currency';

// Finance types
export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 'subscription' | 'entry_fee' | 'prize' | 'refund' | 'withdrawal' | 'deposit' | 'transfer';
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
  netAmount: number;
  
  // Reference
  referenceId?: string;
  referenceType?: 'fantasy_league' | 'fantasy_contest' | 'subscription' | 'withdrawal' | 'deposit';
  referenceData?: any;
  
  // Payment
  paymentMethod?: string;
  transactionId?: string;
  
  // Timing
  processedAt?: string;
  completedAt?: string;
  
  // Notes
  description?: string;
  notes?: string;
}

export interface Wallet extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  // Balances
  balance: number;
  pendingBalance: number;
  lockedBalance: number;
  currency: Currency;
  
  // Stats
  totalDeposited: number;
  totalWithdrawn: number;
  totalWon: number;
  totalSpent: number;
  
  // Settings
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  withdrawalLimit: number;
  dailyWithdrawalLimit: number;
  
  // Payment methods
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod extends Identifiable, Timestamped {
  userId: string;
  type: 'upi' | 'bank' | 'wallet' | 'card';
  provider: string;
  
  // Details
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  
  // Settings
  isDefault: boolean;
  isVerified: boolean;
  isDisabled: boolean;
  
  // Verification
  verifiedAt?: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
}

export interface Withdrawal extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  amount: number;
  currency: Currency;
  fee: number;
  netAmount: number;
  
  // Method
  paymentMethodId: string;
  paymentMethodName: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  rejectionReason?: string;
  
  // Timing
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  
  // Reference
  transactionId?: string;
}

export interface Deposit extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  amount: number;
  currency: Currency;
  fee: number;
  netAmount: number;
  
  // Method
  paymentMethodId: string;
  paymentMethodName: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  failureReason?: string;
  
  // Timing
  requestedAt: string;
  completedAt?: string;
  
  // Reference
  transactionId?: string;
  gatewayTransactionId?: string;
}