import { Identifiable, Timestamped } from '../shared';

// Organization types
export type OrgType = 'company' | 'team' | 'club' | 'academy' | 'association' | 'governing_body';
export type OrgStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface Organization extends Identifiable, Timestamped {
  name: string;
  type: OrgType;
  status: OrgStatus;
  
  // Contact
  email: string;
  phone?: string;
  website?: string;
  
  // Address
  address?: string;
  city?: string;
  state?: string;
  country: string;
  zipCode?: string;
  
  // Branding
  logo?: string;
  banner?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  
  // Settings
  timezone: string;
  currency: string;
  language: string;
  
  // Stats
  totalMembers?: number;
  totalTournaments?: number;
  
  // Links
  socialLinks?: SocialLink[];
}

export interface SocialLink extends Identifiable {
  platform: 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'facebook' | 'tiktok';
  url: string;
  handle: string;
  isVerified: boolean;
}

export interface OrgMember extends Identifiable, Timestamped {
  orgId: string;
  orgName: string;
  userId: string;
  userName: string;
  
  // Role
  role: string;
  permissions: string[];
  
  // Status
  isActive: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  
  // Timing
  joinedAt: string;
  leftAt?: string;
}

export interface OrgSettings extends Identifiable, Timestamped {
  orgId: string;
  orgName: string;
  
  // General
  name: string;
  type: OrgType;
  timezone: string;
  
  // Features
  features: FeatureSettings;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Branding
  logo?: string;
  banner?: string;
  themeColor?: string;
  
  // Payment
  defaultCurrency: string;
  paymentProvider?: string;
}

export interface FeatureSettings {
  fantasy: boolean;
  analytics: boolean;
  videoAnalysis: boolean;
  training: boolean;
  academy: boolean;
  streaming: boolean;
  monetization: boolean;
}