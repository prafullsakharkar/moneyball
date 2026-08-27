/**
 * TournamentWorkspacePage — CricketOS Tournament Workspace
 * ============================================
 * Premium tournament workspace with a tournament selector and tabbed navigation:
 * Overview, Seasons, Fixtures, Matches, Teams, Standings, Statistics, Analytics,
 * Reports, and Media.
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
  TournamentBadge,
  StatCard,
  FormIndicator,
  TeamBadge,
} from '@shared/components/cricket';
import {
  BarChart,
  DonutChart,
  RadarChart,
} from '@shared/components/analytics';
import { useTournaments, useTournament, useTournamentStandings } from '@hooks/useCricket';
import { useMatches } from '@hooks/useCricket';
import { useMediaAssets } from '@hooks/useCricket';
import { useHasPermission } from '@hooks/index';
import type { Tournament, StandingRow, Match } from '@domain/index';
import type { FormResult as IndicatorFormResult } from '@shared/components/cricket';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GroupsIcon from '@mui/icons-material/Groups';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import EventNoteIcon from '@mui/icons-material/EventNote';

type TournamentTab =
  | 'overview'
  | 'seasons'
  | 'fixtures'
  | 'matches'
  | 'teams'
  | 'standings'
  | 'statistics'
  | 'analytics'
  | 'reports'
  | 'media';

const TABS: { id: TournamentTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <EmojiEventsIcon /> },
  { id: 'seasons', label: 'Seasons', icon: <EventNoteIcon /> },
  { id: 'fixtures', label: 'Fixtures', icon: <CalendarMonthIcon /> },
  { id: 'matches', label: 'Matches', icon: <SportsCricketIcon /> },
  { id: 'teams', label: 'Teams', icon: <GroupsIcon /> },
  { id: 'standings', label: 'Standings', icon: <LeaderboardIcon /> },
  { id: 'statistics', label: 'Statistics', icon: <BarChartIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <InsightsIcon /> },
  { id: 'reports', label: 'Reports', icon: <DescriptionIcon /> },
  { id: 'media', label: 'Media', icon: <VideoLibraryIcon /> },
];

/** Map Tournament FormResult ('W'|'L'|'T'|'N') to FormIndicator FormResult. */
function toIndicatorForm(form: StandingRow['form']): IndicatorFormResult[] {
  return form.map((r) => (r === 'N' ? 'NR' : r));
}

export default function TournamentWorkspacePage() {
  const { data: tournaments, isLoading, isError, refetch } = useTournaments();
  const tournamentList = tournaments?.data ?? [];

  const canManageTournament = useHasPermission('competition', 'manage');

  const [selectedId, setSelectedId] = useState<string>(tournamentList[0]?.id ?? '');
  const [tab, setTab] = useState<TournamentTab>('overview');

  const activeId = selectedId || tournamentList[0]?.id || '';
  const { data: tournament, isLoading: loadingDetail } = useTournament(activeId);
  const { data: standingsData } = useTournamentStandings(activeId);
  const { data: matchesData } = useMatches();
  const { data: mediaData } = useMediaAssets();

  const matches = matchesData?.data ?? [];
  const media = mediaData?.data ?? [];
  const standings = standingsData ?? tournament?.standings ?? [];

  if (isLoading) return <LoadingState message="Loading tournaments..." />;
  if (isError) return <ErrorState title="Failed to load tournaments" onRetry={() => refetch()} />;

  if (tournamentList.length === 0) {
    return (
      <PageShell>
        <PageHeader title="Tournaments" description="Manage competitions and leagues" />
        <EmptyState title="No tournaments" description="Tournaments will appear here." />
      </PageShell>
    );
  }

  if (loadingDetail || !tournament) return <LoadingState message="Loading tournament..." />;

  const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);
  const tournamentMedia = media;

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Tournament Workspace"
        description="Competition, fixtures, standings and intelligence"
        actions={
          <PageActions>
            <Button variant="ghost" size="small">Export</Button>
            {canManageTournament ? (
              <Button variant="primary" size="small">Edit Tournament</Button>
            ) : null}
          </PageActions>
        }
      />

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        {/* Selector sidebar */}
        <Box sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {tournamentList.map((t) => {
              const isActive = t.id === tournament.id;
              return (
                <Box
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => {
                    setSelectedId(t.id);
                    setTab('overview');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(t.id);
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
                    <TournamentBadge name={t.shortName} type="tournament" size="sm" />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', mt: 0.25 }}>
                    {t.formatLabel} · {t.season}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Mobile selector */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {tournamentList.map((t) => (
                <Chip
                  key={t.id}
                  label={t.shortName}
                  size="small"
                  color={t.id === tournament.id ? 'primary' : 'default'}
                  onClick={() => {
                    setSelectedId(t.id);
                    setTab('overview');
                  }}
                />
              ))}
            </Box>
          </Box>

          <TournamentHeader tournament={tournament} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
              {TABS.map((t) => (
                <Tab key={t.id} value={t.id} label={t.label} icon={t.icon} iconPosition="start" />
              ))}
            </Tabs>
          </Box>

          <Box>
            {tab === 'overview' && <OverviewTab tournament={tournament} standings={standings} />}
            {tab === 'seasons' && <SeasonsTab tournament={tournament} />}
            {tab === 'fixtures' && <FixturesTab matches={tournamentMatches} />}
            {tab === 'matches' && <MatchesTab matches={tournamentMatches} />}
            {tab === 'teams' && <TeamsTab standings={standings} />}
            {tab === 'standings' && <StandingsTab standings={standings} />}
            {tab === 'statistics' && <StatisticsTab standings={standings} />}
            {tab === 'analytics' && <AnalyticsTab tournament={tournament} standings={standings} />}
            {tab === 'reports' && <ReportsTab tournament={tournament} />}
            {tab === 'media' && <MediaTab assets={tournamentMedia} />}
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}

function TournamentHeader({ tournament }: { tournament: Tournament }) {
  const winRate = tournament.standings.length > 0
    ? Math.round(
        (tournament.standings.reduce((s, r) => s + r.won, 0) /
          Math.max(1, tournament.standings.reduce((s, r) => s + r.played, 0))) * 100,
      )
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TournamentBadge name={tournament.shortName} type="tournament" size="lg" status={tournament.status} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{tournament.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {tournament.formatLabel} · Season {tournament.season}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip size="small" label={`${tournament.teamsCount} teams`} />
        <Chip size="small" label={`${tournament.matchesCount} matches`} />
        <Chip size="small" label={`${new Date(tournament.startDate).toLocaleDateString()} → ${new Date(tournament.endDate).toLocaleDateString()}`} />
        <Chip size="small" label={`Win rate ${winRate}%`} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard value={tournament.teamsCount} label="Teams" />
        <StatCard value={tournament.matchesCount} label="Matches" />
        <StatCard value={tournament.standings.length} label="Standing rows" />
        <StatCard value={tournament.status} label="Status" />
      </Box>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

function OverviewTab({ tournament, standings }: { tournament: Tournament; standings: StandingRow[] }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Tournament Details">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <DetailRow label="Format" value={tournament.formatLabel} />
            <DetailRow label="Season" value={tournament.season} />
            <DetailRow label="Start" value={new Date(tournament.startDate).toLocaleDateString()} />
            <DetailRow label="End" value={new Date(tournament.endDate).toLocaleDateString()} />
            <DetailRow label="Status" value={tournament.status} />
          </Box>
        </PageSection>
        <PageSection title="Standings Snapshot">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {standings.slice(0, 3).map((r) => (
              <Box key={r.teamId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', width: 20 }}>{r.teamName.slice(0, 1)}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.teamName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{r.points} pts</Typography>
                <FormIndicator results={toIndicatorForm(r.form)} size="sm" />
              </Box>
            ))}
          </Box>
        </PageSection>
      </Box>
      <PageSection title="Season Record">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DetailRow label="Total matches" value={String(tournament.matchesCount)} />
          <DetailRow label="Teams competing" value={String(tournament.teamsCount)} />
          <DetailRow label="Standings tracked" value={String(standings.length)} />
        </Box>
      </PageSection>
    </Box>
  );
}

function SeasonsTab({ tournament }: { tournament: Tournament }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Season">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DetailRow label="Season" value={tournament.season} />
          <DetailRow label="Start" value={new Date(tournament.startDate).toLocaleDateString()} />
          <DetailRow label="End" value={new Date(tournament.endDate).toLocaleDateString()} />
          <DetailRow label="Status" value={tournament.status} />
        </Box>
      </PageSection>
    </Box>
  );
}

function FixturesTab({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <EmptyState title="No fixtures" description="Fixtures will appear here." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {matches.map((m) => (
        <MatchRow key={m.id} match={m} />
      ))}
    </Box>
  );
}

function MatchesTab({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <EmptyState title="No matches" description="Matches will appear here." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {matches.map((m) => (
        <MatchRow key={m.id} match={m} />
      ))}
    </Box>
  );
}

function MatchRow({ match }: { match: Match }) {
  const [t1, t2] = match.teams;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
          {t1.shortName} vs {t2.shortName}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
          {match.venue} · {match.format.toUpperCase()}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
          {match.state === 'scheduled' ? match.label : `${t1.runs}/${t1.wickets}`}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
          {match.result ?? match.state}
        </Typography>
      </Box>
    </Box>
  );
}

function TeamsTab({ standings }: { standings: StandingRow[] }) {
  if (standings.length === 0) {
    return <EmptyState title="No teams" description="Teams will appear here." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {standings.map((r) => (
        <Box key={r.teamId} sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TeamBadge name={r.teamName} shortName={r.teamName.slice(0, 3).toUpperCase()} size="sm" />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.teamName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{r.points} pts</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>NRR {r.netRunRate.toFixed(2)}</Typography>
            <FormIndicator results={toIndicatorForm(r.form)} size="sm" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function StandingsTab({ standings }: { standings: StandingRow[] }) {
  if (standings.length === 0) {
    return <EmptyState title="No standings" description="Standings will appear here." />;
  }
  return (
    <PageSection title="Points Table">
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
              {['#', 'Team', 'P', 'W', 'L', 'T', 'NR', 'Pts', 'NRR', 'Form'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: '0.6875rem', color: 'rgba(128,128,128,0.8)', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((r, i) => (
              <tr key={r.teamId} style={{ borderBottom: '1px solid rgba(128,128,128,0.12)' }}>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'rgba(128,128,128,0.8)' }}>{i + 1}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontWeight: 600 }}>{r.teamName}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{r.played}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{r.won}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{r.lost}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{r.tied}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{r.noResult}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.points}</td>
                <td style={{ padding: '6px 8px', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{r.netRunRate.toFixed(2)}</td>
                <td style={{ padding: '6px 8px' }}>
                  <FormIndicator results={toIndicatorForm(r.form)} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </PageSection>
  );
}

function StatisticsTab({ standings }: { standings: StandingRow[] }) {
  const totalWins = standings.reduce((s, r) => s + r.won, 0);
  const totalLosses = standings.reduce((s, r) => s + r.lost, 0);
  const totalTies = standings.reduce((s, r) => s + r.tied, 0);
  const totalNR = standings.reduce((s, r) => s + r.noResult, 0);
  const totalPlayed = standings.reduce((s, r) => s + r.played, 0);

  const winShare = totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard value={totalPlayed} label="Matches played" />
        <StatCard value={totalWins} label="Wins" />
        <StatCard value={totalLosses} label="Losses" />
        <StatCard value={winShare} label="Win %" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Result Distribution">
          <DonutChart
            data={[
              { label: 'Wins', value: totalWins },
              { label: 'Losses', value: totalLosses },
              { label: 'Ties', value: totalTies },
              { label: 'No result', value: totalNR },
            ]}
            centerLabel="Results"
            centerValue={totalPlayed}
            showLegend
          />
        </PageSection>
        <PageSection title="Points by Team">
          <BarChart
            data={standings.map((r) => ({ label: r.teamName.slice(0, 3).toUpperCase(), value: r.points }))}
            height={180}
            showValues
            showLabels
          />
        </PageSection>
      </Box>
    </Box>
  );
}

function AnalyticsTab({ tournament, standings }: { tournament: Tournament; standings: StandingRow[] }) {
  const pointsSeries = standings.map((r) => r.points);
  const nrrSeries = standings.map((r) => r.netRunRate);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Points Comparison">
          <BarChart data={standings.map((r) => ({ label: r.teamName.slice(0, 3).toUpperCase(), value: r.points }))} height={180} showValues showLabels />
        </PageSection>
        <PageSection title="Net Run Rate">
          <BarChart data={standings.map((r) => ({ label: r.teamName.slice(0, 3).toUpperCase(), value: Math.round(r.netRunRate * 100) }))} height={180} showValues showLabels />
        </PageSection>
      </Box>
      <PageSection title="Tournament Profile">
        <RadarChart
          series={[
            {
              label: tournament.shortName,
              values: [
                Math.min(100, Math.round((pointsSeries.reduce((a, b) => a + b, 0) / Math.max(1, pointsSeries.length)) * 4)),
                Math.min(100, Math.round((nrrSeries.reduce((a, b) => a + b, 0) / Math.max(1, nrrSeries.length)) * 40 + 50)),
                Math.min(100, Math.round((tournament.teamsCount / 10) * 100)),
                Math.min(100, Math.round((tournament.matchesCount / 60) * 100)),
                Math.min(100, Math.round((standings.length / 8) * 100)),
              ],
            },
          ]}
          axes={['Points', 'NRR', 'Teams', 'Matches', 'Depth']}
          size={260}
        />
      </PageSection>
    </Box>
  );
}

function ReportsTab({ tournament }: { tournament: Tournament }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Tournament Report">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
            {tournament.name} is a {tournament.formatLabel.toLowerCase()} competition running from{' '}
            {new Date(tournament.startDate).toLocaleDateString()} to {new Date(tournament.endDate).toLocaleDateString()}.
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            {tournament.teamsCount} teams are competing across {tournament.matchesCount} scheduled matches.
          </Typography>
        </Box>
      </PageSection>
    </Box>
  );
}

function MediaTab({ assets }: { assets: { id: string; title: string; kind: string }[] }) {
  if (assets.length === 0) {
    return <EmptyState title="No media" description="Media assets will appear here." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {assets.map((a) => (
        <Box key={a.id} sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.title}</Typography>
          <Typography variant="caption" color="text.secondary">{a.kind}</Typography>
        </Box>
      ))}
    </Box>
  );
}
