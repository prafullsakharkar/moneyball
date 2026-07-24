import { Identifiable, Timestamped } from '../shared';
import { Currency } from '../shared/currency';

// Sponsorship types
export type SponsorshipType = 'title' | 'official' | 'associate' | 'supporting';
export type SponsorshipStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type SponsorshipChannel = 'digital' | 'tv' | 'print' | 'event' | 'social';

export interface Sponsorship extends Identifiable, Timestamped {
  name: string;
  type: SponsorshipType;
  status: SponsorshipStatus;
  
  // Company
  companyId: string;
  companyName: string;
  companyLogo?: string;
  
  // Context
  tournamentId: string;
  tournamentName: string;
  year: number;
  
  // Period
  startDate: string;
  endDate: string;
  
  // Terms
  rights: SponsorshipRight[];
  exclusivity: boolean;
  categories: string[];
  
  // Pricing
  value: number;
  currency: Currency;
  paymentTerms: string;
  
  // Deliverables
  deliverables: SponsorshipDeliverable[];
  statusUpdates: SponsorshipStatusUpdate[];
}

export interface SponsorshipRight {
  type: 'logo' | 'name' | 'video' | 'content' | 'activation';
  description: string;
  value: number;
  isExcluded: boolean;
}

export interface SponsorshipDeliverable extends Identifiable {
  type: SponsorshipChannel;
  description: string;
  value: number;
  status: 'pending' | 'completed' | 'expired';
  dueDate?: string;
  completedAt?: string;
}

export interface SponsorshipStatusUpdate extends Identifiable, Timestamped {
  sponsorId: string;
  sponsorName: string;
  
  title: string;
  message: string;
  images?: string[];
  
  // Stats
  impressions?: number;
  reach?: number;
  engagements?: number;
}

export interface Sponsor extends Identifiable, Timestamped {
  name: string;
  type: 'corporate' | 'brand' | 'organization';
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  
  // Logo
  logo?: string;
  website?: string;
  
  // Categories
  categories: string[];
  industries: string[];
  
  // Preferences
  preferredTournaments: string[];
  preferredRights: string[];
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  
  // Stats
  activeSponsorships: number;
  totalInvestment: number;
}

export interface SponsorshipContract extends Identifiable, Timestamped {
  sponsorId: string;
  sponsorName: string;
  
  tournamentId: string;
  tournamentName: string;
  
  // Terms
  value: number;
  currency: Currency;
  paymentSchedule: PaymentSchedule[];
  
  // Rights
  rightsGranted: string[];
  restrictions: string[];
  
  // Timeline
  signedAt: string;
  effectiveFrom: string;
  effectiveTo: string;
  renewalDate?: string;
  
  // Status
  status: 'draft' | 'signed' | 'active' | 'expired' | 'terminated';
  terminatedReason?: string;
}

export interface PaymentSchedule extends Identifiable {
  installment: number;
  dueDate: string;
  amount: number;
  currency: Currency;
  paid: boolean;
  paidAt?: string;
  paymentReference?: string;
}