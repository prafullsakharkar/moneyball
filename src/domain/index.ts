// =============================================================================
// CricketIQ - Domain Module Exports
// =============================================================================
// Main domain module exports for CricketIQ
// =============================================================================

// Core domain types
export type { ID, UUID, Timestamp } from './core/types';
export type { Money, Address, ContactInfo, SocialMediaLink, MediaReference } from './core/types';
export type { PaginationParams, PaginationResult, PaginatedResponse } from './core/types';
export type { Filter, Sort, QueryOptions } from './core/types';
export type { ApiResponse, ApiError, ListResponse } from './core/types';
export type { SearchQuery, SearchResult, SearchResponse } from './core/types';

export type { DomainEntity, AuditEntity, SoftDeleteEntity, AggregateRoot, ValueObject } from './core/entities';
export type { User, UserPreferences, UserSettings, NotificationPreferences, PrivacySettings, AccessibilitySettings, SecuritySettings } from './core/entities';
export type { Role, Permission, UserRoleAssignment } from './core/entities';
export type { Organization, OrganizationSettings, OrganizationHierarchy, FinancialInfo, MatchScoringSettings, PlayerRegistrationSettings, PaymentSettings, NotificationSettings } from './core/entities';
export type { CricketPitch, CricketGround, SeatingArrangement } from './core/entities';

export { CricketFormat, EntityStatus, MatchStatus, ScoringStatus, PlayerStatus, TeamStatus, TournamentStatus } from './core/enums';
export { OrganizationType, MediaType, SocialMediaPlatform } from './core/enums';
export { CricketPitchType, CricketPitchCondition, CricketPitchPace, CricketPitchBounce, CricketPitchCarry, CricketPitchSpin } from './core/enums';
export { FilterOperator } from './core/enums';
export { RoleScope, ScopeType, ThemeMode, TimeFormat, DigestFrequency, ProfileVisibility, FontSize, SeatingType, FileUploadStatus, UserStatus } from './core/enums';

// Competition domain
export * from './competition/tournaments';
export * from './competition/teams';
export * from './competition/players';
export * from './competition/matches';
export * from './competition/venue';

// Academy domain
export * from './academy/batches';
export * from './academy/coaches';
export * from './academy/courses';
export * from './academy/progress';
export * from './academy/students';

// Video domain
export * from './video/clips';
export * from './video/highlights';
export * from './video/tags';
export * from './video/videos';

// Analytics domain
export * from './analytics/insights';
export * from './analytics/leaderboards';
export * from './analytics/predictions';
export * from './analytics/stats';

// AI domain
export * from './ai/analysis';
export * from './ai/models';
export * from './ai/recommendations';
export * from './ai/scouting';

// Streaming domain
export * from './streaming/broadcasts';
export * from './streaming/lives';
export * from './streaming/streams';

// Fantasy domain
export * from './fantasy/contests';
export * from './fantasy/leagues';
export * from './fantasy/players';
export * from './fantasy/scoreboards';
export * from './fantasy/teams';

// Business domain
export * from './business/finance';
export * from './business/revenue';
export * from './business/sponsorship';
export * from './business/transactions';

// Enterprise domain
export * from './enterprise/audit';
export * from './enterprise/organizations';
export * from './enterprise/permissions';
export * from './enterprise/users';

// Shared types
export * from './shared/currency';
export * from './shared/index';
