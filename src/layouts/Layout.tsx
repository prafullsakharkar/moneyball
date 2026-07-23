import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Search, Bell, Zap } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

const SIDEBAR_W = 272;
const SIDEBAR_COLLAPSED_W = 72;

export default function Layout({ children, activePath, onNavigate }: LayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const w = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-cyan-500/5 dark:from-primary-900/20 dark:to-cyan-900/20 pointer-events-none" />

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        activePath={activePath}
        onNavigate={onNavigate}
      />

      {/* Top bar */}
        <motion.header
          initial={false}
          animate={{ marginLeft: w, width: `calc(100% - ${w}px)` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 right-0 h-16 z-50 flex items-center justify-between px-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50"
        >
        <button className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Search players, teams...</span>
          <kbd className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded-md hidden sm:inline">⌘K</kbd>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDarkMode(d => !d)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
            <Zap className="w-3.5 h-3.5" />
            AI Assistant
          </button>

          <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: w, width: `calc(100% - ${w}px)` }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-16 min-h-screen relative z-10"
      >
        <div className="p-6">
          <motion.div
            key={activePath}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
