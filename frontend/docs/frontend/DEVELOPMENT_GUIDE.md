# CricketOS Development Guide

## Getting Started

### Prerequisites
- Node.js 20.x
- pnpm (use exclusively — do not use npm or yarn)

### Installation
```bash
cd frontend
pnpm install
```

### Development Server
```bash
pnpm dev
```

### Environment Variables
Copy `.env.example` to `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_VERSION=0.1.0
VITE_MSW_ENABLED=false
```

Set `VITE_MSW_ENABLED=true` to enable MSW API mocking in the browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest test suite |
| `pnpm test:watch` | Run tests in watch mode |

## Code Architecture Rules

### ✅ DO
- Use TanStack Query for all server state
- Use Zustand for client-only state (auth, theme, org)
- Use React Hook Form + Zod for all forms
- Use MUI components for UI consistency
- Use Tailwind for layout and responsive utilities
- Include organization ID in all query keys
- Write tests for hooks and components

### ❌ DON'T
- Import `ky`, `fetch`, or API URLs in components
- Use `useEffect` for data fetching (use TanStack Query)
- Store server state in Zustand
- Create duplicate utilities or components
- Use inline styles (use Tailwind or MUI sx)
- Use `any` type (use proper TypeScript types)

## Adding a New Module

1. Create module directory: `src/modules/<domain>/`
2. Add types to `src/types/<domain>.ts`
3. Create service: `src/api/<domain>.ts`
4. Create repository: `src/modules/<domain>/services/repository.ts`
5. Create hooks: `src/modules/<domain>/hooks/`
6. Add query keys to `src/core/queryClient.ts`
7. Create components: `src/modules/<domain>/components/`
8. Add routes to `src/routes/router.tsx`
9. Add navigation item to `PrimaryNavigation`
10. Write tests

## Testing

### Unit Tests (Vitest + RTL)
```bash
pnpm test
```
- MSW server runs automatically in test setup
- Use `render` from `@testing-library/react`
- Test hooks with `renderHook`

### E2E Tests (Playwright) — TBD
```bash
pnpm test:e2e
```

## Git Conventions

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring
- `docs:` — Documentation
- `test:` — Tests
- `chore:` — Maintenance
