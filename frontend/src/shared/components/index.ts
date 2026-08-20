/* ── Shared Components ──────────────────────────────────── */

export { PageHeader } from './PageHeader';
export { ProtectedRoute } from './ProtectedRoute';
export { GuestRoute } from './GuestRoute';
export { LoadingButton } from './LoadingButton';

/* ── UI Design System ──────────────────────────────────── */

export {
  Button,
  Input,
  Card,
  Dialog,
  EmptyState,
  LoadingState,
  Skeleton,
  ErrorState,
  ConfirmDialog,
} from './ui';

export type {
  ButtonProps,
  InputProps,
  CardProps,
  DialogProps,
  EmptyStateProps,
  LoadingStateProps,
  ErrorStateProps,
  ConfirmDialogProps,
} from './ui';

/* ── Cricket Components ────────────────────────────────── */

export {
  Score,
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
