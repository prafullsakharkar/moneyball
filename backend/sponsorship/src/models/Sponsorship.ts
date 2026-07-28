// Models for Sponsorship Service

export enum SponsorType {
  Platinum = 'Platinum',
  Gold = 'Gold',
  Silver = 'Silver',
  Bronze = 'Bronze',
  Official = 'Official',
  Partner = 'Partner',
  Media = 'Media',
  Technology = 'Technology',
  Apparel = 'Apparel',
  Beverage = 'Beverage',
  Financial = 'Financial',
  Other = 'Other'
}

export enum SponsorshipStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Active = 'Active',
  Expired = 'Expired',
  Terminated = 'Terminated',
  RenewalPending = 'RenewalPending'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export enum AssetType {
  Logo = 'Logo',
  Banner = 'Banner',
  Image = 'Image',
  Video = 'Video',
  Document = 'Document'
}

export interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  sponsorType: SponsorType;
  logoUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipPackage {
  id: string;
  name: string;
  description: string | null;
  sponsorId: string;
  price: number;
  currency: string;
  benefits: string[];
  maxExposure: string | null;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipDeal {
  id: string;
  sponsorId: string;
  packageId: string | null;
  entityType: string;
  entityId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentTerms: string | null;
  status: SponsorshipStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealPayment {
  id: string;
  dealId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  transactionReference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipAsset {
  id: string;
  dealId: string;
  assetType: AssetType;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Input types for CRUD operations
export interface SponsorCreateInput {
  name: string;
  description?: string;
  sponsorType: SponsorType;
  logoUrl?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
}

export interface SponsorUpdateInput {
  name?: string;
  description?: string;
  sponsorType?: SponsorType;
  logoUrl?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
}

export interface SponsorshipPackageCreateInput {
  name: string;
  description?: string;
  sponsorId: string;
  price: number;
  currency?: string;
  benefits: string[];
  maxExposure?: string;
  durationDays?: number;
  isActive?: boolean;
}

export interface SponsorshipPackageUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  benefits?: string[];
  maxExposure?: string;
  durationDays?: number;
  isActive?: boolean;
}

export interface SponsorshipDealCreateInput {
  sponsorId: string;
  packageId?: string;
  entityType: string;
  entityId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentTerms?: string;
  status?: SponsorshipStatus;
  createdBy: string;
}

export interface SponsorshipDealUpdateInput {
  packageId?: string;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  paymentTerms?: string;
  status?: SponsorshipStatus;
}

export interface DealPaymentCreateInput {
  dealId: string;
  amount: number;
  currency?: string;
  paymentDate: string;
  paymentStatus?: PaymentStatus;
  transactionReference?: string;
  notes?: string;
}

export interface DealPaymentUpdateInput {
  amount?: number;
  paymentStatus?: PaymentStatus;
  transactionReference?: string;
  notes?: string;
}

export interface SponsorshipAssetCreateInput {
  dealId: string;
  assetType: AssetType;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
}

export interface SponsorshipAssetUpdateInput {
  assetType?: AssetType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
}
