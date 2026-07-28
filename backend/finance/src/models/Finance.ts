// Models for Finance Service

export interface Transaction {
  id: string;
  transactionId: string;
  entityType: FinanceEntityType;
  entityId: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod?: string;
  paymentReference?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  entityType: FinanceEntityType;
  entityId: string;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: string;
  paidAt?: string;
  items?: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionReference?: string;
  gatewayResponse?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planName: string;
  planTier: PlanTier;
  amount: number;
  currency: string;
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  transactionId?: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  reason?: string;
  status: RefundStatus;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialReport {
  id: string;
  reportType: ReportType;
  reportPeriod: ReportPeriod;
  reportDate: string;
  data: Record<string, any>;
  generatedAt: string;
}

// Enums
export enum FinanceEntityType {
  Organization = 'Organization',
  Team = 'Team',
  Player = 'Player',
  Tournament = 'Tournament',
  Venue = 'Venue'
}

export enum TransactionType {
  SubscriptionPayment = 'SubscriptionPayment',
  EntryFee = 'EntryFee',
  Sponsorship = 'Sponsorship',
  Merchandise = 'Merchandise',
  TicketSales = 'TicketSales',
  PrizeMoney = 'PrizeMoney',
  Refund = 'Refund',
  Transfer = 'Transfer',
  Other = 'Other'
}

export enum TransactionStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export enum PlanTier {
  Free = 'Free',
  Basic = 'Basic',
  Standard = 'Standard',
  Premium = 'Premium',
  Enterprise = 'Enterprise'
}

export enum BillingPeriod {
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Annually = 'Annually'
}

export enum SubscriptionStatus {
  Active = 'Active',
  PastDue = 'PastDue',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
  Suspended = 'Suspended'
}

export enum RefundStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed'
}

export enum ReportType {
  DailySales = 'DailySales',
  MonthlyRevenue = 'MonthlyRevenue',
  SubscriptionRenewals = 'SubscriptionRenewals',
  PaymentGateway = 'PaymentGateway',
  TaxReport = 'TaxReport',
  FinancialSummary = 'FinancialSummary'
}

export enum ReportPeriod {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly'
}

// Input types
export interface TransactionCreateInput {
  transactionId: string;
  entityType: FinanceEntityType;
  entityId: string;
  transactionType: TransactionType;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  paymentReference?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceCreateInput {
  invoiceNumber: string;
  entityType: FinanceEntityType;
  entityId: string;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  currency?: string;
  status?: InvoiceStatus;
  dueDate?: string;
  items?: Record<string, any>[];
}

export interface PaymentCreateInput {
  paymentId: string;
  invoiceId?: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  transactionReference?: string;
  gatewayResponse?: Record<string, any>;
}

export interface SubscriptionCreateInput {
  organizationId: string;
  planName: string;
  planTier: PlanTier;
  amount: number;
  currency?: string;
  billingPeriod: BillingPeriod;
  status?: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  autoRenew?: boolean;
}

export interface RefundCreateInput {
  transactionId?: string;
  invoiceId?: string;
  amount: number;
  currency?: string;
  reason?: string;
  status?: RefundStatus;
}

export interface FinancialReportCreateInput {
  reportType: ReportType;
  reportPeriod: ReportPeriod;
  reportDate: string;
  data: Record<string, any>;
}
