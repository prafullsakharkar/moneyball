// Models for Notification Service

export interface Notification {
  id: string;
  userId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  priority: Priority;
  status: NotificationStatus;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  templateName: string;
  notificationType: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  priority: Priority;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSentHistory {
  id: string;
  notificationId?: string;
  userId: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  status: SendStatus;
  sentAt: string;
  errorMessage?: string;
}

export interface PushToken {
  id: string;
  userId: string;
  token: string;
  deviceType: DeviceType;
  deviceName?: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Enums
export enum NotificationType {
  MatchStart = 'MatchStart',
  MatchResult = 'MatchResult',
  ScoringUpdate = 'ScoringUpdate',
  TournamentUpdate = 'TournamentUpdate',
  TeamUpdate = 'TeamUpdate',
  PlayerUpdate = 'PlayerUpdate',
  FantasyUpdate = 'FantasyUpdate',
  PaymentUpdate = 'PaymentUpdate',
  SubscriptionRenewal = 'SubscriptionRenewal',
  SystemUpdate = 'SystemUpdate',
  Promotion = 'Promotion',
  Other = 'Other'
}

export enum Priority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High',
  Urgent = 'Urgent'
}

export enum NotificationStatus {
  Unread = 'Unread',
  Read = 'Read',
  Archived = 'Archived',
  Deleted = 'Deleted'
}

export enum NotificationChannel {
  Email = 'Email',
  SMS = 'SMS',
  Push = 'Push',
  InApp = 'InApp'
}

export enum SendStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed',
  Bounced = 'Bounced',
  Delivered = 'Delivered'
}

export enum DeviceType {
  iOS = 'iOS',
  Android = 'Android',
  Web = 'Web'
}

// Input types
export interface NotificationCreateInput {
  userId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  priority?: Priority;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationUpdateInput {
  title?: string;
  message?: string;
  priority?: Priority;
  actionUrl?: string;
  metadata?: Record<string, any>;
  status?: NotificationStatus;
}

export interface NotificationTemplateCreateInput {
  templateName: string;
  notificationType: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  priority?: Priority;
  isActive?: boolean;
}

export interface NotificationTemplateUpdateInput {
  titleTemplate?: string;
  messageTemplate?: string;
  priority?: Priority;
  isActive?: boolean;
}

export interface NotificationPreferenceCreateInput {
  userId: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  isEnabled?: boolean;
}

export interface NotificationPreferenceUpdateInput {
  isEnabled?: boolean;
}

export interface PushTokenCreateInput {
  userId: string;
  token: string;
  deviceType: DeviceType;
  deviceName?: string;
  isActive?: boolean;
}

export interface PushTokenUpdateInput {
  deviceName?: string;
  isActive?: boolean;
}
