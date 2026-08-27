/**
 * TeamWorkspacePage — CricketOS Team Workspace
 * ============================================
 * Premium team workspace with a team selector and tabbed navigation:
 * Overview, Squad, Matches, Performance, Statistics, Analytics, Training,
 * Staff, Fixtures, and Media.
 *
 * All cricket metrics use tabular numbers, right-aligned. Restrained colors.
 */
import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Chip } from '@mui/material';
import {
  PageShell,
  PageHeader,
  PageActions,
  PageSection,
  EmptyState,
  LoadingState,
  ErrorState,
  Button,
} from '@shared/components';
import {
  TeamBadge,
  StatCard,
  FormIndicator,
  PlayerAvatar,
} from '@shared/components/cricket';
import {
  LineChart,
  BarChart,
  RadarChart,
} from '@shared/components/analytics';
import { useTeams, useTeam } from '@hooks/useCricket';
import { useMatches } from '@hooks/useCricket';
import { useMediaAssets } from '@hooks/useCricket';
import { useHasPermission } from '@hooks/index';
import type { Team, TeamSquadMember, Match } from '@domain/index';
import type { FormResult as IndicatorFormResult } from '@shared/components/cricket';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

type TeamTab =
  | 'overview'
  | 'squad'
  | 'matches'
  | 'performance'
  | 'statistics'
  | 'analytics'
  | 'training'
  | 'staff'
  | 'fixtures'
  | 'media';

const TABS: { id: TeamTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <SportsCricketIcon /> },
  { id: 'squad', label: 'Squad', icon: <GroupsIcon /> },
  { id: 'matches', label: 'Matches', icon: <EmojiEventsIcon /> },
  { id: 'performance', label: 'Performance', icon: <TrendingUpIcon /> },
  { id: 'statistics', label: 'Statistics', icon: <BarChartIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <InsightsIcon /> },
  { id: 'training', label: 'Training', icon: <FitnessCenterIcon /> },
  { id: 'staff', label: 'Staff', icon: <BadgeIcon /> },
  { id: 'fixtures', label: 'Fixtures', icon: <CalendarMonthIcon /> },
  { id: 'media', label: 'Media', icon: <VideoLibraryIcon /> },
];

/** Map Team FormResult ('W'|'L'|'T'|'N') to FormIndicator FormResult. */
function toIndicatorForm(form: Team['form']): IndicatorFormResult[] {
  return form.map((r) => (r === 'N' ? 'NR' : r));
}

/** Deterministic synthetic trend series for a metric. */
function trendSeries(base: number, seed: number, points = 8): number[] {
  return Array.from({ length: points }, (_, i) => {
    const wobble = Math.sin(i * 1.7 + seed) * base * 0.08;
    return Math.max(0, Math.round((base + wobble) * 10) / 10);
  });
}

export default function TeamWorkspacePage() {
  const { data: teams, isLoading, isError, refetch } = useTeams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<TeamTab>('overview');

  const canManageTeam = useHasPermission('team', 'manage');

  const teamList = teams?.data ?? [];
  const activeId = selectedId ?? teamList[0]?.id ?? null;
  const { data: team, isLoading: teamLoading, isError: teamError, refetch: refetchTeam } = useTeam(activeId ?? '');

  if (isLoading) return <LoadingState message="Loading teams..." />;
  if (isError) return <ErrorState title="Failed to load teams" onRetry={() => refetch()} />;
  if (!teams || teamList.length === 0) {
    return (
      <PageShell>
        <PageHeader title="Team Workspace" description="Select a team to explore its workspace." />
        <EmptyState title="No teams found" description="Create a team to get started." />
      </PageShell>
    );
  }

  if (teamLoading) return <LoadingState message="Loading team..." />;
  if (teamError || !team) return <ErrorState title="Failed to load team" onRetry={() => refetchTeam()} />;

  const winRate = team.played > 0 ? Math.round((team.won / team.played) * 100) : 0;

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Team Workspace"
        description="Squad, performance, statistics, and media for a team."
        actions={
          canManageTeam ? (
            <PageActions>
              <Button variant="secondary" size="small">Edit Team</Button>
            </PageActions>
          ) : undefined
        }
      />

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        {/* Team selector sidebar */}
        <Box sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {teamList.map((t) => (
              <Box
                key={t.id}
                role="button"
                tabIndex={0}
                aria-pressed={t.id === activeId}
                onClick={() => setSelectedId(t.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(t.id);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: t.id === activeId ? 'primary.main' : 'divider',
                  bgcolor: t.id === activeId ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 1,
                  },
                }}
              >
                <TeamBadge name={t.name} shortName={t.shortName} color={t.color} size="sm" />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Mobile team selector */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {teamList.map((t) => (
                <Chip
                  key={t.id}
                  label={t.shortName}
                  onClick={() => setSelectedId(t.id)}
                  color={t.id === activeId ? 'primary' : 'default'}
                  variant={t.id === activeId ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
              {TABS.map((t) => (
                <Tab key={t.id} value={t.id} label={t.label} icon={t.icon} iconPosition="start" />
              ))}
            </Tabs>
          </Box>

          <Box>
            {tab === 'overview' && <OverviewTab team={team} winRate={winRate} />}
            {tab === 'squad' && <SquadTab team={team} />}
            {tab === 'matches' && <MatchesTab team={team} />}
            {tab === 'performance' && <PerformanceTab team={team} />}
            {tab === 'statistics' && <StatisticsTab team={team} />}
            {tab === 'analytics' && <AnalyticsTab team={team} />}
            {tab === 'training' && <TrainingTab />}
            {tab === 'staff' && <StaffTab team={team} />}
            {tab === 'fixtures' && <FixturesTab team={team} />}
            {tab === 'media' && <MediaTab />}
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}

/* ── Team Header ─────────────────────────────────────── */

function TeamHeader({ team, winRate }: { team: Team; winRate: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TeamBadge name={team.name} shortName={team.shortName} color={team.color} size="lg" />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{team.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {team.homeGround} · Founded {team.founded ?? '—'}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip label={`Coach: ${team.coach ?? '—'}`} size="small" variant="outlined" />
        <Chip label={`Captain: ${team.captainName ?? '—'}`} size="small" variant="outlined" />
        <Chip label={`Win rate: ${winRate}%`} size="small" variant="outlined" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard value={team.played} label="Played" />
        <StatCard value={team.won} label="Won" accent="success" />
        <StatCard value={team.lost} label="Lost" accent="error" />
        <StatCard value={team.points} label="Points" accent="primary" />
      </Box>
    </Box>
  );
}

/* ── Overview ────────────────────────────────────────── */

function OverviewTab({ team, winRate }: { team: Team; winRate: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TeamHeader team={team} winRate={winRate} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Season Record">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <DetailRow label="Net Run Rate" value={team.netRunRate.toFixed(2)} />
            <DetailRow label="Tied" value={String(team.tied)} />
            <DetailRow label="No Result" value={String(team.noResult)} />
            <DetailRow label="Home Ground" value={team.homeGround ?? '—'} />
          </Box>
        </PageSection>
        <PageSection title="Recent Form">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormIndicator results={toIndicatorForm(team.form)} size="lg" />
            <Typography variant="body2" color="text.secondary">
              Last {team.form.length} matches
            </Typography>
          </Box>
        </PageSection>
      </Box>
      <PageSection title="Squad Snapshot">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {team.squad.map((m) => (
            <Chip key={m.playerId} label={m.playerName} size="small" variant="outlined" />
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

/* ── Squad ───────────────────────────────────────────── */

function SquadTab({ team }: { team: Team }) {
  const playingXI = team.squad.filter((m) => m.inPlayingXI);
  const bench = team.squad.filter((m) => !m.inPlayingXI);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title={`Playing XI (${playingXI.length})`}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1 }}>
          {playingXI.map((m) => (
            <SquadMemberRow key={m.playerId} member={m} />
          ))}
        </Box>
      </PageSection>
      {bench.length > 0 && (
        <PageSection title={`Bench (${bench.length})`}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1 }}>
            {bench.map((m) => (
              <SquadMemberRow key={m.playerId} member={m} />
            ))}
          </Box>
        </PageSection>
      )}
    </Box>
  );
}

function SquadMemberRow({ member }: { member: TeamSquadMember }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <PlayerAvatar firstName={member.playerName.split(' ')[0] ?? ''} lastName={member.playerName.split(' ').slice(1).join(' ') || ' '} size="sm" />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {member.playerName}
        </Typography>
        <Typography variant="caption" color="text.secondary">{member.role}</Typography>
      </Box>
      {member.jerseyNumber !== undefined && (
        <Typography variant="caption" sx={{ ml: 'auto', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
          #{member.jerseyNumber}
        </Typography>
      )}
    </Box>
  );
}

/* ── Matches ─────────────────────────────────────────── */

function MatchesTab({ team }: { team: Team }) {
  const { data: matches, isLoading, isError, refetch } = useMatches();
  if (isLoading) return <LoadingState message="Loading matches..." />;
  if (isError) return <ErrorState title="Failed to load matches" onRetry={() => refetch()} />;
  const list = matches?.data ?? [];
  const teamMatches = list.filter((m) => m.teams.some((t) => t.id === team.id));
  if (teamMatches.length === 0) {
    return <EmptyState title="No matches" description="No matches found for this team." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {teamMatches.map((m) => (
        <MatchRow key={m.id} match={m} teamId={team.id} />
      ))}
    </Box>
  );
}

function MatchRow({ match, teamId }: { match: Match; teamId: string }) {
  const self = match.teams.find((t) => t.id === teamId);
  const opp = match.teams.find((t) => t.id !== teamId);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {self?.shortName} vs {opp?.shortName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {match.tournamentName ?? 'Match'} · {match.venue}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {self?.runs}/{self?.wickets}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {match.result ?? match.state}
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Performance ─────────────────────────────────────── */

function PerformanceTab({ team }: { team: Team }) {
  const winSeries = trendSeries(team.won, 1);
  const pointsSeries = trendSeries(team.points, 2);
  const labels = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
        <StatCard value={team.won} label="Wins" trend="up" trendValue="+2" />
        <StatCard value={team.lost} label="Losses" trend="down" trendValue="-1" />
        <StatCard value={team.netRunRate.toFixed(2)} label="Net Run Rate" trend={team.netRunRate >= 0 ? 'up' : 'down'} />
      </Box>
      <PageSection title="Wins Trend">
        <LineChart labels={labels} series={[{ label: 'Wins', data: winSeries }]} height={200} />
      </PageSection>
      <PageSection title="Points Trend">
        <LineChart labels={labels} series={[{ label: 'Points', data: pointsSeries }]} height={200} />
      </PageSection>
    </Box>
  );
}

/* ── Statistics ──────────────────────────────────────── */

function StatisticsTab({ team }: { team: Team }) {
  const runsData = [
    { label: 'Won', value: team.won },
    { label: 'Lost', value: team.lost },
    { label: 'Tied', value: team.tied },
    { label: 'NR', value: team.noResult },
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard value={team.played} label="Played" />
        <StatCard value={team.won} label="Won" accent="success" />
        <StatCard value={team.lost} label="Lost" accent="error" />
        <StatCard value={team.points} label="Points" accent="primary" />
      </Box>
      <PageSection title="Result Breakdown">
        <BarChart data={runsData} height={180} showValues showLabels />
      </PageSection>
    </Box>
  );
}

/* ── Analytics ───────────────────────────────────────── */

function AnalyticsTab({ team }: { team: Team }) {
  const radarSeries = [
    {
      label: team.shortName,
      values: [
        Math.min(team.won * 10, 100),
        Math.min(team.points * 5, 100),
        Math.max(0, Math.min((team.netRunRate + 1) * 50, 100)),
        Math.max(0, 100 - team.lost * 12),
      ],
    },
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Team Profile">
        <RadarChart
          axes={['Wins', 'Points', 'NRR', 'Resilience']}
          series={radarSeries}
          size={280}
        />
      </PageSection>
      <PageSection title="Form Analysis">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {team.name} have won {team.won} of {team.played} matches ({Math.round((team.won / Math.max(team.played, 1)) * 100)}% win rate).
          </Typography>
          <FormIndicator results={toIndicatorForm(team.form)} size="md" />
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Training ────────────────────────────────────────── */

function TrainingTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Training Sessions">
        <EmptyState title="No training sessions" description="Training sessions will appear here." />
      </PageSection>
    </Box>
  );
}

/* ── Staff ───────────────────────────────────────────── */

function StaffTab({ team }: { team: Team }) {
  const staff = [
    { name: team.coach ?? '—', role: 'Head Coach' },
    { name: team.captainName ?? '—', role: 'Captain' },
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Coaching Staff">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
          {staff.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
              <PlayerAvatar firstName={s.name.split(' ')[0] ?? ''} lastName={s.name.split(' ').slice(1).join(' ') || ' '} size="sm" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.name}</Typography>
                <Typography variant="caption" color="text.secondary">{s.role}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Fixtures ────────────────────────────────────────── */

function FixturesTab({ team }: { team: Team }) {
  const { data: matches, isLoading, isError, refetch } = useMatches();
  if (isLoading) return <LoadingState message="Loading fixtures..." />;
  if (isError) return <ErrorState title="Failed to load fixtures" onRetry={() => refetch()} />;
  const list = matches?.data ?? [];
  const fixtures = list.filter((m) => m.teams.some((t) => t.id === team.id) && m.state === 'scheduled');
  if (fixtures.length === 0) {
    return <EmptyState title="No fixtures" description="No upcoming fixtures for this team." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {fixtures.map((m) => (
        <MatchRow key={m.id} match={m} teamId={team.id} />
      ))}
    </Box>
  );
}

/* ── Media ───────────────────────────────────────────── */

function MediaTab() {
  const { data: assets, isLoading, isError, refetch } = useMediaAssets();
  if (isLoading) return <LoadingState message="Loading media..." />;
  if (isError) return <ErrorState title="Failed to load media" onRetry={() => refetch()} />;
  const list = assets?.data ?? [];
  if (list.length === 0) {
    return <EmptyState title="No media" description="Media assets will appear here." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {list.map((a) => (
        <Box key={a.id} sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.title}</Typography>
          <Typography variant="caption" color="text.secondary">{a.kind}</Typography>
        </Box>
      ))}
    </Box>
  );
}
