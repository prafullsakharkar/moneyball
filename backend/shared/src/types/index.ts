// Shared Types for CricketIQ Microservices

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditTrail {
  logs: AuditLog[];
  total: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'in';
  value: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'in';
  value: any;
}

// Cricket Domain Types

export type CricketFormat = 'Test' | 'ODI' | 'T20' | 'Hundred' | 'Exhibition';
export type TeamType = 'Senior' | 'Junior' | 'Women' | 'Academy' | 'Corporate' | 'Development';
export type TournamentType = 'League' | 'Knockout' | 'RoundRobin' | 'Group' | 'Custom';
export type TournamentCategory = 'International' | 'Domestic' | 'Club' | 'Academy' | 'School' | 'Corporate';
export type TournamentGender = 'Male' | 'Female' | 'Mixed';
export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper' | 'Wicket-Keeper-Batsman';
export type BattingStyle = 'Right-Handed' | 'Left-Handed';
export type BowlingStyle = 'Right-Arm-Fast' | 'Left-Arm-Fast' | 'Right-Arm-Medium' | 'Left-Arm-Medium' | 'Right-Arm-Spin' | 'Left-Arm-Spin' | 'Leg-Spin' | 'Left-Arm-Chinaman';
export type MatchStatus = 'Scheduled' | 'Live' | 'Completed' | 'Abandoned' | 'Postponed' | 'Cancelled';
export type ScoringEvent = 'Ball' | 'Wide' | 'NoBall' | 'Bye' | 'LegBye' | 'Four' | 'Six' | 'Wicket' | 'Over' | 'Innings';
export type ScoringOutcome = 'Dot' | 'Single' | 'Double' | 'Triple' | 'Four' | 'Six' | 'Wide' | 'NoBall' | 'Bye' | 'LegBye' | 'Wicket';
export type TeamStatus = 'Active' | 'Inactive' | 'Suspended' | 'Dissolved';
export type PlayerStatus = 'Active' | 'Inactive' | 'Injured' | 'Suspended' | 'Retired' | 'Banned';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Unexcused';
export type CurriculumLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
export type AssessmentType = 'Practical' | 'Theory' | 'Fitness' | 'Mock-Match';
export type FacilityType = 'Ground' | 'Indoor-Court' | 'Gym' | 'Swimming-Pool' | 'Cafeteria' | 'Medical-Center';
export type CoachRole = 'Head-Coach' | 'Batting-Coach' | 'Bowling-Coach' | 'Fielding-Coach' | 'Fitness-Coach' | 'Goalkeeper-Coach';
export type ScoutingStatus = 'New' | 'Under-Review' | 'Shortlisted' | 'Rejected' | 'Signed';
export type ScoutingCriteria = 'Batting' | 'Bowling' | 'Fielding' | 'Fitness' | 'Leadership' | 'Teamwork' | 'Discipline';

// Financial Types

export type PaymentStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Refunded' | 'Cancelled';
export type PaymentMethod = 'CreditCard' | 'DebitCard' | 'NetBanking' | 'Wallet' | 'UPI' | 'BankTransfer' | 'Cash' | 'Cheque';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type SubscriptionStatus = 'Active' | 'Inactive' | 'Expired' | 'Cancelled' | 'Pending';
export type TransactionType = 'Credit' | 'Debit';
export type TransactionCategory = 'Registration' | 'Subscription' | 'Tournament' | 'Academy' | 'Training' | 'Equipment' | 'Refund' | 'Other';

// Notification Types

export type NotificationChannel = 'Email' | 'SMS' | 'Push' | 'InApp' | 'WhatsApp';
export type NotificationType = 'System' | 'Alert' | 'Reminder' | 'Update' | 'Promotional';
export type NotificationStatus = 'Sent' | 'Delivered' | 'Read' | 'Failed';

// Media Types

export type MediaType = 'Image' | 'Video' | 'Audio' | 'Document';
export type MediaCategory = 'Player' | 'Team' | 'Match' | 'Tournament' | 'Training' | 'Academy' | 'Other';
export type MediaStatus = 'Uploaded' | 'Processing' | 'Ready' | 'Failed';

// Scouting Types

export type PlayerEvaluation = {
  playerId: string;
  scoutId: string;
  rating: number;
  notes: string;
  criteria: Record<string, number>;
  status: ScoutingStatus;
  createdAt: string;
  updatedAt: string;
};

export type ScoutingReport = {
  id: string;
  playerId: string;
  scoutId: string;
  organizationId: string;
  reportDate: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  status: ScoutingStatus;
  createdAt: string;
  updatedAt: string;
};

// Auction Types

export type AuctionStatus = 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
export type BidStatus = 'Active' | 'Outbid' | 'Won' | 'Lost' | 'Withdrawn';
export type PlayerStatusInAuction = 'Available' | 'Sold' | 'Unsold' | 'Withdrawn';

// Sponsorship Types

export type SponsorshipStatus = 'Pending' | 'Active' | 'Expired' | 'Cancelled';
export type SponsorshipType = 'Title' | 'Official' | 'Partner' | 'Associate' | 'Supporter';
export type DeliverableStatus = 'Pending' | 'In-Progress' | 'Completed' | 'Rejected';

// Training Types

export type TrainingSessionType = 'Practice' | 'Match-Preparation' | 'Recovery' | 'Fitness' | 'Skill-Development';
export type TrainingDrillType = 'Batting' | 'Bowling' | 'Fielding' | 'Wicket-Keeping' | 'Fitness' | 'Strategy' | 'Mental';
export type SessionStatus = 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled' | 'Postponed';

// Analytics Types

export type AnalyticsType = 'Player' | 'Team' | 'Match' | 'Tournament' | 'League';
export type AnalyticsMetric = 'Runs' | 'Wickets' | 'Average' | 'StrikeRate' | 'Economy' | 'Catches' | 'RunOuts';
export type AnalyticsPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Career' | 'Season';

// User Types

export type UserRole = 'SuperAdmin' | 'PlatformAdmin' | 'OrganizationAdmin' | 'TeamManager' | 'Coach' | 'Captain' | 'Player' | 'Scorer' | 'Umpire' | 'Scout' | 'Parent' | 'Fan';
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Banned';
export type UserGender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay';

// Common Interfaces

export interface BaseModel {
  id: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface NameModel {
  firstName: string;
  lastName: string;
  fullName: string;
  displayName?: string;
}

export interface ContactModel {
  phone: string;
  email: string;
  alternatePhone?: string;
  alternateEmail?: string;
}

export interface AddressModel {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface DocumentModel {
  documentType: string;
  documentUrl: string;
  documentName: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface SettingsModel {
  theme?: string;
  language?: string;
  timezone?: string;
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

// Event Types for Kafka

export interface CricketEvent<T> {
  id: string;
  type: string;
  timestamp: string;
  source: string;
  payload: T;
  metadata: {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface PlayerCreatedEvent {
  playerId: string;
  organizationId: string;
  firstName: string;
  lastName: string;
}

export interface PlayerUpdatedEvent {
  playerId: string;
  changes: Record<string, any>;
}

export interface MatchStartedEvent {
  matchId: string;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
  startTime: string;
}

export interface MatchCompletedEvent {
  matchId: string;
  winnerId: string;
  margin: string;
  playerOfTheMatch?: string;
}

export interface ScoringUpdatedEvent {
  matchId: string;
  innings: number;
  over: number;
  ball: number;
  runs: number;
  wicket: boolean;
  extras: number;
}

export interface TournamentCreatedEvent {
  tournamentId: string;
  organizationId: string;
  name: string;
  format: CricketFormat;
}

export interface TeamCreatedEvent {
  teamId: string;
  organizationId: string;
  name: string;
  format: CricketFormat;
}

export interface PaymentProcessedEvent {
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export interface NotificationSentEvent {
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  type: NotificationType;
  status: NotificationStatus;
}
