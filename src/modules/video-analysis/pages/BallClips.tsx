import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Play, Bookmark, Tag as TagIcon, Filter, Film } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { BallClipCard, TagPicker, VideoPlayer } from '../components';
import { mockBallClips } from '../services/mock-data';
import type { BallClip, BallOutcome, ShotTag } from '../types';
import { cn } from '../../../lib/utils';

const outcomes: BallOutcome[] = ['dot', 'single', 'four', 'six', 'wicket', 'wide', 'no_ball'];

const outcomeLabels: Record<BallOutcome, string> = {
  dot: 'Dot',
  single: 'Single',
  double: 'Double',
  triple: 'Triple',
  four: 'Four',
  six: 'Six',
  wicket: 'Wicket',
  wide: 'Wide',
  no_ball: 'No Ball',
  bye: 'Bye',
  leg_bye: 'Leg Bye',
};

export function BallClips() {
  const [query, setQuery] = React.useState('');
  const [outcomeFilter, setOutcomeFilter] = React.useState<BallOutcome | 'all'>('all');
  const [bookmarkedOnly, setBookmarkedOnly] = React.useState(false);
  const [clips, setClips] = React.useState(mockBallClips);
  const [tagPickerOpen, setTagPickerOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<ShotTag[]>([]);
  const [playingClip, setPlayingClip] = React.useState<BallClip | null>(null);

  const filtered = React.useMemo(() => {
    return clips.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        if (!c.ballLabel.includes(q) && !c.batsman?.toLowerCase().includes(q) && !c.bowler?.toLowerCase().includes(q)) return false;
      }
      if (outcomeFilter !== 'all' && c.outcome !== outcomeFilter) return false;
      if (bookmarkedOnly && !c.bookmarked) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => c.tags.includes(t))) return false;
      return true;
    });
  }, [clips, query, outcomeFilter, bookmarkedOnly, selectedTags]);

  const toggleBookmark = (clip: BallClip) => {
    setClips((prev) => prev.map((c) => c.id === clip.id ? { ...c, bookmarked: !c.bookmarked } : c));
  };

  const toggleTag = (tag: ShotTag) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ball Clips</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{filtered.length} clips from tagged balls</p>
      </div>

      {/* Toolbar */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ball, batsman, bowler..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
            />
            {query && <button onClick={() => setQuery('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
          </div>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value as BallOutcome | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none border border-transparent focus:border-primary-500"
          >
            <option value="all">All Outcomes</option>
            {outcomes.map((o) => <option key={o} value={o}>{outcomeLabels[o]}</option>)}
          </select>

          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
              bookmarkedOnly
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            <Bookmark className={cn('w-4 h-4', bookmarkedOnly && 'fill-amber-400')} />
            Bookmarked
          </button>

          <button
            onClick={() => setTagPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <TagIcon className="w-4 h-4" />
            Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
          </button>
        </div>

        {/* Active tag filters */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium"
              >
                {tag}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={() => setSelectedTags([])} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              Clear all
            </button>
          </div>
        )}
      </GlassCard>

      {/* Clips grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((clip, i) => (
            <BallClipCard
              key={clip.id}
              clip={clip}
              index={i}
              onPlay={setPlayingClip}
              onBookmark={toggleBookmark}
              onTag={() => setTagPickerOpen(true)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Film className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-lg">No clips found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Tag picker */}
      <TagPicker
        open={tagPickerOpen}
        onClose={() => setTagPickerOpen(false)}
        selectedTags={selectedTags}
        onToggle={toggleTag}
      />

      {/* Clip player modal */}
      <AnimatePresence>
        {playingClip && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setPlayingClip(null)}
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
                    <h3 className="font-semibold text-slate-900 dark:text-white">Ball {playingClip.ballLabel}</h3>
                    <p className="text-xs text-slate-400">{playingClip.batsman} vs {playingClip.bowler}</p>
                  </div>
                  <button onClick={() => setPlayingClip(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <VideoPlayer src={playingClip.clipUrl} poster={playingClip.thumbnailUrl} />
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {playingClip.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {playingClip.comments.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {playingClip.comments.map((c, i) => (
                        <p key={i} className="text-sm text-slate-500 dark:text-slate-400">• {c}</p>
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

export default BallClips;
