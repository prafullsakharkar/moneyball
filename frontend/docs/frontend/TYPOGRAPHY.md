# CricketIQ Typography

Typography system for CricketIQ, defined in [`src/core/theme/typography.ts`](../../src/core/theme/typography.ts) and built on the type tokens in [`src/design/tokens.ts`](../../src/design/tokens.ts).

---

## Principles

1. **Dense by default** — Base font size is **13px** (StudioHub reference), not the browser default 16px. This maximizes information density for data-heavy cricket views.
2. **Inter for UI, JetBrains Mono for numbers** — Sans-serif for reading, monospace for overs/rates/economy where alignment matters.
3. **Tabular numbers** — All cricket metrics use `font-variant-numeric: tabular-nums` so digits align in columns.
4. **Semantic components** — Use `Display`, `Heading`, `Body`, `Label`, `Caption`, `Overline`, `Metric` rather than raw `Typography` where possible.

---

## Font Families

| Token | Value |
|-------|-------|
| `fontFamily.sans` | `"Inter", "Roboto", "Helvetica", "Arial", sans-serif` |
| `fontFamily.mono` | `"JetBrains Mono", "Roboto Mono", "Consolas", monospace` |
| `fontFamily.display` | `"Inter", "Roboto", "Helvetica", "Arial", sans-serif` |

---

## Base Font Size

```ts
export const baseFontSize = 13;
```

MUI `fontSize` is set to 13 and `htmlFontSize` to 16. This means `1rem` in MUI context = 13px, while raw CSS `rem` still maps to 16px.

---

## MUI Typography Mapping

| MUI Variant | Size | Weight | Line-height | Notes |
|-------------|------|--------|-------------|-------|
| `h1` | 24px | 600 | 1.25 | Page titles |
| `h2` | 20px | 600 | 1.3 | Section titles |
| `h3` | 18px | 600 | 1.35 | Sub-sections |
| `h4` | 16px | 600 | 1.4 | Card titles |
| `h5` | 15px | 600 | 1.4 | |
| `h6` | 14px | 600 | 1.4 | |
| `subtitle1` | 14px | 500 | 1.5 | |
| `subtitle2` | 13px | 500 | 1.5 | |
| `body1` | 14px | 400 | 1.5 | Default body |
| `body2` | 13px | 400 | 1.5 | Secondary body |
| `caption` | 12px | 400 | 1.4 | |
| `overline` | 11px | 600 | 1.4 | Uppercase, 0.06em |
| `button` | 13px | 500 | — | No text-transform |

---

## Cricket Metrics

The `metrics` object provides numeric styles for cricket statistics. All use `tabular-nums`.

| Metric | Font | Weight | Notes |
|--------|------|--------|-------|
| `score` | sans | 700 | -0.02em letter-spacing |
| `runs` | sans | 600 | |
| `wickets` | sans | 600 | |
| `overs` | mono | 500 | |
| `runRate` | mono | 500 | |
| `economy` | mono | 500 | |
| `average` | mono | 500 | |
| `strikeRate` | mono | 500 | |

```ts
import { metrics } from '@core/theme';

const style = metrics.score; // { fontFamily, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }
```

---

## Semantic Typography Components

From `@shared/components`:

| Component | Usage |
|-----------|-------|
| `Display` | Hero/landing display text |
| `Heading` | Section headings |
| `Body` | Paragraph/body text |
| `Label` | Form labels, small emphasis |
| `Caption` | Captions, metadata |
| `Overline` | Uppercase eyebrow labels |
| `Metric` | Tabular-nums numeric value |
| `ScoreText` | Cricket score (runs/wickets) |
| `StatValue` | Stat card value |

```tsx
import { Display, Heading, Body, Label, Caption, Overline, Metric } from '@shared/components';

<Display>CricketIQ</Display>
<Heading>Match Center</Heading>
<Body>Live scores and analytics.</Body>
<Label>Team</Label>
<Caption>Updated 2m ago</Caption>
<Overline>Overview</Overline>
<Metric value={287} />
```

---

## Usage Guidelines

- **Page titles:** `h1` / `PageTitle` (24px, 600)
- **Card titles:** `h4` (16px, 600)
- **Body:** `body1` (14px) for primary, `body2` (13px) for secondary
- **Labels:** `label` preset (12px, 500, 0.01em)
- **Overlines:** `overline` (11px, 600, uppercase, 0.06em) for eyebrows
- **Numbers:** Always use `Metric` or `metrics.*` for tabular alignment
- **Overs/rates:** Use monospace (`metrics.overs`, `metrics.runRate`, etc.)
