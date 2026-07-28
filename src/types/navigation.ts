/**
 * Enterprise Navigation System Types
 * ===================================
 * 
 * Type definitions for the CricketIQ navigation system.
 * Supports 250+ pages with intelligent organization.
 */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────────────
// NAVIGATION TYPES
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Navigation item types for enterprise navigation
 */
export type NavigationType = 
  | 'dashboard'           // Home/dashboard pages
  | 'competition'         // Tournaments, seasons, fixtures
  | 'team'                // Team management
  | 'player'              // Player profiles and stats
  | 'match'               // Match center and scoring
  | 'analytics'           // Analytics and insights
  | 'ai'                  // AI features
  | 'video'               // Video analysis
  | 'academy'             // Academy management
  | 'training'            // Training and sessions
  | 'auction'             // Auction management
  | 'fantasy'             // Fantasy cricket
  | 'streaming'           // Live streaming
  | 'sponsorship'         // Sponsorship management
  | 'monetization'        // Billing and revenue
  | 'reports'             // Reports and exports
  | 'administration'      // Admin and settings
  | 'utility'             // Help, settings, logout
  | 'favorite'            // Favorite pages
  | 'recent'              // Recently visited pages
  | 'context'             // Context-aware navigation
  | 'quick-action'        // Quick create actions
  | 'notification'        // Notifications
  | 'search'              // Search results
  | 'command'             // Command palette actions;

/**
 * Navigation group category
 */
export type NavigationCategory = 
  | 'primary'         // Main navigation
  | 'secondary'       // Sub-items
  | 'tertiary'        // Deep nested items
  | 'contextual'      // Context-aware items
  | 'utility'         // Help, settings, logout
  | 'system'          // System actions;

/**
 * Badge types for navigation items
 */
export type BadgeType = 
  | 'count'           // Numeric count (e.g., 3)
  | 'status'          // Status indicator (e.g., 'New', 'Updated')
  | 'priority'        // Priority level (e.g., 'High', 'Urgent')
  | 'color'           // Color-coded badge (e.g., 'primary', 'success', 'warning');

/**
 * Badge configuration
 */
export interface BadgeConfig {
  type: BadgeType;
  value: string | number;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  pulse?: boolean;
  animate?: boolean;
}

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  id: string;
  type: NavigationType;
  category: NavigationCategory;
  label: string;
  description?: string;
  icon: LucideIcon;
  path?: string;
  pathPattern?: string; // For dynamic routes (e.g., '/players/:id')
  
  // Navigation behavior
  active?: boolean;
  expanded?: boolean;
  order: number;
  
  // Features
  badge?: BadgeConfig;
  isFavorite?: boolean;
  isPinned?: boolean;
  isRecent?: boolean;
  hotkey?: string; // Keyboard shortcut (e.g., 'Ctrl+K', 'Cmd+T')
  
  // Nested structure
  children?: NavigationItem[];
  parent?: string;
  
  // Permissions
  roles?: string[];
  permissions?: string[];
  featureFlag?: string;
  
  // Context
  context?: 'global' | 'tournament' | 'player' | 'team' | 'match';
  contextId?: string;
  
  // Metadata
  metadata?: {
    hidden?: boolean;
    deprecated?: boolean;
    experimental?: boolean;
    beta?: boolean;
    new?: boolean;
  };
}

/**
 * Navigation group
 */
export interface NavigationGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  type: NavigationType;
  category: NavigationCategory;
  order: number;
  
  // Behavior
  collapsible?: boolean;
  collapsed?: boolean;
  expanded?: boolean;
  
  // Items
  items: NavigationItem[];
  
  // Badge
  badge?: BadgeConfig;
  
  // Permissions
  roles?: string[];
  permissions?: string[];
}

/**
 * Context-aware navigation configuration
 */
export interface ContextNavigation {
  context: 'tournament' | 'player' | 'team' | 'match';
  contextId: string;
  navigation: NavigationItem[];
}

/**
 * Quick action item
 */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  category: string;
  order: number;
  hotkey?: string;
}

/**
 * Command palette action
 */
export interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  path?: string;
  action?: () => void;
  category: string;
  hotkey?: string;
  isDefault?: boolean;
}

/**
 * Search result item
 */
export interface SearchResult {
  id: string;
  type: 'player' | 'team' | 'tournament' | 'match' | 'venue' | 'report' | 'video';
  title: string;
  subtitle?: string;
  path: string;
  score?: number; // Relevance score for fuzzy search
  icon: LucideIcon;
}

/**
 * Sidebar state
 */
export interface SidebarState {
  collapsed: boolean;
  expandedGroups: string[];
  favoriteItems: string[];
  recentItems: string[];
  darkMode: boolean;
  width: number;
  visible: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  id: string;
  label: string;
  path?: string;
  icon?: LucideIcon;
  isLast?: boolean;
  active?: boolean;
}

/**
 * Top navigation items
 */
export interface TopNavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  dropdown?: TopNavItem[];
  badge?: BadgeConfig;
  active?: boolean;
  type: 'link' | 'dropdown' | 'button' | 'search' | 'notification' | 'profile' | 'switcher';
}

// ──────────────────────────────────────────────────────────────────────────────────────
// CONTEXT SWITCHER TYPES
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Organization switcher item
 */
export interface Organization {
  id: string;
  name: string;
  logo?: string;
  slug: string;
  current?: boolean;
  role?: string;
  permissions?: string[];
}

/**
 * Tournament switcher item
 */
export interface Tournament {
  id: string;
  name: string;
  slug: string;
  current?: boolean;
  season?: string;
  startDate?: string;
  endDate?: string;
  status?: 'upcoming' | 'live' | 'completed' | 'cancelled';
  format?: 'T20' | 'ODI' | 'Test' | 'First-Class';
}

/**
 * Academy switcher item
 */
export interface Academy {
  id: string;
  name: string;
  slug: string;
  current?: boolean;
  address?: string;
  phone?: string;
  email?: string;
}

/**
 * Team switcher item
 */
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  current?: boolean;
  tournamentId?: string;
}

/**
 * Context switcher configuration
 */
export interface ContextSwitcherConfig {
  organizations: Organization[];
  tournaments: Tournament[];
  academies: Academy[];
  teams: Team[];
  currentOrganization?: Organization;
  currentTournament?: Tournament;
  currentAcademy?: Academy;
  currentTeam?: Team;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// FAVORITE & RECENT SYSTEM
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Favorite item
 */
export interface FavoriteItem {
  id: string;
  navigationItemId: string;
  label: string;
  icon: LucideIcon;
  path: string;
  order: number;
  createdAt: string;
}

/**
 * Recent item
 */
export interface RecentItem {
  id: string;
  navigationItemId?: string;
  label: string;
  icon?: LucideIcon;
  path: string;
  visitedAt: string;
  visitCount: number;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// RESPONSIVE CONFIGURATION
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Responsive breakpoint
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Responsive navigation configuration
 */
export interface ResponsiveConfig {
  mobile: {
    sidebarWidth: number;
    collapsedWidth: number;
    useDrawer: boolean;
    drawerPosition: 'left' | 'right' | 'top';
    swipeThreshold: number;
  };
  tablet: {
    sidebarWidth: number;
    collapsedWidth: number;
    useDrawer: boolean;
  };
  desktop: {
    sidebarWidth: number;
    collapsedWidth: number;
    useDrawer: boolean;
  };
}

// ──────────────────────────────────────────────────────────────────────────────────────
// ANIMATION CONFIGURATION
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Animation presets
 */
export type AnimationPreset = 
  | 'fade-in' 
  | 'fade-in-up' 
  | 'fade-in-down' 
  | 'slide-in-left' 
  | 'slide-in-right' 
  | 'scale-up' 
  | 'scale-down' 
  | 'float' 
  | 'bounce' 
  | 'pulse';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  preset: AnimationPreset;
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  iterations?: number;
}

/**
 * Hover effect
 */
export type HoverEffect = 
  | 'none' 
  | 'scale' 
  | 'translate' 
  | 'shadow' 
  | 'glow' 
  | 'pulse' 
  | 'bounce' 
  | 'rotate';

// ──────────────────────────────────────────────────────────────────────────────────────
// KEYBOARD SHORTCUT
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Keyboard shortcut
 */
export interface KeyboardShortcut {
  key: string;
  modifiers: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  description: string;
  action: () => void;
  global?: boolean;
}

/**
 * Command palette item
 */
export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  keywords: string[];
  action: () => void;
  category: string;
  hotkey?: KeyboardShortcut;
  order: number;
  isDefault?: boolean;
}

/**
 * Navigation context provider
 */
export interface NavigationContext {
  // State
  collapsed: boolean;
  darkMode: boolean;
  expandedGroups: string[];
  favoriteItems: string[];
  recentItems: string[];
  context: string;
  
  // Actions
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  toggleFavorite: (itemId: string) => void;
  addToRecent: (itemId: string, label: string, path: string, icon?: LucideIcon) => void;
  setContext: (context: string) => void;
  navigate: (path: string) => void;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// PERMISSION & ROLE TYPES
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * User role
 */
export type UserRole = 
  | 'super-admin'       // Full system access
  | 'admin'            // Admin access
  | 'tournament-manager' // Tournament management
  | 'team-manager'     // Team management
  | 'coach'            // Coaching access
  | 'player'           // Player access
  | 'analyst'          // Analytics access
  | 'scout'            // Scouting access
  | 'academy-admin'    // Academy management
  | 'academy-coach'    // Academy coaching
  | 'academy-student'  // Academy student
  | 'fan'              // Public fan access
  | 'guest'            // Limited guest access
  | 'sponsor'          // Sponsor access
  | 'viewer'           // Read-only access
  | 'editor'           // Edit access
  | 'publisher'        // Publish access
  | 'moderator'        // Moderation access;

/**
 * Permission
 */
export type Permission = 
  | 'read'             // Read data
  | 'write'            // Write data
  | 'create'           // Create new items
  | 'update'           // Update existing items
  | 'delete'           // Delete items
  | 'admin'            // Administrative access
  | 'manage_users'     // User management
  | 'manage_roles'     // Role management
  | 'manage_permissions' // Permission management
  | 'manage_settings'  // Settings management
  | 'manage_content'   // Content management
  | 'manage_media'     // Media management
  | 'manage_analytics' // Analytics management
  | 'manage_auction'   // Auction management
  | 'manage_fantasy'   // Fantasy management
  | 'manage_streaming' // Streaming management
  | 'manage_sponsorship' // Sponsorship management
  | 'manage_monetization' // Monetization management
  | 'manage_reports'   // Report management
  | 'export_data'      // Data export
  | 'import_data'      // Data import
  | 'manage_venues'    // Venue management
  | 'manage_officials' // Officials management
  | 'manage_matches'   // Match management
  | 'manage_players'   // Player management
  | 'manage_teams'     // Team management
  | 'manage_tournaments' // Tournament management
  | 'manage_academies' // Academy management
  | 'manage_training'  // Training management
  | 'manage_auctions'  // Auction management
  | 'manage_fantasy_leagues' // Fantasy league management
  | 'manage_streaming_channels' // Streaming channel management
  | 'manage_sponsorships' // Sponsorship management
  | 'manage_billing'   // Billing management
  | 'manage_reports_export' // Report export management;

/**
 * Role-based navigation configuration
 */
export interface RoleNavigationConfig {
  role: UserRole;
  visible: boolean;
  order?: number;
  permissions?: Permission[];
}

/**
 * Permission-based visibility
 */
export interface PermissionVisibility {
  requiredPermissions: Permission[];
  operator?: 'and' | 'or';
  hiddenIf?: 'missing' | 'present';
}

// ──────────────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  skipToContentId: string;
  focusTrapEnabled: boolean;
  keyboardNavigationEnabled: boolean;
  ariaLabelledBy: string;
  ariaDescribedBy?: string;
  role: string;
  tabIndex?: number;
}

/**
 * ARIA labels for navigation
 */
export interface AriaLabels {
  sidebar: string;
  navigation: string;
  group: (groupName: string) => string;
  item: (itemName: string) => string;
  button: (buttonName: string) => string;
  dropdown: (dropdownName: string) => string;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// PERFORMANCE OPTIMIZATION
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Virtualization configuration
 */
export interface VirtualizationConfig {
  enabled: boolean;
  itemSize: number;
  overscanCount: number;
  bufferSize: number;
}

/**
 * Lazy loading configuration
 */
export interface LazyLoadingConfig {
  enabled: boolean;
  threshold: number;
  delay: number;
  placeholder?: ReactNode;
}

/**
 * Memoization configuration
 */
export interface MemoizationConfig {
  enabled: boolean;
  maxCacheSize: number;
  ttl: number; // Time to live in milliseconds
}