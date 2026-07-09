import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, HardDrive, Eye, Tag, Users, Film, Trash2, Pencil, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { VideoFile, VideoStatus, VideoQuality, VideoSource } from '../types';

interface VideoDetailModalProps {
  video: VideoFile | null;
  onClose: () => void;
  onDelete?: (video: VideoFile) => void;
  onEdit?: (video: VideoFile) => void;
}

const statusConfig: Record<VideoStatus, { label: string; bg: string }> = {
  ready: { label: 'Ready', bg: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  processing: { label: 'Processing', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  queued: { label: 'Queued', bg: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' },
  failed: { label: 'Failed', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};

const sourceLabels: Record<VideoSource, string> = {
  broadcast: 'Broadcast',
  user_upload: 'User Upload',
  highlights: 'Highlights',
  clip: 'Clip',
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

export function VideoDetailModal({ video, onClose, onDelete, onEdit }: VideoDetailModalProps) {
  return (
    <AnimatePresence>
      {video && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-200 dark:bg-slate-800">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', statusConfig[video.status].bg)}>
                      {statusConfig[video.status].label}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase">
                      {video.quality}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                  {video.matchName && (
                    <p className="text-sm text-white/70 mt-0.5">{video.matchName}</p>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label="Duration" value={formatDuration(video.duration)} />
                  <InfoItem icon={<HardDrive className="w-3.5 h-3.5" />} label="Size" value={`${video.size} MB`} />
                  <InfoItem icon={<Calendar className="w-3.5 h-3.5" />} label="Uploaded" value={new Date(video.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
                  <InfoItem icon={<Film className="w-3.5 h-3.5" />} label="Source" value={sourceLabels[video.source]} />
                  <InfoItem icon={<Eye className="w-3.5 h-3.5" />} label="Views" value={video.views.toLocaleString()} />
                  <InfoItem icon={<Tag className="w-3.5 h-3.5" />} label="Tagged Balls" value={video.taggedBalls.toLocaleString()} />
                  <InfoItem icon={<Users className="w-3.5 h-3.5" />} label="Tagged Players" value={video.taggedPlayers.toString()} />
                  <InfoItem icon={<Film className="w-3.5 h-3.5" />} label="AI Clips" value={video.aiClips.toString()} />
                </div>

                {/* Description */}
                {video.description && (
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Description</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      {video.description}
                    </p>
                  </div>
                )}

                {/* Teams */}
                {video.team1Short && video.team2Short && (
                  <div className="flex items-center justify-center gap-4 py-2">
                    <span className="px-4 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold text-lg">
                      {video.team1Short}
                    </span>
                    <span className="text-slate-400 text-sm">vs</span>
                    <span className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-lg">
                      {video.team2Short}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(video)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(video)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <span className="text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{value}</p>
      </div>
    </div>
  );
}
