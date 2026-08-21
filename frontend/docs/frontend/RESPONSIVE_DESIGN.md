# CricketIQ Responsive Design

Responsive strategy for CricketIQ, defined in [`src/core/theme/breakpoints.ts`](../../src/core/theme/breakpoints.ts) and the `useResponsive` hook.

---

## Breakpoints

| Token | Value | MUI Key | Typical Device |
|-------|-------|---------|----------------|
| `xs` | 0px | `xs` | Small phones |
| `sm` | 640px | `sm` | Large phones / small tablets |
| `md` | 768px | `md` | Tablets |
| `lg` | 1024px | `lg` | Laptops |
| `xl` | 1280px | `xl` | Desktops |
| `2xl` | 1536px | — | Ultra-wide |

```ts
import { breakpoints, muiBreakpoints } from '@core/theme';
```

MUI uses `xs`–`xl` (the `2xl` token is available for custom queries).

---

## The `useResponsive` Hook

```ts
import { useResponsive } from '@hooks';
```

| Return | Type | Description |
|--------|------|-------------|
| `isXs` | `boolean` | Only `xs` (< 640px) |
| `isSm` | `boolean` | ≥ `sm` (640px) |
| `isMd` | `boolean` | ≥ `md` (768px) |
| `isLg` | `boolean` | ≥ `lg` (1024px) |
| `isXl` | `boolean` | ≥ `xl` (1280px) |
| `isMobile` | `boolean` | Below `md` (< 768px) |
| `isTablet` | `boolean` | `sm`–`md` (640–768px) |
| `isDesktop` | `boolean` | ≥ `md` (768px) |
| `isTouch` | `boolean` | Touch-capable device (coarse pointer) |

```tsx
const { isMobile } = useResponsive();

{isMobile ? <MobileView /> : <DesktopView />}
```

---

## Responsive Patterns

### 1. Sidebar / Navigation

- **Desktop (`md`+):** Persistent drawer. Width `sidebarWidth` (260px), collapses to `sidebarCollapsedWidth` (64px).
- **Mobile (< `md`):** Temporary drawer that slides over content. Opened via the header menu toggle.

### 2. Grids

Use MUI `Grid` with responsive `size`:

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>...</Grid>
  <Grid size={{ xs: 12, md: 6 }}>...</Grid>
</Grid>
```

Or CSS grid with responsive `gridTemplateColumns`:

```tsx
<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
```

### 3. Stat Cards

```tsx
<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
  {stats.map((s) => <StatCard key={s.label} {...s} />)}
</Box>
```

### 4. Forms

Forms use `formMaxWidth` (480px) on desktop and full width on mobile. Multi-column forms collapse to single column below `sm`:

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6 }}>...</Grid>
  <Grid size={{ xs: 12, sm: 6 }}>...</Grid>
</Grid>
```

### 5. Data Tables

Tables scroll horizontally on small screens (`TableContainer` with `overflowX: auto`). Dense mode (`dense`) reduces row height for data-heavy views.

### 6. Dialogs & Drawers

- **Dialogs:** `maxWidth` responsive; full-width on mobile.
- **Drawers:** `drawerWidth` (400px) on desktop, full-width on mobile.

---

## Content Max Width

`PageShell` centers content with `maxWidth: layout.contentMaxWidth` (1200px). On ultra-wide screens content stays centered rather than stretching edge-to-edge.

---

## Mobile-First Approach

All responsive styles use the **mobile-first** pattern: define the base (mobile) value first, then override at larger breakpoints.

```tsx
<Box sx={{
  display: 'grid',
  gridTemplateColumns: '1fr',          // mobile
  sm: { gridTemplateColumns: 'repeat(2, 1fr)' },  // tablet
  lg: { gridTemplateColumns: 'repeat(4, 1fr)' },  // desktop
}}>
```

---

## Touch Targets

On touch devices (`isTouch`), interactive elements get adequate hit areas (≥ 44px) to meet accessibility guidelines.

---

## Testing

Verify responsive behavior at all breakpoints:

| Breakpoint | Check |
|------------|-------|
| `xs` (0–640) | Single column, temporary drawer, full-width forms |
| `sm` (640–768) | 2-column grids |
| `md` (768–1024) | Persistent sidebar, 2–4 column grids |
| `lg` (1024–1280) | Full desktop layout |
| `xl` (1280+) | Centered max-width content |
