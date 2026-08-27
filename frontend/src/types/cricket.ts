/**
 * CricketOS — Cricket Domain Types
 * ============================================
 * Competition, Participants, Media, and Intelligence domain entities.
 * All cricket metrics (runs, wickets, overs, averages, strike rates, economy,
 * rankings, points) are numeric and rendered with tabular numbers, right-aligned.
 */

/* ════════════════════════════════════════════════════════════════════
 * Match Domain
 * ════════════════════════════════════════════════════════════════════ */

export type MatchFormat = 'test' | 'odi' | 't20' | 't10' | 'the_hundred';

export type MatchState =
  | 'scheduled'
  | 'in_progress'
  | 'live'
  | 'innings_break'
  | 'rain_delay'
  | 'completed'
  | 'abandoned'
  | 'no_result';

export type InningsNumber = 1 | 2 | 3 | 4;

export interface MatchTeam {
  id: string;
  name: string;
  shortName: string;
  /** Runs scored */
  runs: number;
  /** Wickets fallen */
  wickets: number;
  /** Overs bowled (e.g., 42.3) */
  overs: number;
  /** Run rate */
  runRate?: number;
  /** Whether this team is currently batting */
  batting?: boolean;
  /** Whether this team won */
  winner?: boolean;
}

export interface MatchInnings {
  number: InningsNumber;
  battingTeamId: string;
  bowlingTeamId: string;
  runs: number;
  wickets: number;
  overs: number;
  runRate: number;
  /** Declared / all out / completed */
  status: 'in_progress' | 'completed' | 'declared' | 'all_out';
  /** Batting card */
  batting: BattingCardEntry[];
  /** Bowling card */
  bowling: BowlingCardEntry[];
  /** Fall of wickets */
  fallOfWickets: FallOfWicket[];
  /** Partnerships */
  partnerships: Partnership[];
  /** Extras breakdown */
  extras: Extras;
  /** Powerplay overs */
  powerplays: Powerplay[];
}

export interface BattingCardEntry {
  playerId: string;
  playerName: string;
  /** How they were dismissed (e.g., "c Smith b Starc") */
  dismissal?: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  /** Whether the batter is currently at the crease */
  notOut?: boolean;
  /** Batting position */
  position: number;
}

export interface BowlingCardEntry {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  /** Wides + no balls */
  wides: number;
  noBalls: number;
}

export interface FallOfWicket {
  /** Wicket number (1-based) */
  wicket: number;
  /** Score at fall */
  score: number;
  /** Overs at fall */
  overs: number;
  playerId: string;
  playerName: string;
}

export interface Partnership {
  /** Wicket number this partnership was for */
  wicket: number;
  runs: number;
  balls: number;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
}

export interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
  total: number;
}

export interface Powerplay {
  label: string;
  fromOver: number;
  toOver: number;
  runs: number;
  wickets: number;
}

export interface CommentaryEntry {
  id: string;
  over: number;
  ball: number;
  /** Runs off the ball */
  runs: number;
  /** Wicket on the ball */
  wicket?: boolean;
  text: string;
  batterId?: string;
  bowlerId?: string;
  timestamp: string;
}

export interface Match {
  id: string;
  organizationId: string;
  tournamentId?: string;
  tournamentName?: string;
  seasonId?: string;
  seasonName?: string;
  format: MatchFormat;
  state: MatchState;
  /** Match number / label */
  label?: string;
  venue: string;
  city?: string;
  country?: string;
  startTime: string;
  /** Number of innings (2 for limited overs, up to 4 for tests) */
  inningsCount: 2 | 4;
  /** Target for the chasing team */
  target?: number;
  /** Required run rate for the chasing team */
  requiredRate?: number;
  /** Current innings number */
  currentInnings?: InningsNumber;
  /** Match result text */
  result?: string;
  /** Toss winner team id */
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
  teams: [MatchTeam, MatchTeam];
  innings: MatchInnings[];
  commentary: CommentaryEntry[];
  /** Whether the match is a live match */
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ════════════════════════════════════════════════════════════════════
 * Team Domain
 * ════════════════════════════════════════════════════════════════════ */

export interface Team {
  id: string;
  organizationId: string;
  name: string;
  shortName: string;
  code?: string;
  logoUrl?: string;
  /** Primary color */
  color?: string;
  homeGround?: string;
  coach?: string;
  captainId?: string;
  captainName?: string;
  founded?: number;
  /** Season record */
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  /** Points */
  points: number;
  /** Net run rate */
  netRunRate: number;
  /** Current form (W/L) */
  form: FormResult[];
  squad: TeamSquadMember[];
  createdAt: string;
  updatedAt: string;
}

export type FormResult = 'W' | 'L' | 'T' | 'N';

export interface TeamSquadMember {
  playerId: string;
  playerName: string;
  role: string;
  jerseyNumber?: number;
  /** Whether in the current playing XI */
  inPlayingXI?: boolean;
}

/* ════════════════════════════════════════════════════════════════════
 * Tournament Domain
 * ════════════════════════════════════════════════════════════════════ */

export type TournamentFormat = 'league' | 'knockout' | 'group_stage' | 'round_robin';

export interface Tournament {
  id: string;
  organizationId: string;
  name: string;
  shortName: string;
  format: TournamentFormat;
  formatLabel: string;
  season: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  teamsCount: number;
  matchesCount: number;
  /** Points table */
  standings: StandingRow[];
  createdAt: string;
  updatedAt: string;
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
  form: FormResult[];
}

/* ════════════════════════════════════════════════════════════════════
 * Analytics Domain
 * ════════════════════════════════════════════════════════════════════ */

export interface TrendPoint {
  label: string;
  value: number;
}

export interface ComparisonDatum {
  label: string;
  value: number;
  /** Comparison value (e.g., league average) */
  baseline?: number;
}

export interface AnalyticsQuestion {
  id: string;
  question: string;
  answer: string;
  /** Supporting data reference */
  evidence: string[];
  category: 'change' | 'performance' | 'improving' | 'declining' | 'location' | 'expectation';
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  severity: 'positive' | 'negative' | 'neutral';
  metric: string;
  change: number;
  trend: TrendPoint[];
}

/* ════════════════════════════════════════════════════════════════════
 * AI / Insights Domain
 * ════════════════════════════════════════════════════════════════════ */

export type InsightSource = 'generated' | 'verified';

export interface AiInsight {
  id: string;
  source: InsightSource;
  title: string;
  body: string;
  /** Context the insight is scoped to */
  context: string;
  /** Supporting verified statistics */
  supportingStats: { label: string; value: string }[];
  /** Confidence 0-1 */
  confidence?: number;
  createdAt: string;
}

export interface AiConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Whether content is generated (vs verified) */
  source?: InsightSource;
  createdAt: string;
}

/* ════════════════════════════════════════════════════════════════════
 * Media Domain
 * ════════════════════════════════════════════════════════════════════ */

export type MediaKind = 'video' | 'image' | 'clip' | 'highlight';

export interface MediaAsset {
  id: string;
  organizationId: string;
  kind: MediaKind;
  title: string;
  description?: string;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Media URL */
  url?: string;
  /** Duration in seconds (video) */
  duration?: number;
  /** Tags */
  tags: string[];
  /** Related match id */
  matchId?: string;
  /** Related player ids */
  playerIds: string[];
  /** Related team id */
  teamId?: string;
  /** Uploaded by */
  uploadedBy?: string;
  createdAt: string;
}

export interface VideoEvent {
  id: string;
  /** Timestamp in seconds */
  timestamp: number;
  type: 'ball' | 'wicket' | 'boundary' | 'milestone' | 'annotation';
  label: string;
  description?: string;
  /** Runs off the ball */
  runs?: number;
  playerId?: string;
  playerName?: string;
  tags: string[];
}

export interface VideoClip {
  id: string;
  title: string;
  start: number;
  end: number;
  tags: string[];
  playerIds: string[];
  createdAt: string;
}

export interface VideoAsset {
  id: string;
  title: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  duration: number;
  matchId?: string;
  matchLabel?: string;
  tags: string[];
  events: VideoEvent[];
  clips: VideoClip[];
  createdAt: string;
}

/* ════════════════════════════════════════════════════════════════════
 * Labels
 * ════════════════════════════════════════════════════════════════════ */

export const MATCH_FORMAT_LABELS: Record<MatchFormat, string> = {
  test: 'Test',
  odi: 'ODI',
  t20: 'T20',
  t10: 'T10',
  the_hundred: 'The Hundred',
};

export const MATCH_STATE_LABELS: Record<MatchState, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  live: 'Live',
  innings_break: 'Innings Break',
  rain_delay: 'Rain Delay',
  completed: 'Completed',
  abandoned: 'Abandoned',
  no_result: 'No Result',
};

export const TOURNAMENT_STATUS_LABELS: Record<Tournament['status'], string> = {
  upcoming: 'Upcoming',
  active: 'Active',
  completed: 'Completed',
};
