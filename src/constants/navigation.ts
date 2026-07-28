/**
 * Enterprise Navigation System Constants
 * ======================================
 * 
 * Complete navigation configuration for CricketIQ.
 * Supports 250+ pages with intelligent organization.
 */

import {
  LayoutDashboard, Trophy, Users, User, Crown, Calendar, Award,
  Brain, BarChart3, Video, GraduationCap, Dumbbell, Gavel, Zap,
  Bell, DollarSign, FileText, Settings, ChevronRight, ChevronsLeft,
  ChevronDown, Shield, MapPin, List, Table, Clock, Heart, MoreHorizontal,
  HelpCircle, LogOut, UserCog, Database, Search, Plus, X,
  Star, History, Filter, Sort, Download, Upload, Share, Link,
  Moon, Sun, Menu, X as XIcon, Check, Search as SearchIcon,
  UserPlus, Team, Gamepad2, Activity, TrendingUp, FileUp,
  Camera, Film, School, Boot, Scale, Gem, Radio, MonitorPlay,
  ShieldCheck, Settings as SettingsIcon2, CreditCard, FileJson,
  UsersRound, UserRound, Trophy as TrophyIcon, CalendarDays,
  BrainCircuit, FilmIcon, GraduationCap as GraduationCapIcon,
  Dumbbell as DumbbellIcon, Gavel as GavelIcon, Zap as ZapIcon,
  Bell as BellIcon, DollarSign as DollarSignIcon, FileText as FileTextIcon,
  Settings as SettingsIcon3, ChevronLeft, ChevronRight as ChevronRightIcon,
  Command, Keyboard, Help, Info, AlertTriangle, CheckCircle,
  XCircle, Loader2, Search as SearchIcon2, Menu as MenuIcon,
  Maximize2, Minimize2, Maximize, Minimize, Maximize1, Minimize1,
  Maximize2 as Maximize2Icon, Minimize2 as Minimize2Icon,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight,
  ArrowDownRight, ArrowUpLeft, ArrowDownLeft, ArrowRightCircle,
  ArrowLeftCircle, ArrowUpCircle, ArrowDownCircle, ArrowRightSquare,
  ArrowLeftSquare, ArrowUpSquare, ArrowDownSquare, Sparkles,
  Play, Mic, Target, Scissors, PlayCircle, ClipboardCheck,
  Activity as ActivityIcon, BookOpen, ReportIcon, Wallet, UserCircle,
  Settings as SettingsIcon, Cpu, Trophy as TrophyIcon2, UserPlus as UserPlusIcon,
  Team as TeamIcon, Gamepad2 as Gamepad2Icon, Activity as ActivityIcon2,
  TrendingUp as TrendingUpIcon, FileUp as FileUpIcon, Camera as CameraIcon,
  Film as FilmIcon2, School as SchoolIcon, Boot as BootIcon, Scale as ScaleIcon,
  Gem as GemIcon, Radio as RadioIcon, MonitorPlay as MonitorPlayIcon,
  ShieldCheck as ShieldCheckIcon, CreditCard as CreditCardIcon, FileJson as FileJsonIcon,
  UsersRound as UsersRoundIcon, UserRound as UserRoundIcon, CalendarDays as CalendarDaysIcon,
  BrainCircuit as BrainCircuitIcon, FilmIcon as FilmIcon3, GraduationCap as GraduationCapIcon2,
  Dumbbell as DumbbellIcon2, Gavel as GavelIcon2, Zap as ZapIcon2, Bell as BellIcon2,
  DollarSign as DollarSignIcon2, FileText as FileTextIcon2, Settings as SettingsIcon4,
  ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon2, Command as CommandIcon,
  Keyboard as KeyboardIcon, Help as HelpIcon, Info as InfoIcon, AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, Loader2 as Loader2Icon,
  Search as SearchIcon3, Menu as MenuIcon2, Maximize2 as Maximize2Icon2, Minimize2 as Minimize2Icon2,
  Maximize as MaximizeIcon, Minimize as MinimizeIcon, Maximize1 as Maximize1Icon,
  Minimize1 as Minimize1Icon, ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon,
  ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon, ArrowUpRight as ArrowUpRightIcon,
  ArrowDownRight as ArrowDownRightIcon, ArrowUpLeft as ArrowUpLeftIcon, ArrowDownLeft as ArrowDownLeftIcon,
  ArrowRightCircle as ArrowRightCircleIcon, ArrowLeftCircle as ArrowLeftCircleIcon,
  ArrowUpCircle as ArrowUpCircleIcon, ArrowDownCircle as ArrowDownCircleIcon,
  ArrowRightSquare as ArrowRightSquareIcon, ArrowLeftSquare as ArrowLeftSquareIcon,
  ArrowUpSquare as ArrowUpSquareIcon, ArrowDownSquare as ArrowDownSquareIcon,
  Zap as ZapIcon3, Bell as BellIcon3, DollarSign as DollarSignIcon3, FileText as FileTextIcon3,
  Settings as SettingsIcon5, ChevronLeft as ChevronLeftIcon2, ChevronRight as ChevronRightIcon3,
  Command as CommandIcon2, Keyboard as KeyboardIcon2, Help as HelpIcon2, Info as InfoIcon2,
  AlertTriangle as AlertTriangleIcon2, CheckCircle as CheckCircleIcon2, XCircle as XCircleIcon2,
  Loader2 as Loader2Icon2, Search as SearchIcon4, Menu as MenuIcon3, Maximize2 as Maximize2Icon3,
  Minimize2 as Minimize2Icon3, Maximize as MaximizeIcon2, Minimize as MinimizeIcon2,
  Maximize1 as Maximize1Icon2, Minimize1 as Minimize1Icon2, ArrowRight as ArrowRightIcon2,
  ArrowLeft as ArrowLeftIcon2, ArrowUp as ArrowUpIcon2, ArrowDown as ArrowDownIcon2,
  ArrowUpRight as ArrowUpRightIcon2, ArrowDownRight as ArrowDownRightIcon2, ArrowUpLeft as ArrowUpLeftIcon2,
  ArrowDownLeft as ArrowDownLeftIcon2, ArrowRightCircle as ArrowRightCircleIcon2,
  ArrowLeftCircle as ArrowLeftCircleIcon2, ArrowUpCircle as ArrowUpCircleIcon2,
  ArrowDownCircle as ArrowDownCircleIcon2, ArrowRightSquare as ArrowRightSquareIcon2,
  ArrowLeftSquare as ArrowLeftSquareIcon2, ArrowUpSquare as ArrowUpSquareIcon2,
  ArrowDownSquare as ArrowDownSquareIcon2
} from 'lucide-react';

import { NavigationGroup, NavigationItem, BadgeConfig } from '../types/navigation';

// ──────────────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIGURATION
// ──────────────────────────────────────────────────────────────────────────────────────

// ─── SIDEBAR CONFIGURATION ──────────────────────────────────────────────────────────

export const SIDEBAR_WIDTH = 272;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const SIDEBAR_ANIMATION_DURATION = 0.3;
export const SIDEBAR_ANIMATION_EASING = 'easeInOut';

// ─── TOP NAVIGATION CONFIGURATION ───────────────────────────────────────────────────

export const TOP_NAV_HEIGHT = 64;
export const TOP_NAV_PADDING_X = 24;
export const TOP_NAV_PADDING_Y = 12;

// ─── BREADCRUMB CONFIGURATION ───────────────────────────────────────────────────────

export const BREADCRUMB_MAX_ITEMS = 5;
export const BREADCRUMB_SEPARATOR = ' / ';

// ─── CONTEXT SWITCHER CONFIGURATION ─────────────────────────────────────────────────

export const CONTEXT_SWITCHER_MAX_ITEMS = 5;
export const CONTEXT_SWITCHER_SEARCH_THRESHOLD = 3;

// ─── QUICK ACTION CONFIGURATION ─────────────────────────────────────────────────────

export const QUICK_ACTION_GROUPS = [
  { id: 'match', label: 'Match Actions' },
  { id: 'content', label: 'Content Actions' },
  { id: 'user', label: 'User Actions' },
  { id: 'analytics', label: 'Analytics Actions' },
  { id: 'admin', label: 'Admin Actions' },
];

// ─── COMMAND PALETTE CONFIGURATION ──────────────────────────────────────────────────

export const COMMAND_PALETTE_GROUPS = [
  { id: 'navigation', label: 'Navigation' },
  { id: 'create', label: 'Create' },
  { id: 'search', label: 'Search' },
  { id: 'settings', label: 'Settings' },
  { id: 'actions', label: 'Actions' },
];

// ─── KEYBOARD SHORTCUTS ─────────────────────────────────────────────────────────────

export const KEYBOARD_SHORTCUTS = [
  { key: 'k', modifiers: { ctrl: true, meta: true }, description: 'Open Command Palette' },
  { key: '/', modifiers: { ctrl: false, shift: false }, description: 'Focus Search' },
  { key: 'n', modifiers: { ctrl: true, meta: true }, description: 'New Item' },
  { key: 'f', modifiers: { ctrl: true, meta: true }, description: 'Toggle Favorites' },
  { key: 'r', modifiers: { ctrl: true, meta: true }, description: 'Refresh Page' },
  { key: 's', modifiers: { ctrl: true, meta: true }, description: 'Save' },
  { key: 'd', modifiers: { ctrl: true, meta: true }, description: 'Toggle Dark Mode' },
  { key: 'Escape', modifiers: { ctrl: false, shift: false }, description: 'Close Modal/Menu' },
  { key: 'ArrowUp', modifiers: { ctrl: false, shift: false }, description: 'Navigate Up' },
  { key: 'ArrowDown', modifiers: { ctrl: false, shift: false }, description: 'Navigate Down' },
  { key: 'Enter', modifiers: { ctrl: false, shift: false }, description: 'Select Item' },
];

// ─── ROLE-BASED NAVIGATION ──────────────────────────────────────────────────────────

export const ROLE_BASED_VISIBILITY: Record<string, boolean> = {
  'super-admin': true,
  'admin': true,
  'tournament-manager': true,
  'team-manager': true,
  'coach': true,
  'player': false,
  'analyst': true,
  'scout': true,
  'academy-admin': true,
  'academy-coach': true,
  'academy-student': false,
  'fan': false,
  'guest': false,
  'sponsor': true,
  'viewer': false,
  'editor': true,
  'publisher': true,
  'moderator': true,
};

// ─── FEATURE FLAGS ──────────────────────────────────────────────────────────────────

export const FEATURE_FLAGS = {
  aiEnabled: true,
  videoAnalysisEnabled: true,
  streamingEnabled: true,
  fantasyEnabled: true,
  auctionEnabled: true,
  academyEnabled: true,
  monetizationEnabled: true,
  sponsorshipEnabled: true,
};

// ─── BADGE STYLES ───────────────────────────────────────────────────────────────────

export const BADGE_STYLES = {
  primary: 'bg-primary-500 text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-white',
  danger: 'bg-rose-500 text-white',
  neutral: 'bg-slate-500 text-white',
  info: 'bg-cyan-500 text-white',
};

// ─── ANIMATION PRESETS ──────────────────────────────────────────────────────────────

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.3 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.3 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
};

// ─── RESPONSIVE BREAKPOINTS ─────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const RESPONSIVE_CONFIG = {
  mobile: {
    sidebarWidth: 280,
    collapsedWidth: 72,
    useDrawer: true,
    drawerPosition: 'left',
    swipeThreshold: 50,
  },
  tablet: {
    sidebarWidth: 272,
    collapsedWidth: 72,
    useDrawer: true,
  },
  desktop: {
    sidebarWidth: 272,
    collapsedWidth: 72,
    useDrawer: false,
  },
};

// ─── ORDER CONSTANTS ────────────────────────────────────────────────────────────────

const NAV_ORDER = {
  // Primary navigation
  dashboard: 10,
  competitions: 20,
  teams: 30,
  players: 40,
  matchCenter: 50,
  analytics: 60,
  aiCenter: 70,
  videoAnalysis: 80,
  academy: 90,
  training: 100,
  auction: 110,
  fantasy: 120,
  streaming: 130,
  sponsorship: 140,
  monetization: 150,
  reports: 160,
  administration: 170,
  
  // Secondary navigation within groups
  overview: 10,
  teamsSub: 20,
  fixtures: 30,
  pointsTable: 40,
  statistics: 50,
  awards: 60,
  
  // Player navigation
  career: 10,
  batting: 20,
  bowling: 30,
  fielding: 40,
  videos: 50,
  fitness: 60,
  
  // Match center
  liveScoring: 10,
  commentary: 20,
  scorecards: 30,
  
  // Analytics
  dashboardAnalytics: 10,
  teamAnalytics: 20,
  playerAnalytics: 30,
  matchAnalytics: 40,
  tournamentAnalytics: 50,
  venueAnalytics: 60,
  captainAnalytics: 70,
  batterAnalytics: 80,
  bowlerAnalytics: 90,
  moneyballAnalytics: 100,
  
  // AI Center
  aiInsights: 10,
  aiCoach: 20,
  aiAnalyst: 30,
  aiPredictions: 40,
  aiReports: 50,
  
  // Video Analysis
  videoDashboard: 10,
  videos: 20,
  ballClips: 30,
  shotTagging: 40,
  highlights: 50,
  aiHighlights: 60,
  
  // Academy
  academyDashboard: 10,
  students: 20,
  coaches: 30,
  parents: 40,
  curriculum: 50,
  reportsAcademy: 60,
  
  // Training
  sessions: 10,
  attendance: 20,
  fitnessTraining: 30,
  performance: 40,
  
  // Auction
  auctionRoom: 10,
  playerPool: 20,
  budgets: 30,
  soldPlayers: 40,
  
  // Fantasy
  leagues: 10,
  rolesAdmin: 20,
  permissionsAdmin: 30,
  auditLogs: 40,
  settingsAdmin: 50,
};

// ─── UTILITY ITEMS ──────────────────────────────────────────────────────────────────

export const UTILITY_ITEMS: NavigationItem[] = [
  {
    id: 'help',
    type: 'utility',
    category: 'utility',
    label: 'Help & Support',
    icon: HelpCircle,
    path: '/help',
    order: NAV_ORDER.administration + 10,
    roles: ['super-admin', 'admin', 'tournament-manager', 'team-manager', 'coach', 'analyst', 'scout'],
  },
  {
    id: 'settings',
    type: 'utility',
    category: 'utility',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    order: NAV_ORDER.administration + 20,
    roles: ['super-admin', 'admin'],
  },
  {
    id: 'logout',
    type: 'utility',
    category: 'utility',
    label: 'Logout',
    icon: LogOut,
    order: NAV_ORDER.administration + 30,
    roles: ['super-admin', 'admin', 'tournament-manager', 'team-manager', 'coach', 'analyst', 'scout', 'fan', 'viewer'],
  },
];

// ─── DASHBOARD GROUP ─────────────────────────────────────────────────────────────────

export const DASHBOARD_GROUP: NavigationGroup = {
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard,
  type: 'dashboard',
  category: 'primary',
  order: NAV_ORDER.dashboard,
  items: [
    {
      id: 'dashboard-home',
      type: 'dashboard',
      category: 'primary',
      label: 'Overview',
      description: 'Main dashboard overview',
      icon: LayoutDashboard,
      path: '/dashboard',
      order: 1,
      badge: { text: 'Main', style: 'primary' },
    },
    {
      id: 'dashboard-analytics',
      type: 'page',
      category: 'secondary',
      label: 'Analytics',
      icon: BarChart3,
      path: '/dashboard/analytics',
      order: NAV_ORDER.dashboardAnalytics,
      roles: ['super-admin', 'admin', 'analyst'],
    },
    {
      id: 'dashboard-my-teams',
      type: 'page',
      category: 'secondary',
      label: 'My Teams',
      icon: Users,
      type: 'dashboard',
      category: 'secondary',
      label: 'Players',
      description: 'Player overview',
      icon: User,
      path: '/dashboard/players',
      order: 4,
    },
    {
      id: 'dashboard-matches',
      type: 'dashboard',
      category: 'secondary',
      label: 'Matches',
      description: 'Live and upcoming matches',
      icon: Gamepad2,
      path: '/dashboard/matches',
      order: 5,
      badge: { count: 5, type: 'warning' },
    },
  ],
};

/**
 * 2. 🏆 Competitions Navigation
 */
export const COMPETITIONS_GROUP: NavigationGroup = {
  id: 'competitions',
  label: 'Competitions',
  icon: Trophy,
  type: 'competition',
  category: 'primary',
  order: NAV_ORDER.competitions,
  label: 'Competitions',
  description: 'Tournament management and competitions',
  icon: Trophy,
  path: '/tournaments',
  order: NAV_ORDER.competitions,
  roles: ['super-admin', 'admin', 'tournament-manager'],
  items: [
    {
      id: 'tournaments',
      type: 'page',
      category: 'primary',
      label: 'Tournaments',
  order: NAVIGATION_ORDER.matchCenter,
  items: [
    {
      id: 'match-center-fixtures',
      type: 'match',
      category: 'primary',
      label: 'Fixtures',
      description: 'Match fixtures and schedules',
      icon: Calendar,
      path: '/matches',
      order: 1,
      badge: BADGES.matches,
    },
    {
      id: 'match-center-live',
      type: 'match',
      category: 'primary',
      label: 'Live Scoring',
      description: 'Live match scoring',
      icon: Play,
      path: '/matches/live',
      order: 2,
      badge: BADGES.live,
    },
    {
      id: 'match-center-commentary',
      type: 'match',
      category: 'secondary',
      label: 'Commentary',
      description: 'Live match commentary',
      icon: Mic,
      path: '/matches/commentary',
      order: 3,
    },
    {
      id: 'match-center-scorecards',
      type: 'match',
      category: 'secondary',
      label: 'Scorecards',
      description: 'Match scorecards',
      icon: FileText,
      path: '/matches/scorecards',
      order: 4,
    },
    {
      id: 'match-center-streaming',
      type: 'streaming',
      category: 'secondary',
      label: 'Streaming',
      description: 'Live match streaming',
      icon: Video,
      path: '/matches/streaming',
      order: 5,
    },
    {
      id: 'match-center-analytics',
      type: 'analytics',
      category: 'secondary',
      label: 'Match Analytics',
      description: 'Match performance analytics',
      icon: BarChart3,
      path: '/matches/analytics',
      order: 6,
    },
  ],
};

/**
 * 6. 📊 Analytics Navigation
 */
export const ANALYTICS_GROUP: NavigationGroup = {
  id: 'analytics',
  label: 'Analytics',
  icon: ChartPie,
  type: 'analytics',
  category: 'primary',
  order: NAVIGATION_ORDER.analytics,
  items: [
    {
      id: 'analytics-dashboard',
      type: 'analytics',
      category: 'primary',
      label: 'Dashboard',
      description: 'Analytics overview',
      icon: ChartPie,
      path: '/analytics',
      order: 1,
    },
    {
      id: 'analytics-team',
      type: 'analytics',
      category: 'secondary',
      label: 'Team',
      description: 'Team analytics',
      icon: Users,
      path: '/analytics/team',
      order: 2,
    },
    {
      id: 'analytics-player',
      type: 'analytics',
      category: 'secondary',
      label: 'Player',
      description: 'Player analytics',
      icon: User,
      path: '/analytics/player',
      order: 3,
    },
    {
      id: 'analytics-match',
      type: 'analytics',
      category: 'secondary',
      label: 'Match',
      description: 'Match analytics',
      icon: Calendar,
      path: '/analytics/match',
      order: 4,
    },
    {
      id: 'analytics-tournament',
      type: 'analytics',
      category: 'secondary',
      label: 'Tournament',
      description: 'Tournament analytics',
      icon: Trophy,
      path: '/analytics/tournament',
      order: 5,
    },
    {
      id: 'analytics-venue',
      type: 'analytics',
      category: 'secondary',
      label: 'Venue',
      description: 'Venue analytics',
      icon: MapPin,
      path: '/analytics/venue',
      order: 6,
    },
    {
      id: 'analytics-captain',
      type: 'analytics',
      category: 'secondary',
      label: 'Captain',
      description: 'Captain analytics',
      icon: Crown,
      path: '/analytics/captain',
      order: 7,
    },
    {
      id: 'analytics-batter',
      type: 'analytics',
      category: 'secondary',
      label: 'Batter',
      description: 'Batter analytics',
      icon: Target,
      path: '/analytics/batter',
      order: 8,
    },
    {
      id: 'analytics-bowler',
      type: 'analytics',
      category: 'secondary',
      label: 'Bowler',
      description: 'Bowler analytics',
      icon: Target,
      path: '/analytics/bowler',
      order: 9,
    },
    {
      id: 'analytics-moneyball',
      type: 'analytics',
      category: 'secondary',
      label: 'Moneyball',
      description: 'Moneyball analytics',
      icon: Sparkles,
      path: '/analytics/moneyball',
      order: 10,
    },
  ],
};

/**
 * 7. 🤖 AI Center Navigation
 */
export const AI_CENTER_GROUP: NavigationGroup = {
  id: 'ai-center',
  label: 'AI Center',
  icon: Brain,
  type: 'ai',
  category: 'primary',
  order: NAVIGATION_ORDER.analytics + 1,
  items: [
    {
      id: 'ai-center-insights',
      type: 'ai',
      category: 'primary',
      label: 'AI Insights',
      description: 'AI-powered insights and recommendations',
      icon: Sparkles,
      path: '/ai/insights',
      order: 1,
      badge: BADGES.ai,
    },
    {
      id: 'ai-center-coach',
      type: 'ai',
      category: 'primary',
      label: 'AI Coach',
      description: 'AI-powered coaching assistant',
      icon: Brain,
      path: '/ai/coach',
      order: 2,
    },
    {
      id: 'ai-center-analyst',
      type: 'ai',
      category: 'secondary',
      label: 'AI Analyst',
      description: 'AI match and player analyst',
      icon: Cpu,
      path: '/ai/analyst',
      order: 3,
    },
    {
      id: 'ai-center-predictions',
      type: 'ai',
      category: 'secondary',
      label: 'AI Predictions',
      description: 'AI-powered match predictions',
      icon: Search,
      path: '/ai/predictions',
      order: 4,
    },
    {
      id: 'ai-center-reports',
      type: 'ai',
      category: 'secondary',
      label: 'AI Reports',
      description: 'AI-generated analysis reports',
      icon: ReportIcon,
      path: '/ai/reports',
      order: 5,
    },
  ],
};

/**
 * 8. 🎥 Video Analysis Navigation
 */
export const VIDEO_ANALYSIS_GROUP: NavigationGroup = {
  id: 'video-analysis',
  label: 'Video Analysis',
  icon: VideoIcon,
  type: 'video',
  category: 'primary',
  order: NAVIGATION_ORDER.videoAnalysis,
  items: [
    {
      id: 'video-analysis-dashboard',
      type: 'video',
      category: 'primary',
      label: 'Dashboard',
      description: 'Video analysis overview',
      icon: Film,
      path: '/video-analysis',
      order: 1,
      badge: BADGES.videos,
    },
    {
      id: 'video-analysis-videos',
      type: 'video',
      category: 'secondary',
      label: 'Videos',
      description: 'All videos library',
      icon: VideoIcon,
      path: '/video-analysis/videos',
      order: 2,
    },
    {
      id: 'video-analysis-ball-clips',
      type: 'video',
      category: 'secondary',
      label: 'Ball Clips',
      description: 'Ball-by-ball clips',
      icon: Scissors,
      path: '/video-analysis/clips',
      order: 3,
    },
    {
      id: 'video-analysis-shot-tagging',
      type: 'video',
      category: 'secondary',
      label: 'Shot Tagging',
      description: 'Tag and analyze shots',
      icon: PlayCircle,
      path: '/video-analysis/tagging',
      order: 4,
    },
    {
      id: 'video-analysis-highlights',
      type: 'video',
      category: 'secondary',
      label: 'Highlights',
      description: 'Create highlight reels',
      icon: PlayCircle,
      path: '/video-analysis/highlights',
      order: 5,
    },
    {
      id: 'video-analysis-ai-highlights',
      type: 'video',
      category: 'secondary',
      label: 'AI Highlights',
      description: 'AI-generated highlight reels',
      icon: Sparkles,
      path: '/video-analysis/ai-highlights',
      order: 6,
    },
  ],
};

/**
 * 9. 🎓 Academy Navigation
 */
export const ACADEMY_GROUP: NavigationGroup = {
  id: 'academy',
  label: 'Academy',
  icon: GraduationCap,
  type: 'academy',
  category: 'primary',
  order: NAVIGATION_ORDER.academy,
  items: [
    {
      id: 'academy-dashboard',
      type: 'academy',
      category: 'primary',
      label: 'Dashboard',
      description: 'Academy overview',
      icon: GraduationCap,
      path: '/academy',
      order: 1,
    },
    {
      id: 'academy-students',
      type: 'academy',
      category: 'secondary',
      label: 'Students',
      description: 'Student management',
      icon: Users,
      path: '/academy/students',
      order: 2,
      badge: BADGES.students,
    },
    {
      id: 'academy-coaches',
      type: 'academy',
      category: 'secondary',
      label: 'Coaches',
      description: 'Academy coaching staff',
      icon: UserCircle,
      path: '/academy/coaches',
      order: 3,
    },
    {
      id: 'academy-parents',
      type: 'academy',
      category: 'secondary',
      label: 'Parents',
      description: 'Parent portal access',
      icon: Users,
      path: '/academy/parents',
      order: 4,
    },
    {
      id: 'academy-curriculum',
      type: 'academy',
      category: 'secondary',
      label: 'Curriculum',
      description: 'Training curriculum',
      icon: BookOpen,
      path: '/academy/curriculum',
      order: 5,
    },
    {
      id: 'academy-reports',
      type: 'academy',
      category: 'secondary',
      label: 'Reports',
      description: 'Academy reports',
      icon: ReportIcon,
      path: '/academy/reports',
      order: 6,
    },
  ],
};

/**
 * 10. 💪 Training Navigation
 */
export const TRAINING_GROUP: NavigationGroup = {
  id: 'training',
  label: 'Training',
  icon: Dumbbell,
  type: 'training',
  category: 'primary',
  order: NAVIGATION_ORDER.training,
  items: [
    {
      id: 'training-dashboard',
      type: 'training',
      category: 'primary',
      label: 'Dashboard',
      description: 'Training overview',
      icon: Dumbbell,
      path: '/training',
      order: 1,
    },
    {
      id: 'training-sessions',
      type: 'training',
      category: 'secondary',
      label: 'Sessions',
      description: 'Training sessions',
      icon: Calendar,
      path: '/training/sessions',
      order: 2,
      badge: BADGES.sessions,
    },
    {
      id: 'training-attendance',
      type: 'training',
      category: 'secondary',
      label: 'Attendance',
      description: 'Session attendance',
      icon: ClipboardCheck,
      path: '/training/attendance',
      order: 3,
    },
    {
      id: 'training-fitness',
      type: 'training',
      category: 'secondary',
      label: 'Fitness',
      description: 'Fitness tracking',
      icon: Activity,
      path: '/training/fitness',
      order: 4,
    },
    {
      id: 'training-performance',
      type: 'training',
      category: 'secondary',
      label: 'Performance',
      description: 'Training performance',
      icon: Target,
      path: '/training/performance',
      order: 5,
    },
  ],
};

/**
 * 11. 💰 Auction Navigation
 */
export const AUCTION_GROUP: NavigationGroup = {
  id: 'auction',
  label: 'Auction',
  icon: Gavel,
  type: 'auction',
  category: 'primary',
  order: NAVIGATION_ORDER.auction,
  items: [
    {
      id: 'auction-room',
      type: 'auction',
      category: 'primary',
      label: 'Auction Room',
      description: 'Live auction management',
      icon: Gavel,
      path: '/auction/room',
      order: 1,
      badge: BADGES.sold,
    },
    {
      id: 'auction-player-pool',
      type: 'auction',
      category: 'secondary',
      label: 'Player Pool',
      description: 'Auction player pool',
      icon: Users,
      path: '/auction/pool',
      order: 2,
    },
    {
      id: 'auction-budgets',
      type: 'auction',
      category: 'secondary',
      label: 'Budgets',
      description: 'Team budgets',
      icon: Wallet,
      path: '/auction/budgets',
      order: 3,
    },
    {
      id: 'auction-sold-players',
      type: 'auction',
      category: 'secondary',
      label: 'Sold Players',
      description: 'Sold players list',
      icon: DollarSign,
      path: '/auction/sold',
      order: 4,
    },
  ],
};

/**
 * 12. ⭐ Fantasy Navigation
 */
export const FANTASY_GROUP: NavigationGroup = {
  id: 'fantasy',
  label: 'Fantasy',
  icon: Gem,
  type: 'fantasy',
  category: 'primary',
  order: NAVIGATION_ORDER.fantasy,
  items: [
    {
      id: 'fantasy-dashboard',
      type: 'fantasy',
      category: 'primary',
      label: 'Dashboard',
      description: 'Fantasy overview',
      icon: Gem,
      path: '/fantasy',
      order: 1,
    },
    {
      id: 'fantasy-leagues',
      type: 'fantasy',
      category: 'secondary',
      label: 'Leagues',
      description: 'Fantasy leagues',
      icon: Trophy,
      path: '/fantasy/leagues',
      order: 2,
    },
    {
      id: 'fantasy-teams',
      type: 'fantasy',
      category: 'secondary',
      label: 'My Teams',
      description: 'Your fantasy teams',
      icon: Users,
      path: '/fantasy/teams',
      order: 3,
    },
    {
      id: 'fantasy-player-pool',
      type: 'fantasy',
      category: 'secondary',
      label: 'Player Pool',
      description: 'Available players',
      icon: User,
      path: '/fantasy/pool',
      order: 4,
    },
    {
      id: 'fantasy-transfers',
      type: 'fantasy',
      category: 'secondary',
      label: 'Transfers',
      description: 'Manage transfers',
      icon: ZapIcon,
      path: '/fantasy/transfers',
      order: 5,
    },
    {
      id: 'fantasy-points',
      type: 'fantasy',
      category: 'secondary',
      label: 'Points',
      description: 'Fantasy points leaderboards',
      icon: TrophyIcon,
      path: '/fantasy/points',
      order: 6,
    },
  ],
};

/**
 *
