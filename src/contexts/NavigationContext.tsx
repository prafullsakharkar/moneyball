/**
 * Navigation Context
 * ==================
 * 
 * React context for managing enterprise navigation state.
 * Provides centralized navigation management with favorites,
 * recent items, context switching, and more.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

import {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  isFavorite,
  getRecentItems,
  addRecent,
  removeRecent,
  clearRecent,
  getContext,
  setContext,
  clearContext,
  setCurrentOrganization,
  getCurrentOrganization,
  setCurrentTournament,
  getCurrentTournament,
  setCurrentAcademy,
  getCurrentAcademy,
  setCurrentTeam,
  getCurrentTeam,
  getSidebarCollapsed,
  setSidebarCollapsed,
  toggleSidebar,
  getExpandedGroups,
  expandGroup,
  collapseGroup,
  toggleGroup,
  getDarkMode,
  setDarkMode,
  toggleDarkMode,
  getActivePath,
  filterVisibleGroups,
} from '../utils/navigation';
import { NavigationItem, NavigationGroup } from '../types/navigation';
import { DASHBOARD_GROUP, COMPETITIONS_GROUP, TEAMS_GROUP, PLAYERS_GROUP, MATCH_CENTER_GROUP, ANALYTICS_GROUP, AI_CENTER_GROUP, VIDEO_ANALYSIS_GROUP, ACADEMY_GROUP, TRAINING_GROUP, AUCTION_GROUP, FANTASY_GROUP, SPONSORSHIP_GROUP, MONETIZATION_GROUP, REPORTS_GROUP, ADMINISTRATION_GROUP, UTILITY_ITEMS } from '../constants/navigation';

// ──────────────────────────────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────────────────────────────

interface NavigationContextType {
  // State
  collapsed: boolean;
  darkMode: boolean;
  expandedGroups: string[];
  favoriteItems: string[];
  recentItems: any[];
  currentContext: {
    organizationId?: string;
    tournamentId?: string;
    academyId?: string;
    teamId?: string;
  };
  
  // Actions
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  toggleFavorite: (itemId: string) => boolean;
  isFavorite: (itemId: string) => boolean;
  addToRecent: (itemId: string, label: string, path: string, icon?: LucideIcon) => void;
  setContext: (context: {
    organizationId?: string;
    tournamentId?: string;
    academyId?: string;
    teamId?: string;
  }) => void;
  clearContext: () => void;
  setCurrentOrganization: (id: string) => void;
  setCurrentTournament: (id: string) => void;
  setCurrentAcademy: (id: string) => void;
  setCurrentTeam: (id: string) => void;
  navigate: (path: string) => void;
  clearRecent: () => void;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ──────────────────────────────────────────────────────────────────────────────────────

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [collapsed, setCollapsed] = useState<boolean>(getSidebarCollapsed());
  const [darkMode, setDarkModeState] = useState<boolean>(getDarkMode());
  const [expandedGroups, setExpandedGroups] = useState<string[]>(getExpandedGroups());
  const [favoriteItems, setFavoriteItems] = useState<string[]>(getFavorites().map(f => f.id));
  const [recentItems, setRecentItems] = useState<any[]>(getRecentItems());
  const [currentContext, setCurrentContextState] = useState(getContext());
  
  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Update favorites from storage
  useEffect(() => {
    const favorites = getFavorites();
    setFavoriteItems(favorites.map(f => f.id));
  }, []);
  
  // Update recent items from storage
  useEffect(() => {
    const recent = getRecentItems();
    setRecentItems(recent);
  }, []);
  
  // Update expanded groups from storage
  useEffect(() => {
    const groups = getExpandedGroups();
    setExpandedGroups(groups);
  }, []);
  
  // Update context from storage
  useEffect(() => {
    const context = getContext();
    setCurrentContextState(context);
  }, []);
  
  // Add current page to recent items on navigation
  useEffect(() => {
    const path = getActivePath(location.pathname);
    
    // Skip certain paths
    if (path === '/dashboard' || path === '/dashboard/analytics') {
      return;
    }
    
    addRecent({
      path,
      label: '', // Will be populated by components
      icon: null as any,
    });
    
    const recent = getRecentItems();
    setRecentItems(recent);
  }, [location.pathname]);
  
  // Actions
  const handleToggleSidebar = useCallback(() => {
    const newValue = toggleSidebar();
    setCollapsed(newValue);
  }, []);
  
  const handleSetCollapsed = useCallback((value: boolean) => {
    setCollapsed(value);
    setSidebarCollapsed(value);
  }, []);
  
  const handleToggleTheme = useCallback(() => {
    const newValue = toggleDarkMode();
    setDarkModeState(newValue);
  }, []);
  
  const handleSetDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
    setDarkMode(value);
  }, []);
  
  const handleToggleGroup = useCallback((groupId: string) => {
    const newValue = toggleGroup(groupId);
    setExpandedGroups(prev => {
      if (newValue) {
        return [...prev, groupId];
      } else {
        return prev.filter(id => id !== groupId);
      }
    });
  }, []);
  
  const handleExpandGroup = useCallback((groupId: string) => {
    expandGroup(groupId);
    setExpandedGroups(prev => [...prev, groupId]);
  }, []);
  
  const handleCollapseGroup = useCallback((groupId: string) => {
    collapseGroup(groupId);
    setExpandedGroups(prev => prev.filter(id => id !== groupId));
  }, []);
  
  const handleToggleFavorite = useCallback((itemId: string) => {
    const newValue = toggleFavorite(itemId);
    setFavoriteItems(prev => {
      if (newValue) {
        return [...prev, itemId];
      } else {
        return prev.filter(id => id !== itemId);
      }
    });
    return newValue;
  }, []);
  
  const handleIsFavorite = useCallback((itemId: string) => {
    return isFavorite(itemId);
  }, []);
  
  const handleAddToRecent = useCallback((itemId: string, label: string, path: string, icon?: LucideIcon) => {
    addRecent({ navigationItemId: itemId, label, path, icon });
    const recent = getRecentItems();
    setRecentItems(recent);
  }, []);
  
  const handleSetContext = useCallback((context: NavigationContextType['currentContext']) => {
    setContext(context);
    setCurrentContextState(context);
  }, []);
  
  const handleClearContext = useCallback(() => {
    clearContext();
    setCurrentContextState({});
  }, []);
  
  const handleSetCurrentOrganization = useCallback((id: string) => {
    setCurrentOrganization(id);
  }, []);
  
  const handleSetCurrentTournament = useCallback((id: string) => {
    setCurrentTournament(id);
  }, []);
  
  const handleSetCurrentAcademy = useCallback((id: string) => {
    setCurrentAcademy(id);
  }, []);
  
  const handleSetCurrentTeam = useCallback((id: string) => {
    setCurrentTeam(id);
  }, []);
  
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    addRecent({
      path,
      label: '', // Will be populated by components
      icon: null as any,
    });
    
    const recent = getRecentItems();
    setRecentItems(recent);
  }, [navigate]);
  
  const handleClearRecent = useCallback(() => {
    clearRecent();
    setRecentItems([]);
  }, []);
  
  // Value
  const value = useMemo<NavigationContextType>(() => ({
    collapsed,
    darkMode,
    expandedGroups,
    favoriteItems,
    recentItems,
    currentContext,
    
    toggleSidebar: handleToggleSidebar,
    setCollapsed: handleSetCollapsed,
    toggleTheme: handleToggleTheme,
    setDarkMode: handleSetDarkMode,
    toggleGroup: handleToggleGroup,
    expandGroup: handleExpandGroup,
    collapseGroup: handleCollapseGroup,
    toggleFavorite: handleToggleFavorite,
    isFavorite: handleIsFavorite,
    addToRecent: handleAddToRecent,
    setContext: handleSetContext,
    clearContext: handleClearContext,
    setCurrentOrganization: handleSetCurrentOrganization,
    setCurrentTournament: handleSetCurrentTournament,
    setCurrentAcademy: handleSetCurrentAcademy,
    setCurrentTeam: handleSetCurrentTeam,
    navigate: handleNavigate,
    clearRecent: handleClearRecent,
  }), [
    collapsed,
    darkMode,
    expandedGroups,
    favoriteItems,
    recentItems,
    currentContext,
    handleToggleSidebar,
    handleSetCollapsed,
    handleToggleTheme,
    handleSetDarkMode,
    handleToggleGroup,
    handleExpandGroup,
    handleCollapseGroup,
    handleToggleFavorite,
    handleIsFavorite,
    handleAddToRecent,
    handleSetContext,
    handleClearContext,
    handleSetCurrentOrganization,
    handleSetCurrentTournament,
    handleSetCurrentAcademy,
    handleSetCurrentTeam,
    handleNavigate,
    handleClearRecent,
  ]);
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// ──────────────────────────────────────────────────────────────────────────────────────
// HOOKS
// ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Hook to get visible navigation groups based on user roles
 */
export function useVisibleNavigationGroups(userRoles: string[] = []) {
  const { darkMode, expandedGroups, toggleGroup, toggleFavorite, isFavorite, navigate, addToRecent } = useNavigation();
  
  const allGroups = useMemo<NavigationGroup[]>(() => [
    DASHBOARD_GROUP,
    COMPETITIONS_GROUP,
    TEAMS_GROUP,
    PLAYERS_GROUP,
    MATCH_CENTER_GROUP,
    ANALYTICS_GROUP,
    AI_CENTER_GROUP,
    VIDEO_ANALYSIS_GROUP,
    ACADEMY_GROUP,
    TRAINING_GROUP,
    AUCTION_GROUP,
    FANTASY_GROUP,
    SPONSORSHIP_GROUP,
    MONETIZATION_GROUP,
    REPORTS_GROUP,
    ADMINISTRATION_GROUP,
  ], []);
  
  const visibleGroups = useMemo(() => {
    return filterVisibleGroups(allGroups, userRoles);
  }, [allGroups, userRoles]);
  
  return {
    visibleGroups,
    darkMode,
    expandedGroups,
    toggleGroup,
    toggleFavorite,
    isFavorite,
    navigate,
    addToRecent,
  };
}

/**
 * Hook to get quick actions
 */
export function useQuickActions() {
  const { navigate } = useNavigation();
  
  const quickActions = useMemo(() => [
    {
      id: 'create-tournament',
      label: 'Create Tournament',
      description: 'Create a new cricket tournament',
      icon: null as any,
      action: () => navigate('/tournaments/new'),
      category: 'competitions',
      order: 1,
    },
    {
      id: 'create-team',
      label: 'Create Team',
      description: 'Create a new cricket team',
      icon: null as any,
      action: () => navigate('/teams/new'),
      category: 'teams',
      order: 2,
    },
    {
      id: 'create-match',
      label: 'Create Match',
      description: 'Create a new match',
      icon: null as any,
      action: () => navigate('/matches/new'),
      category: 'matches',
      order: 3,
    },
    {
      id: 'create-player',
      label: 'Create Player',
      description: 'Register a new player',
      icon: null as any,
      action: () => navigate('/players/new'),
      category: 'players',
      order: 4,
    },
    {
      id: 'create-academy',
      label: 'Create Academy',
      description: 'Create a new academy',
      icon: null as any,
      action: () => navigate('/academy/new'),
      category: 'academy',
      order: 5,
    },
    {
      id: 'start-live-match',
      label: 'Start Live Match',
      description: 'Start scoring a live match',
      icon: null as any,
      action: () => navigate('/matches/live'),
      category: 'matches',
      order: 6,
    },
    {
      id: 'upload-video',
      label: 'Upload Video',
      description: 'Upload video for analysis',
      icon: null as any,
      action: () => navigate('/video-analysis/upload'),
      category: 'video',
      order: 7,
    },
    {
      id: 'create-session',
      label: 'Create Session',
      description: 'Create a training session',
      icon: null as any,
      action: () => navigate('/training/sessions/new'),
      category: 'training',
      order: 8,
    },
  ], [navigate]);
  
  return quickActions;
}

/**
 * Hook to get command palette items
 */
export function useCommandPaletteItems() {
  const { navigate } = useNavigation();
  
  const commandItems = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      description: 'Navigate to main dashboard',
      icon: null as any,
      keywords: ['dashboard', 'home', 'main'],
      action: () => navigate('/dashboard'),
      category: 'navigation',
      order: 1,
      isDefault: true,
    },
    {
      id: 'tournaments',
      label: 'View Tournaments',
      description: 'Browse all tournaments',
      icon: null as any,
      keywords: ['tournaments', 'competitions', 'leagues'],
      action: () => navigate('/tournaments'),
      category: 'navigation',
      order: 2,
    },
    {
      id: 'teams',
      label: 'View Teams',
      description: 'Browse all teams',
      icon: null as any,
      keywords: ['teams', 'squads', 'clubs'],
      action: () => navigate('/teams'),
      category: 'navigation',
      order: 3,
    },
    {
      id: 'players',
      label: 'View Players',
      description: 'Browse all players',
      icon: null as any,
      keywords: ['players', 'athletes', 'roster'],
      action: () => navigate('/players'),
      category: 'navigation',
      order: 4,
    },
    {
      id: 'matches',
      label: 'View Matches',
      description: 'Browse all matches',
      icon: null as any,
      keywords: ['matches', 'fixtures', 'games'],
      action: () => navigate('/matches'),
      category: 'navigation',
      order: 5,
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      description: 'Navigate to analytics',
      icon: null as any,
      keywords: ['analytics', 'statistics', 'insights'],
      action: () => navigate('/analytics'),
      category: 'navigation',
      order: 6,
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Go to settings page',
      icon: null as any,
      keywords: ['settings', 'preferences', 'config'],
      action: () => navigate('/settings'),
      category: 'navigation',
      order: 7,
    },
    {
      id: 'help',
      label: 'Help & Support',
      description: 'Access help documentation',
      icon: null as any,
      keywords: ['help', 'support', 'docs'],
      action: () => navigate('/help'),
      category: 'navigation',
      order: 8,
    },
  ], [navigate]);
  
  return commandItems;
}