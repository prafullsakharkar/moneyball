// Organization model for Organization Service

export interface Organization {
  id: string;
  externalId?: string;
  name: string;
  shortName: string;
  logo?: string;
  description?: string;
  organizationType: OrganizationType;
  status: OrganizationStatus;
  website?: string;
  email?: string;
  phone?: string;
  address: Address;
  contact: Contact;
  socialMedia: SocialMedia;
  settings: OrganizationSettings;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type OrganizationType = 
  | 'InternationalBoard' 
  | 'NationalAssociation' 
  | 'RegionalAssociation' 
  | 'Club' 
  | 'Academy' 
  | 'School' 
  | 'Corporate' 
  | 'Other';

export type OrganizationStatus = 'Active' | 'Inactive' | 'Suspended' | 'PendingVerification' | 'Verified';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Contact {
  phone: string;
  email: string;
  primaryContactName: string;
  alternatePhone?: string;
  alternateEmail?: string;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

export interface OrganizationSettings {
  theme?: string;
  language?: string;
  timezone?: string;
  currency?: string;
  cricketFormat?: string;
  matchDurationMinutes?: number;
  notifications?: NotificationSettings;
  privacy?: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  whatsapp: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'Public' | 'Private' | 'Organization' | 'Team';
  statsVisibility: 'Public' | 'Private' | 'Organization' | 'Team';
  contactVisibility: 'Public' | 'Private' | 'Organization' | 'Team';
}

export interface OrganizationCreateInput {
  name: string;
  shortName: string;
  logo?: string;
  description?: string;
  organizationType: OrganizationType;
  website?: string;
  email?: string;
  phone?: string;
  address: Address;
  contact: Contact;
  socialMedia?: SocialMedia;
}

export interface OrganizationUpdateInput {
  name?: string;
  shortName?: string;
  logo?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: Address;
  contact?: Contact;
  socialMedia?: SocialMedia;
  settings?: Partial<OrganizationSettings>;
}

export interface OrganizationHierarchy {
  id: string;
  parentId: string;
  childId: string;
  relationshipType: string;
  startedAt: string;
  endedAt?: string;
  createdAt: string;
}

export interface Venue {
  id: string;
  organizationId: string;
  name: string;
  shortName?: string;
  logo?: string;
  description?: string;
  venueType: VenueType;
  capacity?: number;
  address: Address;
  facilities: Facility[];
  images: string[];
  status: VenueStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type VenueType = 'Stadium' | 'Ground' | 'IndoorCourt' | 'PracticeFacility' | 'Other';
export type VenueStatus = 'Active' | 'Inactive' | 'UnderMaintenance';

export interface Facility {
  name: string;
  type: string;
  capacity?: number;
  amenities: string[];
}

export interface OrganizationDocument {
  id: string;
  organizationId: string;
  documentType: string;
  documentUrl: string;
  documentName: string;
  uploadedAt: string;
  uploadedBy?: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface VenueCreateInput {
  name: string;
  shortName?: string;
  logo?: string;
  description?: string;
  venueType: VenueType;
  capacity?: number;
  address: Address;
  facilities: Facility[];
  images: string[];
}

export interface VenueUpdateInput {
  name?: string;
  shortName?: string;
  logo?: string;
  description?: string;
  venueType?: VenueType;
  capacity?: number;
  address?: Address;
  facilities?: Facility[];
  images?: string[];
}
