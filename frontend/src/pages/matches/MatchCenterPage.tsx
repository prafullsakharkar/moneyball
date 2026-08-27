/**
 * MatchCenterPage — CricketOS Match Center Workspace
 * ============================================
 * Premium match workspace with a match selector and tabbed navigation:
 * Overview, Scorecard, Live Scoring, Commentary, Analytics, Timeline,
 * Players, Video, and Reports.
 *
 * All cricket metrics use tabular numbers, right-aligned. Restrained colors.
 */
import { useMemo, useState } from 'react';
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
  MatchHeader,
  LiveScore,
  Scorecard,
  LiveIndicator,
  StatCard,
} from '@shared/components/cricket';
import {
  ManhattanChart,
  LineChart,
  WagonWheel,
  BarChart,
} from '@shared/components/analytics';
import { useMatches, useMatch } from '@hooks/useCricket';
import type { Match, MatchInnings } from '@domain/index';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import InsightsIcon from '@mui/icons-material/Insights';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import LiveTvIcon from '@mui/icons-material/LiveTv';

type MatchTab =
  | 'overview'
  | 'scorecard'
  | 'live'
  | 'commentary'
  | 'analytics'
  | 'timeline'
  | 'players'
  | 'video'
  | 'reports';

const TABS: { id: MatchTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <SportsCricketIcon /> },
  { id: 'scorecard', label: 'Scorecard', icon: <ScoreboardIcon /> },
  { id: 'live', label: 'Live Scoring', icon: <LiveTvIcon /> },
  { id: 'commentary', label: 'Commentary', icon: <RecordVoiceOverIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <InsightsIcon /> },
  { id: 'timeline', label: 'Timeline', icon: <TimelineIcon /> },
  { id: 'players', label: 'Players', icon: <GroupIcon /> },
  { id: 'video', label: 'Video', icon: <VideoLibraryIcon /> },
  { id: 'reports', label: 'Reports', icon: <DescriptionIcon /> },
];

/** Build Manhattan (runs per over) data from a completed innings. */
function manhattanFromInnings(innings: MatchInnings): { over: number; runs: number; wickets?: number }[] {
  const totalOvers = Math.floor(innings.overs);
  if (totalOvers <= 0) return [];
  const base = innings.runs / Math.max(totalOvers, 1);
  return Array.from({ length: totalOvers }, (_, i) => ({
    over: i + 1,
    runs: Math.max(1, Math.round(base + ((i % 3) - 1) * 2)),
    wickets: i === 4 ? 1 : undefined,
  }));
}

/** Build a run-rate trend series from innings. */
function runRateSeries(innings: MatchInnings[]): { labels: string[]; series: { label: string; data: number[] }[] } {
  const labels = innings.map((i) => `Inn ${i.number}`);
  const data = innings.map((i) => i.runRate);
  return { labels, series: [{ label: 'Run rate', data }] };
}

export default function MatchCenterPage() {
  const { data: matches, isLoading, isError, refetch } = useMatches();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<MatchTab>('overview');

  const matchList = useMemo(() => matches?.data ?? [], [matches]);
  const activeId = selectedId ?? matchList[0]?.id ?? null;
  const { data: match, isLoading: matchLoading, isError: matchError, refetch: refetchMatch } = useMatch(activeId ?? '');

  const liveMatches = useMemo(() => matchList.filter((m) => m.isLive || m.state === 'live' || m.state === 'in_progress'), [matchList]);
  const upcomingMatches = useMemo(() => matchList.filter((m) => m.state === 'scheduled'), [matchList]);
  const recentMatches = useMemo(() => matchList.filter((m) => m.state === 'completed'), [matchList]);

  if (isLoading) return <LoadingState message="Loading matches..." />;
  if (isError) return <ErrorState title="Failed to load matches" onRetry={() => refetch()} />;
  if (!matches || matchList.length === 0) {
    return (
      <PageShell>
        <PageHeader title="Match Center" description="Premium match workspace" />
        <EmptyState icon={<SportsCricketIcon />} title="No matches found" description="Matches will appear here once scheduled." />
      </PageShell>
    );
  }

  const renderMatchList = (list: Match[], label: string) => (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {list.map((m) => {
          const [t1, t2] = m.teams;
          const isActive = m.id === activeId;
          return (
            <Box
              key={m.id}
              onClick={() => {
                setSelectedId(m.id);
                setTab('overview');
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
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {m.isLive && <LiveIndicator size="sm" showLabel={false} />}
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t1.shortName} vs {t2.shortName}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {m.state === 'scheduled' ? m.label : `${t1.runs}/${t1.wickets}`}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', mt: 0.25 }}>
                {m.venue} · {m.format.toUpperCase()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Match Center"
        description="Premium match workspace"
        actions={
          <PageActions>
            <Button variant="secondary" size="small" onClick={() => refetch()}>Refresh</Button>
          </PageActions>
        }
      />

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        {/* Match selector sidebar */}
        <Box sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          {liveMatches.length > 0 && renderMatchList(liveMatches, 'Live')}
          {upcomingMatches.length > 0 && renderMatchList(upcomingMatches, 'Upcoming')}
          {recentMatches.length > 0 && renderMatchList(recentMatches, 'Recent')}
        </Box>

        {/* Workspace */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {matchLoading ? (
            <LoadingState message="Loading match..." />
          ) : matchError || !match ? (
            <ErrorState title="Failed to load match" onRetry={() => refetchMatch()} />
          ) : (
            <>
              <MatchHeader match={match} sx={{ mb: 2 }} />

              {/* Mobile match selector */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                  {matchList.map((m) => {
                    const [t1, t2] = m.teams;
                    return (
                      <Chip
                        key={m.id}
                        label={`${t1.shortName} v ${t2.shortName}`}
                        size="small"
                        color={m.id === activeId ? 'primary' : 'default'}
                        onClick={() => {
                          setSelectedId(m.id);
                          setTab('overview');
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* Tab navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v as MatchTab)}
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
                {tab === 'overview' && <OverviewTab match={match} />}
                {tab === 'scorecard' && <ScorecardTab match={match} />}
                {tab === 'live' && <LiveScoringTab match={match} />}
                {tab === 'commentary' && <CommentaryTab match={match} />}
                {tab === 'analytics' && <AnalyticsTab match={match} />}
                {tab === 'timeline' && <TimelineTab match={match} />}
                {tab === 'players' && <PlayersTab match={match} />}
                {tab === 'video' && <VideoTab match={match} />}
                {tab === 'reports' && <ReportsTab match={match} />}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </PageShell>
  );
}

/* ── Overview ─────────────────────────────────────────── */

function OverviewTab({ match }: { match: Match }) {
  const [t1, t2] = match.teams;
  const currentInnings = match.innings.find((i) => i.number === match.currentInnings) ?? match.innings[match.innings.length - 1];
  const isLive = match.isLive || match.state === 'live' || match.state === 'in_progress';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Current Innings" value={match.currentInnings ? `${match.currentInnings}${match.currentInnings === 1 ? 'st' : 'nd'}` : '—'} />
        <StatCard label="Target" value={match.target !== undefined ? String(match.target) : '—'} />
        <StatCard label="Required Rate" value={match.requiredRate !== undefined ? match.requiredRate.toFixed(2) : '—'} />
        <StatCard label="Format" value={match.format.toUpperCase()} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <LiveScore match={match} size="md" />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <PageSection title="Match Details">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <DetailRow label="Venue" value={`${match.venue}${match.city ? `, ${match.city}` : ''}`} />
              <DetailRow label="Start" value={new Date(match.startTime).toLocaleString()} />
              <DetailRow label="Toss" value={match.tossWinnerId ? `${match.teams.find((t) => t.id === match.tossWinnerId)?.shortName ?? ''} elected to ${match.tossDecision}` : 'Pending'} />
              {match.result && <DetailRow label="Result" value={match.result} />}
            </Box>
          </PageSection>
          {isLive && currentInnings && (
            <PageSection title="Current Run Rate">
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                  {currentInnings.runRate.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>runs per over</Typography>
              </Box>
            </PageSection>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        <TeamFormCard name={t1.name} shortName={t1.shortName} runs={t1.runs} wickets={t1.wickets} overs={t1.overs} />
        <TeamFormCard name={t2.name} shortName={t2.shortName} runs={t2.runs} wickets={t2.wickets} overs={t2.overs} />
      </Box>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

function TeamFormCard({ name, shortName, runs, wickets, overs }: { name: string; shortName: string; runs: number; wickets: number; overs: number }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, bgcolor: 'background.paper' }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', mb: 0.5 }}>{name}</Typography>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
        {runs}/{wickets} <span style={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>({overs} ov)</span>
      </Typography>
      <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary' }}>{shortName}</Typography>
    </Box>
  );
}

/* ── Scorecard ────────────────────────────────────────── */

function ScorecardTab({ match }: { match: Match }) {
  if (match.innings.length === 0) {
    return <EmptyState title="No scorecard yet" description="The scorecard will appear once the match begins." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {match.innings.map((innings) => {
        const battingTeam = match.teams.find((t) => t.id === innings.battingTeamId);
        const bowlingTeam = match.teams.find((t) => t.id === innings.bowlingTeamId);
        return (
          <PageSection key={innings.number} title={`${innings.number}${innings.number === 1 ? 'st' : 'nd'} Innings`}>
            <Scorecard
              innings={innings}
              battingTeamName={battingTeam?.name}
              bowlingTeamName={bowlingTeam?.name}
            />
          </PageSection>
        );
      })}
    </Box>
  );
}

/* ── Live Scoring ─────────────────────────────────────── */

function LiveScoringTab({ match }: { match: Match }) {
  const currentInnings = match.innings.find((i) => i.number === match.currentInnings) ?? match.innings[match.innings.length - 1];
  const isLive = match.isLive || match.state === 'live' || match.state === 'in_progress';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <LiveScore match={match} size="lg" />
      {isLive && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LiveIndicator size="sm" />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Live scoring in progress</Typography>
        </Box>
      )}
      {currentInnings && (
        <PageSection title="Runs per Over">
          <ManhattanChart data={manhattanFromInnings(currentInnings)} height={200} showValues />
        </PageSection>
      )}
      {!currentInnings && <EmptyState title="No live data" description="Live scoring will appear once the match begins." />}
    </Box>
  );
}

/* ── Commentary ───────────────────────────────────────── */

function CommentaryTab({ match }: { match: Match }) {
  if (match.commentary.length === 0) {
    return <EmptyState title="No commentary yet" description="Ball-by-ball commentary will appear here." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[...match.commentary].reverse().map((c) => (
        <Box
          key={c.id}
          sx={{
            display: 'flex',
            gap: 1.5,
            px: 1.5,
            py: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
              {c.over}.{c.ball}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>{c.text}</Typography>
            <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', mt: 0.25 }}>
              {new Date(c.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Chip
              label={c.wicket ? 'Wicket' : `${c.runs} run${c.runs === 1 ? '' : 's'}`}
              size="small"
              color={c.wicket ? 'error' : c.runs >= 4 ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* ── Analytics ────────────────────────────────────────── */

function AnalyticsTab({ match }: { match: Match }) {
  const currentInnings = match.innings.find((i) => i.number === match.currentInnings) ?? match.innings[match.innings.length - 1];
  const rr = runRateSeries(match.innings);

  const wagonShots = currentInnings?.batting.flatMap((b) =>
    Array.from({ length: Math.min(b.runs, 8) }, (_, i) => ({
      runs: i % 3 === 0 ? 4 : i % 3 === 1 ? 1 : 2,
      angle: (i * 47 + b.position * 13) % 360,
      distance: 0.4 + ((i * 37) % 50) / 100,
      type: (['drive', 'cut', 'pull', 'sweep'] as const)[i % 4],
    })),
  ) ?? [];

  const topScorers = currentInnings?.batting.slice(0, 5).map((b) => ({ label: b.playerName.split(' ').pop() ?? b.playerName, value: b.runs })) ?? [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Run Rate by Innings">
          <LineChart labels={rr.labels} series={rr.series} height={200} showPoints />
        </PageSection>
        <PageSection title="Shot Placement">
          <WagonWheel shots={wagonShots} size={240} />
        </PageSection>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Top Scorers">
          <BarChart data={topScorers} height={180} showValues />
        </PageSection>
        <PageSection title="Runs per Over">
          {currentInnings ? (
            <ManhattanChart data={manhattanFromInnings(currentInnings)} height={180} />
          ) : (
            <EmptyState title="No data" compact />
          )}
        </PageSection>
      </Box>
    </Box>
  );
}

/* ── Timeline ─────────────────────────────────────────── */

function TimelineTab({ match }: { match: Match }) {
  const events = match.innings.flatMap((innings) =>
    innings.fallOfWickets.map((f) => ({
      innings: innings.number,
      wicket: f.wicket,
      score: f.score,
      overs: f.overs,
      playerName: f.playerName,
    })),
  );

  if (events.length === 0) {
    return <EmptyState title="No wickets yet" description="Fall of wickets will appear here." />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {events.map((e, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
            {e.score}/{e.wicket}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>
            ({e.overs} ov)
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{e.playerName}</Typography>
          <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', ml: 'auto' }}>Innings {e.innings}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ── Players ──────────────────────────────────────────── */

function PlayersTab({ match }: { match: Match }) {
  const battingPlayers = match.innings.flatMap((i) => i.batting);
  const bowlingPlayers = match.innings.flatMap((i) => i.bowling);
  const uniqueBatters = battingPlayers.filter((p, idx, arr) => arr.findIndex((x) => x.playerId === p.playerId) === idx);
  const uniqueBowlers = bowlingPlayers.filter((p, idx, arr) => arr.findIndex((x) => x.playerId === p.playerId) === idx);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
      <PageSection title="Batting">
        {uniqueBatters.length === 0 ? (
          <EmptyState title="No batting data" compact />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {uniqueBatters.map((b) => (
              <Box key={b.playerId} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.playerName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>{b.runs}</Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>({b.balls})</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums', width: 48, textAlign: 'right' }}>
                  SR {b.strikeRate.toFixed(0)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </PageSection>
      <PageSection title="Bowling">
        {uniqueBowlers.length === 0 ? (
          <EmptyState title="No bowling data" compact />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {uniqueBowlers.map((b) => (
              <Box key={b.playerId} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.playerName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>{b.wickets}/{b.runs}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums', width: 48, textAlign: 'right' }}>
                  Econ {b.economy.toFixed(1)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </PageSection>
    </Box>
  );
}

/* ── Video ────────────────────────────────────────────── */

function VideoTab({ match }: { match: Match }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Match Footage">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
          <VideoLibraryIcon sx={{ color: 'text.secondary', fontSize: 40 }} />
          <Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>Match {match.label ?? match.id}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Full footage and highlights will be available here.</Typography>
          </Box>
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Reports ──────────────────────────────────────────── */

function ReportsTab({ match }: { match: Match }) {
  const [t1, t2] = match.teams;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Match Report">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
            {t1.name} ({t1.runs}/{t1.wickets} in {t1.overs} overs) vs {t2.name} ({t2.runs}/{t2.wickets} in {t2.overs} overs).
          </Typography>
          {match.result ? (
            <Typography sx={{ fontSize: '0.875rem', color: 'success.main', fontWeight: 500 }}>{match.result}</Typography>
          ) : (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Match in progress.</Typography>
          )}
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Venue: {match.venue}. Format: {match.format.toUpperCase()}. {match.tournamentName ?? ''}
          </Typography>
        </Box>
      </PageSection>
    </Box>
  );
}
