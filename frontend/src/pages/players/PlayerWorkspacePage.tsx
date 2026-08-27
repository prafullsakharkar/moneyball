/**
 * PlayerWorkspacePage — CricketOS Player Workspace
 * ============================================
 * Premium player workspace with a player selector and tabbed navigation:
 * Overview, Statistics, Batting, Bowling, Fielding, Matches, Performance,
 * Training, Fitness, Medical, Scouting, Video, and AI Insights.
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
  PlayerAvatar,
  StatCard,
  PerformanceMetric,
  FormIndicator,
} from '@shared/components/cricket';
import {
  LineChart,
  BarChart,
  RadarChart,
} from '@shared/components/analytics';
import { usePlayers, usePlayer } from '@hooks/usePlayers';
import { useAiInsights } from '@hooks/useCricket';
import { useMediaAssets } from '@hooks/useCricket';
import type {
  Player,
  PlayerStats,
  PlayerMetrics,
  PlayerRole,
} from '@domain/index';
import {
  PLAYER_ROLE_LABELS,
  PLAYER_STATUS_LABELS,
  BATTING_STYLE_LABELS,
  BOWLING_STYLE_LABELS,
} from '@domain/index';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SearchIcon from '@mui/icons-material/Search';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InsightsIcon from '@mui/icons-material/Insights';

type PlayerTab =
  | 'overview'
  | 'statistics'
  | 'batting'
  | 'bowling'
  | 'fielding'
  | 'matches'
  | 'performance'
  | 'training'
  | 'fitness'
  | 'medical'
  | 'scouting'
  | 'video'
  | 'ai';

const TABS: { id: PlayerTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <PersonIcon /> },
  { id: 'statistics', label: 'Statistics', icon: <BarChartIcon /> },
  { id: 'batting', label: 'Batting', icon: <SportsCricketIcon /> },
  { id: 'bowling', label: 'Bowling', icon: <GolfCourseIcon /> },
  { id: 'fielding', label: 'Fielding', icon: <SportsHandballIcon /> },
  { id: 'matches', label: 'Matches', icon: <EmojiEventsIcon /> },
  { id: 'performance', label: 'Performance', icon: <TrendingUpIcon /> },
  { id: 'training', label: 'Training', icon: <FitnessCenterIcon /> },
  { id: 'fitness', label: 'Fitness', icon: <MonitorHeartIcon /> },
  { id: 'medical', label: 'Medical', icon: <MonitorHeartIcon /> },
  { id: 'scouting', label: 'Scouting', icon: <SearchIcon /> },
  { id: 'video', label: 'Video', icon: <VideoLibraryIcon /> },
  { id: 'ai', label: 'AI Insights', icon: <InsightsIcon /> },
];

/** Map PlayerRole to PlayerAvatar role prop. */
function avatarRole(role: PlayerRole): 'batsman' | 'bowler' | 'allrounder' | 'wk' {
  if (role === 'wicket_keeper') return 'wk';
  if (role === 'all_rounder') return 'allrounder';
  return role;
}

/** Compute derived PlayerMetrics from raw PlayerStats. */
function computeMetrics(stats: PlayerStats): PlayerMetrics {
  const dismissals = Math.max(stats.innings - stats.notOuts, 0);
  const battingAverage = dismissals > 0 ? stats.runs / dismissals : stats.runs > 0 ? stats.runs : 0;
  const strikeRate = stats.ballsFaced > 0 ? (stats.runs / stats.ballsFaced) * 100 : 0;
  const bowlingAverage = stats.wickets > 0 ? stats.runsConceded / stats.wickets : 0;
  const overs = stats.ballsBowled / 6;
  const economyRate = overs > 0 ? stats.runsConceded / overs : 0;
  const bowlingStrikeRate = stats.wickets > 0 ? stats.ballsBowled / stats.wickets : 0;
  return { battingAverage, strikeRate, bowlingAverage, economyRate, bowlingStrikeRate };
}

/** Deterministic synthetic trend series for a metric. */
function trendSeries(base: number, seed: number, points = 8): number[] {
  return Array.from({ length: points }, (_, i) => {
    const wobble = Math.sin(i * 1.7 + seed) * base * 0.08;
    return Math.max(0, Math.round((base + wobble) * 10) / 10);
  });
}

export default function PlayerWorkspacePage() {
  const { data: players, isLoading, isError, refetch } = usePlayers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<PlayerTab>('overview');

  const playerList = players?.data ?? [];
  const activeId = selectedId ?? playerList[0]?.id ?? null;
  const { data: player, isLoading: playerLoading, isError: playerError, refetch: refetchPlayer } = usePlayer(activeId ?? '');

  if (isLoading) return <LoadingState message="Loading players..." />;
  if (isError) return <ErrorState title="Failed to load players" onRetry={() => refetch()} />;
  if (!players || playerList.length === 0) {
    return (
      <PageShell>
        <PageHeader title="Player Workspace" description="Premium player workspace" />
        <EmptyState icon={<PersonIcon />} title="No players found" description="Players will appear here once added." />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Player Workspace"
        description="Premium player workspace"
        actions={
          <PageActions>
            <Button variant="secondary" size="small" onClick={() => refetch()}>Refresh</Button>
          </PageActions>
        }
      />

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        {/* Player selector sidebar */}
        <Box sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {playerList.map((p) => {
              const isActive = p.id === activeId;
              return (
                <Box
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => {
                    setSelectedId(p.id);
                    setTab('overview');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(p.id);
                      setTab('overview');
                    }
                  }}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                    bgcolor: isActive ? 'action.selected' : 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 1,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlayerAvatar
                      firstName={p.firstName}
                      lastName={p.lastName}
                      imageUrl={p.avatarUrl}
                      size="sm"
                      role={avatarRole(p.role)}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.displayName}
                      </Typography>
                      <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary' }}>
                        {PLAYER_ROLE_LABELS[p.role]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Workspace */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {playerLoading ? (
            <LoadingState message="Loading player..." />
          ) : playerError || !player ? (
            <ErrorState title="Failed to load player" onRetry={() => refetchPlayer()} />
          ) : (
            <>
              <PlayerHeader player={player} />

              {/* Mobile player selector */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                  {playerList.map((p) => (
                    <Chip
                      key={p.id}
                      label={p.displayName}
                      size="small"
                      color={p.id === activeId ? 'primary' : 'default'}
                      onClick={() => {
                        setSelectedId(p.id);
                        setTab('overview');
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Tab navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v as PlayerTab)}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{ minHeight: 40 }}
                >
                  {TABS.map((t) => (
                    <Tab
                      key={t.id}
                      value={t.id}
                      label={t.label}
                      icon={t.icon}
                      iconPosition="start"
                      sx={{ minHeight: 40, fontSize: '0.75rem', textTransform: 'none' }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Tab content */}
              <Box>
                {tab === 'overview' && <OverviewTab player={player} />}
                {tab === 'statistics' && <StatisticsTab player={player} />}
                {tab === 'batting' && <BattingTab player={player} />}
                {tab === 'bowling' && <BowlingTab player={player} />}
                {tab === 'fielding' && <FieldingTab player={player} />}
                {tab === 'matches' && <MatchesTab player={player} />}
                {tab === 'performance' && <PerformanceTab player={player} />}
                {tab === 'training' && <TrainingTab player={player} />}
                {tab === 'fitness' && <FitnessTab player={player} />}
                {tab === 'medical' && <MedicalTab player={player} />}
                {tab === 'scouting' && <ScoutingTab player={player} />}
                {tab === 'video' && <VideoTab player={player} />}
                {tab === 'ai' && <AiTab />}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </PageShell>
  );
}

/* ── Player Header ─────────────────────────────────────── */

function PlayerHeader({ player }: { player: Player }) {
  const metrics = computeMetrics(player.stats);
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
        px: 2,
        py: 2,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <PlayerAvatar
        firstName={player.firstName}
        lastName={player.lastName}
        imageUrl={player.avatarUrl}
        size="xl"
        role={avatarRole(player.role)}
        showRole
      />
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary' }}>
            {player.displayName}
          </Typography>
          {player.jerseyNumber !== undefined && (
            <Chip label={`#${player.jerseyNumber}`} size="small" variant="outlined" />
          )}
          <Chip label={PLAYER_STATUS_LABELS[player.status]} size="small" color={player.status === 'active' ? 'success' : player.status === 'injured' ? 'warning' : 'default'} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{PLAYER_ROLE_LABELS[player.role]}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{BATTING_STYLE_LABELS[player.battingStyle]}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{BOWLING_STYLE_LABELS[player.bowlingStyle]}</Typography>
          {player.teamName && <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{player.teamName}</Typography>}
          {player.nationality && <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{player.nationality}</Typography>}
        </Box>
        {player.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
            {player.tags.map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: '0.625rem' }} />
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bat Avg</Typography>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
            {metrics.battingAverage.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Strike Rate</Typography>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
            {metrics.strikeRate.toFixed(1)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Wickets</Typography>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
            {player.stats.wickets}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Overview ──────────────────────────────────────────── */

function OverviewTab({ player }: { player: Player }) {
  const metrics = computeMetrics(player.stats);
  const s = player.stats;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Matches" value={String(s.matches)} />
        <StatCard label="Runs" value={String(s.runs)} />
        <StatCard label="Wickets" value={String(s.wickets)} />
        <StatCard label="Ranking" value={player.ranking ? `#${player.ranking}` : '—'} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Batting Summary">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <PerformanceMetric label="Batting Average" value={metrics.battingAverage} maxValue={60} displayValue={metrics.battingAverage.toFixed(2)} showBar color="primary" />
            <PerformanceMetric label="Strike Rate" value={metrics.strikeRate} maxValue={200} displayValue={metrics.strikeRate.toFixed(1)} showBar color="success" />
            <PerformanceMetric label="Highest Score" value={s.highestScore} maxValue={200} displayValue={String(s.highestScore)} showBar color="info" />
          </Box>
        </PageSection>
        <PageSection title="Bowling Summary">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <PerformanceMetric label="Bowling Average" value={metrics.bowlingAverage} maxValue={50} displayValue={metrics.bowlingAverage.toFixed(2)} showBar color="warning" />
            <PerformanceMetric label="Economy Rate" value={metrics.economyRate} maxValue={12} displayValue={metrics.economyRate.toFixed(2)} showBar color="error" />
            <PerformanceMetric label="Best Bowling" value={s.wickets} maxValue={10} displayValue={s.bestBowling ?? '—'} showBar color="info" />
          </Box>
        </PageSection>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        <PageSection title="Recent Form">
          <FormIndicator results={['W', 'W', 'L', 'W', 'D']} size="md" />
        </PageSection>
        <PageSection title="Availability">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={player.availability} size="small" color={player.availability === 'available' ? 'success' : player.availability === 'probable' ? 'warning' : 'default'} />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {player.availability === 'available' ? 'Available for selection' : player.availability === 'probable' ? 'Likely to be available' : 'Currently unavailable'}
            </Typography>
          </Box>
        </PageSection>
      </Box>
    </Box>
  );
}

/* ── Statistics ────────────────────────────────────────── */

function StatisticsTab({ player }: { player: Player }) {
  const s = player.stats;
  const battingTrend = trendSeries(s.runs / Math.max(s.matches, 1), 1);
  const bowlingTrend = trendSeries(s.wickets / Math.max(s.matches, 1), 2);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Innings" value={String(s.innings)} />
        <StatCard label="Not Outs" value={String(s.notOuts)} />
        <StatCard label="Hundreds" value={String(s.hundreds)} />
        <StatCard label="Fifties" value={String(s.fifties)} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Runs per Match Trend">
          <LineChart labels={Array.from({ length: battingTrend.length }, (_, i) => `M${i + 1}`)} series={[{ label: 'Runs/match', data: battingTrend }]} height={200} showPoints />
        </PageSection>
        <PageSection title="Wickets per Match Trend">
          <LineChart labels={Array.from({ length: bowlingTrend.length }, (_, i) => `M${i + 1}`)} series={[{ label: 'Wickets/match', data: bowlingTrend }]} height={200} showPoints />
        </PageSection>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Balls Faced" value={String(s.ballsFaced)} />
        <StatCard label="Balls Bowled" value={String(s.ballsBowled)} />
        <StatCard label="Runs Conceded" value={String(s.runsConceded)} />
        <StatCard label="Five-Wicket Hauls" value={String(s.fiveWicketHauls)} />
      </Box>
    </Box>
  );
}

/* ── Batting ───────────────────────────────────────────── */

function BattingTab({ player }: { player: Player }) {
  const s = player.stats;
  const metrics = computeMetrics(s);
  const shotMix = [
    { label: 'Defensive', value: 32 },
    { label: 'Aggressive', value: 41 },
    { label: 'Rotational', value: 27 },
  ];
  const runsByOver = [
    { label: '1-6', value: 42 },
    { label: '7-15', value: 38 },
    { label: '16-20', value: 20 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Runs" value={String(s.runs)} />
        <StatCard label="Batting Average" value={metrics.battingAverage.toFixed(2)} />
        <StatCard label="Strike Rate" value={metrics.strikeRate.toFixed(1)} />
        <StatCard label="Highest Score" value={String(s.highestScore)} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Runs by Phase">
          <BarChart data={runsByOver} height={180} showValues />
        </PageSection>
        <PageSection title="Shot Distribution">
          <BarChart data={shotMix} height={180} showValues />
        </PageSection>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Hundreds" value={String(s.hundreds)} />
        <StatCard label="Fifties" value={String(s.fifties)} />
        <StatCard label="Balls Faced" value={String(s.ballsFaced)} />
        <StatCard label="Not Outs" value={String(s.notOuts)} />
      </Box>
    </Box>
  );
}

/* ── Bowling ───────────────────────────────────────────── */

function BowlingTab({ player }: { player: Player }) {
  const s = player.stats;
  const metrics = computeMetrics(s);
  const economyByPhase = [
    { label: '1-6', value: metrics.economyRate + 0.4 },
    { label: '7-15', value: metrics.economyRate },
    { label: '16-20', value: metrics.economyRate + 0.8 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Wickets" value={String(s.wickets)} />
        <StatCard label="Bowling Average" value={metrics.bowlingAverage.toFixed(2)} />
        <StatCard label="Economy Rate" value={metrics.economyRate.toFixed(2)} />
        <StatCard label="Bowling SR" value={metrics.bowlingStrikeRate.toFixed(1)} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Economy by Phase">
          <BarChart data={economyByPhase} height={180} showValues />
        </PageSection>
        <PageSection title="Bowling Performance">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <PerformanceMetric label="Best Bowling" value={s.wickets} maxValue={10} displayValue={s.bestBowling ?? '—'} showBar color="info" />
            <PerformanceMetric label="Five-Wicket Hauls" value={s.fiveWicketHauls} maxValue={10} displayValue={String(s.fiveWicketHauls)} showBar color="success" />
            <PerformanceMetric label="Balls Bowled" value={s.ballsBowled} maxValue={10000} displayValue={String(s.ballsBowled)} showBar color="primary" />
          </Box>
        </PageSection>
      </Box>
    </Box>
  );
}

/* ── Fielding ──────────────────────────────────────────── */

function FieldingTab({ player }: { player: Player }) {
  const s = player.stats;
  const fieldingMix = [
    { label: 'Catches', value: s.catches },
    { label: 'Stumpings', value: s.stumpings },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Catches" value={String(s.catches)} />
        <StatCard label="Stumpings" value={String(s.stumpings)} />
        <StatCard label="Dismissals" value={String(s.catches + s.stumpings)} />
        <StatCard label="Role" value={PLAYER_ROLE_LABELS[player.role]} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Dismissals Breakdown">
          <BarChart data={fieldingMix} height={180} showValues />
        </PageSection>
        <PageSection title="Fielding Notes">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
              {player.role === 'wicket_keeper'
                ? 'Primary wicketkeeper. Reliable behind the stumps with strong glovework.'
                : 'Reliable outfielder with safe hands in the deep.'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {s.catches + s.stumpings} total dismissals across {s.matches} matches.
            </Typography>
          </Box>
        </PageSection>
      </Box>
    </Box>
  );
}

/* ── Matches ───────────────────────────────────────────── */

function MatchesTab({ player }: { player: Player }) {
  const recent = [
    { opp: 'Melbourne Stars', runs: 45, balls: 32, wkts: 0, result: 'W' },
    { opp: 'Brisbane Heat', runs: 12, balls: 15, wkts: 1, result: 'L' },
    { opp: 'Perth Scorchers', runs: 78, balls: 50, wkts: 0, result: 'W' },
    { opp: 'Adelaide Strikers', runs: 23, balls: 20, wkts: 2, result: 'W' },
    { opp: 'Hobart Hurricanes', runs: 5, balls: 8, wkts: 0, result: 'L' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Recent Matches">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {recent.map((m, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Chip label={m.result} size="small" color={m.result === 'W' ? 'success' : 'error'} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', flex: 1, minWidth: 0 }}>vs {m.opp}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>{m.runs} ({m.balls})</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>{m.wkts} wkt</Typography>
            </Box>
          ))}
        </Box>
      </PageSection>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Matches" value={String(player.stats.matches)} />
        <StatCard label="Innings" value={String(player.stats.innings)} />
        <StatCard label="Runs" value={String(player.stats.runs)} />
        <StatCard label="Wickets" value={String(player.stats.wickets)} />
      </Box>
    </Box>
  );
}

/* ── Performance ───────────────────────────────────────── */

function PerformanceTab({ player }: { player: Player }) {
  const s = player.stats;
  const metrics = computeMetrics(s);
  const radarSeries = [
    {
      label: player.displayName,
      values: [
        Math.min(metrics.battingAverage / 60, 1),
        Math.min(metrics.strikeRate / 200, 1),
        Math.min(metrics.bowlingAverage > 0 ? 30 / metrics.bowlingAverage : 0, 1),
        Math.min(s.catches / 150, 1),
        Math.min(s.wickets / 200, 1),
      ],
    },
  ];
  const axes = ['Bat Avg', 'Strike Rate', 'Bowl Avg', 'Fielding', 'Wickets'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Performance Profile">
          <RadarChart series={radarSeries} axes={axes} size={260} />
        </PageSection>
        <PageSection title="Performance Trend">
          <LineChart
            labels={Array.from({ length: 8 }, (_, i) => `M${i + 1}`)}
            series={[
              { label: 'Runs', data: trendSeries(s.runs / Math.max(s.matches, 1), 3) },
              { label: 'Wickets', data: trendSeries(s.wickets / Math.max(s.matches, 1), 4) },
            ]}
            height={220}
            showPoints
          />
        </PageSection>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Batting Average" value={metrics.battingAverage.toFixed(2)} trend={metrics.battingAverage > 40 ? 'up' : 'neutral'} />
        <StatCard label="Strike Rate" value={metrics.strikeRate.toFixed(1)} trend={metrics.strikeRate > 130 ? 'up' : 'neutral'} />
        <StatCard label="Economy" value={metrics.economyRate.toFixed(2)} trend={metrics.economyRate > 0 && metrics.economyRate < 7 ? 'up' : 'neutral'} />
        <StatCard label="Wickets" value={String(s.wickets)} trend={s.wickets > 100 ? 'up' : 'neutral'} />
      </Box>
    </Box>
  );
}

/* ── Training ──────────────────────────────────────────── */

function TrainingTab({ player }: { player: Player }) {
  const sessions = [
    { label: 'Batting Net Session', value: 92, unit: '%' },
    { label: 'Bowling Workload', value: 78, unit: '%' },
    { label: 'Fielding Drills', value: 85, unit: '%' },
    { label: 'Video Review', value: 64, unit: '%' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Training Load">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sessions.map((s) => (
            <PerformanceMetric key={s.label} label={s.label} value={s.value} maxValue={100} displayValue={`${s.value}${s.unit}`} showBar color="primary" />
          ))}
        </Box>
      </PageSection>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Sessions/Week" value="5" />
        <StatCard label="Hours/Week" value="18" />
        <StatCard label="Attendance" value="94%" />
        <StatCard label="Focus" value={player.role === 'bowler' ? 'Bowling' : 'Batting'} />
      </Box>
    </Box>
  );
}

/* ── Fitness ───────────────────────────────────────────── */

function FitnessTab({ player }: { player: Player }) {
  const metrics = [
    { label: 'Yo-Yo Test', value: 18.2, maxValue: 22, displayValue: '18.2', unit: 'lvl' },
    { label: 'Sprint Speed', value: 8.4, maxValue: 10, displayValue: '8.4', unit: 'm/s' },
    { label: 'Body Fat', value: 12, maxValue: 25, displayValue: '12%', unit: '%' },
    { label: 'Strength Index', value: 82, maxValue: 100, displayValue: '82', unit: '%' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Fitness Metrics">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {metrics.map((m) => (
            <PerformanceMetric key={m.label} label={m.label} value={m.value} maxValue={m.maxValue} displayValue={m.displayValue} unit={m.unit} showBar color="success" />
          ))}
        </Box>
      </PageSection>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Fitness Status" value={player.status === 'injured' ? 'Injured' : 'Fit'} />
        <StatCard label="Last Assessment" value="2d ago" />
        <StatCard label="Injury Risk" value="Low" />
        <StatCard label="Recovery" value="Good" />
      </Box>
    </Box>
  );
}

/* ── Medical ───────────────────────────────────────────── */

function MedicalTab({ player }: { player: Player }) {
  const isInjured = player.status === 'injured';
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Medical Status">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={isInjured ? 'Injured' : 'Clear to play'} size="small" color={isInjured ? 'error' : 'success'} />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {isInjured ? 'Currently unavailable due to injury.' : 'No active medical concerns.'}
          </Typography>
        </Box>
      </PageSection>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Last Checkup" value="3w ago" />
        <StatCard label="Next Checkup" value="2w" />
        <StatCard label="Medical Clearance" value="Valid" />
        <StatCard label="Insurance" value="Active" />
      </Box>
    </Box>
  );
}

/* ── Scouting ──────────────────────────────────────────── */

function ScoutingTab({ player }: { player: Player }) {
  const metrics = computeMetrics(player.stats);
  const strengths = [
    { label: 'Batting Average', value: metrics.battingAverage.toFixed(2) },
    { label: 'Strike Rate', value: metrics.strikeRate.toFixed(1) },
    { label: 'Wickets', value: String(player.stats.wickets) },
    { label: 'Economy', value: metrics.economyRate.toFixed(2) },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Scouting Report">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
            {player.displayName} is a {PLAYER_ROLE_LABELS[player.role].toLowerCase()} with a market value of{' '}
            {player.price ? `$${player.price.toLocaleString()}` : '—'} and current ranking of{' '}
            {player.ranking ? `#${player.ranking}` : 'unranked'}.
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {BATTING_STYLE_LABELS[player.battingStyle]} batter, {BOWLING_STYLE_LABELS[player.bowlingStyle]} bowler.
          </Typography>
        </Box>
      </PageSection>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        {strengths.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </Box>
    </Box>
  );
}

/* ── Video ─────────────────────────────────────────────── */

function VideoTab({ player }: { player: Player }) {
  const { data: assets, isLoading, isError, refetch } = useMediaAssets();
  const assetList = assets?.data ?? [];
  const playerAssets = assetList.filter((a) => a.playerIds.includes(player.id));

  if (isLoading) return <LoadingState message="Loading media..." />;
  if (isError) return <ErrorState title="Failed to load media" onRetry={() => refetch()} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Player Footage">
        {playerAssets.length === 0 ? (
          <EmptyState icon={<VideoLibraryIcon />} title="No footage yet" description="Video of this player will appear here." />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {playerAssets.map((a) => (
              <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <VideoLibraryIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>{a.title}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary' }}>
                    {a.kind} · {a.duration ? `${Math.round(a.duration / 60)}m` : '—'}
                  </Typography>
                </Box>
                <Chip label={a.kind} size="small" variant="outlined" />
              </Box>
            ))}
          </Box>
        )}
      </PageSection>
    </Box>
  );
}

/* ── AI Insights ───────────────────────────────────────── */

function AiTab() {
  const { data: insights, isLoading, isError, refetch } = useAiInsights();
  const list = insights ?? [];

  if (isLoading) return <LoadingState message="Loading AI insights..." />;
  if (isError) return <ErrorState title="Failed to load insights" onRetry={() => refetch()} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="AI Insights">
        {list.length === 0 ? (
          <EmptyState icon={<InsightsIcon />} title="No insights yet" description="AI-generated insights will appear here." />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {list.map((ins) => (
              <Box key={ins.id} sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip label={ins.source === 'generated' ? 'Generated' : 'Verified'} size="small" color={ins.source === 'generated' ? 'primary' : 'success'} variant="outlined" />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>{ins.title}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{ins.body}</Typography>
                {ins.supportingStats.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                    {ins.supportingStats.map((st, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary' }}>{st.label}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>{st.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </PageSection>
    </Box>
  );
}
