# StudioHub Design Audit

> **Purpose**: This document captures the visual language, layout, typography, component patterns, and interaction conventions observed in the StudioHub frontend. It serves as the **primary design reference** for the CricketIQ UI/UX makeover. It is a *reference* document — we adopt StudioHub's *visual and UX patterns*, never its business logic.

---

## 1. Design Philosophy

StudioHub's interface is built around a few core principles that we should carry into CricketIQ:

1. **Density first** — Information-dense layouts with compact controls. Base font size is `13px`, table cells are tight, chips are small. The UI prioritizes showing more data per viewport.
2. **Dark-first** — Dark mode is the default and the primary experience. Light mode is a secondary, fully-supported variant.
3. **Quiet chrome** — The shell (header, sidebar) recedes; content is the hero. Borders are subtle (`slate-800`), backgrounds are near-black (`slate-900`), and accents are used sparingly.
4. **Single accent** — One indigo accent (`#6366f1`) drives interactive states, active nav, and primary actions. Everything else is neutral.
5. **Keyboard-first power users** — Command palette (`⌘K`), hotkeys on nav items, and dense navigation sections signal a tool built for daily, expert use.
6. **Monospace for metadata** — Section labels, badges, and technical metadata use a monospace font at tiny sizes (`9px`–`11px`) with uppercase tracking, creating a "pro dashboard" feel.

---

## 2. Color System

### Primary Accent
- **Indigo**: `#6366f1` (Tailwind `indigo-500`)
- Active nav background: `bg-indigo-600/15` (15% opacity indigo)
- Active nav text: `text-indigo-300`
- Active nav border: `border-indigo-500/30`

### Neutrals (Dark — the default)
| Token | Value | Usage |
|-------|-------|-------|
| `slate-900` | `#0f172a` | App background, header/sidebar base |
| `slate-900/95` | — | Header/sidebar with backdrop blur |
| `slate-800` | `#1e293b` | Borders, dividers |
| `slate-700` | `#334155` | Hover surfaces, secondary borders |
| `slate-300` | `#cbd5e1` | Primary text |
| `slate-400` | `#94a3b8` | Secondary text |
| `slate-500` | `#64748b` | Muted text, placeholders |

### Semantic Colors
- Success / positive: green family
- Warning: amber family
- Error / destructive: red family
- Info: indigo/blue family

### Usage Rules
- Accent color is reserved for **active/selected/interactive** states only.
- Never use accent for decorative fills.
- Text hierarchy is expressed through neutral opacity steps (`slate-300` → `slate-500`), not color variety.

---

## 3. Typography

### Font Family
- **Inter** for all UI text (sans-serif).
- **Monospace** (JetBrains Mono / system mono) for section labels, badges, hotkeys, and technical metadata.

### Scale
- **Base**: `13px` (`text-[13px]`) — the default body/UI size.
- **Tiny labels**: `9px` (`text-[9px]`) — nav section headers, uppercase, bold, monospace.
- **Small**: `11px`–`12px` — badges, chips, table metadata.
- **Body**: `13px`–`14px` — standard content.
- **Headings**: modest sizes; the shell does not rely on large display type.

### Style Rules
- Section labels: `text-[9px] font-bold font-mono uppercase tracking-wider`.
- Numbers and metrics should use **tabular-nums** for alignment.
- Avoid heavy font weights for body text; reserve `font-bold` for emphasis and labels.

---

## 4. Layout & Shell

### Header (56px / `h-14`)
- Sticky top, `z-30`.
- Background: `bg-slate-900/95 backdrop-blur-md border-b border-slate-800`.
- Contents (left → right):
  1. Brand / logo link.
  2. **Organization switcher** (dropdown).
  3. Spacer.
  4. **Command palette trigger** (`⌘K`).
  5. **Notifications** dropdown.
  6. **User menu**.
  7. **Theme toggle** (light/dark).

### Sidebar
- **Collapsible**: collapsed width `w-14` (56px), expanded width `w-60` (240px).
- **Sectioned navigation** with uppercase monospace section labels.
- Each nav item: icon + label + optional **badge** and **hotkey**.
- Active state: `bg-indigo-600/15 text-indigo-300 border border-indigo-500/30`.
- Collapsed mode shows only icons (with tooltips).

### Content Area
- Content sits to the right of the sidebar, below the header.
- Uses a max-width container with comfortable padding.
- Cards and panels use subtle borders (`border-slate-800`) rather than heavy shadows.

---

## 5. Component Patterns

### Buttons
- `disableElevation` (flat, no shadow).
- Default size `small`.
- Border radius `6px`.
- Padding `5px 12px`.
- Font size `0.75rem` (12px).
- Primary uses the indigo accent; secondary/ghost are neutral.

### Cards / Panels
- `MuiPaper` with `1px` border.
- Minimal shadow; rely on borders and background contrast.

### Chips / Badges
- Height `22px`.
- Font size `0.6875rem` (11px).
- Compact, used for status, tags, and metadata.

### Tables
- Cell padding `6px 10px` (dense).
- Header cells: uppercase, `0.6875rem` (11px), muted color.
- Row hover states for interactivity.

### Inputs & Forms
- Compact, consistent with the `13px` base.
- Clear labels, helper text, and error states.

### Dialogs & Drawers
- Used for focused tasks (create/edit, confirm, detail views).
- Consistent max-widths and padding.

---

## 6. Density

StudioHub is a **compact-density** interface. Key measurements:
- Base font: `13px`
- Table cell padding: `6px 10px`
- Chip height: `22px`
- Button padding: `5px 12px`
- Header height: `56px`
- Sidebar collapsed: `56px` / expanded: `240px`

This density is the single most impactful difference from CricketIQ's current default-density UI. Adopting it will immediately make CricketIQ feel more "pro."

---

## 7. Motion & Interaction

- **Backdrop blur** on sticky surfaces (header/sidebar) for depth.
- **Hover states** on all interactive rows/items.
- **Command palette** opens with `⌘K` for keyboard-first navigation.
- **Collapsible sidebar** with smooth width transition.
- Subtle transitions; no gratuitous animation. Motion supports state change, it does not decorate.

---

## 8. Dark Mode

- **Dark is the default** and primary experience.
- Light mode is fully supported and toggled from the header.
- Both modes share the same component structure; only palette values change.
- System preference is respected on first load.

---

## 9. Accessibility & Performance

- Semantic HTML (`<header>`, `<aside>`, `<nav>`, `<main>`).
- Keyboard shortcuts for power users.
- Clear focus states.
- Backdrop blur and borders instead of heavy shadows (cheaper to render).
- Dense layout reduces scroll and improves glanceability.

---

## 10. What CricketIQ Adopts vs. What It Keeps

### Adopt from StudioHub (visual/UX)
- **Inter** font family (replace Roboto).
- **Dense typography** — `13px` base, compact components.
- **Dark-first** theme with light mode support.
- **Indigo accent** (`#6366f1`) for interactive/active states.
- **Sectioned navigation** with uppercase monospace labels.
- **Collapsible sidebar** (56px / 240px).
- **56px header** with org switcher, `⌘K` palette, notifications, user menu, theme toggle.
- **Compact tables** (dense cells, uppercase headers).
- **Flat buttons** (no elevation), small size, `6px` radius.
- **Bordered cards** (1px border, minimal shadow).
- **Compact chips** (22px height, 11px font).
- **Backdrop blur** on sticky surfaces.
- **Command palette** (`⌘K`) as primary search/navigation.

### Keep from CricketIQ (domain & architecture)
- **Cricket-specific components** (Score, TeamBadge, PlayerAvatar, MatchStatus, etc.) — enhanced, not replaced.
- **Design token architecture** (`src/design/tokens.ts`) — refactored into `src/core/theme/`.
- **React Hook Form + Zod** form patterns.
- **TanStack Query / Table** data patterns.
- **Zustand** stores.
- **Framer Motion** for animation.
- **Business logic, API layer, and domain models** — untouched.

### Replace / Add
- **Lucide icons** (replace `@mui/icons-material`).
- **Centralized theme** at `src/core/theme/` (palette, typography, spacing, shadows, shape, breakpoints, components, light, dark).
- **Data table system** (Material React Table).
- **Page layout system** (PageShell, PageHeader, PageTabs, PageFilters, etc.).
- **Dialogs & drawers** (FormDialog, DetailDrawer, FilterDrawer, CommandDialog, CreateEntityDialog).
- **Analytics UI** and **states** (Loading/Empty/Error/Success/PermissionDenied/Offline).

---

## 11. Migration Order

1. **Theme** — centralized `src/core/theme/`, Inter font, indigo accent, dense defaults.
2. **Typography** — display/body/label/caption/overline/metrics + cricket-specific numeric styles.
3. **Shell** — AppShell, GlobalHeader, Sidebar, sectioned Navigation.
4. **Shared components** — page layouts, states, feedback.
5. **Tables** — data table system.
6. **Forms** — RHF + Zod, MUI-consistent.
7. **Dialogs & Drawers**.
8. **Dashboard** — HomePage redesign.
9. **Cricket components** — enhance existing, add new.
10. **Domain pages** — migrate representative pages.

---

*This audit is a living reference. As the CricketIQ makeover progresses, update this document to reflect final decisions and any deviations from StudioHub patterns.*
