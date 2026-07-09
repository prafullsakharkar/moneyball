import React from 'react';
import { motion } from 'framer-motion';
import {
  Video, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, X,
  Play, ExternalLink, Radio, Clock, Calendar, Globe, Users
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface StreamingDetail {
  id: string;
  match_id: string;
  match_name: string;
  provider: string;
  platform: string;
  stream_url: string;
  language: string;
  commentator: string[];
  status: 'scheduled' | 'live' | 'ended';
  viewer_count?: number;
  start_time: string;
  quality: string[];
  region: string;
}

const streamingData: StreamingDetail[] = [
  {
    id: '1',
    match_id: 'M45',
    match_name: 'CSK vs MI - Match 45',
    provider: 'JioCinema',
    platform: 'Web / Mobile / TV',
    stream_url: 'https://jiocinema.com/ipl/match/45',
    language: 'English',
    commentator: ['Ravi Shastri', 'Harsha Bhogle', 'Sunil Gavaskar'],
    status: 'live',
    viewer_count: 1250000,
    start_time: '19:30 IST',
    quality: ['1080p', '720p', '480p', '360p'],
    region: 'India'
  },
  {
    id: '2',
    match_id: 'M46',
    match_name: 'RCB vs KKR - Match 46',
    provider: 'Star Sports',
    platform: 'TV / Hotstar',
    stream_url: 'https://hotstar.com/match/46',
    language: 'Hindi',
    commentator: ['Virender Sehwag', 'Sanjay Manjrekar'],
    status: 'scheduled',
    start_time: '15:30 IST',
    quality: ['1080p', '720p', '480p'],
    region: 'India'
  },
  {
    id: '3',
    match_id: 'M44',
    match_name: 'GT vs LSG - Match 44',
    provider: 'Willow TV',
    platform: 'Web / Mobile',
    stream_url: 'https://willow.tv/match/44',
    language: 'English',
    commentator: ['Ian Bishop', 'Mike Haysman'],
    status: 'ended',
    viewer_count: 85000,
    start_time: '19:30 IST',
    quality: ['1080p', '720p'],
    region: 'USA'
  },
];

export function StreamingDetails() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedStream, setSelectedStream] = React.useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-error-100 text-error-600';
      case 'scheduled': return 'bg-primary-100 text-primary-600';
      case 'ended': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Streaming Details</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage live streaming links and information</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Stream
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-error-600 mb-2">
            <Radio className="w-4 h-4" />
            <span className="text-xs">Live Now</span>
          </div>
          <p className="text-2xl font-bold text-error-600">{streamingData.filter(s => s.status === 'live').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{streamingData.filter(s => s.status === 'scheduled').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Video className="w-4 h-4" />
            <span className="text-xs">Total Streams</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{streamingData.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs">Total Viewers</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {((streamingData.reduce((sum, s) => sum + (s.viewer_count || 0), 0)) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search streams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      {/* Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {streamingData.map((stream, i) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    stream.status === 'live' ? 'bg-error-100 dark:bg-error-900/30' :
                    stream.status === 'scheduled' ? 'bg-primary-100 dark:bg-primary-900/30' :
                    'bg-slate-100 dark:bg-slate-800'
                  )}>
                    {stream.status === 'live' ? (
                      <Radio className="w-6 h-6 text-error-600" />
                    ) : (
                      <Video className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{stream.match_name}</h3>
                    <p className="text-sm text-slate-500">{stream.provider}</p>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', getStatusColor(stream.status))}>
                  {stream.status === 'live' && (
                    <span className="w-2 h-2 rounded-full bg-error-500 animate-pulse" />
                  )}
                  {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                </span>
              </div>

              {stream.status === 'live' && stream.viewer_count && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-error-50 dark:bg-error-900/20 mb-4">
                  <Users className="w-4 h-4 text-error-600" />
                  <span className="text-sm font-medium text-error-600">
                    {(stream.viewer_count / 1000000).toFixed(2)}M watching now
                  </span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{stream.platform}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 font-medium">Language:</span>
                  <span className="text-slate-600 dark:text-slate-400">{stream.language}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{stream.start_time}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Commentators</p>
                <div className="flex flex-wrap gap-1">
                  {stream.commentator.map((c, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Available Qualities</p>
                <div className="flex gap-2">
                  {stream.quality.map((q, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs">
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <a
                  href={stream.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  {stream.status === 'live' ? (
                    <>
                      <Play className="w-4 h-4" />
                      Watch Live
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      View Stream
                    </>
                  )}
                </a>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Edit className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Trash2 className="w-4 h-4 text-error-500" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Streaming Detail</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Match</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Select Match</option>
                  <option>CSK vs MI - Match 45</option>
                  <option>RCB vs KKR - Match 46</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Provider</label>
                  <input type="text" placeholder="e.g., JioCinema" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Platform</label>
                  <input type="text" placeholder="e.g., Web / Mobile / TV" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Stream URL</label>
                <input type="url" placeholder="https://" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Language</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Regional</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Region</label>
                  <input type="text" placeholder="e.g., India" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium">
                Add Stream
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default StreamingDetails;
