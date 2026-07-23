import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ShotTag } from '../types';

export const ALL_TAGS: ShotTag[] = [
  'Cover Drive',
  'Pull',
  'Cut',
  'Sweep',
  'Reverse Sweep',
  'Yorker',
  'Bouncer',
  'Slower Ball',
  'Edge',
  'Catch',
  'LBW',
  'Run Out',
];

export const tagColors: Record<ShotTag, string> = {
  'Cover Drive': '#6366f1',
  'Pull': '#06b6d4',
  'Cut': '#22c55e',
  'Sweep': '#f59e0b',
  'Reverse Sweep': '#ef4444',
  'Yorker': '#a855f7',
  'Bouncer': '#ec4899',
  'Slower Ball': '#14b8a6',
  'Edge': '#f97316',
  'Catch': '#8b5cf6',
  'LBW': '#3b82f6',
  'Run Out': '#10b981',
};

interface TagPickerProps {
  open: boolean;
  onClose: () => void;
  selectedTags: ShotTag[];
  onToggle: (tag: ShotTag) => void;
  title?: string;
}

export function TagPicker({ open, onClose, selectedTags, onToggle, title = 'Select Shot Tags' }: TagPickerProps) {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!query) return ALL_TAGS;
    return ALL_TAGS.filter((t) => t.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedTags.length} selected</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tags..."
                    className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery('')}>
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="p-5 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {filtered.map((tag) => {
                    const selected = selectedTags.includes(tag);
                    const color = tagColors[tag];
                    return (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onToggle(tag)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border',
                          selected
                            ? 'text-white border-transparent'
                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        )}
                        style={selected ? { backgroundColor: color, borderColor: color } : {}}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: selected ? 'white' : color }}
                          />
                          {tag}
                        </span>
                        {selected && <Check className="w-4 h-4" />}
                      </motion.button>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">No tags found</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
