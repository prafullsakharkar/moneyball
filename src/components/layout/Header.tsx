import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Search, Bell, Zap, ChevronRight, ChevronsLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
  className?: string;
}

export function Header({ collapsed = false, onToggleSidebar, className }: HeaderProps) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <motion.header
      initial={false}
      animate={{ 
        width: collapsed ? `calc(100% - 72px)` : `calc(100% - 272px)`,
        marginLeft: collapsed ? '72px' : '272px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed top-0 right-0 h-16 z-50 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className={cn(
            'p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors',
            !collapsed && 'hidden sm:block'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronsLeft className="w-4 h-4" />
          )}
        </button>

        <motion.div
          animate={{ 
            width: searchOpen ? '200px' : '160px',
            opacity: searchOpen ? 1 : 1,
          }}
          className="relative flex-1"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search players, teams..."
            className={cn(
              'w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 transition-all',
              searchOpen && 'focus:ring-2 focus:ring-primary-500'
            )}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded-md hidden sm:block text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-3">
        <button
          onClick={() => setDarkMode(d => !d)}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
          <Zap className="w-3.5 h-3.5" />
          AI Assistant
        </button>

        <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </button>

        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all">
          A
        </button>
      </div>
    </motion.header>
  );
}

export interface HeaderTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function HeaderTitle({ title, subtitle, className }: HeaderTitleProps) {
  return (
    <div className={cn('space-y-0.5', className)}>
      {typeof title === 'string' ? (
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      ) : (
        title
      )}
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}