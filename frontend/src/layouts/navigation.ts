/**
 * CricketOS — Navigation Configuration
 * ============================================
 * Section-based primary navigation (StudioHub pattern).
 * Sections: HOME, COMPETITION, PARTICIPANTS, DEVELOPMENT, FACILITIES,
 * MEDIA, INTELLIGENCE, COMMERCIAL, FAN, PLATFORM.
 *
 * Navigation is organization-aware AND permission-aware. Each item may
 * declare an optional `permission` (resource + action). Items without a
 * permission are visible to all authenticated users. Use
 * `useFilteredNavigation()` to obtain the sections filtered by the current
 * user's permissions in the active organization.
 *
 * Permission resources map to the closest domain resource the platform
 * currently grants (see `src/mocks/handlers.ts`), so items remain visible
 * to owners/admins while still being filterable for restricted roles.
 */
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Trophy,
  Award,
  CalendarRange,
  CalendarDays,
  Shield,
  ClipboardList,
  Gavel,
  Users,
  UserRound,
  UsersRound,
  GraduationCap,
  Briefcase,
  UserCheck,
  School,
  Dumbbell,
  HeartPulse,
  Stethoscope,
  Activity,
  Binoculars,
  MapPin,
  Building2,
  Package,
  Boxes,
  Cpu,
  Wrench,
  Camera,
  Video,
  Radio,
  Images,
  FileText,
  BarChart3,
  LineChart,
  FileBarChart,
  BrainCircuit,
  Search,
  CreditCard,
  Handshake,
  Ticket,
  Store,
  ShoppingBag,
  Receipt,
  Wallet,
  Gamepad2,
  Gift,
  Heart,
  Megaphone,
  Bell,
  Workflow,
  Plug,
  FolderOpen,
  Calendar,
  CalendarCheck,
  Palette,
  Settings,
  HelpCircle,
} from 'lucide-react';
import type { PermissionAction } from '@domain/index';

export interface NavPermission {
  resource: string;
  action: PermissionAction;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional badge text (e.g. count) */
  badge?: string;
  /** Optional permission required to view this item. */
  permission?: NavPermission;
}

export interface NavSection {
  /** Uppercase mono section label */
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Home',
    items: [{ label: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Competition',
    items: [
      { label: 'Tournaments', href: '/tournaments', icon: Trophy, permission: { resource: 'competition', action: 'read' } },
      { label: 'Leagues', href: '/leagues', icon: Award, permission: { resource: 'competition', action: 'read' } },
      { label: 'Seasons', href: '/seasons', icon: CalendarRange, permission: { resource: 'competition', action: 'read' } },
      { label: 'Fixtures', href: '/fixtures', icon: CalendarDays, permission: { resource: 'match', action: 'read' } },
      { label: 'Matches', href: '/matches', icon: Shield, permission: { resource: 'match', action: 'read' } },
      { label: 'Scoring', href: '/scoring', icon: ClipboardList, permission: { resource: 'match', action: 'read' } },
      { label: 'Officials', href: '/officials', icon: Gavel, permission: { resource: 'match', action: 'read' } },
    ],
  },
  {
    label: 'Participants',
    items: [
      { label: 'Players', href: '/players', icon: UserRound, permission: { resource: 'player', action: 'read' } },
      { label: 'Teams', href: '/teams', icon: Users, permission: { resource: 'team', action: 'read' } },
      { label: 'Squads', href: '/squads', icon: UsersRound, permission: { resource: 'team', action: 'read' } },
      { label: 'Coaches', href: '/coaches', icon: GraduationCap, permission: { resource: 'team', action: 'read' } },
      { label: 'Staff', href: '/staff', icon: Briefcase, permission: { resource: 'team', action: 'read' } },
      { label: 'Selectors', href: '/selectors', icon: UserCheck, permission: { resource: 'team', action: 'read' } },
    ],
  },
  {
    label: 'Development',
    items: [
      { label: 'Academy', href: '/academy', icon: School, permission: { resource: 'training', action: 'read' } },
      { label: 'Training', href: '/training', icon: Dumbbell, permission: { resource: 'training', action: 'read' } },
      { label: 'Fitness', href: '/fitness', icon: HeartPulse, permission: { resource: 'training', action: 'read' } },
      { label: 'Medical', href: '/medical', icon: Stethoscope, permission: { resource: 'training', action: 'read' } },
      { label: 'Performance', href: '/performance', icon: Activity, permission: { resource: 'training', action: 'read' } },
      { label: 'Scouting', href: '/scouting', icon: Binoculars, permission: { resource: 'training', action: 'read' } },
    ],
  },
  {
    label: 'Facilities',
    items: [
      { label: 'Grounds', href: '/grounds', icon: MapPin, permission: { resource: 'facility', action: 'read' } },
      { label: 'Facilities', href: '/facilities', icon: Building2, permission: { resource: 'facility', action: 'read' } },
      { label: 'Equipment', href: '/equipment', icon: Package, permission: { resource: 'facility', action: 'read' } },
      { label: 'Inventory', href: '/inventory', icon: Boxes, permission: { resource: 'facility', action: 'read' } },
      { label: 'Devices', href: '/devices', icon: Cpu, permission: { resource: 'facility', action: 'read' } },
      { label: 'Maintenance', href: '/maintenance', icon: Wrench, permission: { resource: 'facility', action: 'read' } },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Media', href: '/media', icon: Camera, permission: { resource: 'media', action: 'read' } },
      { label: 'Video', href: '/video', icon: Video, permission: { resource: 'media', action: 'read' } },
      { label: 'Streaming', href: '/streaming', icon: Radio, permission: { resource: 'media', action: 'read' } },
      { label: 'Gallery', href: '/gallery', icon: Images, permission: { resource: 'media', action: 'read' } },
      { label: 'CMS', href: '/cms', icon: FileText, permission: { resource: 'media', action: 'read' } },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Statistics', href: '/statistics', icon: BarChart3, permission: { resource: 'analytics', action: 'read' } },
      { label: 'Analytics', href: '/analytics', icon: LineChart, permission: { resource: 'analytics', action: 'read' } },
      { label: 'Reports', href: '/reports', icon: FileBarChart, permission: { resource: 'analytics', action: 'read' } },
      { label: 'AI', href: '/ai', icon: BrainCircuit, permission: { resource: 'insights', action: 'read' } },
      { label: 'Search', href: '/search', icon: Search, permission: { resource: 'insights', action: 'read' } },
    ],
  },
  {
    label: 'Commercial',
    items: [
      { label: 'Membership', href: '/membership', icon: CreditCard, permission: { resource: 'organization', action: 'read' } },
      { label: 'Sponsorship', href: '/sponsorship', icon: Handshake, permission: { resource: 'organization', action: 'read' } },
      { label: 'Ticketing', href: '/ticketing', icon: Ticket, permission: { resource: 'organization', action: 'read' } },
      { label: 'Marketplace', href: '/marketplace', icon: Store, permission: { resource: 'organization', action: 'read' } },
      { label: 'Merchandise', href: '/merchandise', icon: ShoppingBag, permission: { resource: 'organization', action: 'read' } },
      { label: 'Billing', href: '/billing', icon: Receipt, permission: { resource: 'organization', action: 'read' } },
      { label: 'Finance', href: '/finance', icon: Wallet, permission: { resource: 'organization', action: 'read' } },
    ],
  },
  {
    label: 'Fan',
    items: [
      { label: 'Fantasy', href: '/fantasy', icon: Gamepad2, permission: { resource: 'organization', action: 'read' } },
      { label: 'Rewards', href: '/rewards', icon: Gift, permission: { resource: 'organization', action: 'read' } },
      { label: 'Loyalty', href: '/loyalty', icon: Heart, permission: { resource: 'organization', action: 'read' } },
      { label: 'Community', href: '/community', icon: Users, permission: { resource: 'organization', action: 'read' } },
      { label: 'Engagement', href: '/engagement', icon: Megaphone, permission: { resource: 'organization', action: 'read' } },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Notifications', href: '/notifications', icon: Bell, permission: { resource: 'settings', action: 'read' } },
      { label: 'Workflow', href: '/workflow', icon: Workflow, permission: { resource: 'settings', action: 'read' } },
      { label: 'Integrations', href: '/integrations', icon: Plug, permission: { resource: 'settings', action: 'read' } },
      { label: 'Documents', href: '/documents', icon: FolderOpen, permission: { resource: 'settings', action: 'read' } },
      { label: 'Calendar', href: '/calendar', icon: Calendar, permission: { resource: 'settings', action: 'read' } },
      { label: 'Events', href: '/events', icon: CalendarCheck, permission: { resource: 'settings', action: 'read' } },
      { label: 'Whitelabel', href: '/whitelabel', icon: Palette, permission: { resource: 'settings', action: 'read' } },
      { label: 'Settings', href: '/settings', icon: Settings, permission: { resource: 'settings', action: 'read' } },
      { label: 'Help', href: '/help', icon: HelpCircle },
    ],
  },
];

/** Flattened list for command palette / search indexing. */
export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
