// Player model for Player Service

export interface Player {
  id: string;
  externalId?: string;
  userId?: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  primaryRole: PlayerRole;
  secondaryRole?: PlayerRole;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  fieldingSkills: string[];
  profileImage?: string;
  bio?: string;
  status: PlayerStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type PlayerRole = 
  | 'Batsman' 
  | 'Bowler' 
  | 'All-Rounder' 
  | 'Wicket-Keeper' 
  | 'Wicket-Keeper-Batsman';

export type BattingStyle = 'Right-Handed' | 'Left-Handed';
export type BowlingStyle = 
  | 'Right-Arm-Fast' 
  | 'Left-Arm-Fast' 
  | 'Right-Arm-Medium' 
  | 'Left-Arm-Medium' 
  | 'Right-Arm-Spin' 
  | 'Left-Arm-Spin' 
  | 'Leg-Spin' 
  | 'Left-Arm-Chinaman';
export type PlayerStatus = 'Active' | 'Inactive' | 'Injured' | 'Suspended' | 'Retired' | 'Banned';

export interface PlayerStats {
  id: string;
  playerId: string;
  matchesPlayed: number;
  runsScored: number;
  ballsFaced: number;
  battingAverage: number;
  strikeRate: number;
  centuries: number;
  halfCenturies: number;
  wicketsTaken: number;
  ballsBowled: number;
  bowlingAverage: number;
  economyRate: number;
  catches: number;
  runOuts: number;
  lastUpdated: string;
}

export interface PlayerFitness {
  id: string;
  playerId: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  run100mTime?: number;
  run20mTime?: number;
  throwDistanceM?: number;
  bowlingSpeedKmh?: number;
  battingStrength?: number;
  fitnessScore?: number;
  lastAssessment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerMedical {
  id: string;
  playerId: string;
  bloodType?: string;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  injuryHistory: string[];
  lastMedicalCheckup?: string;
  medicalStatus: MedicalStatus;
  createdAt: string;
  updatedAt: string;
}

export type MedicalStatus = 'Fit' | 'Injured' | 'Recovering' | 'Unfit';

export interface PlayerContract {
  id: string;
  playerId: string;
  teamId?: string;
  organizationId: string;
  contractType: ContractType;
  basePrice: number;
  contractStart: string;
  contractEnd: string;
  contractStatus: ContractStatus;
  contractDocument?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractType = 'Full-Time' | 'Part-Time' | 'Trial' | 'Loan' | 'Free-Agent';
export type ContractStatus = 'Active' | 'Expired' | 'Terminated' | 'Renewed';

export interface PlayerDocument {
  id: string;
  playerId: string;
  documentType: string;
  documentUrl: string;
  documentName: string;
  uploadedAt: string;
  uploadedBy?: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface PlayerMatchHistory {
  id: string;
  playerId: string;
  matchId: string;
  teamId: string;
  runsScored?: number;
  ballsFaced?: number;
  wicketsTaken?: number;
  oversBowled?: number;
  catches?: number;
  runOuts?: number;
  isManOfTheMatch: boolean;
  createdAt: string;
}

export interface PlayerCreateInput {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  primaryRole: PlayerRole;
  secondaryRole?: PlayerRole;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  fieldingSkills?: string[];
  profileImage?: string;
  bio?: string;
  organizationId: string;
}

export interface PlayerUpdateInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  primaryRole?: PlayerRole;
  secondaryRole?: PlayerRole;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  fieldingSkills?: string[];
  profileImage?: string;
  bio?: string;
  status?: PlayerStatus;
}

export interface PlayerStatsUpdateInput {
  matchesPlayed?: number;
  runsScored?: number;
  ballsFaced?: number;
  battingAverage?: number;
  strikeRate?: number;
  centuries?: number;
  halfCenturies?: number;
  wicketsTaken?: number;
  ballsBowled?: number;
  bowlingAverage?: number;
  economyRate?: number;
  catches?: number;
  runOuts?: number;
}

export interface PlayerFitnessUpdateInput {
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  run100mTime?: number;
  run20mTime?: number;
  throwDistanceM?: number;
  bowlingSpeedKmh?: number;
  battingStrength?: number;
  fitnessScore?: number;
  lastAssessment?: string;
}

export interface PlayerMedicalUpdateInput {
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  currentMedications?: string[];
  injuryHistory?: string[];
  lastMedicalCheckup?: string;
  medicalStatus?: MedicalStatus;
}
