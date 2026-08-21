/**
 * CricketIQ — Navigation Configuration
 * ============================================
 * Section-based primary navigation (StudioHub pattern).
 * Sections: HOME, COMPETITION, PARTICIPANTS, DEVELOPMENT, FACILITIES,
 * MEDIA, INTELLIGENCE, COMMERCIAL, PLATFORM.
 *
 * Navigation is organization-aware AND permission-aware. Each item may
 * declare an optional `permission` (resource + action). Items without a
 * permission are visible to all authenticated users. Use
 * `useFilteredNavigation()` to obtain the sections filtered by the current
 * user's permissions in the active organization.
 */
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserRound,
  Shield,
  Dumbbell,
  Camera,
  BrainCircuit,
  BarChart3,
  Building2,
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
      { label: 'Competitions', href: '/competitions', icon: Trophy, permission: { resource: 'competition', action: 'read' } },
      { label: 'Matches', href: '/matches', icon: Shield, permission: { resource: 'match', action: 'read' } },
    ],
  },
  {
    label: 'Participants',
    items: [
      { label: 'Teams', href: '/teams', icon: Users, permission: { resource: 'team', action: 'read' } },
      { label: 'Players', href: '/players', icon: UserRound, permission: { resource: 'player', action: 'read' } },
    ],
  },
  {
    label: 'Development',
    items: [{ label: 'Training', href: '/training', icon: Dumbbell, permission: { resource: 'training', action: 'read' } }],
  },
  {
    label: 'Facilities',
    items: [{ label: 'Venues', href: '/venues', icon: Building2, permission: { resource: 'facility', action: 'read' } }],
  },
  {
    label: 'Media',
    items: [{ label: 'Media', href: '/media', icon: Camera, permission: { resource: 'media', action: 'read' } }],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart3, permission: { resource: 'analytics', action: 'read' } },
      { label: 'Insights', href: '/insights', icon: BrainCircuit, permission: { resource: 'insights', action: 'read' } },
    ],
  },
  {
    label: 'Commercial',
    items: [{ label: 'Organizations', href: '/organizations', icon: Building2, permission: { resource: 'organization', action: 'read' } }],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings, permission: { resource: 'settings', action: 'read' } },
      { label: 'Help', href: '/help', icon: HelpCircle },
    ],
  },
];

/** Flattened list for command palette / search indexing. */
export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
