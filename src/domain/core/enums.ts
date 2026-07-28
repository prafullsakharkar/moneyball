// =============================================================================
// CricketIQ - Core Enums
// =============================================================================
// Enum definitions for domain types
// =============================================================================

// ============================================================================
// Cricket Formats
// ============================================================================

export enum CricketFormat {
  TEST = 'test',
  ODI = 'odi',
  T20 = 't20',
  T10 = 't10',
  FIRST_CLASS = 'first-class',
  LIST_A = 'list-a',
  OTHER = 'other',
}

// ============================================================================
// Entity Status
// ============================================================================

export enum EntityStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

// ============================================================================
// Match Status
// ============================================================================

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  WARMUP = 'warmup',
  FIRST_INNINGS = 'first-innings',
  SECOND_INNINGS = 'second-innings',
  INNINGS_BREAK = 'innings-break',
  MATCH_COMPLETED = 'match-completed',
  ABANDONED = 'abandoned',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
  TIMEOUT = 'timeout',
  TIED = 'tied',
  NO_RESULT = 'no-result',
}

// ============================================================================
// Scoring Status
// ============================================================================

export enum ScoringStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ============================================================================
// Player Status
// ============================================================================

export enum PlayerStatus {
  AVAILABLE = 'available',
  INJURED = 'injured',
  SUSPENDED = 'suspended',
  UNAVAILABLE = 'unavailable',
  RETIRED = 'retired',
  TRANSFERRED = 'transferred',
}

// ============================================================================
// Team Status
// ============================================================================

export enum TeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DISBANDED = 'disbanded',
}

// ============================================================================
// Tournament Status
// ============================================================================

export enum TournamentStatus {
  PLANNING = 'planning',
  REGISTRATION_OPEN = 'registration-open',
  REGISTRATION_CLOSED = 'registration-closed',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ============================================================================
// Organization Types
// ============================================================================

export enum OrganizationType {
  ASSOCIATION = 'association',
  LEAGUE = 'league',
  CLUB = 'club',
  ACADEMY = 'academy',
  SCHOOL = 'school',
  COMPANY = 'company',
  OTHER = 'other',
}

// ============================================================================
// Location Types
// ============================================================================

export enum LocationType {
  GROUND = 'ground',
  STADIUM = 'stadium',
  VENUE = 'venue',
  OFFICE = 'office',
  TRAINING_CENTER = 'training-center',
  OTHER = 'other',
}

// ============================================================================
// Media Types
// ============================================================================

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

// ============================================================================
// Social Media Platforms
// ============================================================================

export enum SocialMediaPlatform {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
}

// ============================================================================
// Cricket Pitch Types
// ============================================================================

export enum CricketPitchType {
  DRIED = 'dried',
  GREEN = 'green',
  HARD = 'hard',
  SOFT = 'soft',
  DRY = 'dry',
  CRICKET = 'cricket',
  ARTIFICIAL = 'artificial',
}

// ============================================================================
// Cricket Pitch Condition
// ============================================================================

export enum CricketPitchCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
  BAD = 'bad',
}

// ============================================================================
// Cricket Pitch Pace
// ============================================================================

export enum CricketPitchPace {
  FAST = 'fast',
  MEDIUM = 'medium',
  SLOW = 'slow',
}

// ============================================================================
// Cricket Pitch Bounce
// ============================================================================

export enum CricketPitchBounce {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// ============================================================================
// Cricket Pitch Carry
// ============================================================================

export enum CricketPitchCarry {
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
}

// ============================================================================
// Cricket Pitch Spin
// ============================================================================

export enum CricketPitchSpin {
  GRAVEL = 'gravel',
  CLAY = 'clay',
  SAND = 'sand',
  LOAM = 'loam',
}

// ============================================================================
// Audit Actions
// ============================================================================

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PERMISSION_CHANGE = 'permission-change',
  STATUS_CHANGE = 'status-change',
  IMPORT = 'import',
  EXPORT = 'export',
}

// ============================================================================
// Notification Types
// ============================================================================

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
  MATCH = 'match',
  SCORING = 'scoring',
  TEAM = 'team',
  PLAYER = 'player',
  TOURNAMENT = 'tournament',
  PAYMENT = 'payment',
  REMINDER = 'reminder',
}

// ============================================================================
// Notification Channels
// ============================================================================

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in-app',
  WHATSAPP = 'whatsapp',
}

// ============================================================================
// Filter Operators
// ============================================================================

export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  LT = 'lt',
  LTE = 'lte',
  GT = 'gt',
  GTE = 'gte',
  CONTAINS = 'contains',
  IN = 'in',
  NOT_IN = 'not-in',
  LIKE = 'like',
  NULL = 'null',
  NOT_NULL = 'not-null',
}

// ============================================================================
// Role Scopes
// ============================================================================

export enum RoleScope {
  GLOBAL = 'global',
  ORGANIZATION = 'organization',
  TEAM = 'team',
  PLAYER = 'player',
}

// ============================================================================
// Scope Types for Role Assignments
// ============================================================================

export enum ScopeType {
  GLOBAL = 'global',
  ORGANIZATION = 'organization',
  TEAM = 'team',
  PLAYER = 'player',
}

// ============================================================================
// Theme Modes
// ============================================================================

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

// ============================================================================
// Time Formats
// ============================================================================

export enum TimeFormat {
  TWELVE_HOUR = '12h',
  TWENTY_FOUR_HOUR = '24h',
}

// ============================================================================
// Digest Frequencies
// ============================================================================

export enum DigestFrequency {
  INSTANT = 'instant',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

// ============================================================================
// Profile Visibility
// ============================================================================

export enum ProfileVisibility {
  PUBLIC = 'public',
  REGISTERED = 'registered',
  PRIVATE = 'private',
}

// ============================================================================
// Font Sizes
// ============================================================================

export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'xlarge',
}

// ============================================================================
// Seating Types
// ============================================================================

export enum SeatingType {
  COVERED = 'covered',
  UNCOVERED = 'uncovered',
  VIP = 'vip',
  GENERAL = 'general',
}

// ============================================================================
// File Upload Status
// ============================================================================

export enum FileUploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  ERROR = 'error',
}

// ============================================================================
// User Status
// ============================================================================

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}
