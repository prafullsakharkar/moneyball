// =============================================================================
// CricketIQ - Core Domain Exports
// =============================================================================
// Core domain types, entities, and enums for CricketIQ
// =============================================================================

// Types
export * from './types';

// Entities
export * from './entities';

// Enums
export * from './enums';

// ============================================================================
// Re-export common types for convenience
// ============================================================================

export type { ID, UUID, Timestamp } from './types';
export type { EntityStatus, MatchStatus, ScoringStatus, PlayerStatus, TeamStatus, TournamentStatus } from './types';
export type { CricketFormat } from './types';
export type { Money, Address, ContactInfo, SocialMediaLink, MediaReference } from './types';
export type { PaginationParams, PaginationResult, PaginatedResponse } from './types';
export type { Filter, Sort, QueryOptions } from './types';
export type { ApiResponse, ApiError, ListResponse } from './types';
export type { AuditLog, AuditAction } from './types';
export type { Notification, NotificationType, NotificationChannel } from './types';
export type { FileUpload, UploadResponse } from './types';
export type { SearchQuery, SearchResult, SearchResponse } from './types';

export type { DomainEntity, AuditEntity, SoftDeleteEntity, AggregateRoot, ValueObject } from './entities';
export type { User, UserPreferences, UserSettings, NotificationPreferences, PrivacySettings, AccessibilitySettings, SecuritySettings } from './entities';
export type { Role, Permission, UserRoleAssignment } from './entities';
export type { Organization, OrganizationSettings, OrganizationHierarchy, FinancialInfo, MatchScoringSettings, PlayerRegistrationSettings, PaymentSettings, NotificationSettings } from './entities';
export type { CricketPitch, CricketGround, SeatingArrangement } from './entities';

export { CricketFormat as CricketFormatEnum } from './enums';
export { EntityStatus as EntityStatusEnum } from './enums';
export { MatchStatus as MatchStatusEnum } from './enums';
export { ScoringStatus as ScoringStatusEnum } from './enums';
export { PlayerStatus as PlayerStatusEnum } from './enums';
export { TeamStatus as TeamStatusEnum } from './enums';
export { TournamentStatus as TournamentStatusEnum } from './enums';
export { OrganizationType as OrganizationTypeEnum } from './enums';
export { MediaType as MediaTypeEnum } from './enums';
export { SocialMediaPlatform as SocialMediaPlatformEnum } from './enums';
export { CricketPitchType as CricketPitchTypeEnum } from './enums';
export { CricketPitchCondition as CricketPitchConditionEnum } from './enums';
export { CricketPitchPace as CricketPitchPaceEnum } from './enums';
export { CricketPitchBounce as CricketPitchBounceEnum } from './enums';
export { CricketPitchCarry as CricketPitchCarryEnum } from './enums';
export { CricketPitchSpin as CricketPitchSpinEnum } from './enums';
export { AuditAction as AuditActionEnum } from './enums';
export { NotificationType as NotificationTypeEnum } from './enums';
export { NotificationChannel as NotificationChannelEnum } from './enums';
export { FilterOperator as FilterOperatorEnum } from './enums';
export { RoleScope as RoleScopeEnum } from './enums';
export { ScopeType as ScopeTypeEnum } from './enums';
export { ThemeMode as ThemeModeEnum } from './enums';
export { TimeFormat as TimeFormatEnum } from './enums';
export { DigestFrequency as DigestFrequencyEnum } from './enums';
export { ProfileVisibility as ProfileVisibilityEnum } from './enums';
export { FontSize as FontSizeEnum } from './enums';
export { SeatingType as SeatingTypeEnum } from './enums';
export { FileUploadStatus as FileUploadStatusEnum } from './enums';
export { UserStatus as UserStatusEnum } from './enums';
