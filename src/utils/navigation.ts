/**
 * Navigation Utilities
 * ====================
 * 
 * Utility functions for the enterprise navigation system.
 * Handles favorites, recent items, context management, and storage.
 */

import { nanoid } from 'nanoid';
import {
  getItemWithExpiration,
  setItemWithExpiration,
  removeItemPrefixed,
  savePreference,
  getPreference,
  removePreference,
  clearPreferences,
} from '../shared/utils/storage';
import {
  FavoriteItem,
  RecentItem,
  NavigationItem,
  NavigationGroup,
  BadgeConfig,
  BadgeType,
} from '../types/navigation';

// ──────────────────────────────────────────────────────────────────────────────────────
// STORAGE KEYS
// ──────────────────────────────────────────────────────────────────────────────────────

export const NAV_STORAGE_PREFIX = 'cricketiq/nav';

export const STORAGE_KEYS = {
  // Favorite items
  favorites: `${NAV_STORAGE_PREFIX}/favorites`,
  
  // Recent items
  recent: `${NAV_STORAGE_PREFIX}/recent`,
  
  // Context state
  context: `${NAV_STORAGE_PREFIX}/context`,
  currentOrganization: `${NAV_STORAGE_PREFIX}/currentOrganization`,
  currentTournament: `${NAV_STORAGE_PREFIX}/currentTournament`,
  currentAcademy: `${NAV_STORAGE_PREFIX}/currentAcademy`,
  currentTeam: `${NAV_STORAGE_PREFIX}/currentTeam`,
  
  // Sidebar state
  sidebarCollapsed: `${NAV_STORAGE_PREFIX}/sidebarCollapsed`,
  expandedGroups: `${NAV_STORAGE_PREFIX}/expandedGroups`,
  
  // User preferences
  theme: `${NAV_STORAGE_PREFIX}/theme`,
  darkMode: `${NAV_STORAGE_PREFIX}/darkMode`,
  
  // Search history
  searchHistory: `${NAV_STORAGE_PREFIX}/searchHistory`,
} as const;

// ──────────────────────────────────────────────────────────────────────────────────────
// FAVORITE ITEMS
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Maximum number of favorite items to store
 */
export const MAX_FAVORITES = 20;

/**
 * Get all favorite items
 */
export function getFavorites(): FavoriteItem[] {
  return getItemWithExpiration<FavoriteItem[]>(STORAGE_KEYS.favorites, {
    type: 'localStorage',
  }) || [];
}

/**
 * Add item to favorites
 */
export function addFavorite(item: Partial<FavoriteItem>): FavoriteItem | null {
  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some(f => f.id === item.id)) {
    return null;
  }
  
  const newFavorite: FavoriteItem = {
    id: item.id || nanoid(),
    navigationItemId: item.navigationItemId || '',
    label: item.label || '',
    icon: item.icon || null as any,
    path: item.path || '',
    order: favorites.length,
    createdAt: new Date().toISOString(),
  };
  
  const updated = [...favorites, newFavorite].slice(0, MAX_FAVORITES);
  savePreference(STORAGE_KEYS.favorites, updated);
  
  return newFavorite;
}

/**
 * Remove item from favorites
 */
export function removeFavorite(id: string): void {
  const favorites = getFavorites();
  const updated = favorites.filter(f => f.id !== id);
  
  // Reorder remaining items
  updated.forEach((item, index) => {
    item.order = index;
  });
  
  savePreference(STORAGE_KEYS.favorites, updated);
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  const exists = favorites.some(f => f.id === id);
  
  if (exists) {
    removeFavorite(id);
    return false;
  } else {
    addFavorite({ id });
    return true;
  }
}

/**
 * Check if item is favorited
 */
export function isFavorite(id: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === id);
}

/**
 * Get favorite item by navigation item ID
 */
export function getFavoriteByNavigationItemId(itemId: string): FavoriteItem | null {
  const favorites = getFavorites();
  return favorites.find(f => f.navigationItemId === itemId) || null;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// RECENT ITEMS
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Maximum number of recent items to store
 */
export const MAX_RECENT = 15;

/**
 * Get all recent items
 */
export function getRecentItems(): RecentItem[] {
  return getItemWithExpiration<RecentItem[]>(STORAGE_KEYS.recent, {
    type: 'localStorage',
  }) || [];
}

/**
 * Add item to recent
 */
export function addRecent(item: Partial<RecentItem>): RecentItem {
  const recent = getRecentItems();
  
  // Remove if already exists
  const updated = recent.filter(r => r.path !== item.path);
  
  const newRecent: RecentItem = {
    id: item.id || nanoid(),
    navigationItemId: item.navigationItemId,
    label: item.label || '',
    icon: item.icon || null as any,
    path: item.path || '',
    visitedAt: new Date().toISOString(),
    visitCount: (item.visitCount || 0) + 1,
  };
  
  // Add to beginning and limit
  const result = [newRecent, ...updated].slice(0, MAX_RECENT);
  savePreference(STORAGE_KEYS.recent, result);
  
  return newRecent;
}

/**
 * Remove item from recent
 */
export function removeRecent(path: string): void {
  const recent = getRecentItems();
  const updated = recent.filter(r => r.path !== path);
  savePreference(STORAGE_KEYS.recent, updated);
}

/**
 * Clear recent items
 */
export function clearRecent(): void {
  savePreference(STORAGE_KEYS.recent, []);
}

// ──────────────────────────────────────────────────────────────────────────────────────
// CONTEXT MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Get current context
 */
export function getContext(): {
  organizationId?: string;
  tournamentId?: string;
  academyId?: string;
  teamId?: string;
} {
  return getItemWithExpiration<Record<string, string>>(STORAGE_KEYS.context, {
    type: 'localStorage',
  }) || {};
}

/**
 * Set context
 */
export function setContext(context: {
  organizationId?: string;
  tournamentId?: string;
  academyId?: string;
  teamId?: string;
}): void {
  savePreference(STORAGE_KEYS.context, context);
}

/**
 * Clear context
 */
export function clearContext(): void {
  savePreference(STORAGE_KEYS.context, {});
}

/**
 * Set current organization
 */
export function setCurrentOrganization(id: string): void {
  savePreference(STORAGE_KEYS.currentOrganization, id);
}

/**
 * Get current organization
 */
export function getCurrentOrganization(): string | null {
  return getPreference<string>(STORAGE_KEYS.currentOrganization);
}

/**
 * Set current tournament
 */
export function setCurrentTournament(id: string): void {
  savePreference(STORAGE_KEYS.currentTournament, id);
}

/**
 * Get current tournament
 */
export function getCurrentTournament(): string | null {
  return getPreference<string>(STORAGE_KEYS.currentTournament);
}

/**
 * Set current academy
 */
export function setCurrentAcademy(id: string): void {
  savePreference(STORAGE_KEYS.currentAcademy, id);
}

/**
 * Get current academy
 */
export function getCurrentAcademy(): string | null {
  return getPreference<string>(STORAGE_KEYS.currentAcademy);
}

/**
 * Set current team
 */
export function setCurrentTeam(id: string): void {
  savePreference(STORAGE_KEYS.currentTeam, id);
}

/**
 * Get current team
 */
export function getCurrentTeam(): string | null {
  return getPreference<string>(STORAGE_KEYS.currentTeam);
}

// ──────────────────────────────────────────────────────────────────────────────────────
// SIDEBAR STATE
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Get sidebar collapsed state
 */
export function getSidebarCollapsed(): boolean {
  return getPreference<boolean>(STORAGE_KEYS.sidebarCollapsed) ?? false;
}

/**
 * Set sidebar collapsed state
 */
export function setSidebarCollapsed(collapsed: boolean): void {
  savePreference(STORAGE_KEYS.sidebarCollapsed, collapsed);
}

/**
 * Toggle sidebar
 */
export function toggleSidebar(): boolean {
  const collapsed = getSidebarCollapsed();
  const newValue = !collapsed;
  setSidebarCollapsed(newValue);
  return newValue;
}

/**
 * Get expanded groups
 */
export function getExpandedGroups(): string[] {
  return getPreference<string[]>(STORAGE_KEYS.expandedGroups) || [];
}

/**
 * Set expanded groups
 */
export function setExpandedGroups(groupIds: string[]): void {
  savePreference(STORAGE_KEYS.expandedGroups, groupIds);
}

/**
 * Expand group
 */
export function expandGroup(groupId: string): void {
  const expanded = getExpandedGroups();
  if (!expanded.includes(groupId)) {
    setExpandedGroups([...expanded, groupId]);
  }
}

/**
 * Collapse group
 */
export function collapseGroup(groupId: string): void {
  const expanded = getExpandedGroups();
  setExpandedGroups(expanded.filter(id => id !== groupId));
}

/**
 * Toggle group expansion
 */
export function toggleGroup(groupId: string): boolean {
  const expanded = getExpandedGroups();
  if (expanded.includes(groupId)) {
    collapseGroup(groupId);
    return false;
  } else {
    expandGroup(groupId);
    return true;
  }
}

// ──────────────────────────────────────────────────────────────────────────────────────
// THEME STATE
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Get dark mode state
 */
export function getDarkMode(): boolean {
  return getPreference<boolean>(STORAGE_KEYS.darkMode) ?? false;
}

/**
 * Set dark mode state
 */
export function setDarkMode(enabled: boolean): void {
  savePreference(STORAGE_KEYS.darkMode, enabled);
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode(): boolean {
  const enabled = getDarkMode();
  const newValue = !enabled;
  setDarkMode(newValue);
  return newValue;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// NAVIGATION UTILITIES
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Check if navigation item is visible based on permissions
 */
export function isItemVisible(
  item: NavigationItem,
  userRoles: string[] = [],
  userPermissions: string[] = []
): boolean {
  // Check if hidden by metadata
  if (item.metadata?.hidden) {
    return false;
  }
  
  // Check roles
  if (item.roles && item.roles.length > 0) {
    const hasRole = item.roles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return false;
    }
  }
  
  // Check permissions
  if (item.permissions && item.permissions.length > 0) {
    const hasPermission = item.permissions.some(permission =>
      userPermissions.includes(permission)
    );
    if (!hasPermission) {
      return false;
    }
  }
  
  return true;
}

/**
 * Filter visible navigation groups
 */
export function filterVisibleGroups(
  groups: NavigationGroup[],
  userRoles: string[] = [],
  userPermissions: string[] = []
): NavigationGroup[] {
  return groups
    .map(group => {
      const filteredItems = group.items.filter(item =>
        isItemVisible(item, userRoles, userPermissions)
      );
      
      if (filteredItems.length === 0) {
        return null;
      }
      
      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group): group is NavigationGroup => group !== null);
}

/**
 * Get active path from current location
 */
export function getActivePath(pathname: string): string {
  // Remove trailing slash
  let path = pathname.replace(/\/+$/, '');
  
  // Remove query parameters
  path = path.split('?')[0];
  
  // Remove hash
  path = path.split('#')[0];
  
  return path;
}

/**
 * Generate badge configuration for dynamic count
 */
export function createCountBadge(count: number, color: BadgeConfig['color'] = 'primary'): BadgeConfig {
  return {
    type: 'count',
    value: count,
    color,
  };
}

/**
 * Generate status badge
 */
export function createStatusBadge(
  status: string,
  color: BadgeConfig['color'] = 'primary'
): BadgeConfig {
  return {
    type: 'status',
    value: status,
    color,
  };
}

/**
 * Check if path matches navigation item path pattern
 */
export function matchesPath(path: string, pattern?: string): boolean {
  if (!pattern) return false;
  
  // Exact match
  if (path === pattern) return true;
  
  // Prefix match for nested routes
  if (pattern.endsWith('/')) {
    return path.startsWith(pattern);
  }
  
  return path.startsWith(pattern + '/');
}

// ──────────────────────────────────────────────────────────────────────────────────────
// SEARCH HISTORY
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Maximum search history items
 */
export const MAX_SEARCH_HISTORY = 10;

/**
 * Get search history
 */
export function getSearchHistory(): string[] {
  return getItemWithExpiration<string[]>(STORAGE_KEYS.searchHistory, {
    type: 'localStorage',
  }) || [];
}

/**
 * Add to search history
 */
export function addToSearchHistory(query: string): void {
  const history = getSearchHistory();
  
  // Remove if already exists
  const updated = history.filter(h => h.toLowerCase() !== query.toLowerCase());
  
  // Add to beginning and limit
  const result = [query, ...updated].slice(0, MAX_SEARCH_HISTORY);
  savePreference(STORAGE_KEYS.searchHistory, result);
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  savePreference(STORAGE_KEYS.searchHistory, []);
}

// ──────────────────────────────────────────────────────────────────────────────────────
// CLEANUP UTILITIES
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Clear all navigation storage
 */
export function clearAllNavigationStorage(): void {
  removeItemPrefixed('favorites');
  removeItemPrefixed('recent');
  removeItemPrefixed('context');
  removeItemPrefixed('currentOrganization');
  removeItemPrefixed('currentTournament');
  removeItemPrefixed('currentAcademy');
  removeItemPrefixed('currentTeam');
  removeItemPrefixed('sidebarCollapsed');
  removeItemPrefixed('expandedGroups');
  removeItemPrefixed('theme');
  removeItemPrefixed('darkMode');
  removeItemPrefixed('searchHistory');
}

/**
 * Reset user preferences (keep auth)
 */
export function resetUserPreferences(): void {
  clearPreferences();
}