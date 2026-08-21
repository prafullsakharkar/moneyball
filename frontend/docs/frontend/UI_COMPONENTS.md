# CricketIQ UI Components

Reference for the shared component library in [`src/shared/components/`](../../src/shared/components/). All components are exported from the barrel [`src/shared/components/index.ts`](../../src/shared/components/index.ts) and imported via the `@shared/components` alias.

---

## UI Components (`ui/`)

### Button

```tsx
import { Button } from '@shared/components';
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | Visual style |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size |
| `startIcon` / `endIcon` | `ReactNode` | — | Icon slots |

> **Note:** The shared `Button` does **not** forward MUI's `component` prop. To render a link, use a plain `<Link>` element styled with `sx` or wrap the button.

```tsx
<Button variant="primary" loading={saving}>Save</Button>
<Button variant="danger" onClick={onDelete}>Delete</Button>
<Button variant="ghost" startIcon={<X />}>Cancel</Button>
```

### Input

```tsx
import { Input } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Field label |
| `description` | `string` | Helper text below label |
| `error` | `string` | Error message (turns field red) |
| `helperText` | `string` | Helper text below field |
| `startAdornment` / `endAdornment` | `ReactNode` | Adornments inside the field |
| `...TextFieldProps` | — | All MUI TextField props (except `variant`) |

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  startAdornment={<Mail size={16} />}
  {...register('email')}
/>
```

### Card

```tsx
import { Card } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Card title |
| `subtitle` | `ReactNode` | Card subtitle |
| `headerAction` | `ReactNode` | Action in the header (right) |
| `actions` | `ReactNode` | Footer actions |
| `hoverable` | `boolean` | Elevation on hover |
| `...MuiCardProps` | — | All MUI Card props |

> **Note:** The shared `Card`'s `CardContent` has its own default padding. Do **not** add `p` to the root `sx` or you get double padding.

```tsx
<Card title="Team Stats" subtitle="Season 2024" headerAction={<Button size="small">Edit</Button>}>
  ...
</Card>
```

### Dialog

```tsx
import { Dialog } from '@shared/components';
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Dialog title |
| `subtitle` | `ReactNode` | — | Dialog subtitle |
| `onClose` | `() => void` | — | Close handler (shows close button) |
| `actions` | `ReactNode` | — | Footer actions |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Max width |
| `padding` | `number` | `3` | Content padding |
| `...MuiDialogProps` | — | All MUI Dialog props |

### Drawer

```tsx
import { Drawer } from '@shared/components';
```

Slide-over panel with `title`, `subtitle`, `onClose`, `actions`, and `width` (default 400px).

### EmptyState

```tsx
import { EmptyState } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` | Icon |
| `title` | `string` | Title |
| `description` | `string` | Description |
| `action` | `ReactNode` | Action button |

### LoadingState

```tsx
import { LoadingState, Skeleton } from '@shared/components';
```

`LoadingState` — spinner with optional `message`, `fullPage` mode. `Skeleton` — animated placeholder with `width`, `height`, `variant`.

### ErrorState

```tsx
import { ErrorState } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Error title |
| `description` | `string` | Error detail |
| `onRetry` | `() => void` | Retry action |

### ConfirmDialog

```tsx
import { ConfirmDialog } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Open state |
| `title` | `string` | Title |
| `message` | `string` | Confirmation message |
| `confirmLabel` | `string` | Confirm button text |
| `cancelLabel` | `string` | Cancel button text |
| `destructive` | `boolean` | Warning styling |
| `onConfirm` | `() => void` | Confirm handler |
| `onCancel` | `() => void` | Cancel handler |

### ThemeToggle

```tsx
import { ThemeToggle } from '@shared/components';
```

Light/dark/system toggle using `useTheme()`.

---

## Page Layout Components (`layout/`)

### PageShell

```tsx
import { PageShell } from '@shared/components';
```

Page container. `maxWidth` (default 1200), `sx`, `className`.

### PageHeader

```tsx
import { PageHeader } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Page title |
| `description` | `ReactNode` | Page description |
| `eyebrow` | `ReactNode` | Small label above title |
| `actions` | `ReactNode` | Right-aligned actions |

### PageSection

```tsx
import { PageSection } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Section title |
| `description` | `ReactNode` | Section description |
| `actions` | `ReactNode` | Section actions |

### PageToolbar / PageFilters / PageTabs / PageFooter

Simple layout rows for filters, tabs, and footers. All accept `sx` and `className`.

```tsx
<PageShell>
  <PageHeader title="Organizations" actions={<Button>New</Button>} />
  <PageToolbar>
    <Input placeholder="Search..." />
    <Select options={types} />
  </PageToolbar>
  <PageSection title="List">
    <DataTable ... />
  </PageSection>
</PageShell>
```

---

## Typography Components (`typography/`)

| Component | Description |
|-----------|-------------|
| `Display` | Large display heading |
| `Heading` | Section heading |
| `Body` | Body text |
| `Label` | Small label |
| `Caption` | Caption text |
| `Overline` | Uppercase overline |
| `Metric` | Tabular-nums numeric display |
| `ScoreText` | Cricket score text |
| `StatValue` | Stat value text |

---

## Form Components (`form/`)

### FormField

```tsx
import { FormField } from '@shared/components';
```

Label + control + error wrapper. `label`, `error`, `required`, `children`.

### FormRow

Grid row for fields. `columns` (default 2), `gap`.

### FormActions

```tsx
import { FormActions } from '@shared/components';
```

Right-aligned action row. `submitLabel`, `cancelLabel`, `onCancel`, `loading`, `submit`.

### Select

```tsx
import { Select } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label |
| `options` | `SelectOption[]` | `{ value, label }` |
| `placeholder` | `string` | Placeholder |
| `description` | `string` | Helper text |
| `error` | `string` | Error message |

### TextArea

Multiline input. `label`, `rows`, `error`, `description`.

### Switch

Toggle switch. `label`, `description`, `checked`, `onChange`.

### Checkbox

```tsx
import { Checkbox } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | `ReactNode` | Label |
| `description` | `ReactNode` | Description |
| `error` | `string` | Error message |

---

## Data Table (`table/`)

### DataTable

```tsx
import { DataTable } from '@shared/components';
import type { DataTableColumn } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `DataTableColumn<T>[]` | Column definitions |
| `data` | `T[]` | Row data |
| `getRowId` | `(row: T) => string` | Row key |
| `loading` | `boolean` | Loading state |
| `loadingRows` | `number` | Skeleton rows while loading |
| `emptyTitle` / `emptyDescription` | `string` | Empty state copy |
| `onRowClick` | `(row: T) => void` | Row click handler |
| `dense` | `boolean` | Compact density |
| `selectable` | `boolean` | Row checkboxes |
| `sortable` | `boolean` | Column sorting |
| `stickyHeader` | `boolean` | Sticky header |
| `maxHeight` | `number` | Scroll container height |

```tsx
const columns: DataTableColumn<Org>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
  { id: 'type', header: 'Type', cell: (row) => <Chip label={row.type} /> },
];

<DataTable columns={columns} data={orgs} getRowId={(o) => o.id} loading={isLoading} />
```

---

## Feedback Components (`feedback/`)

### ToastProvider / useToast

```tsx
import { ToastProvider, useToast } from '@shared/components';

// Wrap app (already done in AppProvider)
<ToastProvider>{children}</ToastProvider>

// In a component
const toast = useToast();
toast.success('Saved');
toast.error('Failed');
toast.info('Heads up');
toast.warning('Careful');
```

### Banner

```tsx
import { Banner } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `tone` | `'info' \| 'success' \| 'warning' \| 'error'` | Tone |
| `title` | `string` | Title |
| `children` | `ReactNode` | Body |
| `onDismiss` | `() => void` | Dismiss handler |

---

## Cricket Components (`cricket/`)

### Score

```tsx
import { Score } from '@shared/components';
```

| Prop | Type | Description |
|------|------|-------------|
| `runs` | `number` | Runs |
| `wickets` | `number` | Wickets |
| `overs` | `number` | Overs |
| `runRate` | `number` | Run rate |
| `team` | `string` | Team short name |
| `subtitle` | `string` | Subtitle |

### Scoreboard

Full match scoreboard. `home`, `away`, `homeScore`, `awayScore`, `status`, `venue`.

### PlayerAvatar

| Prop | Type | Description |
|------|------|-------------|
| `firstName` / `lastName` | `string` | Name |
| `role` | `'batsman' \| 'bowler' \| 'allrounder' \| 'wicketkeeper'` | Role |
| `size` | `'sm' \| 'md' \| 'lg'` | Size |
| `online` | `boolean` | Online status dot |

### TeamBadge

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Full name |
| `shortName` | `string` | Short name |
| `score` | `{ runs, wickets, overs }` | Optional score |

### MatchStatus

| Prop | Type | Description |
|------|------|-------------|
| `state` | `'live' \| 'scheduled' \| 'completed'` | State |
| `innings` | `number` | Innings |

### LiveIndicator

Pulsing red dot with `LIVE`/`REC` label.

### StatCard

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number \| string` | Stat value |
| `label` | `string` | Label |
| `trend` | `'up' \| 'down' \| 'neutral'` | Trend |
| `trendValue` | `string` | Trend delta |
| `comparison` | `string` | Comparison text |
| `icon` | `ReactNode` | Icon |
| `accent` | `string` | Accent color |
| `compact` | `boolean` | Compact mode |

### PerformanceMetric

Metric with bar indicator. `label`, `value`, `max`, `color`.

### FormIndicator

Recent form. `results: ('W' | 'L' | 'D' | 'T' | 'N')[]`.

### TournamentBadge

Tournament/league badge. `name`, `type`, `season`, `status`.

---

## Analytics Components (`analytics/`)

Self-contained SVG charts — no chart library dependency.

### Sparkline

```tsx
import { Sparkline } from '@shared/components';
```

`data: number[]`, `width`, `height`, `color`.

### BarChart

```tsx
import { BarChart } from '@shared/components';
```

`data: { label, value }[]`, `height`, `showValues`, `showLabels`, `color`.

### DonutChart

```tsx
import { DonutChart } from '@shared/components';
```

`value`, `max`, `size`, `thickness`, `color`, `label`.

---

## Motion (`motion/`)

```tsx
import { Motion, motion, fadeUp, fade, slideInRight, scaleIn, stagger } from '@shared/components';
```

| Export | Description |
|--------|-------------|
| `Motion` | Wrapper with `variant` (`fadeUp`/`fade`/`slideInRight`/`scaleIn`/`stagger`), `delay` |
| `motion` | Framer Motion `motion` re-export |
| `fadeUp` / `fade` / `slideInRight` / `scaleIn` / `stagger` | Variant presets |

```tsx
<Motion variant="fadeUp" delay={0.1}>
  <Card>...</Card>
</Motion>

<motion.div variants={stagger} initial="hidden" animate="visible">
  ...
</motion.div>
```
