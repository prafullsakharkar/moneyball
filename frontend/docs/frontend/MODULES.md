# CricketOS Frontend Modules

## Module Architecture

Each module follows a consistent structure:

```
src/modules/<domain>/
├── components/          # UI components specific to this domain
├── hooks/               # Custom hooks (useQuery wrappers, form hooks)
├── services/            # Repository + service layer
├── schemas/             # Zod validation schemas
├── types/               # Domain-specific TypeScript types
├── index.ts             # Public API barrel export
└── __tests__/           # Module-specific tests
```

## Module Dependency Rules

1. **Modules may import from**: `@core`, `@shared`, `@api`, `@stores`, `@domain`, `@utils`
2. **Modules may NOT import from other modules directly** — use events or shared stores
3. **Shared components may NOT import from modules**
4. **Core may NOT import from modules, shared, or providers**

## Existing Modules

### organization
Manages multi-tenant organization switching and context.
- `OrganizationSwitcher` — MUI dropdown for org switching
- Organization store (Zustand) for tenant state

### search
Global search and command palette functionality.
- `GlobalSearch` — Search input in header
- `CommandPalette` — Ctrl+K triggered command palette

### notifications
Notification center and delivery.
- `NotificationCenter` — Bell icon with badge and popover

### user
User profile and menu.
- `UserMenu` — Avatar dropdown with profile, settings, sign out

## Future Modules

### competition
Tournament and competition management.
### player
Player profiles and statistics.
### team
Team management and rosters.
### match
Match scheduling and live scoring.
### analytics
Player and team analytics dashboards.
### training
Training session management.
### media
Media file management.
### commercial
Sponsorship, auctions, and finance.
### intelligence
AI-powered insights and statistics.
