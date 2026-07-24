// API configuration constants

/**
 * Base API configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.moneyball.app/v1';

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT = 30000;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  /**
   * Authentication
   */
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    changePassword: '/auth/change-password',
  },
  
  /**
   * User
   */
  user: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    deleteAccount: '/users/account',
    avatar: '/users/avatar',
  },
  
  /**
   * Matches
   */
  matches: {
    list: '/matches',
    detail: (id: string) => `/matches/${id}`,
    liveScores: '/matches/live-scores',
    schedule: '/matches/schedule',
    venue: (id: string) => `/matches/${id}/venue`,
    scorecard: (id: string) => `/matches/${id}/scorecard`,
    ballByBall: (id: string) => `/matches/${id}/ball-by-ball`,
    statistics: (id: string) => `/matches/${id}/statistics`,
    commentary: (id: string) => `/matches/${id}/commentary`,
  },
  
  /**
   * Players
   */
  players: {
    list: '/players',
    detail: (id: string) => `/players/${id}`,
    statistics: (id: string) => `/players/${id}/statistics`,
    career: (id: string) => `/players/${id}/career`,
    rankings: '/players/rankings',
    search: '/players/search',
  },
  
  /**
   * Teams
   */
  teams: {
    list: '/teams',
    detail: (id: string) => `/teams/${id}`,
    players: (id: string) => `/teams/${id}/players`,
    statistics: (id: string) => `/teams/${id}/statistics`,
    matches: (id: string) => `/teams/${id}/matches`,
    fixtures: (id: string) => `/teams/${id}/fixtures`,
  },
  
  /**
   * Tournaments
   */
  tournaments: {
    list: '/tournaments',
    detail: (id: string) => `/tournaments/${id}`,
    matches: (id: string) => `/tournaments/${id}/matches`,
    pointsTable: (id: string) => `/tournaments/${id}/points-table`,
    statistics: (id: string) => `/tournaments/${id}/statistics`,
    teams: (id: string) => `/tournaments/${id}/teams`,
  },
  
  /**
   * Analytics
   */
  analytics: {
    player: (id: string) => `/analytics/players/${id}`,
    team: (id: string) => `/analytics/teams/${id}`,
    match: (id: string) => `/analytics/matches/${id}`,
    leaderboard: '/analytics/leaderboard',
    predictions: '/analytics/predictions',
    insights: '/analytics/insights',
    video: (id: string) => `/analytics/video/${id}`,
    ai: (id: string) => `/analytics/ai/${id}`,
  },
  
  /**
   * Video
   */
  video: {
    list: '/video',
    detail: (id: string) => `/video/${id}`,
    clips: (id: string) => `/video/${id}/clips`,
    highlights: (id: string) => `/video/${id}/highlights`,
    tags: '/video/tags',
    upload: '/video/upload',
  },
  
  /**
   * Fantasy
   */
  fantasy: {
    leagues: '/fantasy/leagues',
    createLeague: '/fantasy/leagues',
    joinLeague: '/fantasy/leagues/join',
    myLeagues: '/fantasy/my-leagues',
    teams: '/fantasy/teams',
    createTeam: '/fantasy/teams',
    myTeams: '/fantasy/my-teams',
    contests: '/fantasy/contests',
    createContest: '/fantasy/contests',
    myContests: '/fantasy/my-contests',
    scoreboards: '/fantasy/scoreboards',
    players: '/fantasy/players',
    transfers: '/fantasy/transfers',
    captain: '/fantasy/captain',
    viceCaptain: '/fantasy/vice-captain',
  },
  
  /**
   * Academy
   */
  academy: {
    students: '/academy/students',
    batches: '/academy/batches',
    courses: '/academy/courses',
    coaches: '/academy/coaches',
    progress: '/academy/progress',
    reports: '/academy/reports',
    sessions: '/academy/sessions',
  },
  
  /**
   * Notifications
   */
  notifications: {
    list: '/notifications',
    unreadCount: '/notifications/unread',
    markRead: '/notifications/mark-read',
    markAllRead: '/notifications/mark-all-read',
    settings: '/notifications/settings',
  },
  
  /**
   * Enterprise
   */
  enterprise: {
    users: '/enterprise/users',
    organizations: '/enterprise/organizations',
    permissions: '/enterprise/permissions',
    audit: '/enterprise/audit',
    roles: '/enterprise/roles',
  },
  
  /**
   * Business
   */
  business: {
    transactions: '/business/transactions',
    payments: '/business/payments',
    subscriptions: '/business/subscriptions',
    revenue: '/business/revenue',
    finance: '/business/finance',
    sponsorship: '/business/sponsorship',
  },
  
  /**
   * AI
   */
  ai: {
    analyze: '/ai/analyze',
    recommendations: '/ai/recommendations',
    predictions: '/ai/predictions',
    scouting: '/ai/scouting',
    insights: '/ai/insights',
  },
  
  /**
   * Admin
   */
  admin: {
    dashboard: '/admin/dashboard',
    matches: '/admin/matches',
    players: '/admin/players',
    teams: '/admin/teams',
    tournaments: '/admin/tournaments',
    users: '/admin/users',
    settings: '/admin/settings',
    logs: '/admin/logs',
    reports: '/admin/reports',
  },
  
  /**
   * Streaming
   */
  streaming: {
    lives: '/streaming/lives',
    broadcasts: '/streaming/broadcasts',
    streams: '/streaming/streams',
    playback: (id: string) => `/streaming/${id}/playback`,
  },
} as const;

/**
 * API headers
 */
export const API_HEADERS = {
  /**
   * Content type
   */
  contentType: 'application/json',
  
  /**
   * Authorization
   */
  authorization: (token: string) => `Bearer ${token}`,
} as const;

/**
 * HTTP methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

/**
 * API response status codes
 */
export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Query parameter keys
 */
export const QUERY_KEYS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ORDER: 'order',
  SEARCH: 'search',
  FILTER: 'filter',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  INCLUDE: 'include',
  EXCLUDE: 'exclude',
} as const;