import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, List, Activity, Sparkles, MessageSquare, ChevronDown, Play, Send } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { VideoPlayer, Timeline, BallClipCard } from '../components';
import { mockVideos, getClipsByVideo, getTimelineEvents, mockComments } from '../services/mock-data';
import type { BallClip, VideoComment } from '../types';
import { cn } from '../../../lib/utils';

type Tab = 'balls' | 'events' | 'highlights' | 'comments';

export function MatchVideo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<Tab>('balls');
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [expandedOver, setExpandedOver] = React.useState<number | null>(null);
  const [commentText, setCommentText] = React.useState('');
  const [comments, setComments] = React.useState<VideoComment[]>(mockComments);

  const video = mockVideos.find((v) => v.id === id) || mockVideos[0];
  const clips = React.useMemo(() => getClipsByVideo(video.id), [video.id]);
  const events = React.useMemo(() => getTimelineEvents(clips), [clips]);

  const overs = React.useMemo(() => {
    const map = new Map<number, BallClip[]>();
    clips.forEach((c) => {
      if (!map.has(c.overNumber)) map.set(c.overNumber, []);
      map.get(c.overNumber)!.push(c);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [clips]);

  const highlights = React.useMemo(() => clips.filter((c) => c.outcome === 'six' || c.outcome === 'four' || c.outcome === 'wicket'), [clips]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'balls', label: 'Ball List', icon: <List className="w-4 h-4" />, count: clips.length },
    { key: 'events', label: 'Events', icon: <Activity className="w-4 h-4" />, count: events.length },
    { key: 'highlights', label: 'Highlights', icon: <Sparkles className="w-4 h-4" />, count: highlights.length },
    { key: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" />, count: comments.length },
  ];

  const handleSeek = (time: number) => setCurrent(time);

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: `cmt-new-${Date.now()}`,
        videoId: video.id,
        author: 'You',
        authorInitials: 'YO',
        timestamp: current,
        text: commentText,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/video-analysis/videos')}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{video.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {video.matchName} • {video.quality} • {video.views} views
          </p>
        </div>
      </div>

      {/* Video player + timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            onTimeUpdate={setCurrent}
            onDurationChange={setDuration}
          />
          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Timeline</h3>
            <Timeline duration={duration || 3600} current={current} events={events} onSeek={handleSeek} />
          </GlassCard>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-1 mb-4">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    tab === t.key
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  )}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                  {t.count !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Ball list tab */}
            {tab === 'balls' && (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {overs.map(([overNum, balls]) => (
                  <div key={overNum}>
                    <button
                      onClick={() => setExpandedOver(expandedOver === overNum ? null : overNum)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Over {overNum}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{balls.length} balls</span>
                        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', expandedOver === overNum && 'rotate-180')} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedOver === overNum && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-1 pl-3">
                            {balls.map((clip) => (
                              <div
                                key={clip.id}
                                onClick={() => handleSeek(clip.startTime)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                              >
                                <span className="text-xs font-bold text-slate-500 w-10">{clip.ballLabel}</span>
                                <span className={cn(
                                  'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
                                  clip.outcome === 'six' ? 'bg-red-500/10 text-red-500' :
                                  clip.outcome === 'four' ? 'bg-green-500/10 text-green-500' :
                                  clip.outcome === 'wicket' ? 'bg-amber-500/10 text-amber-500' :
                                  'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                )}>
                                  {clip.outcome}
                                </span>
                                <span className="text-xs text-slate-400 ml-auto">{clip.runs} run{clip.runs !== 1 ? 's' : ''}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* Events tab */}
            {tab === 'events' && (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {events.map((evt, i) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => handleSeek(evt.time)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          evt.type === 'six' ? '#ef4444' :
                          evt.type === 'boundary' ? '#22c55e' :
                          evt.type === 'wicket' ? '#f59e0b' : '#94a3b8',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{evt.label}</p>
                      {evt.description && <p className="text-xs text-slate-400 truncate">{evt.description}</p>}
                    </div>
                    <span className="text-xs text-slate-400">{Math.floor(evt.time / 60)}:{Math.floor(evt.time % 60).toString().padStart(2, '0')}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Highlights tab */}
            {tab === 'highlights' && (
              <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto">
                {highlights.slice(0, 12).map((clip, i) => (
                  <BallClipCard key={clip.id} clip={clip} index={i} compact onPlay={(c) => handleSeek(c.startTime)} />
                ))}
              </div>
            )}

            {/* Comments tab */}
            {tab === 'comments' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button onClick={addComment} disabled={!commentText.trim()} className="p-2 rounded-xl bg-primary-500 text-white disabled:opacity-50 hover:bg-primary-600 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-[450px] overflow-y-auto">
                  {comments.map((cmt) => (
                    <div key={cmt.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {cmt.authorInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cmt.author}</span>
                          <span className="text-xs text-slate-400">{Math.floor(cmt.timestamp / 60)}:{Math.floor(cmt.timestamp % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{cmt.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default MatchVideo;
