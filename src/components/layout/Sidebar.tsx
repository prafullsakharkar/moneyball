import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Trophy, Users, User, Crown, Calendar, Award,
  Brain, BarChart3, Video, GraduationCap, Dumbbell, Gavel, Zap,
  Bell, DollarSign, FileText, Settings, ChevronRight, ChevronDown, ChevronsLeft,
  Shield, MapPin, List, Table, Clock, Heart, MoreHorizontal,
  HelpCircle, LogOut, UserCog, Database
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

// ─── MAIN NAVIGATION ────────────────────────────────────────────────────────────
const DASHBOARD: NavGroup = {
  id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/'
};

const COMPETITIONS: NavGroup = {
  id: 'competitions', label: 'Competitions', icon: Trophy,
  children: [
    { id: 'tournaments', label: 'Tournament', icon: Trophy, path: '/tournaments', badge: 3 },
    { id: 'fixtures', label: 'Fixtures', icon: Calendar, path: '/matches' },
    { id: 'points-table', label: 'Points Table', icon: Table, path: '/tournaments/standings' },
    { id: 'venues', label: 'Venues', icon: MapPin, path: '/admin/venues' },
  ],
};

const TEAMS: NavGroup = {
  id: 'teams', label: 'Teams', icon: Users,
  children: [
    { id: 'teams-list', label: 'All Teams', icon: Users, path: '/teams' },
    { id: 'team-analytics', label: 'Team Analytics', icon: BarChart3, path: '/teams/analytics' },
  ],
};

const PLAYERS: NavGroup = {
  id: 'players', label: 'Players', icon: User,
  children: [
    { id: 'players-list', label: 'All Players', icon: User, path: '/players' },
    { id: 'player-analytics', label: 'Player Analytics', icon: BarChart3, path: '/players/analytics' },
  ],
};

const MATCHES: NavGroup = {
  id: 'matches', label: 'Matches', icon: Calendar, badge: 12,
  children: [
    { id: 'match-center', label: 'Match Center', icon: Calendar, path: '/matches' },
    { id: 'match-analytics', label: 'Match Analytics', icon: BarChart3, path: '/matches/analytics' },
    { id: 'head-to-head', label: 'Head to Head', icon: Users, path: '/h2h' },
    { id: 'h2h-analytics', label: 'H2H Analytics', icon: BarChart3, path: '/h2h/analytics' },
  ],
};

const ANALYTICS: NavGroup = {
  id: 'analytics', label: 'Analytics', icon: BarChart3,
  children: [
    { id: 'team-analytics', label: 'Team', icon: Users, path: '/teams/analytics' },
    { id: 'player-analytics', label: 'Player', icon: User, path: '/players/analytics' },
    { id: 'match-analytics', label: 'Match', icon: Calendar, path: '/matches/analytics' },
    { id: 'tournament-analytics', label: 'Tournament', icon: Trophy, path: '/tournaments/analytics' },
    { id: 'ai-analytics', label: 'AI', icon: Brain, path: '/ai' },
  ],
};

const VIDEO_ANALYSIS: NavGroup = {
  id: 'video-analysis', label: 'Video Analysis', icon: Video,
  children: [
    { id: 'va-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/video-analysis' },
    { id: 'va-library', label: 'Video Library', icon: Video, path: '/video-analysis/videos' },
    { id: 'va-clips', label: 'Ball Clips', icon: Calendar, path: '/video-analysis/clips' },
    { id: 'va-tagging', label: 'Shot Tagging', icon: Trophy, path: '/video-analysis/tagging' },
    { id: 'va-highlights', label: 'Player Highlights', icon: Award, path: '/video-analysis/highlights' },
    { id: 'va-ai-highlights', label: 'AI Highlights', icon: Brain, path: '/video-analysis/ai' },
  ],
};

const ACADEMY: NavGroup = {
  id: 'academy', label: 'Academy', icon: GraduationCap,
  children: [
    { id: 'ac-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/academy' },
    { id: 'ac-students', label: 'Students', icon: Users, path: '/academy/students' },
    { id: 'ac-batches', label: 'Batches', icon: List, path: '/academy/batches' },
    { id: 'ac-curriculum', label: 'Curriculum', icon: Award, path: '/academy/curriculum' },
    { id: 'ac-progress', label: 'Student Progress', icon: BarChart3, path: '/academy/progress' },
  ],
};

const TRAINING: NavGroup = {
  id: 'training', label: 'Training', icon: Dumbbell,
  children: [
    { id: 'tr-dashboard', label: 'Coach Dashboard', icon: LayoutDashboard, path: '/training' },
    { id: 'tr-sessions', label: 'Practice Sessions', icon: Calendar, path: '/training/sessions' },
    { id: 'tr-fitness', label: 'Fitness Tracking', icon: BarChart3, path: '/training/fitness' },
    { id: 'tr-attendance', label: 'Attendance', icon: Clock, path: '/training/attendance' },
    { id: 'tr-performance', label: 'Performance', icon: Zap, path: '/training/performance' },
  ],
};

const AUCTION: NavGroup = {
  id: 'auction', label: 'Auction', icon: Gavel,
  children: [
    { id: 'au-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/auction' },
    { id: 'au-room', label: 'Auction Room', icon: Calendar, path: '/auction/room' },
    { id: 'au-players', label: 'Player Pool', icon: Users, path: '/auction/players' },
    { id: 'au-budget', label: 'Budget Tracker', icon: DollarSign, path: '/auction/budget' },
  ],
};

const FANTASY: NavGroup = {
  id: 'fantasy', label: 'Fantasy', icon: Zap,
  children: [
    { id: 'fantasy-main', label: 'Fantasy', icon: Zap, path: '/fantasy/analytics' },
    { id: 'fantasy-analytics', label: 'Fantasy Analytics', icon: BarChart3, path: '/fantasy/analytics' },
  ],
};

const NOTIFICATIONS: NavChild = {
  id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications'
};

const SPONSORSHIP: NavChild = {
  id: 'sponsorship', label: 'Sponsorship', icon: DollarSign, path: '/sponsorship'
};

const MONETIZATION: NavChild = {
  id: 'monetization', label: 'Monetization', icon: DollarSign, path: '/monetization'
};

const REPORTS: NavChild = {
  id: 'reports', label: 'Reports', icon: FileText, path: '/reports'
};

const ADMINISTRATION: NavGroup = {
  id: 'administration', label: 'Administration', icon: UserCog,
  children: [
    { id: 'admin-home', label: 'Admin Home', icon: LayoutDashboard, path: '/admin' },
    { id: 'admin-portal', label: 'Admin Portal', icon: Settings, path: '/admin/portal' },
    { id: 'admin-live', label: 'Live Dashboard', icon: Calendar, path: '/admin/live-dashboard' },
    { id: 'admin-tournaments', label: 'Tournaments', icon: Trophy, path: '/admin/tournaments' },
    { id: 'admin-teams', label: 'Teams', icon: Users, path: '/admin/teams' },
    { id: 'admin-players', label: 'Players', icon: User, path: '/admin/players' },
    { id: 'admin-squads', label: 'Squads', icon: Shield, path: '/admin/squads' },
    { id: 'admin-matches', label: 'Matches', icon: Calendar, path: '/admin/matches' },
    { id: 'admin-scoring', label: 'Live Scoring', icon: Trophy, path: '/admin/scoring', badge: 3 },
    { id: 'admin-ball-by-ball', label: 'Ball-by-Ball', icon: Award, path: '/admin/ball-by-ball' },
    { id: 'admin-scorecards', label: 'Scorecards', icon: FileText, path: '/admin/scorecards' },
    { id: 'admin-streaming', label: 'Streaming', icon: Video, path: '/admin/streaming' },
    { id: 'admin-officials', label: 'Match Officials', icon: Shield, path: '/admin/officials' },
    { id: 'admin-venues', label: 'Venues', icon: MapPin, path: '/admin/venues' },
    { id: 'admin-organizers', label: 'Organizers', icon: Database, path: '/admin/organizers' },
    { id: 'admin-player-analytics', label: 'Player Analytics', icon: User, path: '/admin/player-analytics' },
    { id: 'admin-team-analytics', label: 'Team Analytics', icon: Users, path: '/admin/team-analytics' },
    { id: 'admin-match-analytics', label: 'Match Analytics', icon: Calendar, path: '/admin/match-analytics' },
    { id: 'admin-tournament-analytics', label: 'Tournament Analytics', icon: Trophy, path: '/admin/tournament-analytics' },
    { id: 'admin-reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
    { id: 'admin-import', label: 'Import Center', icon: FileText, path: '/admin/import' },
    { id: 'admin-users', label: 'User Management', icon: UserCog, path: '/admin/users' },
    { id: 'admin-audit', label: 'Audit Logs', icon: Database, path: '/admin/audit' },
  ],
};

const UTILITY_ITEMS: NavChild[] = [
  { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/help' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Logout', icon: LogOut, path: '/logout' },
];

function NavGroupItem({
  group, collapsed, activePath, onNavigate
}: {
  group: NavGroup | NavChild;
  collapsed: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
}) {
  const isDirect = !('children' in group) || group.children === undefined;
  const children = 'children' in group ? group.children : undefined;
  const isActive = group.path
    ? activePath === group.path
    : (children?.some(c => activePath === c.path || activePath.startsWith(c.path + '/')) ?? false);
  const [open, setOpen] = React.useState(isActive);
  const Icon = group.icon;

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

  if (collapsed) {
    return (
      <button
        onClick={() => onNavigate(children![0].path)}
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
              {children!.map(child => {
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

function UtilityItem({ item, collapsed, onNavigate }: { item: NavChild; collapsed: boolean; onNavigate: (path: string) => void }) {
  if (collapsed) {
    return (
      <button
        onClick={() => onNavigate(item.path)}
        title={item.label}
        className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-0.5"
      >
        <item.icon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => onNavigate(item.path)}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-0.5"
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium text-sm flex-1 text-left whitespace-nowrap">{item.label}</span>
    </button>
  );
}

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

export function Sidebar({ 
  collapsed = false, 
  onToggle, 
  activePath = '', 
  onNavigate = () => {},
  className 
}: SidebarProps) {
  const [showUtilities, setShowUtilities] = React.useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 272 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col overflow-hidden transition-all duration-300',
        className
      )}
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
        <NavGroupItem
          group={DASHBOARD}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        {!collapsed && <div className="my-3 mx-1 h-px bg-slate-200 dark:bg-slate-700" />}

        <NavGroupItem
          group={COMPETITIONS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={TEAMS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={PLAYERS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={MATCHES}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={ANALYTICS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={VIDEO_ANALYSIS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={ACADEMY}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={TRAINING}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={AUCTION}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={FANTASY}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={NOTIFICATIONS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={SPONSORSHIP}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={MONETIZATION}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <NavGroupItem
          group={REPORTS}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        {!collapsed && <div className="my-3 mx-1 h-px bg-slate-200 dark:bg-slate-700" />}

        <NavGroupItem
          group={ADMINISTRATION}
          collapsed={collapsed}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        {!collapsed && (
          <>
            <div className="my-2 mx-1 flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <button
                onClick={() => setShowUtilities(!showUtilities)}
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-2 py-1"
              >
                More <MoreHorizontal className="w-3 h-3" />
              </button>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>
            {showUtilities && UTILITY_ITEMS.map(item => (
              <UtilityItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
            <div className="my-2 mx-2 h-px bg-slate-200 dark:bg-slate-700" />
          </>
        )}
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