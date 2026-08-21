/* ── Shared Components ──────────────────────────────────── */

export { ProtectedRoute } from './ProtectedRoute';
export { GuestRoute } from './GuestRoute';
export { LoadingButton } from './LoadingButton';

/* ── Page Layout System ────────────────────────────────── */

export {
  PageShell,
  PageHeader,
  PageTitle,
  PageActions,
  PageContent,
  PageSection,
  PageToolbar,
  PageTabs,
  PageFilters,
  PageFooter,
} from './layout';

export type {
  PageShellProps,
  PageHeaderProps,
  PageTitleProps,
  PageActionsProps,
  PageContentProps,
  PageSectionProps,
  PageToolbarProps,
  PageTabsProps,
  PageFiltersProps,
  PageFooterProps,
} from './layout';

/* ── Typography System ─────────────────────────────────── */

export {
  Display,
  Heading,
  Body,
  Label,
  Caption,
  Overline,
  Metric,
  ScoreText,
  StatValue,
} from './typography';

export type {
  DisplayProps,
  HeadingProps,
  BodyProps,
  LabelProps,
  CaptionProps,
  OverlineProps,
  MetricKind,
  MetricProps,
  ScoreTextProps,
  StatValueProps,
} from './typography';

/* ── UI Design System ──────────────────────────────────── */

export {
  Button,
  Input,
  Card,
  Dialog,
  Drawer,
  EmptyState,
  LoadingState,
  Skeleton,
  ErrorState,
  ConfirmDialog,
  ThemeToggle,
} from './ui';

export type {
  ButtonProps,
  InputProps,
  CardProps,
  DialogProps,
  DrawerProps,
  EmptyStateProps,
  LoadingStateProps,
  ErrorStateProps,
  ConfirmDialogProps,
  ThemeToggleProps,
} from './ui';

/* ── Feedback System ───────────────────────────────────── */

export { ToastProvider, useToast, Banner } from './feedback';

export type { ToastApi, ToastOptions, BannerProps, BannerTone } from './feedback';

/* ── Data Table System ─────────────────────────────────── */

export { DataTable } from './table';

export type { DataTableColumn, DataTableProps } from './table';

/* ── Forms System ──────────────────────────────────────── */

export { FormField, FormRow, FormActions, Select, TextArea, Switch, Checkbox } from './form';

export type {
  FormFieldProps,
  FormRowProps,
  FormActionsProps,
  SelectProps,
  SelectOption,
  TextAreaProps,
  SwitchProps,
  CheckboxProps,
} from './form';

/* ── Motion System ────────────────────────────────────── */

export { Motion, motion, fadeUp, fade, slideInRight, scaleIn, stagger } from './motion';

export type { MotionProps } from './motion';

/* ── Analytics Components ──────────────────────────────── */

export { Sparkline, BarChart, DonutChart } from './analytics';

export type { SparklineProps, BarChartProps, BarDatum, DonutChartProps, DonutSegment } from './analytics';

/* ── Cricket Components ────────────────────────────────── */

export {
  Score,
  Scoreboard,
  PlayerAvatar,
  TeamBadge,
  MatchStatus,
  LiveIndicator,
  StatCard,
  PerformanceMetric,
  FormIndicator,
  TournamentBadge,
} from './cricket';

export type {
  ScoreProps,
  ScoreboardProps,
  ScoreboardTeam,
  PlayerAvatarProps,
  TeamBadgeProps,
  MatchStatusProps,
  MatchState,
  LiveIndicatorProps,
  StatCardProps,
  PerformanceMetricProps,
  FormIndicatorProps,
  FormResult,
  TournamentBadgeProps,
} from './cricket';
