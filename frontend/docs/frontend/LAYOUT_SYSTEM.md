# CricketIQ Layout System

Documentation for the application shell and page layout system.

---

## Application Shell

The app shell lives in [`src/layouts/`](../../src/layouts/).

```
src/layouts/
├── AppShell.tsx            # Root shell: sidebar + header + content
├── AppLayout.tsx           # Layout wrapper
├── AuthLayout.tsx          # Centered auth card layout
├── GlobalHeader.tsx        # Top app bar
├── PrimaryNavigation.tsx   # Sidebar navigation (collapsible, responsive)
├── Breadcrumbs.tsx         # Breadcrumb trail
└── navigation.ts           # Nav section/item definitions
```

### AppShell

```tsx
import { AppShell } from '@layouts';
```

Composes `PrimaryNavigation` (sidebar) + `GlobalHeader` + routed content. Uses a flex layout with `minHeight: 100vh`. The content area transitions on route change.

### GlobalHeader

Top app bar (`AppBar` + `Toolbar`). Contains:
- Menu toggle (mobile)
- Breadcrumbs
- Global search
- Organization switcher
- Notification center
- User menu
- Theme toggle

Height: `layout.headerHeight` (56px).

### PrimaryNavigation

Collapsible sidebar with:
- Brand/logo + current organization
- Grouped nav sections (`NAV_SECTIONS` from `navigation.ts`)
- Active state highlighting
- Badges
- Collapse toggle (desktop)

**Responsive behavior:**
- **Desktop (`md`+):** Persistent drawer, width `sidebarWidth` (260px) or `sidebarCollapsedWidth` (64px) when collapsed.
- **Mobile (< `md`):** Temporary drawer that slides over content.

### AuthLayout

Centered layout for auth pages (login, register, forgot/reset password). Uses the shared `Card` with `maxWidth: 440`, brand icon, and `background.default` background.

---

## Page Layout System

The page layout components live in [`src/shared/components/layout/`](../../src/shared/components/layout/) and are exported from `@shared/components`.

### Composition

```
PageShell (max-width container)
└── PageHeader (title + description + eyebrow + actions)
└── PageToolbar (filters/search row)
└── PageTabs (tab navigation)
└── PageSection (title + description + actions)
│   └── Card / DataTable / content
└── PageFooter
```

### PageShell

```tsx
import { PageShell } from '@shared/components';
```

Container with `maxWidth` (default `layout.contentMaxWidth` = 1200px). Centers content and applies horizontal padding.

### PageHeader

```tsx
<PageHeader
  eyebrow="Overview"
  title="Organizations"
  description="Manage all organizations in your workspace"
  actions={<Button variant="primary">New Organization</Button>}
/>
```

### PageSection

```tsx
<PageSection title="Team List" description="All teams in this organization" actions={<Button size="small">Add</Button>}>
  <Card>...</Card>
</PageSection>
```

### PageToolbar / PageFilters

```tsx
<PageToolbar>
  <Input placeholder="Search..." />
  <Select options={types} />
</PageToolbar>
```

---

## Layout Tokens

From [`src/design/tokens.ts`](../../src/design/tokens.ts) `layout`:

| Token | Value | Usage |
|-------|-------|-------|
| `sidebarWidth` | 260px | Expanded sidebar |
| `sidebarCollapsedWidth` | 64px | Collapsed sidebar |
| `headerHeight` | 56px | Default header |
| `headerHeightCompact` | 48px | Dense data views |
| `headerHeightTall` | 64px | Dashboard/home |
| `contentMaxWidth` | 1200px | Page content |
| `formMaxWidth` | 480px | Forms |
| `dialogMaxWidth` | 560px | Dialogs |
| `drawerWidth` | 400px | Drawers |

---

## Responsive Behavior

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| `xs` | < 640px | Mobile: temporary drawer, stacked grids, single-column forms |
| `sm` | ≥ 640px | Tablet: 2-column grids |
| `md` | ≥ 768px | Desktop: persistent sidebar, 2-4 column grids |
| `lg` | ≥ 1024px | Full desktop: expanded layouts |
| `xl` | ≥ 1280px | Wide: max-width content centered |
| `2xl` | ≥ 1536px | Ultra-wide |

See [`RESPONSIVE_DESIGN.md`](./RESPONSIVE_DESIGN.md) for the full responsive strategy.

---

## Usage Example

```tsx
import { PageShell, PageHeader, PageSection, PageToolbar, DataTable, Button, Input, Select } from '@shared/components';

export default function OrganizationListPage() {
  return (
    <PageShell>
      <PageHeader
        title="Organizations"
        description="Manage organizations"
        actions={<Button variant="primary">New</Button>}
      />
      <PageToolbar>
        <Input placeholder="Search..." />
        <Select options={typeOptions} />
      </PageToolbar>
      <PageSection title="All Organizations">
        <DataTable columns={columns} data={orgs} loading={isLoading} />
      </PageSection>
    </PageShell>
  );
}
```
