import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, X,
  User, ArrowRight, ArrowLeft, Shield, GripVertical, CheckCircle
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface TeamSquad {
  team_id: string;
  team_name: string;
  team_short: string;
  tournament: string;
  squad_size: number;
  max_size: number;
  players: SquadPlayer[];
}

interface SquadPlayer {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  batting_style: 'Right-hand' | 'Left-hand';
  bowling_style: string;
  status: 'active' | 'injured' | 'unavailable';
  is_captain: boolean;
  is_vice_captain: boolean;
}

const squads: TeamSquad[] = [
  {
    team_id: '1',
    team_name: 'Chennai Super Kings',
    team_short: 'CSK',
    tournament: 'IPL 2024',
    squad_size: 23,
    max_size: 25,
    players: [
      { id: 'p1', name: 'MS Dhoni', role: 'Wicket-keeper', batting_style: 'Right-hand', bowling_style: 'N/A', status: 'active', is_captain: true, is_vice_captain: false },
      { id: 'p2', name: 'Ruturaj Gaikwad', role: 'Batsman', batting_style: 'Right-hand', bowling_style: 'Right-arm off break', status: 'active', is_captain: false, is_vice_captain: true },
      { id: 'p3', name: 'Ravindra Jadeja', role: 'All-rounder', batting_style: 'Left-hand', bowling_style: 'Left-arm orthodox', status: 'active', is_captain: false, is_vice_captain: false },
      { id: 'p4', name: 'Deepak Chahar', role: 'Bowler', batting_style: 'Right-hand', bowling_style: 'Right-arm medium', status: 'injured', is_captain: false, is_vice_captain: false },
      { id: 'p5', name: 'Moeen Ali', role: 'All-rounder', batting_style: 'Left-hand', bowling_style: 'Right-arm off break', status: 'active', is_captain: false, is_vice_captain: false },
    ]
  },
  {
    team_id: '2',
    team_name: 'Mumbai Indians',
    team_short: 'MI',
    tournament: 'IPL 2024',
    squad_size: 24,
    max_size: 25,
    players: [
      { id: 'p6', name: 'Rohit Sharma', role: 'Batsman', batting_style: 'Right-hand', bowling_style: 'Right-arm off break', status: 'active', is_captain: true, is_vice_captain: false },
      { id: 'p7', name: 'Jasprit Bumrah', role: 'Bowler', batting_style: 'Right-hand', bowling_style: 'Right-arm fast', status: 'active', is_captain: false, is_vice_captain: true },
      { id: 'p8', name: 'Ishan Kishan', role: 'Wicket-keeper', batting_style: 'Left-hand', bowling_style: 'N/A', status: 'active', is_captain: false, is_vice_captain: false },
    ]
  },
];

const availablePlayers = [
  { id: 'ap1', name: 'Travis Head', role: 'Batsman', country: 'Australia' },
  { id: 'ap2', name: 'Pat Cummins', role: 'Bowler', country: 'Australia' },
  { id: 'ap3', name: 'Rashid Khan', role: 'Bowler', country: 'Afghanistan' },
];

export function SquadManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTeam, setSelectedTeam] = React.useState<string | null>(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = React.useState(false);
  const [draggedPlayer, setDraggedPlayer] = React.useState<string | null>(null);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-primary-100 text-primary-600';
      case 'Bowler': return 'bg-cyan-100 text-cyan-600';
      case 'All-rounder': return 'bg-warning-100 text-warning-600';
      case 'Wicket-keeper': return 'bg-success-100 text-success-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-600';
      case 'injured': return 'bg-error-100 text-error-600';
      case 'unavailable': return 'bg-warning-100 text-warning-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Squad Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage team squads and player assignments</p>
        </div>
        <button
          onClick={() => setShowAddPlayerModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Player to Squad
        </button>
      </div>

      {/* Team Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {squads.map((squad) => (
          <button
            key={squad.team_id}
            onClick={() => setSelectedTeam(selectedTeam === squad.team_id ? null : squad.team_id)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap',
              selectedTeam === squad.team_id
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:border-primary-300'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
              {squad.team_short}
            </div>
            <div className="text-left">
              <p>{squad.team_name}</p>
              <p className={cn('text-xs', selectedTeam === squad.team_id ? 'text-white/80' : 'text-slate-500')}>
                {squad.squad_size}/{squad.max_size} players
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Squad Details */}
      {selectedTeam ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {squads.filter(s => s.team_id === selectedTeam).map((squad) => (
            <div key={squad.team_id}>
              {/* Squad Header */}
              <GlassCard className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {squad.team_short}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{squad.team_name}</h2>
                      <p className="text-slate-500">{squad.tournament}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{squad.squad_size}</p>
                      <p className="text-xs text-slate-500">of {squad.max_size}</p>
                    </div>
                    <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-cyan-500"
                        style={{ width: `${(squad.squad_size / squad.max_size) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Players Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {squad.players.map((player, i) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    draggable
                    onDragStart={() => setDraggedPlayer(player.id)}
                    className={cn(
                      'p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-move',
                      player.status === 'injured' && 'opacity-70'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 dark:text-white">{player.name}</p>
                            {player.is_captain && (
                              <span className="px-1.5 py-0.5 rounded bg-warning-100 text-warning-600 text-xs font-bold flex items-center gap-1">
                                <Shield className="w-3 h-3" /> C
                              </span>
                            )}
                            {player.is_vice_captain && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-bold">VC</span>
                            )}
                          </div>
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getRoleColor(player.role))}>
                            {player.role}
                          </span>
                        </div>
                      </div>
                      <GripVertical className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span>{player.batting_style}</span>
                      <span>•</span>
                      <span>{player.bowling_style}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={cn('px-2 py-1 rounded text-xs font-medium capitalize', getStatusColor(player.status))}>
                        {player.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add Player Card */}
                <button
                  onClick={() => setShowAddPlayerModal(true)}
                  className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex flex-col items-center justify-center min-h-[150px]"
                >
                  <Plus className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Add Player</p>
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        /* Team Overview */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squads.map((squad, i) => (
            <motion.div
              key={squad.team_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="cursor-pointer hover:shadow-lg" onClick={() => setSelectedTeam(squad.team_id)}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {squad.team_short}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{squad.team_name}</h3>
                    <p className="text-sm text-slate-500">{squad.tournament}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {squad.players.slice(0, 4).map((player) => (
                    <div key={player.id} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs relative">
                      {player.name.split(' ').map(n => n[0]).join('')}
                      {player.is_captain && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warning-500 text-white text-xs flex items-center justify-center">
                          <Shield className="w-2 h-2" />
                        </span>
                      )}
                    </div>
                  ))}
                  {squad.players.length > 4 && (
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-medium text-xs">
                      +{squad.players.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{squad.squad_size} players</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-500" />
                    <span className="text-success-600">Complete</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Player to Squad</h2>
                <button onClick={() => setShowAddPlayerModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Select Team</label>
                <div className="grid grid-cols-3 gap-2">
                  {squads.map((s) => (
                    <button
                      key={s.team_id}
                      className="p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 text-center"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                        {s.team_short}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{s.team_name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Available Players</label>
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 mb-3"
                />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availablePlayers.map((player) => (
                    <div
                      key={player.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{player.name}</p>
                          <p className="text-xs text-slate-500">{player.role} • {player.country}</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default SquadManagement;
