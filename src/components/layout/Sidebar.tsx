import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Trophy, Users, User, Crown, Calendar, Swords, Award,
  Brain, TrendingUp, Settings, ChevronRight, ChevronsLeft, Zap, ChevronDown,
  BarChart3, Activity, Shield, Target, LineChart, Sparkles, MapPin, Upload,
  Database, FileText, UserCog, ClipboardList, Video, Radio, Star, Tag,
  Dumbbell, CheckCircle2, GraduationCap, BookOpen, Gavel, Wallet,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavChild {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: number;
  children?: NavChild[];
}

// ─── ALL ROUTES ───────────────────────────────────────────────────────────────
const PUBLIC_NAV: NavGroup[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  {
    id: 'tournaments', label: 'Tournaments', icon: Trophy, badge: 3,
    children: [
      { id: 'tournaments-list', label: 'All Tournaments', icon: Trophy, path: '/tournaments' },
      { id: 'tournaments-analytics', label: 'Analytics', icon: BarChart3, path: '/tournaments/analytics' },
    ],
  },
  {
    id: 'teams', label: 'Teams', icon: Users,
    children: [
      { id: 'teams-list', label: 'All Teams', icon: Users, path: '/teams' },
      { id: 'teams-analytics', label: 'Analytics', icon: BarChart3, path: '/teams/analytics' },
    ],
  },
  {
    id: 'players', label: 'Players', icon: User,
    children: [
      { id: 'players-list', label: 'All Players', icon: User, path: '/players' },
      { id: 'players-analytics', label: 'Analytics', icon: BarChart3, path: '/players/analytics' },
    ],
  },
  {
    id: 'captains', label: 'Captains', icon: Crown,
    children: [
      { id: 'captains-list', label: 'Captain Dashboard', icon: Crown, path: '/captains' },
      { id: 'captains-analytics', label: 'Analytics', icon: BarChart3, path: '/captains/analytics' },
    ],
  },
  {
    id: 'matches', label: 'Matches', icon: Calendar, badge: 12,
    children: [
      { id: 'matches-list', label: 'Match Center', icon: Calendar, path: '/matches' },
      { id: 'matches-analytics', label: 'Analytics', icon: BarChart3, path: '/matches/analytics' },
    ],
  },
  {
    id: 'h2h', label: 'Head to Head', icon: Swords,
    children: [
      { id: 'h2h-main', label: 'H2H Comparison', icon: Swords, path: '/h2h' },
      { id: 'h2h-detailed', label: 'Detailed Analytics', icon: BarChart3, path: '/h2h/analytics' },
    ],
  },
  {
    id: 'awards', label: 'Awards', icon: Award,
    children: [
      { id: 'awards-main', label: 'Awards', icon: Award, path: '/awards' },
      { id: 'awards-leaderboards', label: 'Leaderboards', icon: TrendingUp, path: '/awards/leaderboards' },
    ],
  },
  { id: 'mvp', label: 'MVP / Fantasy', icon: Zap, path: '/mvp' },
  {
    id: 'ai', label: 'AI Analytics', icon: Brain,
    children: [
      { id: 'ai-main', label: 'AI Analytics', icon: Brain, path: '/ai' },
      { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, path: '/ai/insights' },
    ],
  },
  {
    id: 'predictions', label: 'Predictions', icon: TrendingUp,
    children: [
      { id: 'predictions-main', label: 'Predictions', icon: TrendingUp, path: '/predictions' },
      { id: 'predictions-detailed', label: 'Detailed Analysis', icon: LineChart, path: '/predictions/detailed' },
    ],
  },
  {
    id: 'video-analysis', label: 'Video Analysis', icon: Video,
    children: [
      { id: 'va-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/video-analysis' },
      { id: 'va-videos', label: 'Video Library', icon: Video, path: '/video-analysis/videos' },
      { id: 'va-clips', label: 'Ball Clips', icon: Target, path: '/video-analysis/clips' },
      { id: 'va-tagging', label: 'Shot Tagging', icon: Tag, path: '/video-analysis/tagging' },
      { id: 'va-highlights', label: 'Player Highlights', icon: Star, path: '/video-analysis/highlights' },
      { id: 'va-ai', label: 'AI Highlights', icon: Sparkles, path: '/video-analysis/ai' },
    ],
  },
  {
    id: 'training', label: 'Training', icon: Dumbbell,
    children: [
      { id: 'tr-dashboard', label: 'Coach Dashboard', icon: LayoutDashboard, path: '/training' },
      { id: 'tr-sessions', label: 'Practice Sessions', icon: Calendar, path: '/training/sessions' },
      { id: 'tr-fitness', label: 'Fitness Tracking', icon: Activity, path: '/training/fitness' },
      { id: 'tr-attendance', label: 'Attendance', icon: CheckCircle2, path: '/training/attendance' },
      { id: 'tr-performance', label: 'Performance', icon: TrendingUp, path: '/training/performance' },
    ],
  },
  {
    id: 'academy', label: 'Academy', icon: GraduationCap,
    children: [
      { id: 'ac-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/academy' },
      { id: 'ac-students', label: 'Students', icon: Users, path: '/academy/students' },
      { id: 'ac-batches', label: 'Batches', icon: Calendar, path: '/academy/batches' },
      { id: 'ac-curriculum', label: 'Curriculum', icon: BookOpen, path: '/academy/curriculum' },
      { id: 'ac-progress', label: 'Student Progress', icon: TrendingUp, path: '/academy/progress' },
    ],
  },
  {
    id: 'auction', label: 'Auction', icon: Gavel,
    children: [
      { id: 'au-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/auction' },
      { id: 'au-room', label: 'Auction Room', icon: Radio, path: '/auction/room' },
      { id: 'au-players', label: 'Player Pool', icon: Users, path: '/auction/players' },
      { id: 'au-budget', label: 'Budget Tracker', icon: Wallet, path: '/auction/budget' },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    id: 'admin-overview', label: 'Overview', icon: LayoutDashboard,
    children: [
      { id: 'admin-home', label: 'Admin Home', icon: LayoutDashboard, path: '/admin' },
      { id: 'admin-portal', label: 'Admin Portal', icon: Settings, path: '/admin/portal' },
      { id: 'admin-analytics', label: 'Analytics Overview', icon: BarChart3, path: '/admin/analytics' },
      { id: 'admin-live', label: 'Live Dashboard', icon: Radio, path: '/admin/live-dashboard' },
    ],
  },
  {
    id: 'admin-competitions', label: 'Competitions', icon: Trophy,
    children: [
      { id: 'admin-tournaments', label: 'Tournaments', icon: Trophy, path: '/admin/tournaments' },
      { id: 'admin-teams', label: 'Teams', icon: Users, path: '/admin/teams' },
      { id: 'admin-players', label: 'Players', icon: User, path: '/admin/players' },
      { id: 'admin-squads', label: 'Squads', icon: ClipboardList, path: '/admin/squads' },
      { id: 'admin-venues', label: 'Venues', icon: MapPin, path: '/admin/venues' },
      { id: 'admin-organizers', label: 'Organizers', icon: Database, path: '/admin/organizers' },
    ],
  },
  {
    id: 'admin-scoring', label: 'Matches & Scoring', icon: Calendar,
    children: [
      { id: 'admin-matches', label: 'Matches', icon: Calendar, path: '/admin/matches' },
      { id: 'admin-officials', label: 'Match Officials', icon: Shield, path: '/admin/officials' },
      { id: 'admin-live-scoring', label: 'Live Scoring', icon: Activity, path: '/admin/scoring', badge: 3 },
      { id: 'admin-ball-by-ball', label: 'Ball-by-Ball', icon: Target, path: '/admin/ball-by-ball' },
      { id: 'admin-scorecards', label: 'Scorecards', icon: FileText, path: '/admin/scorecards' },
      { id: 'admin-streaming', label: 'Streaming', icon: Video, path: '/admin/streaming' },
    ],
  },
  {
    id: 'admin-analytics-section', label: 'Analytics & Insights', icon: BarChart3,
    children: [
      { id: 'admin-ai-insights', label: 'AI Insights', icon: Sparkles, path: '/admin/insights' },
      { id: 'admin-player-analytics', label: 'Player Analytics', icon: User, path: '/admin/player-analytics' },
      { id: 'admin-team-analytics', label: 'Team Analytics', icon: Users, path: '/admin/team-analytics' },
      { id: 'admin-match-analytics', label: 'Match Analytics', icon: Calendar, path: '/admin/match-analytics' },
      { id: 'admin-tournament-dashboard', label: 'Tournament Dashboard', icon: Trophy, path: '/admin/tournament-dashboard' },
      { id: 'admin-batter-insights', label: 'Batter Insights', icon: Target, path: '/admin/batter-insights' },
      { id: 'admin-bowler-insights', label: 'Bowler Insights', icon: Shield, path: '/admin/bowler-insights' },
      { id: 'admin-mvp-analytics', label: 'MVP Analytics', icon: Star, path: '/admin/mvp-analytics' },
      { id: 'admin-captain-analytics', label: 'Captain Analytics', icon: Crown, path: '/admin/captain-analytics' },
      { id: 'admin-venue-analytics', label: 'Venue Analytics', icon: MapPin, path: '/admin/venue-analytics' },
      { id: 'admin-moneyball', label: 'Moneyball Analytics', icon: Zap, path: '/admin/moneyball' },
      { id: 'admin-leaderboards', label: 'Leaderboards & MVP', icon: Award, path: '/admin/leaderboards' },
    ],
  },
  {
    id: 'admin-reports', label: 'Reports & Data', icon: FileText,
    children: [
      { id: 'admin-reports-page', label: 'Generate Reports', icon: FileText, path: '/admin/reports' },
      { id: 'admin-import', label: 'Import Center', icon: Upload, path: '/admin/import' },
    ],
  },
  {
    id: 'admin-system', label: 'System', icon: UserCog,
    children: [
      { id: 'admin-users', label: 'User Management', icon: UserCog, path: '/admin/users' },
      { id: 'admin-audit', label: 'Audit Logs', icon: Database, path: '/admin/audit' },
    ],
  },
];

// ─── ITEM COMPONENT ───────────────────────────────────────────────────────────
function NavGroupItem({
  group, collapsed, activePath, onNavigate,
}: {
  group: NavGroup;
  collapsed: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
}) {
  const isDirect = !group.children;

  const isActive = group.path
    ? activePath === group.path
    : (group.children?.some(c => activePath === c.path || activePath.startsWith(c.path + '/')) ?? false);

  const [open, setOpen] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive && !isDirect) setOpen(true);
  }, [isActive, isDirect]);

  const Icon = group.icon;

  // ── Direct link ──
  if (isDirect) {
    return (
      <motion.button
        whileHover={{ x: collapsed ? 0 : 3 }}
        onClick={() => onNavigate(group.path!)}
        title={collapsed ? group.label : undefined}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 mb-0.5',
          isActive
            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-primary-500')} />
        {!collapsed && (
          <>
            <span className="font-medium text-sm flex-1 text-left whitespace-nowrap">{group.label}</span>
            {group.badge && (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full leading-none">
                {group.badge}
              </span>
            )}
          </>
        )}
      </motion.button>
    );
  }

  // ── Collapsed: icon only, navigates to first child ──
  if (collapsed) {
    return (
      <button
        onClick={() => onNavigate(group.children![0].path)}
        title={group.label}
        className={cn(
          'w-full flex items-center justify-center p-2.5 rounded-xl transition-colors mb-0.5',
          isActive ? 'bg-primary-500/10 text-primary-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  // ── Expandable group ──
  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150',
          isActive
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-primary-500')} />
        <span className="font-medium text-sm flex-1 text-left whitespace-nowrap">{group.label}</span>
        {group.badge && (
          <span className="px-1.5 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full leading-none">
            {group.badge}
          </span>
        )}
        <ChevronDown className={cn('w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="ml-5 mt-0.5 border-l-2 border-slate-200 dark:border-slate-700 pl-2.5 space-y-0.5 pb-1">
              {group.children!.map(child => {
                const ChildIcon = child.icon;
                const childActive = activePath === child.path || activePath.startsWith(child.path + '/');
                return (
                  <button
                    key={child.id}
                    onClick={() => onNavigate(child.path)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all duration-150',
                      childActive
                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                    )}
                  >
                    <ChildIcon className={cn('w-3.5 h-3.5 flex-shrink-0', childActive && 'text-primary-500')} />
                    <span className="truncate flex-1 text-left">{child.label}</span>
                    {child.badge && (
                      <span className="px-1.5 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full leading-none">
                        {child.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ collapsed, onToggle, activePath, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 272 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-3 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          C
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0"
            >
              <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">CricketIQ</p>
              <p className="text-[10px] text-slate-500 leading-tight">Analytics Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 ml-auto"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 text-slate-400" />
            : <ChevronsLeft className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2">
        {/* Public routes */}
        {PUBLIC_NAV.map(group => (
          <NavGroupItem
            key={group.id}
            group={group}
            collapsed={collapsed}
            activePath={activePath}
            onNavigate={onNavigate}
          />
        ))}

        {/* Admin divider */}
        {!collapsed ? (
          <div className="my-3 mx-1 flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1">Admin</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>
        ) : (
          <div className="my-2 mx-2 h-px bg-slate-200 dark:bg-slate-700" />
        )}

        {/* Admin routes */}
        {ADMIN_NAV.map(group => (
          <NavGroupItem
            key={group.id}
            group={group}
            collapsed={collapsed}
            activePath={activePath}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 truncate">v1.0.0</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
