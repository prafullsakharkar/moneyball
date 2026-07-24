import { Identifiable, Timestamped } from '../shared';
import { PlayerRole } from '../competition/players';

// User types
export type UserRole = 'admin' | 'super_admin' | 'organizer' | 'captain' | 'player' | 'coach' | 'staff' | 'fan' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserCategory = 'player' | 'staff' | 'admin' | 'fan' | 'guest';

export interface User extends Identifiable, Timestamped {
  email: string;
  userName: string;
  displayName: string;
  phone?: string;
  
  // Role & Access
  role: UserRole;
  category: UserCategory;
  status: UserStatus;
  
  // Profile
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  bio?: string;
  
  // Player Stats (for players)
  playerRole?: PlayerRole;
  teams?: string[];
  tournamentsPlayed?: number;
  matchesPlayed?: number;
  
  // Settings
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  
  // Auth
  lastLogin?: string;
  twoFactorEnabled: boolean;
  
  // Links
  socialLinks?: SocialLink[];
}

export interface SocialLink extends Identifiable {
  platform: 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'facebook' | 'tiktok';
  url: string;
  handle: string;
  isVerified: boolean;
}

export interface UserProfile extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  // Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  nationality: string;
  
  // Contact
  email: string;
  phone?: string;
  address?: string;
  
  // Physical
  height?: number; // cm
  weight?: number; // kg
  playingHand?: 'right' | 'left' | 'ambidextrous';
  
  // Stats
  matchesPlayed: number;
  runs: number;
  wickets: number;
  catches: number;
  
  // Status
  isActive: boolean;
  isVerified: boolean;
}

export interface UserSession extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  sessionId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  location?: string;
  
  // Timing
  loginAt: string;
  logoutAt?: string;
  isActive: boolean;
  
  // Tokens
  accessToken?: string;
  refreshToken?: string;
}

export interface DeviceInfo {
  type: 'web' | 'ios' | 'android' | 'desktop';
  browser?: string;
  os?: string;
  device?: string;
  screenResolution?: string;
}