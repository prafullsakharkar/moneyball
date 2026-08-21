# CricketOS Design System

> Premium global Cricket Operating System design language.
>
> Inspired by Monologue-style productivity software, Linear-level product polish,
> and enterprise operational interfaces.
>
> This is an independent CricketOS design system.
> Do not copy third-party branding, assets, logos, or proprietary UI.

---

## 01. Visual Theme & Atmosphere

CricketOS is a global enterprise operating system for cricket organizations.

The interface should feel:

- Precise
- Calm
- Dense
- Fast
- Intelligent
- Professional
- Modern
- Operational
- Data-driven
- Premium

The visual language combines:

    Productivity SaaS
    +
    Enterprise operations
    +
    Sports intelligence
    +
    Cricket analytics

The product should feel closer to:

    Linear
    +
    Bloomberg-style information density
    +
    modern sports analytics

than:

    generic admin dashboard
    +
    sports news website
    +
    fantasy cricket application

### Core Principle

CricketOS is software for people who operate cricket.

It is not primarily a website for people who consume cricket.

The interface should therefore prioritize:

    Information
    Context
    Speed
    Accuracy
    Actions

over decorative visuals.

### Visual Personality

- Dark-first
- Minimal
- Compact
- High information density
- Subtle borders
- Restrained color
- Strong typography
- Clear hierarchy
- Precise spacing
- Minimal shadows
- Contextual interactions
- Keyboard-first workflows

### Avoid

Do not introduce:

- Excessive gradients
- Glassmorphism everywhere
- Huge hero cards
- Excessive rounded containers
- Decorative cricket balls
- Stadium backgrounds
- Excessive green
- Neon sports styling
- Random accent colors
- Oversized typography in application screens
- Excessive whitespace
- Generic SaaS dashboard patterns

---

## 02. Color Palette & Roles

CricketOS uses a neutral dark foundation with a restrained cricket-inspired green accent.

The accent represents:

- active state
- success
- live state
- primary actions
- selected controls

It must not be used everywhere.

### Dark Theme

```css
--background: #090A0B;
--surface-100: #101113;
--surface-200: #141619;
--surface-300: #191C20;
--surface-400: #20242A;

--foreground: #F1F3F4;
--muted: rgba(241, 243, 244, 0.64);
--subtle: rgba(241, 243, 244, 0.42);
--disabled: rgba(241, 243, 244, 0.25);

--border: rgba(255,255,255,0.07);
--border-strong: rgba(255,255,255,0.13);
--focus: rgba(163,230,53,0.55);
```

### CricketOS Accent

```css
--accent: #A3E635;
--accent-dim: rgba(163,230,53,0.14);
--accent-dark: #65A30D;
```

Use the accent for:

- active
- live
- selected
- positive
- primary action

Do not make entire cards green.

### Semantic Colors

```css
--success: #84CC16;
--warning: #F59E0B;
--danger: #F87171;
--info: #60A5FA;
```

### Cricket-Specific Status

**LIVE**

Use the accent with a subtle indicator:

```text
● LIVE
```

**COMPLETED**

Use muted neutral styling.

**UPCOMING**

Use secondary text with subtle emphasis.

**ABANDONED**

Use warning/error semantics.

### Light Theme

Do not simply invert the dark theme.

```css
--background: #F7F7F5;
--surface-100: #FFFFFF;
--surface-200: #F2F2EF;
--surface-300: #EAEAE6;

--foreground: #151515;
--muted: rgba(21,21,21,0.62);
--subtle: rgba(21,21,21,0.42);

--border: rgba(21,21,21,0.09);
--border-strong: rgba(21,21,21,0.16);

--accent: #65A30D;
```

---

## 03. Typography Rules

Typography must prioritize:

- readability
- hierarchy
- density
- numerical clarity
- scanning

Avoid excessive font-size variation.

### Font Family

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

If the existing CricketOS project has an approved font, preserve it unless the design audit determines that replacement is necessary.

### Display

```css
font-size: clamp(36px, 5vw, 64px);
line-height: 1.04;
letter-spacing: -0.035em;
font-weight: 500;
```

Use only for major marketing or introduction surfaces.

### Page Heading

```css
font-size: 24px;
line-height: 1.2;
letter-spacing: -0.02em;
font-weight: 600;
```

### Section Heading

```css
font-size: 16px;
line-height: 1.3;
font-weight: 600;
```

### Body

```css
font-size: 14px;
line-height: 1.55;
letter-spacing: -0.005em;
font-weight: 400;
```

### Small Body

```css
font-size: 13px;
line-height: 1.5;
```

### Labels

```css
font-size: 12px;
line-height: 1.4;
font-weight: 500;
```

### Metadata

```css
font-size: 12px;
line-height: 1.4;
color: var(--subtle);
```

### Numeric Typography

CricketOS contains large amounts of numeric information.

Use:

```css
font-variant-numeric: tabular-nums;
```

Apply to:

- runs
- wickets
- overs
- averages
- strike rates
- economy
- rankings
- points
- prices
- dates
- timestamps

### Score Typography

Large match scores:

```css
font-size: 28px;
font-weight: 600;
letter-spacing: -0.03em;
font-variant-numeric: tabular-nums;
```

Critical live score:

```css
font-size: 32px;
font-weight: 600;
```

Do not make scores unnecessarily gigantic.

### Monospace

Use selectively for:

- code
- technical identifiers
- event IDs
- API information
- terminal-like AI output

Preferred:

```css
font-family:
  "JetBrains Mono",
  "SFMono-Regular",
  Consolas,
  monospace;
```

---

## 04. Component Styling

Components should feel compact, precise, and intentional.

### Buttons

Buttons should have clear hierarchy.

#### Primary

Use the accent only for the most important action.

#### Secondary

Use neutral surfaces.

#### Ghost

Use transparent background.

#### Destructive

Use danger only for destructive operations.

Do not make destructive buttons visually dominant unless necessary.

### Button Dimensions

```text
Default: 36px
Compact: 32px
Large: 40px
Padding: 0 12px
Radius: 6px
```

Avoid oversized buttons inside enterprise workflows.

### Inputs

```text
Height: 36px
Radius: 6px
```

Use:

- clear labels
- subtle borders
- strong focus state
- concise helper text

Avoid excessive rounded inputs.

### Cards

Cards should not dominate the interface.

Use cards for:

- grouped information
- metrics
- contextual panels
- summaries

Avoid cards for every piece of information.

### Panels

```css
background: var(--surface-100);
border: 1px solid var(--border);
border-radius: 8px;
```

### Tables

Tables are central to CricketOS.

Use:

- compact rows
- sticky headers
- subtle separators
- aligned numeric columns
- strong hover states
- contextual actions

Default row height:

```text
40px
```

Dense:

```text
36px
```

Comfortable:

```text
44px
```

### Table Header

```text
12px
font-weight: 500
color: var(--subtle)
```

Avoid heavy backgrounds.

### Table Rows

```css
border-bottom: 1px solid var(--border);
```

Hover:

```css
background: var(--surface-200);
```

Selected:

```css
background: var(--accent-dim);
```

### Badges

Badges should be small.

Examples:

```text
LIVE
T20
COMPLETED
PENDING
ACTIVE
```

Avoid large pill-shaped badges.

### Avatars

Players:

- 32px default
- 40px detail
- 24px compact table

Use circular avatars unless team identity requires another shape.

### Team Identity

Team badges may use circular, shield, or square forms depending on source artwork.

Do not force every logo into a circle.

### Tabs

Tabs should be compact.

Use tabs for:

- Player workspace
- Team workspace
- Match workspace
- Tournament workspace

Active state:

- accent
- strong text
- subtle indicator

Avoid oversized tab bars.

### Dialogs

Use dialogs for:

- confirmation
- short forms
- destructive actions

Do not use dialogs for entire workflows.

### Drawers

Use drawers for contextual workflows.

Examples:

```text
Player list → Player detail drawer
Match list → Match details
Tournament list → Tournament summary
```

Drawers preserve context.

### Command Palette

Command palette should feel fast and native.

Shortcuts:

```text
⌘K
Ctrl+K
```

Support:

- navigation
- search
- creation
- organization switching
- actions

### Tooltips

Tooltips should be:

- concise
- delayed
- non-blocking

Use primarily for:

- icon-only actions
- collapsed navigation
- unfamiliar controls

---

## 05. Layout Principles

CricketOS is an application workspace.

### Application Layout

```text
┌────────────┬───────────────────────────────┐
│            │ Header                        │
│ Sidebar    ├───────────────────────────────┤
│            │                               │
│            │ Workspace                     │
│            │                               │
│            │                               │
└────────────┴───────────────────────────────┘
```

### Sidebar

```text
Expanded: 240px
Compact: 64px
```

Do not make the sidebar wider than necessary.

### Header

```text
56px
```

Avoid oversized headers.

### Page Padding

```text
Desktop: 24px
Large screens: 32px
Compact: 16px
```

### Spacing Scale

Use a 4px base unit:

```text
2
4
6
8
12
16
20
24
32
40
48
64
```

Prefer the smallest spacing that maintains readability.

### Information Density

Default application density:

```text
Compact
```

Use whitespace to establish hierarchy.

Do not use whitespace merely to fill the viewport.

### Workspace Principle

Pages should answer:

1. Where am I?
2. What am I looking at?
3. What is important?
4. What can I do?
5. What is related?

### Contextual Navigation

Prefer:

```text
Tournament
   ↓
Season
   ↓
Fixture
   ↓
Match
   ↓
Player
```

over forcing users back to global navigation after every action.

### Split Views

Use split views for:

- lists + details
- search + results
- analytics + configuration
- media + metadata

### Dashboard

Dashboards should be operational.

Avoid:

```text
KPI
KPI
KPI
KPI
```

Prefer:

```text
Today
Live
Competition
Performance
Operations
Intelligence
```

---

## 06. Depth & Elevation

CricketOS should use restrained elevation.

Avoid heavy shadows.

Prefer:

- borders
- surface contrast
- subtle elevation

### Elevation Levels

Level 0:

```text
Page background
```

Level 1:

```text
surface-100
```

Level 2:

```text
surface-200
```

Level 3:

```text
surface-300
```

### Shadows

Dialogs and popovers may use:

```css
box-shadow: 0 12px 40px rgba(0,0,0,0.28);
```

Do not apply large shadows to every card.

### Borders

Borders are more important than shadows.

```css
border: 1px solid var(--border);
```

### Radius

```text
sm: 4px
md: 6px
lg: 8px
xl: 12px
full: 9999px
```

Default:

```text
6px–8px
```

Avoid excessive pill shapes.

---

## 07. Interaction & Motion

Motion should communicate state.

It should never slow down expert users.

### Standard Transition

```css
transition-timing-function:
  cubic-bezier(0.2, 0.7, 0.2, 1);

transition-duration:
  180ms;
```

### Timing

```text
Fast: 120ms
Standard: 180–220ms
Slow: 300–400ms
```

### Hover

Hover states should be subtle.

```text
surface-100 → surface-200
```

Do not create dramatic scale animations.

### Focus

Focus must always be visible.

```css
outline: 2px solid var(--focus);
outline-offset: 2px;
```

### Live Indicator

Live matches may use a subtle pulse.

```text
● LIVE
```

Do not animate the entire score.

### Loading

Prefer:

- skeleton
- subtle opacity
- progress indicators

Avoid aggressive spinners everywhere.

### Optimistic Updates

Where safe:

1. update UI immediately
2. submit request
3. confirm server state
4. rollback on failure

### Keyboard Interaction

Important shortcuts:

```text
⌘/Ctrl + K → Search
G then M   → Matches
G then P   → Players
G then T   → Teams
G then A   → Analytics
Esc        → Close
Enter      → Confirm
/          → Focus search
```

Only implement shortcuts that do not conflict with browser behavior.

---

## 08. Responsive Behavior

CricketOS is desktop-first because professional operations are primarily desktop workflows.

Every major screen must remain usable on smaller screens.

### Desktop

```text
≥ 1280px
```

Use:

- full sidebar
- dense tables
- multi-column layouts
- split views
- analytics panels

### Tablet

```text
768px – 1279px
```

Use:

- compact sidebar
- reduced columns
- drawers
- horizontal tabs
- responsive tables

### Mobile

```text
< 768px
```

Prioritize:

- matches
- scores
- notifications
- players
- teams
- quick actions

Do not simply shrink desktop tables.

Instead:

- hide low-priority columns
- provide row details
- use drawers
- use horizontal scrolling only where necessary

### Mobile Navigation

Use:

- bottom navigation for key actions where appropriate
- drawer navigation
- compact header

Do not expose the entire desktop navigation hierarchy at once.

### Mobile Match Center

Prioritize:

```text
Match Status
Team A
Score
Team B
Score

Current Over

Key Stats

Commentary
```

### Touch Targets

Minimum recommended target:

```text
44px
```

Even when visual controls are compact.

---

## 09. Agent Prompt Guide

Every AI coding agent working on CricketOS must read this DESIGN.md before modifying UI.

### Source of Truth

```text
DESIGN.md
↓
Existing CricketOS Design System
↓
MUI Theme
↓
Shared Components
↓
Domain Components
```

Do not introduce a competing visual language.

### Before Writing UI

The agent MUST:

1. Read DESIGN.md.
2. Inspect existing components.
3. Search for reusable components.
4. Check the MUI theme.
5. Check responsive patterns.
6. Check dark/light themes.
7. Follow established spacing.
8. Follow typography rules.
9. Preserve accessibility.
10. Preserve existing business logic.

### Component Rule

Before creating a new:

```text
Button
Card
Modal
Table
Input
```

search the existing component library.

Prefer reuse.

### Theme Rule

Never hardcode visual values when a design token exists.

Avoid:

```tsx
color="#A3E635"
```

Prefer theme tokens.

Avoid arbitrary radius and spacing values.

### Layout Rule

Do not create page-specific spacing systems.

Use shared primitives such as:

```text
PageShell
PageHeader
PageToolbar
PageContent
PageSection
```

### Data Density Rule

For enterprise pages prefer:

```text
more useful information
+
less decorative whitespace
```

without sacrificing readability.

### Dashboard Rule

Never create a dashboard consisting primarily of:

```text
large KPI cards
large empty spaces
decorative charts
```

Every dashboard component must answer a real operational question.

### Table Rule

Tables should be:

- compact
- sortable
- filterable
- searchable
- keyboard accessible
- responsive

### Cricket Rule

Cricket-specific design should come from:

- scores
- statistics
- player identity
- team identity
- match state
- competition context
- performance

not decorative cricket graphics.

### AI Rule

AI interfaces must:

- respect tenant boundaries
- respect permissions
- show context
- show supporting data
- avoid presenting generated information as authoritative without qualification

### Accessibility Rule

Every component must support:

- keyboard
- focus
- semantic HTML
- screen readers
- contrast

### Responsive Rule

Every page must be checked at:

```text
1440px
1920px
2560px
1024px
768px
390px
```

### Visual QA Rule

After implementing UI, check:

- alignment
- spacing
- typography
- colors
- borders
- radius
- density
- hierarchy
- responsive behavior
- dark mode
- hover
- focus
- loading
- empty
- error

Do not declare completion merely because TypeScript compiles.

---

## 10. MUI Implementation

Use MUI as the primary component system.

Centralize customization in:

```text
src/core/theme/
```

Prefer:

```text
theme.components
```

over per-component overrides.

If Tailwind is present, use it primarily for utility layout and responsive utilities. Do not allow Tailwind and MUI to create conflicting design systems.

MUI remains the semantic component foundation.

---

## 11. Charts

Charts must use the same:

- typography
- colors
- spacing
- borders
- tooltips

as the rest of CricketOS.

Avoid rainbow charts.

Use restrained semantic colors.

Charts should prioritize:

- comparison
- trend
- context
- anomaly
- decision support

---

## 12. Final Design Principle

CricketOS should feel like:

> A serious operating system for serious cricket organizations.

The interface should disappear behind the work.

Users should think:

> "I can operate cricket from here."

not:

> "This is a pretty dashboard."

---

## Final Quality Checklist

Before completing any UI task:

- [ ] DESIGN.md read
- [ ] Existing components inspected
- [ ] Existing theme reused
- [ ] No duplicate components
- [ ] No hardcoded colors
- [ ] No arbitrary spacing
- [ ] Typography follows system
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Responsive behavior works
- [ ] Keyboard navigation works
- [ ] Focus states work
- [ ] Loading state exists
- [ ] Empty state exists
- [ ] Error state exists
- [ ] Permission state exists
- [ ] Tables are dense
- [ ] Primary action is obvious
- [ ] Context is obvious
- [ ] Existing functionality preserved

---

# CricketOS Design Mantra

Less decoration.

More information.

Less navigation.

More context.

Less clicking.

More keyboard.

Less dashboard.

More workspace.

Less noise.

More intelligence.

---

# End of DESIGN.md
