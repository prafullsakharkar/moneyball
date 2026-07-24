import { Identifiable, Timestamped } from '../shared';
import { PlayerRole, BattingStyle, BowlingStyle } from '../competition/players';

// Scouting types
export type ScoutingType = 'player' | 'team' | 'tournament' | 'scout_report';
export type ScoutingStatus = 'draft' | 'reviewing' | 'approved' | 'published';
export type ScoutingSource = 'live' | 'video' | 'statistics' | 'expert' | 'ai_analysis';

export interface ScoutingReport extends Identifiable, Timestamped {
  title: string;
  type: ScoutingType;
  status: ScoutingStatus;
  
  // Subject
  playerId?: string;
  playerName?: string;
  teamId?: string;
  teamName?: string;
  tournamentId?: string;
  tournamentName?: string;
  
  // Sources
  sources: ScoutingSource[];
  videoReferences?: string[];
  matchReferences?: string[];
  
  // Content
  summary: string;
  keyPoints: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  
  // Scouter info
  scouterId?: string;
  scouterName?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // Stats
  views: number;
  isFeatured: boolean;
}

export interface PlayerScoutingReport extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  playerInitials: string;
  teamId?: string;
  teamName?: string;
  
  // Basic info
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  age: number;
  height?: string;
  
  // Skills
  battingSkills: SkillRating[];
  bowlingSkills: SkillRating[];
  fieldingSkills: SkillRating[];
  fitness: SkillRating[];
  
  // Overall
  overallRating: number;
  potentialRating: number;
  developmentStage: 'emerging' | 'developing' | 'established' | 'elite';
  
  // Comparison
  similarPlayers: SimilarPlayer[];
  
  // Recommendation
  status: 'recommended' | 'watchlist' | 'not_recommended';
  contractValue?: number;
  negotiationPoints: string[];
}

export interface SkillRating {
  skill: string;
  rating: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  evidence?: string[];
}

export interface SimilarPlayer {
  playerId: string;
  playerName: string;
  similarityScore: number;
  currentTeam: string;
  age: number;
  statsSummary: string;
}

export interface Scout extends Identifiable, Timestamped {
  name: string;
  email: string;
  phone?: string;
  
  // Credentials
  certifications: string[];
  experienceYears: number;
  specializations: string[];
  
  // Stats
  active: boolean;
  reportsSubmitted: number;
  reportsApproved: number;
  averageRating?: number;
  
  // Preferences
  regions: string[];
  teamsInterests: string[];
}

export interface ScoutAssignment {
  scoutId: string;
  scoutName: string;
  targetId: string;
  targetType: 'player' | 'team';
  assignmentDate: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  reportId?: string;
}