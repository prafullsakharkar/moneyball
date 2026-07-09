import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Tag as TagIcon, Clock, Film, CheckCircle2, SkipForward, SkipBack } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { VideoPlayer, Timeline, TagPicker } from '../components';
import { mockVideos, getClipsByVideo, getTimelineEvents } from '../services/mock-data';
import { ALL_TAGS, tagColors } from '../components/TagPicker';
import type { ShotTag, BallClip } from '../types';
import { cn } from '../../../lib/utils';

export function ShotTagging() {
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [tagPickerOpen, setTagPickerOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<ShotTag[]>([]);
  const [taggedClips, setTaggedClips] = React.useState<Set<string>>(new Set());

  const video = mockVideos[0];
  const clips = React.useMemo(() => getClipsByVideo(video.id), [video.id]);
  const events = React.useMemo(() => getTimelineEvents(clips), [clips]);

  const currentOver = Math.floor(current / 25) + 1;
  const currentBall = Math.floor((current % 25) / 4) + 1;
  const currentLabel = `${currentOver}.${currentBall}`;

  const nearbyClips = React.useMemo(() => {
    return clips
      .filter((c) => Math.abs(c.startTime - current) < 60)
      .sort((a, b) => Math.abs(a.startTime - current) - Math.abs(b.startTime - current))
      .slice(0, 5);
  }, [clips, current]);

  const toggleTag = (tag: ShotTag) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const saveTags = () => {
    if (selectedTags.length > 0) {
      setTaggedClips((prev) => new Set(prev).add(currentLabel));
      setSelectedTags([]);
    }
  };

  const skipToNext = () => {
    const next = clips.find((c) => c.startTime > current);
    if (next) setCurrent(next.startTime);
  };

  const skipToPrev = () => {
    const prev = [...clips].reverse().find((c) => c.startTime < current);
    if (prev) setCurrent(prev.startTime);
  };

  const progress = clips.length > 0 ? (taggedClips.size / clips.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shot Tagging</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tag shots frame-by-frame with AI assistance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400">Tagging Progress</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{taggedClips.size} / {clips.length} balls</p>
          </div>
          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video + Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            onTimeUpdate={setCurrent}
            onDurationChange={setDuration}
          />

          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Match Timeline</h3>
            <Timeline duration={duration || 3600} current={current} events={events} onSeek={setCurrent} />
          </GlassCard>

          {/* Current frame info */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Current Frame</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ball {currentLabel} • {Math.floor(current / 60)}:{Math.floor(current % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={skipToPrev} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={skipToNext} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick tag buttons */}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Quick Tags</p>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  const color = tagColors[tag];
                  return (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                        selected
                          ? 'text-white border-transparent'
                          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      )}
                      style={selected ? { backgroundColor: color, borderColor: color } : {}}
                    >
                      {tag}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setTagPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <TagIcon className="w-3.5 h-3.5" />
                More Tags
              </button>
              <button
                onClick={saveTags}
                disabled={selectedTags.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors ml-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Tags ({selectedTags.length})
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right: Nearby clips */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Nearby Clips</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {nearbyClips.map((clip) => (
                <NearbyClipItem key={clip.id} clip={clip} current={current} onSeek={setCurrent} tagged={taggedClips.has(clip.ballLabel)} />
              ))}
              {nearbyClips.length === 0 && (
                <div className="text-center py-8">
                  <Film className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No clips near current position</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Tagging stats */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tagging Stats</h3>
            <div className="space-y-2">
              <StatRow label="Total Balls" value={clips.length} />
              <StatRow label="Tagged" value={taggedClips.size} color="text-green-500" />
              <StatRow label="Remaining" value={clips.length - taggedClips.size} color="text-amber-500" />
              <StatRow label="Progress" value={`${progress.toFixed(1)}%`} color="text-primary-500" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Tag picker */}
      <TagPicker
        open={tagPickerOpen}
        onClose={() => setTagPickerOpen(false)}
        selectedTags={selectedTags}
        onToggle={toggleTag}
      />
    </div>
  );
}

function NearbyClipItem({ clip, current, onSeek, tagged }: { clip: BallClip; current: number; onSeek: (t: number) => void; tagged: boolean }) {
  const distance = Math.abs(clip.startTime - current);
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSeek(clip.startTime)}
      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
    >
      <img src={clip.thumbnailUrl} alt="" className="w-16 h-10 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ball {clip.ballLabel}</span>
          {tagged && <CheckCircle2 className="w-3 h-3 text-green-500" />}
        </div>
        <p className="text-xs text-slate-400 truncate">{clip.batsman} vs {clip.bowler}</p>
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">
        {distance < 5 ? 'Now' : `${distance}s`}
      </span>
    </motion.div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className={cn('text-sm font-bold', color || 'text-slate-900 dark:text-white')}>{value}</span>
    </div>
  );
}

export default ShotTagging;
