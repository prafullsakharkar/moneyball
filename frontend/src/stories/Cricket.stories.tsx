import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { Score } from '../shared/components/cricket/Score';
import { PlayerAvatar } from '../shared/components/cricket/PlayerAvatar';
import { TeamBadge } from '../shared/components/cricket/TeamBadge';
import { MatchStatus } from '../shared/components/cricket/MatchStatus';
import { LiveIndicator } from '../shared/components/cricket/LiveIndicator';
import { StatCard } from '../shared/components/cricket/StatCard';
import { PerformanceMetric } from '../shared/components/cricket/PerformanceMetric';
import { FormIndicator } from '../shared/components/cricket/FormIndicator';
import { TournamentBadge } from '../shared/components/cricket/TournamentBadge';

/* ── Score ──────────────────────────────────────────────── */

const scoreMeta: Meta<typeof Score> = {
  title: 'Design System/Cricket/Score',
  component: Score,
  tags: ['autodocs'],
};
export default scoreMeta;

type ScoreStory = StoryObj<typeof Score>;

export const ScoreDefault: ScoreStory = {
  name: 'Default Score',
  args: {
    runs: 287,
    wickets: 6,
    overs: 82.4,
    runRate: 3.47,
    team: 'AUS',
  },
};

export const ScoreSmall: ScoreStory = {
  name: 'Small Score',
  args: {
    runs: 142,
    wickets: 3,
    overs: 34.2,
    size: 'sm',
  },
};

export const ScoreLarge: ScoreStory = {
  name: 'Large Score',
  args: {
    runs: 356,
    wickets: 8,
    overs: 90,
    runRate: 3.96,
    team: 'IND',
    subtitle: 'Day 2',
    size: 'lg',
  },
};

/* ── Player Avatar ──────────────────────────────────────── */

export const PlayerAvatars: StoryObj = {
  name: 'Player Avatars',
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <PlayerAvatar firstName="Pat" lastName="Cummins" role="bowler" size="sm" showRole />
      <PlayerAvatar firstName="Steve" lastName="Smith" role="batsman" size="md" showRole online />
      <PlayerAvatar firstName="Alex" lastName="Carey" role="wk" size="lg" showRole />
      <PlayerAvatar firstName="Mitchell" lastName="Starc" role="allrounder" size="xl" showRole online />
    </Box>
  ),
};

/* ── Team Badge ─────────────────────────────────────────── */

export const TeamBadges: StoryObj = {
  name: 'Team Badges',
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TeamBadge name="Australia" shortName="AUS" />
      <TeamBadge name="India" shortName="IND" score={{ runs: 312, wickets: 8, overs: 90 }} />
    </Box>
  ),
};

/* ── Match Status ───────────────────────────────────────── */

export const MatchStatuses: StoryObj = {
  name: 'Match Status',
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MatchStatus state="live" innings={2} />
      <MatchStatus state="scheduled" />
      <MatchStatus state="completed" result="Australia won by 5 wickets" />
      <MatchStatus state="rain_delay" />
      <MatchStatus state="innings_break" innings={1} />
    </Box>
  ),
};

/* ── Live Indicator ─────────────────────────────────────── */

export const LiveIndicators: StoryObj = {
  name: 'Live Indicators',
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <LiveIndicator size="sm" />
      <LiveIndicator size="md" />
      <LiveIndicator size="lg" />
      <LiveIndicator variant="recording" />
    </Box>
  ),
};

/* ── Stat Card ──────────────────────────────────────────── */

export const StatCards: StoryObj = {
  name: 'Stat Cards',
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 2 }}>
      <StatCard value={45.32} label="Batting Average" trend="up" trendValue="+2.1" comparison="vs last season" />
      <StatCard value={28.7} label="Bowling Average" trend="down" trendValue="-1.3" accent="success" />
      <StatCard value={12} label="Centuries" trend="neutral" accent="warning" />
      <StatCard value={89} label="Matches" icon={<span>🏏</span>} accent="info" />
    </Box>
  ),
};

/* ── Performance Metric ─────────────────────────────────── */

export const PerformanceMetrics: StoryObj = {
  name: 'Performance Metrics',
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
      <PerformanceMetric label="Strike Rate" value={87.5} displayValue="87.50" />
      <PerformanceMetric label="Economy" value={4.2} maxValue={10} displayValue="4.20" color="success" />
      <PerformanceMetric label="Win Rate" value={65} displayValue="65%" color="primary" />
      <PerformanceMetric label="Fitness Score" value={92} color="success" compact />
    </Box>
  ),
};

/* ── Form Indicator ─────────────────────────────────────── */

export const FormIndicators: StoryObj = {
  name: 'Form Indicators',
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormIndicator results={['W', 'W', 'L', 'D', 'W']} />
      <FormIndicator results={['L', 'L', 'W', 'W', 'W']} size="sm" />
      <FormIndicator results={['W', 'D', 'W', 'W', 'L', 'W']} size="lg" />
    </Box>
  ),
};

/* ── Tournament Badge ───────────────────────────────────── */

export const TournamentBadges: StoryObj = {
  name: 'Tournament Badges',
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TournamentBadge name="Big Bash League" type="league" season="2024-25" status="active" />
      <TournamentBadge name="Sheffield Shield" type="tournament" season="2024" status="completed" />
      <TournamentBadge name="Border-Gavaskar Trophy" type="series" season="2024-25" status="upcoming" />
    </Box>
  ),
};
