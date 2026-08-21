# CricketIQ Design System

CricketIQ feels like **Linear-level polish** + **Enterprise information density** + **Modern sports technology** + **Professional cricket operations**.

This is NOT a generic admin dashboard. Every pixel communicates cricket authority.

---

## Design Philosophy

1. **Density by default** — 13px base font, tight spacing, information-rich views. Cricket is a data-heavy sport; the UI must surface numbers without clutter.
2. **Cricket authority** — Deep cricket blue (`brand`), teal accents (`accent`), pitch/turf colors for ground visualizations. Every component speaks the sport's language.
3. **Tabular numbers** — All cricket metrics use `font-variant-numeric: tabular-nums` so columns align perfectly.
4. **Motion with restraint** — Fast micro-interactions (100ms) for hover/focus, smooth transitions (300ms) for page changes, spring (500ms) for playful moments. Respects `prefers-reduced-motion`.
5. **Dark mode first-class** — Both themes built from the same tokens; toggle between light/dark/system.

---

## Architecture

The design system is split into two layers:

| Layer | Location | Purpose |
|-------|----------|---------|
| **Design tokens** | `src/design/tokens.ts` | Raw values (colors, type scale, spacing, elevation, motion, layout) |
| **Theme module** | `src/core/theme/` | MUI theme built from tokens (light/dark themes, component overrides) |
| **Shared components** | `src/shared/components/` | Reusable UI, layout, form, table, feedback, cricket, analytics, motion components |

### Theme module structure

```
src/core/theme/
├── index.ts          # Public API (single entry point)
├── palette.ts        # Color palettes (light/dark)
├── typography.ts     # Typography system + cricket metrics
├── spacing.ts        # Spacing scale
├── shadows.ts        # Elevation system
├── shape.ts          # Border radius
├── breakpoints.ts    # Responsive breakpoints
├── components.ts     # Shared MUI component overrides
├── light.ts          # Light theme
└── dark.ts           # Dark theme
```

Import everything from the barrel:

```ts
import {
  lightTheme,
  darkTheme,
  brand,
  accent,
  metrics,
  spacing,
  shadows,
  shape,
  breakpoints,
  sharedComponents,
} from '@core/theme';
```

---

## Design Tokens

All raw values live in [`src/design/tokens.ts`](../../src/design/tokens.ts). See [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) for the complete reference.

### Colors

**Brand Blue** (`colors.brand`) — Deep cricket blue for trust, tradition, authority.

| Token | Usage |
|-------|-------|
| `brand[500]` (`#1565c0`) | Primary actions, links, active states |
| `brand[700]` (`#0d47a1`) | Hover states, dark accents |
| `brand[100]` | Light backgrounds, subtle highlights |

**Accent Teal** (`colors.accent`) — Score highlights, success states, secondary actions.

**Neutrals** (`colors.neutral`) — Sophisticated greys from `0` (white) to `950` (near-black).

**Semantic Colors** — `success`, `warning`, `error`, `info` — for status and feedback.

**Cricket-Specific** — `colors.pitch` (green/light/worn/dust) and `colors.turf` (fresh/used/dry/brown) for ground/pitch visualizations.

### Typography

**Font Family:** Inter (sans-serif), JetBrains Mono (monospace for overs/rates).

**Dense Scale** — Body text starts at 13px (not 16px) for enterprise information density:

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
| `3xl` | 30px | Hero |
| `4xl` | 36px | Display |

**Preset Text Styles** — `typography.presets.display`, `.h1`–`.h4`, `.body`, `.body-sm`, `.caption`, `.label`, `.overline`, `.code`.

See [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) for the full system.

### Spacing

4px base grid: `spacing[1]=4px`, `spacing[2]=8px`, `spacing[3]=12px`, `spacing[4]=16px`, etc.

### Elevation

6 levels: `elevation.xs` → `elevation.2xl`, plus `elevation.inner` for pressed states.

### Border Radius

`radius.sm=4px`, `radius.md=8px`, `radius.lg=12px`, `radius.xl=16px`, `radius.full=9999px`.

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion.fast` | 100ms | ease | Hover, focus |
| `motion.normal` | 200ms | ease | Open, close |
| `motion.smooth` | 300ms | ease-out | Page transitions |
| `motion.emphasis` | 400ms | ease-out | Modal entrance |
| `motion.spring` | 500ms | spring | Playful interactions |

### Density

Three levels for different contexts:
- **Compact:** Data tables, lists (32px rows)
- **Default:** Most content (40px rows)
- **Comfortable:** Hero sections, large cards (48px rows)

---

## Light & Dark Mode

Both themes are built from the same design tokens in `src/core/theme/`.

Toggle via `useTheme().setTheme('light' | 'dark' | 'system')` from `@providers`.

Dark mode uses:
- Darker neutrals (950 for background)
- Brighter brand colors (400 instead of 500)
- Adjusted shadows for depth

The `ThemeProvider` (light/dark/system) + `MuiThemeBridge` in `AppProvider` selects `lightTheme`/`darkTheme` based on the resolved theme.

---

## Components

### UI Components (`src/shared/components/ui/`)

| Component | Description |
|-----------|-------------|
| **Button** | `primary`, `secondary`, `ghost`, `danger`, `success` variants with `loading` state |
| **Input** | TextField with label, description, error state, adornments |
| **Card** | Composable card with title, subtitle, header action, footer actions |
| **Dialog** | Modal with title, subtitle, close button, action slots |
| **Drawer** | Slide-over panel |
| **EmptyState** | Empty list/table placeholder with icon, title, description, action |
| **LoadingState** | Loading spinner with message, full-page mode |
| **Skeleton** | Animated loading placeholder |
| **ErrorState** | Error display with retry action |
| **ConfirmDialog** | Destructive action confirmation with warning icon |
| **ThemeToggle** | Light/dark/system toggle |

### Page Layout Components (`src/shared/components/layout/`)

| Component | Description |
|-----------|-------------|
| **PageShell** | Page container with max-width (default 1200) |
| **PageHeader** | Title + description + eyebrow + actions |
| **PageTitle** | Typographic page title |
| **PageActions** | Right-aligned action slot |
| **PageContent** | Content wrapper |
| **PageSection** | Section with title, description, actions |
| **PageToolbar** | Filter/search toolbar row |
| **PageTabs** | Tab navigation row |
| **PageFilters** | Filter controls row |
| **PageFooter** | Page footer |

### Typography Components (`src/shared/components/typography/`)

| Component | Description |
|-----------|-------------|
| **Display / Heading / Body / Label / Caption / Overline** | Semantic text components |
| **Metric** | Tabular-nums numeric display |
| **ScoreText / StatValue** | Cricket score / stat value display |

### Form Components (`src/shared/components/form/`)

| Component | Description |
|-----------|-------------|
| **FormField** | Label + control + error wrapper |
| **FormRow** | Grid row for form fields |
| **FormActions** | Form action button row |
| **Select** | Labeled select with options, description, error |
| **TextArea** | Multiline text input |
| **Switch** | Toggle switch |
| **Checkbox** | Checkbox with label, description, error |

### Data Table (`src/shared/components/table/`)

| Component | Description |
|-----------|-------------|
| **DataTable** | Sortable, selectable, dense table with loading skeletons, empty state, row click |

### Feedback Components (`src/shared/components/feedback/`)

| Component | Description |
|-----------|-------------|
| **ToastProvider / useToast** | Toast notification system (Framer Motion animated) |
| **Banner** | Inline alert banner (info/success/warning/error) |

### Cricket Components (`src/shared/components/cricket/`)

| Component | Description |
|-----------|-------------|
| **Score** | Runs/wickets/overs display with run rate |
| **Scoreboard** | Full match scoreboard |
| **PlayerAvatar** | Avatar with initials fallback, role indicator (BAT/BWL/AR/WK), online status |
| **TeamBadge** | Team logo + short name + optional score |
| **MatchStatus** | Status chip (live/scheduled/completed) with pulsing indicator |
| **LiveIndicator** | Pulsing red dot with LIVE/REC label |
| **StatCard** | Stat value + label + trend + comparison |
| **PerformanceMetric** | Metric with bar indicator |
| **FormIndicator** | Recent form (W/D/L) with color-coded circles |
| **TournamentBadge** | Tournament/league badge with type, season, status |

### Analytics Components (`src/shared/components/analytics/`)

Self-contained SVG charts (no chart library dependency):

| Component | Description |
|-----------|-------------|
| **Sparkline** | Inline trend line |
| **BarChart** | Vertical bar chart with labels/values |
| **DonutChart** | Donut/progress ring |

### Motion (`src/shared/components/motion/`)

| Export | Description |
|--------|-------------|
| **Motion** | Wrapper component with `fadeUp`, `fade`, `slideInRight`, `scaleIn`, `stagger` variants |
| **motion** | Re-exported Framer Motion `motion` |
| **fadeUp / fade / slideInRight / scaleIn / stagger** | Variant presets |

---

## Accessibility

- **Focus visible:** 2px solid brand blue ring on keyboard navigation
- **Reduced motion:** All animations disabled when `prefers-reduced-motion: reduce` (via `MotionConfig reducedMotion="user"`)
- **ARIA:** All interactive elements have proper roles and labels
- **Color contrast:** WCAG AA compliant for all text/background combinations
- **Screen reader:** `sr-only` utility class for hidden descriptive text

---

## File Structure

```
src/
├── design/
│   └── tokens.ts          # All design tokens (raw values)
├── core/theme/            # MUI theme built from tokens
│   ├── index.ts           # Public API
│   ├── palette.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   ├── shape.ts
│   ├── breakpoints.ts
│   ├── components.ts
│   ├── light.ts
│   └── dark.ts
├── shared/components/
│   ├── ui/                # Generic UI components
│   ├── layout/            # Page layout system
│   ├── typography/        # Semantic text components
│   ├── form/              # Form controls
│   ├── table/             # DataTable
│   ├── feedback/          # Toast, Banner
│   ├── cricket/           # Cricket-specific components
│   ├── analytics/         # SVG charts
│   ├── motion/            # Framer Motion wrappers
│   └── index.ts           # Barrel export
```

---

## Usage Examples

```tsx
// Button variants
<Button variant="primary">Save</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
<Button variant="ghost">Cancel</Button>

// Page layout
<PageShell>
  <PageHeader title="Organizations" description="Manage your organizations" actions={<Button>New</Button>} />
  <PageSection title="List">
    <DataTable columns={columns} data={rows} />
  </PageSection>
</PageShell>

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

// Motion
<Motion variant="fadeUp" delay={0.1}>...</Motion>

// Dark mode toggle
const { setTheme, resolvedTheme } = useTheme();
```
