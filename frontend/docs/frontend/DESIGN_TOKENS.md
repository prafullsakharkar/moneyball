# CricketIQ Design Tokens

All design decisions are encoded as tokens in [`src/design/tokens.ts`](../../src/design/tokens.ts). Components reference these tokens — never hardcode values.

The tokens are consumed by the MUI theme in [`src/core/theme/`](../../src/core/theme/) and re-exported through its public API.

---

## Colors

### Brand — Deep cricket blue

| Token | Hex | Usage |
|-------|-----|-------|
| `brand[50]` | `#e8f0fe` | Lightest tint |
| `brand[100]` | `#c5d9fc` | Light backgrounds, subtle highlights |
| `brand[200]` | `#9ebef9` | |
| `brand[300]` | `#6fa0f5` | |
| `brand[400]` | `#4a88f0` | Dark-mode primary |
| `brand[500]` | `#1565c0` | **Primary** actions, links, active states |
| `brand[600]` | `#1258a8` | |
| `brand[700]` | `#0d47a1` | Hover states, dark accents |
| `brand[800]` | `#0a3680` | |
| `brand[900]` | `#072660` | |
| `brand[950]` | `#041a42` | |

### Accent — Teal

| Token | Hex | Usage |
|-------|-----|-------|
| `accent[50]` | `#e0f2f1` | |
| `accent[100]` | `#b2dfdb` | |
| `accent[200]` | `#80cbc4` | |
| `accent[300]` | `#4db6ac` | |
| `accent[400]` | `#26a69a` | |
| `accent[500]` | `#00897b` | Score highlights, success states |
| `accent[600]` | `#00796b` | |
| `accent[700]` | `#00695c` | |
| `accent[800]` | `#004d40` | |
| `accent[900]` | `#003330` | |

### Neutral — Sophisticated greys

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral[0]` | `#ffffff` | White |
| `neutral[25]` | `#fcfcfd` | |
| `neutral[50]` | `#f8f9fb` | Light background |
| `neutral[100]` | `#f1f3f5` | |
| `neutral[200]` | `#e9ecef` | |
| `neutral[300]` | `#dee2e6` | Borders |
| `neutral[400]` | `#ced4da` | |
| `neutral[500]` | `#adb5bd` | Disabled |
| `neutral[600]` | `#868e96` | Secondary text |
| `neutral[700]` | `#495057` | |
| `neutral[800]` | `#343a40` | |
| `neutral[900]` | `#212529` | Primary text |
| `neutral[950]` | `#111318` | Near-black (dark bg) |

### Semantic — Status

| Token | 50 | 100 | 500 | 600 | 700 |
|-------|----|----|----|----|----|
| `success` | `#e8f5e9` | `#c8e6c9` | `#2e7d32` | `#1b5e20` | `#1a4721` |
| `warning` | `#fff3e0` | `#ffe0b2` | `#ed6c02` | `#e65100` | `#bf360c` |
| `error` | `#ffebee` | `#ffcdd2` | `#d32f2f` | `#c62828` | `#b71c1c` |
| `info` | `#e1f5fe` | `#b3e5fc` | `#0288d1` | `#0277bd` | `#01579b` |

### Cricket-specific

| Group | Token | Hex |
|-------|-------|-----|
| `pitch` | `green` | `#2d5016` |
| `pitch` | `light` | `#4a7c2e` |
| `pitch` | `worn` | `#8b7d3c` |
| `pitch` | `dust` | `#c4a94d` |
| `turf` | `fresh` | `#3a6b24` |
| `turf` | `used` | `#6b8a3f` |
| `turf` | `dry` | `#9e8c4a` |
| `turf` | `brown` | `#a08050` |

---

## Typography

### Font families

| Token | Value |
|-------|-------|
| `fontFamily.sans` | `"Inter", "Roboto", "Helvetica", "Arial", sans-serif` |
| `fontFamily.mono` | `"JetBrains Mono", "Roboto Mono", "Consolas", monospace` |
| `fontFamily.display` | `"Inter", "Roboto", "Helvetica", "Arial", sans-serif` |

### Font sizes (dense scale)

| Token | Size | Usage |
|-------|------|-------|
| `2xs` | 10px | Micro labels |
| `xs` | 12px | Captions, table headers |
| `sm` | 13px | Secondary text, form labels |
| `base` | 14px | Body (default) |
| `md` | 16px | Emphasized body |
| `lg` | 18px | Subheadings |
| `xl` | 20px | Section titles |
| `2xl` | 24px | Page titles |
| `3xl` | 30px | Hero |
| `4xl` | 36px | Display |

### Line heights

`none: 1`, `tight: 1.2`, `snug: 1.35`, `normal: 1.5`, `relaxed: 1.65`

### Font weights

`normal: 400`, `medium: 500`, `semibold: 600`, `bold: 700`

### Letter spacing

`tighter: -0.03em`, `tight: -0.02em`, `normal: 0`, `wide: 0.025em`, `wider: 0.05em`

### Preset text styles

| Preset | Size | Weight | Line-height | Letter-spacing |
|--------|------|--------|-------------|----------------|
| `display` | 36px | 700 | 1.15 | -0.03em |
| `h1` | 24px | 600 | 1.25 | -0.02em |
| `h2` | 20px | 600 | 1.3 | -0.015em |
| `h3` | 18px | 600 | 1.35 | — |
| `h4` | 16px | 600 | 1.4 | — |
| `body` | 14px | 400 | 1.5 | — |
| `body-sm` | 13px | 400 | 1.5 | — |
| `caption` | 12px | 400 | 1.4 | — |
| `label` | 12px | 500 | 1.4 | 0.01em |
| `overline` | 11px | 600 | 1.4 | 0.06em (uppercase) |
| `code` | 13px | 400 | — | mono |

---

## Spacing

4px base grid.

| Token | Value | Token | Value |
|-------|-------|-------|-------|
| `0` | 0px | `6` | 24px |
| `px` | 1px | `8` | 32px |
| `0.5` | 2px | `10` | 40px |
| `1` | 4px | `12` | 48px |
| `1.5` | 6px | `16` | 64px |
| `2` | 8px | `20` | 80px |
| `2.5` | 10px | `24` | 96px |
| `3` | 12px | `32` | 128px |
| `4` | 16px | | |
| `5` | 20px | | |

---

## Elevation

| Token | Shadow |
|-------|--------|
| `none` | `none` |
| `xs` | `0 1px 2px rgba(0,0,0,0.04)` |
| `sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` |
| `md` | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)` |
| `lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)` |
| `xl` | `0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)` |
| `2xl` | `0 25px 50px -12px rgba(0,0,0,0.16)` |
| `inner` | `inset 0 2px 4px rgba(0,0,0,0.06)` |

---

## Borders

| Token | Value |
|-------|-------|
| `width.thin` / `DEFAULT` | 1px |
| `width.medium` | 1.5px |
| `width.thick` | 2px |
| `width.heavy` | 3px |
| `color.light` | `rgba(0,0,0,0.06)` |
| `color.DEFAULT` | `rgba(0,0,0,0.08)` |
| `color.medium` | `rgba(0,0,0,0.12)` |
| `color.strong` | `rgba(0,0,0,0.20)` |
| `color.focus` | `brand[500]` |
| `color.error` | `error[500]` |
| `color.success` | `success[500]` |
| `color.warning` | `warning[500]` |

---

## Border Radius

| Token | Value |
|-------|-------|
| `none` | 0px |
| `sm` | 4px |
| `DEFAULT` | 6px |
| `md` | 8px |
| `lg` | 12px |
| `xl` | 16px |
| `2xl` | 20px |
| `full` | 9999px |

---

## Density

| Level | paddingY | paddingX | gap | rowHeight | itemHeight |
|-------|----------|----------|-----|-----------|------------|
| `compact` | 4px | 8px | 4px | 32px | 28px |
| `default` | 6px | 12px | 8px | 40px | 36px |
| `comfortable` | 12px | 16px | 12px | 48px | 44px |

---

## Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `fast` | 100ms | `cubic-bezier(0.25,0.1,0.25,1)` | Hover, focus |
| `normal` | 200ms | `cubic-bezier(0.25,0.1,0.25,1)` | Open, close |
| `smooth` | 300ms | `cubic-bezier(0.4,0,0.2,1)` | Page transitions |
| `emphasis` | 400ms | `cubic-bezier(0,0,0.2,1)` | Modal entrance |
| `spring` | 500ms | `cubic-bezier(0.34,1.56,0.64,1)` | Playful interactions |

---

## Z-Index Layers

| Token | Value |
|-------|-------|
| `base` | 0 |
| `dropdown` | 1000 |
| `sticky` | 1100 |
| `header` | 1200 |
| `drawer` | 1300 |
| `modal` | 1400 |
| `popover` | 1500 |
| `tooltip` | 1600 |
| `toast` | 1700 |
| `commandPalette` | 1800 |

---

## Breakpoints

| Token | Value |
|-------|-------|
| `xs` | 0px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## Layout Constants

| Token | Value |
|-------|-------|
| `sidebarWidth` | 260px |
| `sidebarCollapsedWidth` | 64px |
| `headerHeight` | 56px |
| `headerHeightCompact` | 48px |
| `headerHeightTall` | 64px |
| `contentMaxWidth` | 1200px |
| `formMaxWidth` | 480px |
| `dialogMaxWidth` | 560px |
| `drawerWidth` | 400px |

---

## Composite Export

```ts
export const tokens = {
  colors,
  typography,
  spacing,
  elevation,
  borders,
  radius,
  density,
  motion,
  layers,
  breakpoints,
  layout,
} as const;

export type Tokens = typeof tokens;
```
