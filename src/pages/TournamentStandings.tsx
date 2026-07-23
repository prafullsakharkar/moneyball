import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Users } from 'lucide-react';

// Mock data for tournament standings
const standingsData = [
  {
    rank: 1,
    team: 'Mumbai Indians',
    played: 14,
    won: 11,
    lost: 3,
    points: 22,
    nrr: 0.456,
    form: ['W', 'W', 'L', 'W', 'W'],
  },
  {
    rank: 2,
    team: 'Chennai Super Kings',
    played: 14,
    won: 10,
    lost: 4,
    points: 20,
    nrr: 0.321,
    form: ['W', 'W', 'W', 'L', 'W'],
  },
  {
    rank: 3,
    team: 'Royal Challengers Bangalore',
    played: 14,
    won: 9,
    lost: 5,
    points: 18,
    nrr: 0.189,
    form: ['L', 'W', 'W', 'W', 'L'],
  },
  {
    rank: 4,
    team: 'Kolkata Knight Riders',
    played: 14,
    won: 8,
    lost: 6,
    points: 16,
    nrr: 0.067,
    form: ['W', 'L', 'W', 'L', 'W'],
  },
  {
    rank: 5,
    team: 'Punjab Kings',
    played: 14,
    won: 7,
    lost: 7,
    points: 14,
    nrr: -0.089,
    form: ['L', 'W', 'L', 'W', 'L'],
  },
  {
    rank: 6,
    team: 'Delhi Capitals',
    played: 14,
    won: 6,
    lost: 8,
    points: 12,
    nrr: -0.234,
    form: ['W', 'L', 'L', 'W', 'L'],
  },
  {
    rank: 7,
    team: 'Rajasthan Royals',
    played: 14,
    won: 6,
    lost: 8,
    points: 12,
    nrr: -0.312,
    form: ['L', 'L', 'W', 'L', 'W'],
  },
  {
    rank: 8,
    team: 'Sunrisers Hyderabad',
    played: 14,
    won: 5,
    lost: 9,
    points: 10,
    nrr: -0.456,
    form: ['L', 'W', 'L', 'L', 'L'],
  },
  {
    rank: 9,
    team: 'Gujarat Titans',
    played: 14,
    won: 4,
    lost: 10,
    points: 8,
    nrr: -0.567,
    form: ['L', 'L', 'L', 'W', 'L'],
  },
  {
    rank: 10,
    team: 'Lucknow Super Giants',
    played: 14,
    won: 3,
    lost: 11,
    points: 6,
    nrr: -0.890,
    form: ['L', 'L', 'L', 'L', 'W'],
  },
];

const TournamentStandings: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tournament Standings</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Live points table and team rankings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20 transition-all"
          >
            <Trophy className="w-4 h-4" />
            Export Table
          </motion.button>
        </div>
      </div>

      {/* Points Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">IPL 2024</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">14 matches completed • 6 remaining</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Leader</p>
              <p className="text-lg font-bold text-primary-500">MI (22 pts)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contender</p>
              <p className="text-lg font-bold text-cyan-500">CSK (20 pts)</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">P</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">W</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">L</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pts</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">NRR</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {standingsData.map((team) => (
                <motion.tr
                  key={team.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: team.rank * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                      style={{
                        backgroundColor: team.rank <= 4 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        color: team.rank <= 4 ? '#10B981' : '#F43F5E',
                        border: `1px solid ${team.rank <= 4 ? '#10B981' : '#F43F5E'}`
                      }}
                    >
                      {team.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {team.team.substring(0, 3)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{team.team}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{team.played} matches</span>
                          <span>•</span>
                          <span>{(team.won / team.played * 100).toFixed(0)}% win rate</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-900 dark:text-white">{team.played}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-green-600 dark:text-green-400">{team.won}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-red-600 dark:text-red-400">{team.lost}</td>
                  <td className="px-6 py-4 text-center text-lg font-bold text-slate-900 dark:text-white">{team.points}</td>
                  <td className={`px-6 py-4 text-center text-sm font-medium ${team.nrr > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {team.nrr > 0 ? '+' : ''}{team.nrr}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {team.form.map((result, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                            result === 'W' 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Playoff qualification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Eliminated</span>
            </div>
          </div>
          <div>
            Next update: After match 20
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Matches Played', value: '20', icon: Users, color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { label: 'Average Score', value: '178', icon: Trophy, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Highest Score', value: '264', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Best Bowling', value: '6/12', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TournamentStandings;