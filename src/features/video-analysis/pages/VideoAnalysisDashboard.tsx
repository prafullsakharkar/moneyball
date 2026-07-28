/**
 * Video Analysis Dashboard Component
 * ==================================
 * 
 * Main dashboard for video analysis feature.
 * Displays overview of video content, recent uploads, and analytics.
 */

import React from 'react';
import { 
  Video, 
  Film, 
  Clock, 
  Upload, 
  Play, 
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Share2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

// Mock data
const recentUploads = [
  {
    id: '1',
    title: 'Training Session - Batting Drills',
    date: '2026-07-24',
    duration: '45:30',
    views: 128,
    thumbnail: '/placeholder-video.jpg',
    tags: ['Training', 'Batting'],
  },
  {
    id: '2',
    title: 'Match Highlights - vs Mumbai Indians',
    date: '2026-07-23',
    duration: '12:45',
    views: 342,
    thumbnail: '/placeholder-video.jpg',
    tags: ['Match', 'Highlights'],
  },
  {
    id: '3',
    title: 'Bowling Technique Analysis',
    date: '2026-07-22',
    duration: '28:15',
    views: 89,
    thumbnail: '/placeholder-video.jpg',
    tags: ['Analysis', 'Bowling'],
  },
];

const videoStats = [
  { label: 'Total Videos', value: '156', icon: Film, color: 'text-blue-500' },
  { label: 'Total Duration', value: '42h 30m', icon: Clock, color: 'text-green-500' },
  { label: 'Total Views', value: '12.5K', icon: Play, color: 'text-purple-500' },
  { label: 'Storage Used', value: '85 GB', icon: Download, color: 'text-orange-500' },
];

const VideoAnalysisDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Video Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400">Analyze and tag cricket footage</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videoStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-lg bg-slate-100 dark:bg-slate-800', stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
          <button className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border-b-2 border-primary-500">
            Recent Uploads
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            Tagged Clips
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            Analytics
          </button>
        </div>

        <div className="space-y-4">
          {/* Recent Uploads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Latest videos added to the library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <Play className="h-8 w-8 text-slate-400" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate">{video.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{video.date}</span>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{video.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {video.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Videos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisDashboard;
