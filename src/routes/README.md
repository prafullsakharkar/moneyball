# CricketIQ Enterprise Routing Architecture

## Overview

This document describes the enterprise-grade routing architecture implemented for CricketIQ, a large-scale Cricket Analytics and Tournament Management platform with 250+ pages and 40+ feature modules.

---

## Architecture Principles

### 1. Feature-Based Modularity

Each feature module has its own route configuration file:

```
src/routes/
├── index.ts              # Central router configuration
├── utils.ts              # Shared utilities (route guards, metadata)
├── auth.routes.ts        # Authentication routes
├── dashboard.routes.ts   # Dashboard routes
├── tournament.routes.ts  # Tournament routes
├── team.routes.ts        # Team routes
├── player.routes.ts      # Player routes
├── match.routes.ts       # Match routes
├── analytics.routes.ts   # Analytics routes
├── video.routes.ts       # Video analysis routes
├── academy.routes.ts     # Academy routes
├── training.routes.ts    # Training routes
├── auction.routes.ts     # Auction routes
├── fantasy.routes.ts     # Fantasy routes
├── notification.routes.ts # Notification routes
├── sponsorship.routes.ts  # Sponsorship routes
├── monetization.routes.ts # Monetization routes
├── streaming.routes.ts    # Streaming routes
├── report.routes.ts       # Report routes
├── settings.routes.ts     # Settings routes
├── admin.routes.ts        # Admin routes
└── system.routes.ts       # System routes
```

### 2. Nested Routing

Routes are organized hierarchically for better URL structure and component composition:

**Before:**
```tsx
{
  path: '/tournaments/analytics',
  element: <TournamentAnalytics />
}
{
  path: '/tournaments/standings',
  element: <TournamentStandings />
}
```

**After:**
```tsx
{
  path: '/tournaments',
  element: <TournamentLayout />,
  children: [
    {
      path: 'analytics',
      element: <TournamentAnalytics />
    },
    {
      path: 'standings',
      element: <TournamentStandings />
    }
  ]
}
```

### 3. Layout-Based Organization

Different layouts for different route groups:

| Layout | Path Prefix | Purpose |
|--------|-------------|---------|
| `AppLayout` | `/` | Main application layout with sidebar |
| `PublicLayout` | `/auth/*` | Public pages (login, register) |
| `AuthLayout` | `/auth/*` | Authentication pages |
| `DashboardLayout` | `/dashboard/*` | Dashboard pages |
| `AnalyticsLayout` | `/analytics/*` | Analytics pages |
| `AdminLayout` | `/admin/*` | Admin pages |
| `ScoringLayout` | `/scoring/*` | Live scoring pages |
| `AcademyLayout` | `/academy/*` | Academy pages |
| `AuctionLayout` | `/auction/*` | Auction pages |
| `BlankLayout` | `/` | No layout wrapper |

### 4. Lazy Loading

Components are lazy-loaded using `React.lazy()` for optimal performance:

```tsx
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
```

Route-level code splitting is achieved through the `lazy` property:

```tsx
{
  path: '/tournaments',
  lazy: () => import('../pages/Tournaments'),
  children: [...]
}
```

---

## Improved URL Structure

### Before (Admin-Centric)
```
/admin/player-analytics
/admin/team-analytics
/admin/match-analytics
/admin/tournament-analytics
```

### After (Feature-Centric)
```
/analytics/player
/analytics/team
/analytics/match
/analytics/tournament
```

---

## Route Groups

### 1. Public Routes
```tsx
{
  path: '/auth/login',
  element: <LoginPage />
}
{
  path: '/auth/register',
  element: <RegisterPage />
}
{
  path: '/auth/forgot-password',
  element: <ForgotPasswordPage />
}
```

### 2. Authenticated Routes
All routes under `/dashboard`, `/tournaments`, `/teams`, etc.

### 3. Admin Routes
```tsx
{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      path: 'analytics',
      element: <AdminAnalytics />
    },
    {
      path: 'dashboard',
      element: <AdminDashboard />
    }
  ]
}
```

---

## Route Guards & Permissions

### Authentication Guard
```tsx
// src/routes/utils.ts
export function requireAuth(location: Location): boolean {
  const authStore = useAuthStore();
  return authStore.isAuthenticated;
}
```

### Role-Based Access Control
```tsx
export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [...],
    meta: {
      requiredRole: 'admin',
      permissions: ['read:admin', 'write:admin']
    }
  }
];
```

### Permission Check Hook
```tsx
// src/hooks/usePermissions.ts
export function usePermissions(permissions: string[]): boolean {
  const authStore = useAuthStore();
  const userRoles = authStore.user?.roles || [];
  
  return permissions.every(permission => {
    return userRoles.some(role => 
      authStore.rolePermissions[role]?.includes(permission)
    );
  });
}
```

---

## Breadcrumb Generation

Routes include metadata for automatic breadcrumb generation:

```tsx
{
  path: '/tournaments/analytics',
  element: <TournamentAnalytics />,
  meta: {
    title: 'Tournament Analytics',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Tournaments', path: '/tournaments' },
      { label: 'Analytics', path: '/tournaments/analytics' }
    ]
  }
}
```

---

## Dynamic Sidebar & Menus

Routes define sidebar configuration:

```tsx
{
  path: '/dashboard',
  element: <Dashboard />,
  meta: {
    sidebar: {
      icon: 'dashboard',
      label: 'Dashboard',
      order: 1,
      visible: true
    }
  }
}
```

---

## Feature Flags

Route visibility controlled by feature flags:

```tsx
{
  path: '/streaming',
  element: <Streaming />,
  meta: {
    featureFlag: 'streaming_enabled',
    visible: true
  }
}
```

---

## SEO & Metadata

Route metadata for SEO:

```tsx
{
  path: '/tournaments/:id',
  element: <TournamentDetail />,
  meta: {
    title: (params: any) => `Tournament ${params.id} - CricketIQ`,
    description: 'Detailed tournament information and statistics',
    keywords: 'cricket tournament, analytics, statistics'
  }
}
```

---

## Loading & Error Boundaries

### Loading Boundary
```tsx
// src/components/LoadingBoundary.tsx
export function LoadingBoundary({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      {children}
    </React.Suspense>
  );
}
```

### Error Boundary
```tsx
// src/components/ErrorBoundary.tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <React.ErrorBoundary fallback={<ErrorPage />}>{children}</React.ErrorBoundary>;
}
```

---

## Migration Strategy

### Phase 1: Setup
1. Create route module files
2. Move lazy imports into feature files
3. Create centralized router configuration

### Phase 2: Restructure
1. Implement nested routing
2. Organize routes by layout
3. Add route metadata

### Phase 3: Enhance
1. Implement route guards
2. Add feature flags
3. Configure SEO metadata

### Phase 4: Optimize
1. Implement code splitting
2. Add loading indicators
3. Configure error handling

---

## Best Practices

1. **One Route File Per Feature** - Keep related routes together
2. **Use Nested Routing** - Better URL structure and component reuse
3. **Lazy Load Everything** - Optimal initial load time
4. **Centralize Guards** - Single source of truth for authentication
5. **Use Route Metadata** - Automatic breadcrumb generation
6. **Feature Flags** - Incremental feature rollout
7. **SEO Metadata** - Each route has proper meta tags
8. **Error Boundaries** - Graceful error handling
9. **Type Safety** - Strict TypeScript configuration
10. **Testing** - Unit tests for route guards

---

## Folder Structure

```
src/
├── app/
│   ├── App.tsx
│   └── router.tsx          # Central router
├── routes/
│   ├── index.ts            # Route exports
│   ├── utils.ts            # Utilities
│   ├── auth.routes.ts
│   ├── dashboard.routes.ts
│   ├── tournament.routes.ts
│   └── ...
├── layouts/
│   ├── AppLayout.tsx
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   └── ...
├── pages/
│   ├── Dashboard.tsx
│   ├── TournamentList.tsx
│   └── ...
└── features/
    ├── tournament/
    ├── team/
    ├── player/
    └── ...
```

---

## Future Modules

### Video Analysis
- Match video review
- Ball-by-ball analysis
- Player highlights
- AI-powered insights

### Academy
- Student management
- Batch scheduling
- Progress tracking
- Performance analytics

### Training
- Practice session planning
- Fitness tracking
- Attendance management
- Performance monitoring

### Auction
- Player pool management
- Budget tracker
- Live auction room
- Bid tracking

### Fantasy
- League management
- Contest creation
- Team selection
- Points tracking

### Streaming
- Live match streaming
- Multi-camera support
- Real-time stats
- Interactive features

### Sponsorship
- Sponsor management
- Contract tracking
- Analytics dashboard
- Reporting tools

### Monetization
- Billing management
- Subscription plans
- Payment processing
- Financial reports

---

## Contributing

When adding new routes:

1. Create route module file in `src/routes/`
2. Export route configuration
3. Update `src/routes/index.ts`
4. Add route metadata
5. Update sidebar configuration
6. Test route guards
7. Add feature flags if needed

---

## Support

For questions or issues, contact the platform team.