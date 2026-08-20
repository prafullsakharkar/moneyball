# CricketIQ Design System

## Design Philosophy

CricketIQ feels like **Linear-level polish** + **Enterprise information density** + **Modern sports technology** + **Professional cricket operations**.

This is NOT a generic admin dashboard. Every pixel communicates cricket authority.

---

## Design Tokens

All design decisions are encoded in tokens at `src/design/tokens.ts`.

### Colors

**Brand Blue** (`colors.brand`) — Deep cricket blue for trust, tradition, authority.

| Token | Usage |
|-------|-------|
| `brand[500]` | Primary actions, links, active states |
| `brand[700]` | Hover states, dark accents |
| `brand[100]` | Light backgrounds, subtle highlights |

**Accent Teal** (`colors.accent`) — Score highlights, success states, secondary actions.

**Neutrals** (`colors.neutral`) — Sophisticated greys from 0 (white) to 950 (near-black).

**Semantic Colors** — `success`, `warning`, `error`, `info` — for status and feedback.

**Cricket-Specific** — `colors.pitch`, `colors.turf` — for ground/pitch visualizations.

### Typography

**Font Family:** Inter (sans-serif), JetBrains Mono (monospace)

**Dense Scale** — Body text starts at 14px (not 16px) for enterprise information density:

| Token | Size | Usage |
|-------|------|-------|
| `2xs` | 10px | Micro labels |
| `xs` | 12px | Captions, table headers |
| `sm` | 13px | Secondary text, form labels |
| `base` | 14px | Body text (default) |
| `md` | 16px | Emphasized body |
| `lg` | 18px | Subheadings |
| `xl` | 20px | Section titles |
| `2xl` | 24px | Page titles |

**Preset Text Styles** — `typography.presets.h1`, `.body`, `.caption`, `.overline`, `.code`

### Spacing

4px base grid: `spacing[1]=4px`, `spacing[2]=8px`, `spacing[3]=12px`, `spacing[4]=16px`, etc.

### Elevation

6 levels: `elevation.xs` → `elevation.2xl`, plus `elevation.inner` for pressed states.

### Border Radius

`radius.sm=4px`, `radius.md=6px`, `radius.lg=12px`, `radius.xl=16px`, `radius.full=9999px`

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion.fast` | 100ms | ease | Hover, focus |
| `motion.normal` | 200ms | ease | Open, close |
| `motion.smooth` | 300ms | ease-out | Page transitions |
| `motion.emphasis` | 400ms | ease-out | Modal entrance |

### Density

Three levels for different contexts:
- **Compact:** Data tables, lists (32px rows)
- **Default:** Most content (40px rows)
- **Comfortable:** Hero sections, large cards (48px rows)

---

## Light & Dark Mode

Both themes are built from the same design tokens at `src/design/theme.ts`.

Toggle via `useTheme().setTheme('light' | 'dark' | 'system')`.

Dark mode uses:
- Darker neutrals (950 for background)
- Brighter brand colors (400 instead of 500)
- Adjusted shadows for depth

---

## Components

### UI Components (`src/shared/components/ui/`)

| Component | Description |
|-----------|-------------|
| **Button** | `primary`, `secondary`, `ghost`, `danger`, `success` variants with loading state |
| **Input** | TextField with label, description, error state, adornments |
| **Card** | Composable card with title, subtitle, header action, footer actions |
| **Dialog** | Modal with title, subtitle, close button, action slots |
| **EmptyState** | Empty list/table placeholder with icon, title, description, action |
| **LoadingState** | Loading spinner with message, full-page mode |
| **Skeleton** | Animated loading placeholder |
| **ErrorState** | Error display with retry action |
| **ConfirmDialog** | Destructive action confirmation with warning icon |

### Cricket Components (`src/shared/components/cricket/`)

| Component | Description |
|-----------|-------------|
| **Score** | Runs/wickets/overs display with run rate |
| **PlayerAvatar** | Avatar with initials fallback, role indicator (BAT/BWL/AR/WK), online status |
| **TeamBadge** | Team logo + short name + optional score |
| **MatchStatus** | Status chip (live/scheduled/completed) with pulsing indicator |
| **LiveIndicator** | Pulsing red dot with LIVE/REC label |
| **StatCard** | Stat value + label + trend + comparison |
| **PerformanceMetric** | Metric with bar indicator |
| **FormIndicator** | Recent form (W/D/L) with color-coded circles |
| **TournamentBadge** | Tournament/league badge with type, season, status |

---

## Accessibility

- **Focus visible:** 2px solid brand blue ring on keyboard navigation
- **Reduced motion:** All animations disabled when `prefers-reduced-motion: reduce`
- **ARIA:** All interactive elements have proper roles and labels
- **Color contrast:** WCAG AA compliant for all text/background combinations
- **Screen reader:** `sr-only` utility class for hidden descriptive text

---

## File Structure

```
src/
├── design/
│   ├── tokens.ts          # All design tokens
│   ├── theme.ts           # MUI light/dark themes
│   └── index.ts           # Barrel export
├── shared/components/
│   ├── ui/                # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── index.ts
│   └── cricket/           # Cricket-specific components
│       ├── Score.tsx
│       ├── PlayerAvatar.tsx
│       ├── TeamBadge.tsx
│       ├── MatchStatus.tsx
│       ├── LiveIndicator.tsx
│       ├── StatCard.tsx
│       ├── PerformanceMetric.tsx
│       ├── FormIndicator.tsx
│       ├── TournamentBadge.tsx
│       └── index.ts
```

---

## Usage Examples

```tsx
// Button variants
<Button variant="primary">Save</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
<Button variant="ghost">Cancel</Button>

// Score display
<Score runs={287} wickets={6} overs={82.4} runRate={3.47} team="AUS" />

// Player with role
<PlayerAvatar firstName="Pat" lastName="Cummins" role="bowler" size="lg" online />

// Live match
<MatchStatus state="live" innings={2} />

// Team badge
<TeamBadge name="Australia" shortName="AUS" score={{ runs: 312, wickets: 8, overs: 90 }} />

// Form indicator
<FormIndicator results={['W', 'W', 'L', 'D', 'W']} />

// Stat card
<StatCard value={45.32} label="Average" trend="up" trendValue="+2.1" comparison="vs last season" />

// Dark mode toggle
const { setTheme, resolvedTheme } = useTheme();
```
