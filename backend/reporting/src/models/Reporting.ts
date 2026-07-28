// Models for Reporting Service

export enum ReportType {
  PlayerPerformance = 'PlayerPerformance',
  TeamPerformance = 'TeamPerformance',
  TournamentSummary = 'TournamentSummary',
  MatchAnalysis = 'MatchAnalysis',
  FinancialReport = 'FinancialReport',
  Attendance = 'Attendance',
  Scouting = 'Scouting',
  Analytics = 'Analytics',
  Custom = 'Custom'
}

export enum ReportFormat {
  PDF = 'PDF',
  Excel = 'Excel',
  CSV = 'CSV',
  HTML = 'HTML',
  JSON = 'JSON'
}

export enum ReportStatus {
  Draft = 'Draft',
  Generating = 'Generating',
  Completed = 'Completed',
  Failed = 'Failed',
  Scheduled = 'Scheduled'
}

export enum TemplateType {
  Standard = 'Standard',
  Custom = 'Custom',
  Template = 'Template'
}

export enum ScheduleType {
  OneTime = 'OneTime',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export enum PermissionLevel {
  Owner = 'Owner',
  Edit = 'Edit',
  View = 'View'
}

export interface Report {
  id: string;
  name: string;
  description: string | null;
  reportType: ReportType;
  reportFormat: ReportFormat;
  status: ReportStatus;
  generatedAt: string | null;
  fileUrl: string | null;
  parameters: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string | null;
  reportType: ReportType;
  templateType: TemplateType;
  templateContent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  name: string;
  description: string | null;
  scheduleType: ScheduleType;
  cronExpression: string | null;
  startDate: string;
  endDate: string | null;
  recipients: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportLog {
  id: string;
  reportId: string;
  scheduledId: string | null;
  status: string;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  fileUrl: string | null;
}

export interface ReportPermission {
  id: string;
  reportId: string;
  userId: string;
  permissionLevel: PermissionLevel;
  createdAt: string;
}

// Input types for CRUD operations
export interface ReportCreateInput {
  name: string;
  description?: string;
  reportType: ReportType;
  reportFormat?: ReportFormat;
  parameters: Record<string, unknown>;
  createdBy: string;
}

export interface ReportUpdateInput {
  name?: string;
  description?: string;
  status?: ReportStatus;
  parameters?: Record<string, unknown>;
}

export interface ReportGenerateInput {
  reportId: string;
  format?: ReportFormat;
  parameters?: Record<string, unknown>;
}

export interface ReportTemplateCreateInput {
  name: string;
  description?: string;
  reportType: ReportType;
  templateType: TemplateType;
  templateContent: string;
  isActive?: boolean;
}

export interface ReportTemplateUpdateInput {
  name?: string;
  description?: string;
  reportType?: ReportType;
  templateType?: TemplateType;
  templateContent?: string;
  isActive?: boolean;
}

export interface ReportScheduleCreateInput {
  reportId: string;
  name: string;
  description?: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  startDate: string;
  endDate?: string;
  recipients: string[];
  isActive?: boolean;
}

export interface ReportScheduleUpdateInput {
  name?: string;
  description?: string;
  scheduleType?: ScheduleType;
  cronExpression?: string;
  startDate?: string;
  endDate?: string;
  recipients?: string[];
  isActive?: boolean;
}

export interface ReportPermissionCreateInput {
  reportId: string;
  userId: string;
  permissionLevel: PermissionLevel;
}

export interface ReportPermissionUpdateInput {
  permissionLevel: PermissionLevel;
}
