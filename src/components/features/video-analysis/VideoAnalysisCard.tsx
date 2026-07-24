import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Play, Download, Clock } from 'lucide-react';

export interface VideoAnalysisCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  type: 'highlight' | 'match' | 'training' | 'tutorial';
  thumbnail?: string;
  className?: string;
  onClick?: () => void;
}

export function VideoAnalysisCard({ 
  id, 
  title, 
  description, 
  duration, 
  date,
  type,
  thumbnail,
  className,
  onClick
}: VideoAnalysisCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'highlight':
        return 'bg-purple-500';
      case 'match':
        return 'bg-blue-500';
      case 'training':
        return 'bg-emerald-500';
      case 'tutorial':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'highlight':
        return 'Highlight';
      case 'match':
        return 'Match';
      case 'training':
        return 'Training';
      case 'tutorial':
        return 'Tutorial';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('group cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300'
      )}>
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {thumbnail ? (
            <>
              <img 
                src={thumbnail} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">{duration}</span>
            </div>
          </div>
          
          {/* Type Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
            <span className={cn('text-xs font-semibold text-white', getTypeColor())}>
              {getTypeLabel()}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white"
            >
              <Play className="w-6 h-6 ml-1 fill-current" />
            </motion.button>
          </div>
        </div>

        {/* Video Info */}
        <div className="px-5 py-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{date}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Download</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}