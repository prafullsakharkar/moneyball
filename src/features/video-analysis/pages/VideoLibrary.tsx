import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Grid3x3, List, Film, Clock, Eye, Tag, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { UploadModal, VideoDetailModal } from '../components';
import { mockVideos } from '../services/mock-data';
import type { VideoFile, VideoStatus, VideoQuality } from '../types';
import { cn } from '../../../lib/utils';

const statusConfig: Record<VideoStatus, { label: string; bg: string }> = {
  ready: { label: 'Ready', bg: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  processing: { label: 'Processing', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  queued: { label: 'Queued', bg: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' },
  failed: { label: 'Failed', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const PAGE_SIZE = 12;

export function VideoLibrary() {
  const [view, setView] = React.useState<'grid' | 'table'>('grid');
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<VideoStatus | 'all'>('all');
  const [qualityFilter, setQualityFilter] = React.useState<VideoQuality | 'all'>('all');
  const [page, setPage] = React.useState(0);
  const [showUpload, setShowUpload] = React.useState(false);
  const [selected, setSelected] = React.useState<VideoFile | null>(null);
  const [videos, setVideos] = React.useState(mockVideos);

  const filtered = React.useMemo(() => {
    return videos.filter((v) => {
      if (query && !v.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (qualityFilter !== 'all' && v.quality !== qualityFilter) return false;
      return true;
    });
  }, [videos, query, statusFilter, qualityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  React.useEffect(() => {
    setPage(0);
  }, [query, statusFilter, qualityFilter]);

  const handleDelete = (video: VideoFile) => {
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Video Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{filtered.length} videos</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      {/* Toolbar */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
            />
            {query && <button onClick={() => setQuery('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as VideoStatus | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none border border-transparent focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="ready">Ready</option>
            <option value="processing">Processing</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value as VideoQuality | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none border border-transparent focus:border-primary-500"
          >
            <option value="all">All Quality</option>
            <option value="4K">4K</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
          </select>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['grid', 'table'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  view === v ? 'bg-white dark:bg-slate-700 text-primary-500 shadow' : 'text-slate-400'
                )}
              >
                {v === 'grid' ? <Grid3x3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pageItems.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(video)}
              className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', statusConfig[video.status].bg)}>
                    {statusConfig[video.status].label}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px]">
                  {formatDuration(video.duration)}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{video.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(video.duration)}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">{video.quality}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">Video</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">Quality</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">Duration</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">Tagged</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">Views</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((video) => (
                  <tr
                    key={video.id}
                    onClick={() => setSelected(video)}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={video.thumbnailUrl} alt="" className="w-16 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{video.title}</p>
                          <p className="text-xs text-slate-400">{video.matchName || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', statusConfig[video.status].bg)}>
                        {statusConfig[video.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{video.quality}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDuration(video.duration)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{video.taggedBalls}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{video.views}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelected(video); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(video); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Film className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-lg">No videos found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or upload a new video</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onUpload={() => {}} />
      <VideoDetailModal video={selected} onClose={() => setSelected(null)} onDelete={handleDelete} onEdit={() => setSelected(null)} />
    </div>
  );
}

export default VideoLibrary;
