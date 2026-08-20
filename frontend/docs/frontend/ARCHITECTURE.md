# CricketOS Frontend Architecture

## Overview

CricketOS is a multi-tenant, enterprise-grade global Cricket Operating System. The frontend is built with React 19, TypeScript, Vite, and follows a domain-driven architecture with strict separation of concerns.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19.2.7 |
| Language | TypeScript 5.x |
| Build | Vite 5.x |
| Package Manager | pnpm |
| Styling | Tailwind CSS 4.x + MUI (Material UI) 9.x |
| State Management | Zustand 5.x (client state) + TanStack Query 5.x (server state) |
| Forms | React Hook Form 7.x + Zod 4.x |
| HTTP Client | Ky 2.x |
| Tables | Material React Table (via @tanstack/react-table) |
| Animations | Framer Motion 13.x |
| Routing | React Router 6.x |
| Mocking | MSW 2.x (Mock Service Worker) |
| Testing | Vitest + React Testing Library + Playwright (E2E) |

## Directory Structure

```
src/
├── app/                  # App shell — root component, providers composition
├── core/                 # Platform infrastructure (env, errors, query client)
├── shared/               # Genuinely reusable UI and utilities
│   └── components/       # PageHeader, ProtectedRoute, etc.
├── modules/              # Domain-specific functionality
│   ├── organization/     # OrganizationSwitcher, context
│   ├── search/           # GlobalSearch, CommandPalette
│   ├── notifications/    # NotificationCenter
│   └── user/             # UserMenu
├── api/                  # API client, services, types
├── mocks/                # MSW handlers and server setup
├── providers/            # React context providers
├── layouts/              # AppShell, AuthLayout, navigation
├── routes/               # Route definitions with lazy loading
├── assets/               # Static assets (images, icons)
├── styles/               # Tailwind config, MUI theme, global CSS
├── types/                # TypeScript type definitions
├── stores/               # Zustand stores (client state)
└── utils/                # Pure utility functions
```

## Data Flow Architecture

**Rule: Components never import API clients, repositories, or services directly.**

```
Component
  ↓
Feature Hook (useQuery/useMutation)
  ↓
Repository (business logic, query key management)
  ↓
Service (HTTP calls via Ky)
  ↓
API Client (Ky instance with interceptors)
  ↓
MSW (tests) or Backend (production)
```

## State Management Strategy

### Client State (Zustand)
- **authStore** — User, tokens, membership, authentication status
- **organizationStore** — Current org, available orgs, switching state

### Server State (TanStack Query)
- All server data fetched via `useQuery` / `useMutation`
- Query keys organized per domain entity
- Automatic caching, refetching, and optimistic updates
- Organization-scoped query keys for tenant isolation

## Multi-Tenancy

Every query key includes the current organization ID, ensuring strict tenant isolation:

```typescript
queryKeys.players.list(orgId, { page: 1 })
// ['players', 'list', 'org_001', { page: 1 }]
```

When the organization switches, all queries automatically refetch with the new org context.

## Styling Strategy

- **Tailwind CSS** for utility-first layout and responsive design
- **MUI** for component library (buttons, cards, tables, forms, dialogs)
- **MUI Theme** provides brand tokens and component overrides
- Custom CSS kept to a minimum (scrollbars, sr-only)
