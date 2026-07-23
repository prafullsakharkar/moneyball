import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, Tag as TagIcon } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { VideoPlayer } from '../components';
import { mockPlayerHighlights } from '../services/mock-data';
import type { HighlightCategory, PlayerHighlight } from '../types';
import { cn } from '../../../lib/utils';

const categoryConfig: Record<HighlightCategory, { label: string; color: string; bg: string }> = {
  batting: { label: 'Batting', color: '#6366f1', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  bowling: { label: 'Bowling', color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  fielding: { label: 'Fielding', color: '#22c55e', bg: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  sixes: { label: 'Sixes', color: '#ef4444', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  boundaries: { label: 'Boundaries', color: '#f59e0b', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  wickets: { label: 'Wickets', color: '#a855f7', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  catches: { label: 'Catches', color: '#ec4899', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  run_outs: { label: 'Run Outs', color: '#14b8a6', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
};

const categories = Object.keys(categoryConfig) as HighlightCategory[];

export function PlayerHighlights() {
  const [activeCategory, setActiveCategory] = React.useState<HighlightCategory>('batting');
  const [playingHighlight, setPlayingHighlight] = React.useState<PlayerHighlight | null>(null);

  const filtered = React.useMemo(() => {
    return mockPlayerHighlights.filter((h) => h.category === activeCategory);
  }, [activeCategory]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, PlayerHighlight[]>();
    filtered.forEach((h) => {
      if (!map.has(h.playerName)) map.set(h.playerName, []);
      map.get(h.playerName)!.push(h);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Player Highlights</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">AI-generated highlights grouped by player</p>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const cfg = categoryConfig[cat];
          const count = mockPlayerHighlights.filter((h) => h.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat
                  ? 'text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
              style={activeCategory === cat ? { backgroundColor: cfg.color } : {}}
            >
              {cfg.label}
              <span className={cn(
                'px-1.5 py-0.5 rounded-md text-[10px] font-bold',
                activeCategory === cat ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped by player */}
      {grouped.length > 0 ? (
        <div className="space-y-6">
          {grouped.map(([playerName, highlights], gi) => (
            <motion.div
              key={playerName}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05 }}
            >
              <GlassCard>
                {/* Player header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                    {highlights[0].playerInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{playerName}</h3>
                    <p className="text-xs text-slate-400">{highlights[0].teamShort} • {highlights.length} highlights</p>
                  </div>
                </div>

                {/* Highlights grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {highlights.map((hl, i) => {
                    const cfg = categoryConfig[hl.category];
                    return (
                      <motion.div
                        key={hl.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ y: -4 }}
                        onClick={() => setPlayingHighlight(hl)}
                        className="group rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 overflow-hidden cursor-pointer"
                      >
                        <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <img src={hl.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </button>
                          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px]">
                            <Clock className="w-2.5 h-2.5" />
                            {hl.duration}s
                          </div>
                          <div className={cn('absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase', cfg.bg)}>
                            {hl.outcome}
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Over {hl.overLabel}</p>
                          <p className="text-[10px] text-slate-400 truncate">{hl.matchName}</p>
                          {hl.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hl.tags.slice(0, 2).map((t) => (
                                <span key={t} className="px-1 py-0.5 rounded bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[9px] font-medium">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No highlights in this category</p>
        </div>
      )}

      {/* Highlight player modal */}
      <AnimatePresence>
        {playingHighlight && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setPlayingHighlight(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{playingHighlight.playerName}</h3>
                    <p className="text-xs text-slate-400">Over {playingHighlight.overLabel} • {playingHighlight.matchName}</p>
                  </div>
                  <button onClick={() => setPlayingHighlight(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <VideoPlayer src={playingHighlight.clipUrl} poster={playingHighlight.thumbnailUrl} />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn('px-2 py-0.5 rounded-md text-xs font-bold uppercase', categoryConfig[playingHighlight.category].bg)}>
                      {categoryConfig[playingHighlight.category].label}
                    </span>
                    <span className="text-sm text-slate-500">{playingHighlight.outcome} • {playingHighlight.runs} runs</span>
                  </div>
                  {playingHighlight.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {playingHighlight.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlayerHighlights;
