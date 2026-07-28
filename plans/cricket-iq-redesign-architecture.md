# CricketIQ Platform - Complete Redesign Architecture

## Executive Summary

This document outlines the complete redesign architecture for CricketIQ Platform - a modern, responsive web application that manages the complete cricket ecosystem from grassroots to professional leagues.

**Vision**: To be the world's most intelligent and comprehensive cricket platform, empowering every level of the cricket ecosystem.

**Design Philosophy**: Domain-Driven Design (DDD) with clean architecture principles, focusing on maintainability, scalability, and extensibility.

---

## 1. Technology Stack

### Core Framework
- **React 19.2.7** - UI framework with hooks and concurrent features
- **TypeScript 6.0.3** - Type-safe development
- **Vite 8.1.5** - Build tool and dev server
- **Tailwind CSS 4.3.3** - Utility-first CSS framework

### State Management
- **Zustand 5.0.14** - Client state management (UI state, form state)
- **TanStack Query 5.101.2** - Server state management (data fetching, caching)
- **React Context** - Theme, Auth, Toast contexts

### Routing
- **React Router DOM 7.11.0** - Client-side routing with lazy loading

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion 12.42.2** - Animation library

### Forms & Validation
- **React Hook Form 7.82.0** - Form management
- **Zod 4.4.3** - Schema validation
- **@hookform/resolvers 5.4.0** - Zod integration

### Data Visualization
- **Recharts 3.10.0** - Chart library

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **clsx/tailwind-merge** - Class name utilities
- **ky 2.0.2** - HTTP client

---

## 2. Domain-Driven Design Architecture

### 2.1 Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CricketIQ Platform                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   PLAYER     │ │   TEAM       │ │   CLUB       │ │   ACADEMY    │       │
│  │   CONTEXT    │ │   CONTEXT    │ │   CONTEXT    │ │   CONTEXT    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ TOURNAMENT   │ │   MATCH      │ │   SCORING    │ │  ANALYTICS   │       │
│  │   CONTEXT    │ │   CONTEXT    │ │   CONTEXT    │ │   CONTEXT    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   VIDEO      │ │   TRAINING   │ │   FANTASY    │ │   NOTIFICATION│       │
│  │  ANALYSIS    │ │   CONTEXT    │   CONTEXT    │ │   CONTEXT    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                             │
│                    ┌──────────────────────┐                                │
│                    │   SHARED KERNEL      │                                │
│                    │  - Types & Interfaces│                                │
│                    │  - Utilities         │                                │
│                    │  - API Client        │                                │
│                    │  - Auth & Permissions│                                │
│                    └──────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Domain Models

#### Player Domain
```typescript
// Domain: Player
interface Player {
  id: string;
  externalId?: string; // External system reference
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string; // ISO date
  age: number;
  gender: 'male' | 'female' | 'other';
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  fieldingSkills: FieldingSkill[];
  primaryRole: PlayerRole;
  secondaryRole?: PlayerRole;
  currentTeamId?: string;
  currentClubId?: string;
  currentAcademyId?: string;
  profileImage?: string;
  bio?: string;
  stats: PlayerStats;
  performanceHistory: PerformanceRecord[];
  createdAt: string;
  updatedAt: string;
}

interface PlayerStats {
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
}

interface PerformanceRecord {
  playerId: string;
  teamId: string;
  tournamentId: string;
  matchId: string;
  runs: number;
  balls: number;
  wickets: number;
  overs: number;
  catches: number;
  date: string;
}
```

#### Team Domain
```typescript
// Domain: Team
interface Team {
  id: string;
  externalId?: string;
  name: string;
  shortName: string;
  logo?: string;
  colors: TeamColors;
  format: CricketFormat;
  teamType: TeamType;
  clubId: string;
  academyId?: string;
  captainId: string;
  viceCaptainId?: string;
  coachId: string;
  assistantCoaches: string[];
  roster: TeamRoster[];
  schedule: MatchSchedule[];
  stats: TeamStats;
  createdAt: string;
  updatedAt: string;
}

interface TeamRoster {
  playerId: string;
  role: PlayerRole;
  jerseyNumber?: number;
  status: 'active' | 'inactive' | 'injured' | 'suspended';
  joinedDate: string;
  leftDate?: string;
}

interface TeamStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  matchesNoResult: number;
  winPercentage: number;
  runsScored: number;
  wicketsTaken: number;
  averageRunRate: number;
  averageOppositionRunRate: number;
}
```

#### Club Domain
```typescript
// Domain: Club
interface Club {
  id: string;
  externalId?: string;
  name: string;
  shortName: string;
  logo?: string;
  description?: string;
  address: ClubAddress;
  contact: ClubContact;
  website?: string;
  socialMedia: ClubSocialMedia;
  teams: ClubTeam[];
  facilities: ClubFacility[];
  createdAt: string;
  updatedAt: string;
}

interface ClubAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface ClubContact {
  phone: string;
  email: string;
  primaryContactName: string;
}

interface ClubSocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

interface ClubTeam {
  teamId: string;
  teamName: string;
  format: CricketFormat;
  level: TeamLevel;
  captainId: string;
}

interface ClubFacility {
  name: string;
  type: FacilityType;
  capacity: number;
  address: ClubAddress;
  amenities: string[];
}
```

#### Academy Domain
```typescript
// Domain: Academy
interface Academy {
  id: string;
  externalId?: string;
  name: string;
  shortName: string;
  logo?: string;
  description?: string;
  address: AcademyAddress;
  contact: AcademyContact;
  website?: string;
  socialMedia: AcademySocialMedia;
  curriculum: AcademyCurriculum[];
  coaches: AcademyCoach[];
  students: AcademyStudent[];
  facilities: AcademyFacility[];
  createdAt: string;
  updatedAt: string;
}

interface AcademyAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AcademyContact {
  phone: string;
  email: string;
  primaryContactName: string;
}

interface AcademySocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

interface AcademyCurriculum {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "3 months"
  level: CurriculumLevel;
  modules: AcademyModule[];
}

interface AcademyModule {
  name: string;
  description: string;
  duration: string;
  objectives: string[];
  assessments: AcademyAssessment[];
}

interface AcademyAssessment {
  name: string;
  type: AssessmentType;
  criteria: string[];
  weight: number;
}

interface AcademyCoach {
  coachId: string;
  role: CoachRole;
  startDate: string;
  endDate?: string;
  schedule: CoachSchedule[];
}

interface AcademyStudent {
  playerId: string;
  enrollmentDate: string;
  graduationDate?: string;
  currentLevel: CurriculumLevel;
  performanceMetrics: StudentPerformance[];
  attendance: StudentAttendance[];
}

interface StudentPerformance {
  metric: PerformanceMetric;
  value: number;
  date: string;
  notes?: string;
}

interface StudentAttendance {
  date: string;
  status: AttendanceStatus;
  sessionType: SessionType;
}
```

#### Tournament Domain
```typescript
// Domain: Tournament
interface Tournament {
  id: string;
  externalId?: string;
  name: string;
  shortName: string;
  description?: string;
  format: CricketFormat;
  tournamentType: TournamentType;
  category: TournamentCategory;
  gender: TournamentGender;
  ageGroup?: AgeGroup;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  venue: TournamentVenue;
  organizerId: string;
  sponsorIds: string[];
  prizePool: PrizePool[];
  teams: TournamentTeam[];
  schedule: TournamentSchedule[];
  standings: TournamentStandings[];
  stats: TournamentStats;
  createdAt: string;
  updatedAt: string;
}

interface TournamentVenue {
  name: string;
  address: TournamentAddress;
  capacity: number;
  facilities: string[];
}

interface TournamentAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PrizePool {
  position: number;
  amount: number;
  currency: string;
  description?: string;
}

interface TournamentTeam {
  teamId: string;
  teamName: string;
  registeredDate: string;
  captainId: string;
  roster: string[];
  status: 'registered' | 'confirmed' | 'withdrawn';
}

interface TournamentSchedule {
  matchId: string;
  team1Id: string;
  team2Id: string;
  scheduledDate: string;
  scheduledTime: string;
  venue: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'abandoned';
  result?: MatchResult;
}

interface TournamentStandings {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  matchesNoResult: number;
  points: number;
  netRunRate: number;
  runRate: number;
  lastUpdated: string;
}

interface TournamentStats {
  totalTeams: number;
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;
  totalCenturies: number;
  totalHatTricks: number;
  averageScore: number;
  highestScore: number;
}
```

#### Match Domain
```typescript
// Domain: Match
interface Match {
  id: string;
  externalId?: string;
  tournamentId: string;
  tournamentName: string;
  matchType: MatchType;
  matchNumber?: number;
  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;
  scheduledDate: string;
  scheduledTime: string;
  venueId: string;
  venueName: string;
  tossWinnerId?: string;
  tossDecision?: TossDecision;
  firstInnings?: Innings;
  secondInnings?: Innings;
  result?: MatchResult;
  superOver?: SuperOver;
  weather: MatchWeather;
  umpires: MatchOfficial[];
  matchReferee?: MatchOfficial;
  tvUmpire?: MatchOfficial;
  fourthUmpire?: MatchOfficial;
  matchStatus: MatchStatus;
  inningsStatus: InningsStatus;
  currentScore?: CurrentScore;
  currentOver?: number;
  currentBatsmen: Batsman[];
  currentBowlers: Bowler[];
  powerplays: Powerplay[];
  declared?: boolean;
  followOn?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Innings {
  inningsNumber: number;
  teamId: string;
  teamName: string;
  targetScore?: number;
  targetOvers?: number;
  runs: number;
  wickets: number;
  overs: number;
  extras: Extras;
  batsmen: Batsman[];
  bowlers: Bowler[];
  declarations: Declaration[];
  followOnDeclared?: boolean;
}

interface CurrentScore {
  runs: number;
  wickets: number;
  overs: number;
  runRate: number;
  requiredRunRate?: number;
  ballsRemaining?: number;
  target?: number;
}

interface Batsman {
  playerId: string;
  playerName: string;
  jerseyNumber?: number;
  isBatting: boolean;
  isOnStrike: boolean;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissals: Dismissal[];
}

interface Bowler {
  playerId: string;
  playerName: string;
  jerseyNumber?: number;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: Extras;
  wides?: number;
  noBalls?: number;
  byes?: number;
  legByes?: number;
}

interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalties: number;
  total: number;
}

interface Dismissal {
  type: DismissalType;
  playerId: string;
  playerName: string;
  fielderId?: string;
  fielderName?: string;
  bowlerId: string;
  bowlerName: string;
  ballNumber: number;
  overNumber: number;
  commentary?: string;
}

interface Powerplay {
  number: number;
  overs: number;
  fieldingRestrictions: FieldingRestrictions;
  status: 'active' | 'completed' | 'notStarted';
}

interface FieldingRestrictions {
  maxFielders: number;
  outsideCircle: number;
  insideCircle: number;
}

interface MatchResult {
  type: ResultType;
  winningTeamId?: string;
  winningTeamName?: string;
  margin?: string;
  resultDetails?: string;
  superOverResult?: SuperOverResult;
}

interface SuperOver {
  team1Score: number;
  team1Wickets: number;
  team1Overs: number;
  team2Score: number;
  team2Wickets: number;
  team2Overs: number;
  winnerId?: string;
}

interface MatchWeather {
  temperature: number;
  humidity: number;
  weatherCondition: WeatherCondition;
  rainDelay: boolean;
  rainDelayDuration?: number;
}

interface MatchOfficial {
  officialId: string;
  name: string;
  role: OfficialRole;
  nationality: string;
  iccId?: string;
}

interface SuperOverResult {
  winningTeamId: string;
  winningTeamName: string;
  margin: string;
}
```

#### Scorecard Domain
```typescript
// Domain: Scorecard
interface Scorecard {
  id: string;
  matchId: string;
  tournamentId: string;
  team1Scorecard: TeamScorecard;
  team2Scorecard: TeamScorecard;
  matchSummary: MatchSummary;
  playerOfTheMatch?: PlayerOfTheMatch;
  umpires: Umpire[];
  createdAt: string;
  updatedAt: string;
}

interface TeamScorecard {
  teamId: string;
  teamName: string;
  innings: InningsScorecard[];
  totalScore: number;
  totalWickets: number;
  totalOvers: number;
  extras: Extras;
  partnerships: Partnership[];
  powerplayScores: PowerplayScore[];
}

interface InningsScorecard {
  inningsNumber: number;
  teamId: string;
  runs: number;
  wickets: number;
  overs: number;
  extras: Extras;
  batsmen: BatsmanScore[];
  bowlers: BowlerScore[];
  declarations: Declaration[];
}

interface BatsmanScore {
  playerId: string;
  playerName: string;
  jerseyNumber?: number;
  out: boolean;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissals: Dismissal[];
}

interface BowlerScore {
  playerId: string;
  playerName: string;
  jerseyNumber?: number;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: Extras;
  wides?: number;
  noBalls?: number;
}

interface Partnership {
  batsman1Id: string;
  batsman1Name: string;
  batsman2Id: string;
  batsman2Name: string;
  runs: number;
  balls: number;
  wickets: number;
  startOver: number;
  endOver: number;
  status: 'completed' | 'unbroken';
}

interface PowerplayScore {
  number: number;
  overs: number;
  runs: number;
  wickets: number;
}

interface MatchSummary {
  venue: string;
  date: string;
  tossWinner: string;
  tossDecision: TossDecision;
  result: MatchResult;
  manOfTheMatch?: PlayerOfTheMatch;
  umpires: Umpire[];
}

interface PlayerOfTheMatch {
  playerId: string;
  playerName: string;
  teamId: string;
  performance: PerformanceSummary;
}

interface Umpire {
  officialId: string;
  name: string;
  role: OfficialRole;
  nationality: string;
}
```

#### Video Analysis Domain
```typescript
// Domain: Video Analysis
interface VideoAnalysis {
  id: string;
  matchId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  matchDate: string;
  teams: VideoAnalysisTeam[];
  clips: VideoClip[];
  tags: VideoTag[];
  aiAnalysis: AIAnalysis[];
  createdAt: string;
  updatedAt: string;
}

interface VideoAnalysisTeam {
  teamId: string;
  teamName: string;
  color: string;
}

interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  clipType: ClipType;
  description: string;
  tags: string[];
  playerIds: string[];
  shotType?: ShotType;
  bowlerId?: string;
  batsmanId?: string;
  commentary?: string;
  createdAt: string;
}

interface VideoTag {
  id: string;
  tagType: TagType;
  value: string;
  startTime: number;
  endTime: number;
  playerId?: string;
  metadata: Record<string, unknown>;
}

interface AIAnalysis {
  id: string;
  analysisType: AnalysisType;
  description: string;
  confidence: number;
  timestamp: number;
  relatedClips: string[];
  recommendations: string[];
}

interface ShotTag {
  id: string;
  playerId: string;
  playerName: string;
  shotType: ShotType;
  direction: ShotDirection;
  distance: number;
  outcome: ShotOutcome;
  bowlerId: string;
  bowlerName: string;
  overNumber: number;
  ballNumber: number;
  timestamp: number;
  videoClipId?: string;
}
```

#### Analytics Domain
```typescript
// Domain: Analytics
interface Analytics {
  id: string;
  type: AnalyticsType;
  entityId: string;
  entityName: string;
  entityCategory: AnalyticsEntityCategory;
  metrics: AnalyticsMetrics;
  trends: AnalyticsTrends;
  comparisons: AnalyticsComparisons;
  insights: AnalyticsInsight[];
  predictions?: AnalyticsPrediction[];
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsMetrics {
  // Player metrics
  matchesPlayed?: number;
  runsScored?: number;
  battingAverage?: number;
  strikeRate?: number;
  centuries?: number;
  halfCenturies?: number;
  wicketsTaken?: number;
  bowlingAverage?: number;
  economyRate?: number;
  catches?: number;
  
  // Team metrics
  matchesWon?: number;
  winPercentage?: number;
  runRate?: number;
  netRunRate?: number;
  
  // Tournament metrics
  totalMatches?: number;
  totalRuns?: number;
  averageScore?: number;
}

interface AnalyticsTrends {
  performanceTrend: PerformanceTrend[];
  formGuide: FormGuide[];
  homeAwayPerformance: HomeAwayPerformance;
  vsOpponentTrend: OpponentTrend[];
}

interface AnalyticsComparisons {
  playerComparison: PlayerComparison[];
  teamComparison: TeamComparison[];
  historicalPerformance: HistoricalPerformance[];
}

interface AnalyticsInsight {
  id: string;
  insightType: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
  confidence: number;
  supportingData: InsightData[];
  recommendation?: string;
}

interface AnalyticsPrediction {
  id: string;
  predictionType: PredictionType;
  description: string;
  confidence: number;
  probability: number;
  factors: PredictionFactor[];
  createdAt: string;
}

interface PredictionFactor {
  factor: string;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
}
```

#### User Roles & Permissions
```typescript
// Domain: User Management
interface User {
  id: string;
  externalId?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  profileImage?: string;
  roles: UserRole[];
  permissions: string[];
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserRole {
  role: RoleType;
  scope: RoleScope;
  scopeId?: string;
  assignedBy?: string;
  assignedAt: string;
  expiresAt?: string;
}

interface RoleScope {
  type: ScopeType;
  id: string;
  name: string;
}

interface UserPermissions {
  canView: string[];
  canCreate: string[];
  canUpdate: string[];
  canDelete: string[];
  canApprove: string[];
  canManage: string[];
}
```

---

## 3. Feature Modules Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── index.ts
├── shared/
│   ├── types/              # Shared types and interfaces
│   │   ├── common.ts
│   │   ├── player.ts
│   │   ├── team.ts
│   │   ├── club.ts
│   │   ├── academy.ts
│   │   ├── tournament.ts
│   │   ├── match.ts
│   │   ├── analytics.ts
│   │   └── video-analysis.ts
│   ├── context/            # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   └── ...
│   ├── services/           # Shared services
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── config.ts
│   └── utils/              # Shared utilities
│       ├── format.ts
│       ├── validation.ts
│       └── ...
├── features/               # Domain-specific features
│   ├── player/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── team/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── club/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── academy/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── tournament/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── match/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── scorecard/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── video-analysis/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── analytics/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── training/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── fantasy/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   └── notifications/
│       ├── types/
│       ├── hooks/
│       ├── services/
│       ├── components/
│       └── pages/
├── layouts/
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   └── index.ts
└── main.tsx
```

---

## 4. State Management Strategy

### 4.1 Zustand Stores (Client State)

```typescript
// stores/useAuthStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// stores/useThemeStore.ts
interface ThemeState {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
}

// stores/useToastStore.ts
interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// stores/useNavigationStore.ts
interface NavigationState {
  activePath: string;
  sidebarOpen: boolean;
  activeMenu: string;
  navigate: (path: string) => void;
  toggleSidebar: () => void;
  setActiveMenu: (menu: string) => void;
}
```

### 4.2 TanStack Query (Server State)

```typescript
// Query keys
const queryKeys = {
  players: () => ['players'],
  player: (id: string) => ['players', id],
  teams: () => ['teams'],
  team: (id: string) => ['teams', id],
  clubs: () => ['clubs'],
  club: (id: string) => ['clubs', id],
  academies: () => ['academies'],
  academy: (id: string) => ['academies', id],
  tournaments: () => ['tournaments'],
  tournament: (id: string) => ['tournaments', id],
  matches: () => ['matches'],
  match: (id: string) => ['matches', id],
  scorecards: () => ['scorecards'],
  scorecard: (id: string) => ['scorecards', id],
  analytics: () => ['analytics'],
  videoAnalysis: () => ['video-analysis'],
  videoClips: () => ['video-clips'],
};

// Example query hooks
const usePlayers = () => {
  return useQuery({
    queryKey: queryKeys.players(),
    queryFn: playerService.getAllPlayers,
  });
};

const usePlayer = (id: string) => {
  return useQuery({
    queryKey: queryKeys.player(id),
    queryFn: () => playerService.getPlayerById(id),
    enabled: !!id,
  });
};
```

---

## 5. API Layer Architecture

### 5.1 API Client Configuration

```typescript
// shared/services/api.ts
class ApiClient {
  private baseURL: string;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.accessToken = storage.getItem('accessToken');
    this.refreshToken = storage.getItem('refreshToken');
  }

  private async refreshAccessToken() {
    // Refresh token logic
  }

  private async request<T>(options: RequestInit): Promise<T> {
    // Request logic with auth headers
  }

  async get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  async post<T>(url: string, body?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', body: JSON.stringify(body) });
  }

  async put<T>(url: string, body?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', body: JSON.stringify(body) });
  }

  async delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);
```

### 5.2 Service Layer

```typescript
// features/player/services/playerService.ts
class PlayerService {
  private basePath = '/api/players';

  async getAllPlayers(params?: PlayerQueryParams): Promise<ListResponse<Player>> {
    return apiClient.get(`${this.basePath}`, { params });
  }

  async getPlayerById(id: string): Promise<Player> {
    return apiClient.get(`${this.basePath}/${id}`);
  }

  async createPlayer(player: CreatePlayerDto): Promise<Player> {
    return apiClient.post(this.basePath, player);
  }

  async updatePlayer(id: string, player: UpdatePlayerDto): Promise<Player> {
    return apiClient.put(`${this.basePath}/${id}`, player);
  }

  async deletePlayer(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  async getPlayerStats(id: string): Promise<PlayerStats> {
    return apiClient.get(`${this.basePath}/${id}/stats`);
  }

  async getPlayerPerformanceHistory(id: string): Promise<PerformanceRecord[]> {
    return apiClient.get(`${this.basePath}/${id}/performance-history`);
  }
}

export const playerService = new PlayerService();
```

---

## 6. Migration Strategy

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up new project structure
- [ ] Define shared types and interfaces
- [ ] Implement API client
- [ ] Set up state management stores
- [ ] Configure routing

### Phase 2: Core Domains (Weeks 3-6)
- [ ] Player domain implementation
- [ ] Team domain implementation
- [ ] Club domain implementation
- [ ] Academy domain implementation

### Phase 3: Competition Domains (Weeks 7-9)
- [ ] Tournament domain implementation
- [ ] Match domain implementation
- [ ] Scorecard domain implementation

### Phase 4: Analytics & AI (Weeks 10-12)
- [ ] Analytics domain implementation
- [ ] Video analysis implementation
- [ ] AI insights implementation

### Phase 5: Training & Fantasy (Weeks 13-14)
- [ ] Training domain implementation
- [ ] Fantasy domain implementation

### Phase 6: Polish & Testing (Weeks 15-16)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Testing (unit, integration, E2E)
- [ ] Documentation

---

## 7. Key Design Principles

### 7.1 Domain-Driven Design
- **Bounded Contexts**: Clear boundaries between domains
- **Entities & Value Objects**: Proper domain modeling
- **Domain Services**: Business logic encapsulation
- **Domain Events**: Event-driven architecture

### 7.2 Clean Architecture
- **Separation of Concerns**: Clear layer separation
- **Dependency Rule**: Inner layers don't depend on outer layers
- **Testability**: Easy to test individual components

### 7.3 Scalability
- **Feature Slicing**: Organize by feature, not by type
- **Lazy Loading**: Code splitting for performance
- **Caching**: Smart caching strategies
- **State Management**: Appropriate state management patterns

### 7.4 Maintainability
- **Type Safety**: Full TypeScript coverage
- **Consistent Patterns**: Standardized patterns across domains
- **Documentation**: Comprehensive documentation
- **Testing**: Unit, integration, and E2E tests

---

## 8. Next Steps

1. **Review and approve architecture document**
2. **Set up new project structure**
3. **Implement shared types and interfaces**
4. **Implement API client and service layer**
5. **Implement state management stores**
6. **Implement domain modules one by one**
7. **Migrate existing features gradually**
8. **Testing and optimization**

---

## 9. References

- [Domain-Driven Design](https://domainlanguage.com/ddd/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
