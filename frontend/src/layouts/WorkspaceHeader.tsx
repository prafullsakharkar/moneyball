/**
 * WorkspaceHeader
 * ============================================
 * Contextual workspace navigation rendered below the global header.
 *
 * When the user is inside a specific workspace (Player, Team, Match,
 * Tournament), this header surfaces the contextual tabs for that entity so
 * they never have to navigate back to the root to reach related views.
 *
 * Workspaces are detected from the URL shape:
 *   /players/:id        → Player workspace
 *   /teams/:id          → Team workspace
 *   /matches/:id        → Match workspace
 *   /tournaments/:id    → Tournament workspace
 *
 * On mobile the tabs collapse into a horizontally scrollable strip; the
 * workspace title is hidden to preserve space.
 */
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Chip, Typography, useTheme, useMediaQuery } from '@mui/material';
import { layout } from '@design/tokens';

interface WorkspaceHeaderProps {
  /** Effective sidebar width (accounts for collapsed state). */
  sidebarWidth?: number;
}

export interface WorkspaceTab {
  label: string;
  href: string;
}

interface WorkspaceDefinition {
  kind: string;
  title: string;
  tabs: WorkspaceTab[];
}

const WORKSPACES: WorkspaceDefinition[] = [
  {
    kind: 'player',
    title: 'Player',
    tabs: [
      { label: 'Overview', href: 'overview' },
      { label: 'Performance', href: 'performance' },
      { label: 'Matches', href: 'matches' },
      { label: 'Statistics', href: 'statistics' },
      { label: 'Training', href: 'training' },
      { label: 'Fitness', href: 'fitness' },
      { label: 'Medical', href: 'medical' },
      { label: 'Media', href: 'media' },
    ],
  },
  {
    kind: 'team',
    title: 'Team',
    tabs: [
      { label: 'Overview', href: 'overview' },
      { label: 'Squad', href: 'squad' },
      { label: 'Matches', href: 'matches' },
      { label: 'Performance', href: 'performance' },
      { label: 'Statistics', href: 'statistics' },
      { label: 'Training', href: 'training' },
      { label: 'Staff', href: 'staff' },
      { label: 'Analytics', href: 'analytics' },
    ],
  },
  {
    kind: 'match',
    title: 'Match',
    tabs: [
      { label: 'Overview', href: 'overview' },
      { label: 'Scorecard', href: 'scorecard' },
      { label: 'Live Scoring', href: 'live-scoring' },
      { label: 'Commentary', href: 'commentary' },
      { label: 'Analytics', href: 'analytics' },
      { label: 'Players', href: 'players' },
      { label: 'Timeline', href: 'timeline' },
      { label: 'Video', href: 'video' },
      { label: 'Reports', href: 'reports' },
    ],
  },
  {
    kind: 'tournament',
    title: 'Tournament',
    tabs: [
      { label: 'Overview', href: 'overview' },
      { label: 'Seasons', href: 'seasons' },
      { label: 'Fixtures', href: 'fixtures' },
      { label: 'Matches', href: 'matches' },
      { label: 'Teams', href: 'teams' },
      { label: 'Standings', href: 'standings' },
      { label: 'Statistics', href: 'statistics' },
      { label: 'Analytics', href: 'analytics' },
      { label: 'Reports', href: 'reports' },
    ],
  },
];

/** Detect the active workspace from the current pathname. */
function detectWorkspace(pathname: string): WorkspaceDefinition | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  const [root, id] = segments;
  if (!id) return null;
  return WORKSPACES.find((w) => w.kind === root) ?? null;
}

export function WorkspaceHeader({ sidebarWidth = layout.sidebarWidth }: WorkspaceHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const workspace = detectWorkspace(location.pathname);
  if (!workspace) return null;

  const base = `/${workspace.kind}/${params.id ?? ''}`;
  const activeTab = location.pathname.split('/').filter(Boolean)[2] ?? 'overview';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: { xs: 1, md: 2 },
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflowX: 'auto',
        ml: { md: `${sidebarWidth}px` },
      }}
    >
      {!isMobile && (
        <Typography
          variant="overline"
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          {workspace.title}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {workspace.tabs.map((tab) => {
          const active = activeTab === tab.href;
          return (
            <Chip
              key={tab.href}
              label={tab.label}
              clickable
              onClick={() => navigate(`${base}/${tab.href}`)}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              size="small"
              sx={{ fontWeight: active ? 600 : 400 }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
