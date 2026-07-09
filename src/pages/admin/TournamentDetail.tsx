import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Users, Calendar, Target, Activity, Award, TrendingUp, BarChart3,
  Star, Crown, Medal, Play, MapPin, ChevronRight, ArrowLeft
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface TournamentDetail {
  id: string;
  name: string;
  season: string;
  status: 'live' | 'completed' | 'upcoming';
  start_date: string;
  end_date: string;
  venue: string;
  teams_count: number;
  matches_played: number;
  total_matches: number;
  highest_score: number;
  lowest_score: number;
  total_runs: number;
  total_wickets: number;
  centuries: number;
  five_fers: number;
  orange_cap: { player: string; runs: number; team: string };
  purple_cap: { player: string; wickets: number; team: string };
  maximum_sixes: { player: string; sixes: number; team: string };
  rising_star: { player: string; team: string };
}

const tournament: TournamentDetail = {
  id: 't1',
  name: 'Indian Premier League',
  season: '2024',
  status: 'live',
  start_date: 'Mar 22, 2024',
  end_date: 'May 26, 2024',
  venue: 'India',
  teams_count: 10,
  matches_played: 52,
  total_matches: 74,
  highest_score: 287,
  lowest_score: 95,
  total_runs: 28456,
  total_wickets: 642,
  centuries: 8,
  five_fers: 12,
  orange_cap: { player: 'Virat Kohli', runs: 741, team: 'RCB' },
  purple_cap: { player: 'Harshal Patel', wickets: 28, team: 'PBKS' },
  maximum_sixes: { player: 'Abhishek Sharma', sixes: 48, team: 'SRH' },
  rising_star: { player: 'Riyan Parag', team: 'RR' },
};

const teamStandings = [
  { rank: 1, team: 'Kolkata Knight Riders', played: 14, won: 11, lost: 3, nr: 0, points: 22, nrr: '+1.428', qualified: true },
  { rank: 2, team: 'Sunrisers Hyderabad', played: 14, won: 9, lost: 5, nr: 1, points: 19, nrr: '+0.835', qualified: true },
  { rank: 3, team: 'Rajasthan Royals', played: 14, won: 9, lost: 5, nr: 0, points: 18, nrr: '+0.291', qualified: true },
  { rank: 4, team: 'Royal Challengers Bangalore', played: 14, won: 8, lost: 6, nr: 0, points: 16, nrr: '+0.456', qualified: true },
  { rank: 5, team: 'Chennai Super Kings', played: 14, won: 7, lost: 7, nr: 0, points: 14, nrr: '+0.125', qualified: false },
  { rank: 6, team: 'Delhi Capitals', played: 14, won: 7, lost: 7, nr: 0, points: 14, nrr: '-0.067', qualified: false },
  { rank: 7, team: 'Gujarat Titans', played: 14, won: 6, lost: 8, nr: 0, points: 12, nrr: '-0.256', qualified: false },
  { rank: 8, team: 'Mumbai Indians', played: 14, won: 6, lost: 8, nr: 0, points: 12, nrr: '-0.328', qualified: false },
  { rank: 9, team: 'Punjab Kings', played: 14, won: 5, lost: 9, nr: 0, points: 10, nrr: '-0.578', qualified: false },
  { rank: 10, team: 'Lucknow Super Giants', played: 14, won: 4, lost: 10, nr: 0, points: 8, nrr: '-0.852', qualified: false },
];

const topBatsmen = [
  { rank: 1, player: 'Virat Kohli', team: 'RCB', runs: 741, avg: 61.75, sr: 154.2, hundreds: 1, fifties: 6 },
  { rank: 2, player: 'Ruturaj Gaikwad', team: 'CSK', runs: 589, avg: 49.08, sr: 142.5, hundreds: 1, fifties: 4 },
  { rank: 3, player: 'Shubman Gill', team: 'GT', runs: 542, avg: 45.16, sr: 158.3, hundreds: 0, fifties: 5 },
  { rank: 4, player: 'Travis Head', team: 'SRH', runs: 498, avg: 41.50, sr: 185.2, hundreds: 0, fifties: 4 },
  { rank: 5, player: 'Riyan Parag', team: 'RR', runs: 476, avg: 47.60, sr: 152.8, hundreds: 0, fifties: 4 },
];

const topBowlers = [
  { rank: 1, player: 'Harshal Patel', team: 'PBKS', wickets: 28, avg: 15.2, econ: 8.2, sr: 11.1, five_wkts: 1 },
  { rank: 2, player: 'Varun Chakravarthy', team: 'KKR', wickets: 24, avg: 18.4, econ: 7.8, sr: 14.2, five_wkts: 1 },
  { rank: 3, player: 'Jasprit Bumrah', team: 'MI', wickets: 22, avg: 16.8, econ: 6.5, sr: 15.4, five_wkts: 1 },
  { rank: 4, player: 'T Natarajan', team: 'SRH', wickets: 21, avg: 19.1, econ: 9.2, sr: 12.4, five_wkts: 0 },
  { rank: 5, player: 'Yuzvendra Chahal', team: 'RR', wickets: 20, avg: 20.5, econ: 7.6, sr: 16.2, five_wkts: 0 },
];

const recentMatches = [
  { id: 'm1', team1: 'KKR', team2: 'SRH', score1: '187/4', score2: '165/8', result: 'KKR won by 22 runs', date: 'Mar 23' },
  { id: 'm2', team1: 'CSK', team2: 'RCB', score1: '178/5', score2: '182/4', result: 'RCB won by 6 wkts', date: 'Mar 22' },
  { id: 'm3', team1: 'MI', team2: 'GT', score1: '145/8', score2: '149/4', result: 'GT won by 6 wkts', date: 'Mar 24' },
  { id: 'm4', team1: 'RR', team2: 'LSG', score1: '193/6', score2: '155/10', result: 'RR won by 38 runs', date: 'Mar 24' },
  { id: 'm5', team1: 'PBKS', team2: 'DC', score1: '172/5', score2: '174/4', result: 'DC won by 6 wkts', date: 'Mar 23' },
];

const awards = [
  { title: 'Orange Cap', winner: 'Virat Kohli', team: 'RCB', stat: '741 runs', icon: Target },
  { title: 'Purple Cap', winner: 'Harshal Patel', team: 'PBKS', stat: '28 wkts', icon: Activity },
  { title: 'Most Sixes', winner: 'Abhishek Sharma', team: 'SRH', stat: '48 sixes', icon: TrendingUp },
  { title: 'Emerging Player', winner: 'Riyan Parag', team: 'RR', stat: '476 runs @ 152.8 SR', icon: Star },
  { title: 'MVP', winner: 'Sunil Narine', team: 'KKR', stat: '487 runs, 17 wkts', icon: Crown },
  { title: 'Fair Play', winner: 'Rajasthan Royals', team: 'RR', stat: 'Best conduct', icon: Medal },
];

export function TournamentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'teams' | 'players' | 'matches' | 'awards'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-cyan-600 to-primary-700 p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate('/admin/tournaments')}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-10 h-10 text-yellow-300" />
                <div>
                  <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
                  <p className="text-white/80">{tournament.season} Edition</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tournament.venue}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{tournament.start_date} - {tournament.end_date}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{tournament.teams_count} Teams</span>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                'px-4 py-2 rounded-full font-bold inline-flex items-center gap-2',
                tournament.status === 'live' ? 'bg-success-500 text-white animate-pulse' :
                tournament.status === 'completed' ? 'bg-slate-500 text-white' :
                'bg-primary-500 text-white'
              )}>
                {tournament.status === 'live' && <span className="w-2 h-2 rounded-full bg-white" />}
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </span>
              <p className="text-white/80 mt-2">{tournament.matches_played}/{tournament.total_matches} Matches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'teams', label: 'Team Stats', icon: Users },
          { id: 'players', label: 'Player Stats', icon: Target },
          { id: 'matches', label: 'Match Stats', icon: Play },
          { id: 'awards', label: 'MVP & Awards', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Runs', value: tournament.total_runs.toLocaleString() },
              { label: 'Total Wickets', value: tournament.total_wickets },
              { label: 'Highest Score', value: tournament.highest_score },
              { label: 'Lowest Score', value: tournament.lowest_score },
              { label: 'Centuries', value: tournament.centuries },
              { label: 'Five-fers', value: tournament.five_fers },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Award Leaders */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-500/20 border border-orange-300 dark:border-orange-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Orange Cap</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{tournament.orange_cap.player}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tournament.orange_cap.team} • {tournament.orange_cap.runs} runs</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-500/20 border border-purple-300 dark:border-purple-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Purple Cap</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{tournament.purple_cap.player}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tournament.purple_cap.team} • {tournament.purple_cap.wickets} wkts</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 border border-cyan-300 dark:border-cyan-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Most Sixes</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{tournament.maximum_sixes.player}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tournament.maximum_sixes.team} • {tournament.maximum_sixes.sixes} sixes</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-green-400/20 to-green-500/20 border border-green-300 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Rising Star</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{tournament.rising_star.player}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tournament.rising_star.team}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Points Table Preview */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Points Table</h3>
              <button
                onClick={() => setActiveTab('teams')}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View Full <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2 text-left">#</th>
                    <th className="py-2 text-left">Team</th>
                    <th className="py-2 text-center">P</th>
                    <th className="py-2 text-center">W</th>
                    <th className="py-2 text-center">L</th>
                    <th className="py-2 text-center">NRR</th>
                    <th className="py-2 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStandings.slice(0, 5).map((team) => (
                    <tr key={team.rank} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3">{team.rank}</td>
                      <td className="py-3 font-medium">{team.team}</td>
                      <td className="py-3 text-center">{team.played}</td>
                      <td className="py-3 text-center">{team.won}</td>
                      <td className="py-3 text-center">{team.lost}</td>
                      <td className={cn('py-3 text-center', team.nrr.startsWith('+') ? 'text-success-600' : 'text-error-600')}>
                        {team.nrr}
                      </td>
                      <td className="py-3 text-center font-bold">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Points Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700 uppercase">
                    <th className="py-3 text-left">Pos</th>
                    <th className="py-3 text-left">Team</th>
                    <th className="py-3 text-center">Played</th>
                    <th className="py-3 text-center">Won</th>
                    <th className="py-3 text-center">Lost</th>
                    <th className="py-3 text-center">NR</th>
                    <th className="py-3 text-center">NRR</th>
                    <th className="py-3 text-center">Points</th>
                    <th className="py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStandings.map((team) => (
                    <tr key={team.rank} className={cn(
                      'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                      team.qualified && 'bg-success-50/50 dark:bg-success-900/10'
                    )}>
                      <td className="py-4">
                        <span className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold',
                          team.rank <= 4 ? 'bg-success-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        )}>
                          {team.rank}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                            {team.team.split(' ').map(w => w[0]).join('').slice(0, 3)}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{team.team}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">{team.played}</td>
                      <td className="py-4 text-center font-medium text-success-600">{team.won}</td>
                      <td className="py-4 text-center font-medium text-error-600">{team.lost}</td>
                      <td className="py-4 text-center">{team.nr}</td>
                      <td className={cn('py-4 text-center font-medium', team.nrr.startsWith('+') ? 'text-success-600' : 'text-error-600')}>
                        {team.nrr}
                      </td>
                      <td className="py-4 text-center font-bold text-lg text-slate-900 dark:text-white">{team.points}</td>
                      <td className="py-4 text-center">
                        {team.qualified ? (
                          <span className="px-2 py-1 rounded-full bg-success-100 text-success-600 text-xs font-medium">Qualified</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Batsmen */}
            <GlassCard>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Top Run Scorers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 text-left">#</th>
                      <th className="py-2 text-left">Player</th>
                      <th className="py-2 text-center">Runs</th>
                      <th className="py-2 text-center">Avg</th>
                      <th className="py-2 text-center">SR</th>
                      <th className="py-2 text-center">100s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBatsmen.map((b) => (
                      <tr key={b.rank} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3">
                          <span className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                            b.rank === 1 ? 'bg-orange-500 text-white' :
                            b.rank <= 3 ? 'bg-orange-200 text-orange-700' :
                            'bg-slate-100 text-slate-600'
                          )}>
                            {b.rank}
                          </span>
                        </td>
                        <td className="py-3">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{b.player}</p>
                            <p className="text-xs text-slate-500">{b.team}</p>
                          </div>
                        </td>
                        <td className="py-3 text-center font-bold">{b.runs}</td>
                        <td className="py-3 text-center">{b.avg}</td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            b.sr >= 150 ? 'bg-success-100 text-success-600' :
                            b.sr >= 130 ? 'bg-primary-100 text-primary-600' :
                            'bg-warning-100 text-warning-600'
                          )}>
                            {b.sr}
                          </span>
                        </td>
                        <td className="py-3 text-center">{b.hundreds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Top Bowlers */}
            <GlassCard>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Top Wicket Takers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 text-left">#</th>
                      <th className="py-2 text-left">Player</th>
                      <th className="py-2 text-center">Wkts</th>
                      <th className="py-2 text-center">Avg</th>
                      <th className="py-2 text-center">Econ</th>
                      <th className="py-2 text-center">5wkts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBowlers.map((b) => (
                      <tr key={b.rank} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3">
                          <span className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                            b.rank === 1 ? 'bg-purple-500 text-white' :
                            b.rank <= 3 ? 'bg-purple-200 text-purple-700' :
                            'bg-slate-100 text-slate-600'
                          )}>
                            {b.rank}
                          </span>
                        </td>
                        <td className="py-3">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{b.player}</p>
                            <p className="text-xs text-slate-500">{b.team}</p>
                          </div>
                        </td>
                        <td className="py-3 text-center font-bold">{b.wickets}</td>
                        <td className="py-3 text-center">{b.avg}</td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            b.econ <= 7 ? 'bg-success-100 text-success-600' :
                            b.econ <= 9 ? 'bg-primary-100 text-primary-600' :
                            'bg-warning-100 text-warning-600'
                          )}>
                            {b.econ}
                          </span>
                        </td>
                        <td className="py-3 text-center">{b.five_wkts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Matches</h3>
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <div key={match.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white">{match.team1}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{match.score1}</p>
                      </div>
                      <span className="text-slate-400 font-medium">vs</span>
                      <div className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white">{match.team2}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{match.score2}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success-600">{match.result}</p>
                      <p className="text-xs text-slate-500">{match.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="text-center">
                  <div className={cn(
                    'w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center',
                    award.title === 'Orange Cap' ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                    award.title === 'Purple Cap' ? 'bg-gradient-to-br from-purple-400 to-purple-500' :
                    award.title === 'MVP' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                    'bg-gradient-to-br from-cyan-400 to-cyan-500'
                  )}>
                    <award.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{award.title}</h3>
                  <p className="text-lg text-primary-600 font-medium mt-2">{award.winner}</p>
                  <p className="text-sm text-slate-500">{award.team}</p>
                  <div className="mt-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400">{award.stat}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TournamentDetail;
