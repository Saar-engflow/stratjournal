# UI Context

## Design Philosophy

StratJournal should feel:

* Professional
* Focused
* Analytical
* Calm
* Trustworthy
* Data-driven

The interface should never feel:

* Gamified
* Flashy
* Crypto-themed
* Neon-heavy
* Distracting

The UI should encourage reflection and disciplined review rather than excitement.

---

# Color Tokens

## Primary Accent

| Token              | Hex       | Usage                          |
| ------------------ | --------- | ------------------------------ |
| `--accent-primary` | `#16A34A` | Primary actions, active states |
| `--accent-hover`   | `#15803D` | Hover states                   |
| `--accent-light`   | `#22C55E` | Charts and positive highlights |
| `--accent-soft`    | `#DCFCE7` | Light backgrounds and badges   |
| `--accent-subtle`  | `#F0FDF4` | Very soft success backgrounds  |

---

## Success

| Token              | Hex       | Usage               |
| ------------------ | --------- | ------------------- |
| `--success`        | `#16A34A` | Winning trades      |
| `--success-soft`   | `#DCFCE7` | Success backgrounds |
| `--success-border` | `#86EFAC` | Success borders     |

---

## Warning

| Token              | Hex       | Usage                |
| ------------------ | --------- | -------------------- |
| `--warning`        | `#F59E0B` | Breakeven or caution |
| `--warning-soft`   | `#FEF3C7` | Warning backgrounds  |
| `--warning-border` | `#FCD34D` | Warning borders      |

---

## Danger

| Token             | Hex       | Usage            |
| ----------------- | --------- | ---------------- |
| `--danger`        | `#DC2626` | Losing trades    |
| `--danger-soft`   | `#FEE2E2` | Loss backgrounds |
| `--danger-border` | `#FCA5A5` | Loss borders     |

---

# Dark Theme

## Backgrounds

| Token                 | Hex       |
| --------------------- | --------- |
| `--background`        | `#09090B` |
| `--surface`           | `#111827` |
| `--surface-secondary` | `#1F2937` |
| `--surface-tertiary`  | `#374151` |

---

## Text

| Token              | Hex       |
| ------------------ | --------- |
| `--text-primary`   | `#F9FAFB` |
| `--text-secondary` | `#D1D5DB` |
| `--text-muted`     | `#9CA3AF` |

---

## Borders

| Token             | Hex       |
| ----------------- | --------- |
| `--border`        | `#27272A` |
| `--border-strong` | `#3F3F46` |

---

# Light Theme

## Backgrounds

| Token                 | Hex       |
| --------------------- | --------- |
| `--background`        | `#FAFAFA` |
| `--surface`           | `#FFFFFF` |
| `--surface-secondary` | `#F4F4F5` |
| `--surface-tertiary`  | `#E4E4E7` |

---

## Text

| Token              | Hex       |
| ------------------ | --------- |
| `--text-primary`   | `#18181B` |
| `--text-secondary` | `#3F3F46` |
| `--text-muted`     | `#71717A` |

---

## Borders

| Token             | Hex       |
| ----------------- | --------- |
| `--border`        | `#E4E4E7` |
| `--border-strong` | `#D4D4D8` |

---

# Calendar Colors

| Event          | Color                 |
| -------------- | --------------------- |
| Profitable Day | `#16A34A`             |
| Losing Day     | `#DC2626`             |
| Breakeven Day  | `#F59E0B`             |
| No Trades      | Default Surface Color |

---

# KPI Card Colors

| Metric       | Color         |
| ------------ | ------------- |
| Total Trades | Primary Text  |
| Win Rate     | Accent Green  |
| Net Profit   | Success Green |
| Net Loss     | Danger Red    |
| Open Trades  | Warning Amber |

---

# Chart Colors

| Token               | Hex           |
| ------------------- | ------------- |
| `--chart-primary`   | `#16A34A`     |
| `--chart-secondary` | `#22C55E`     |
| `--chart-grid`      | `#3F3F46`     |
| `--chart-tooltip`   | Surface Color |

Charts should remain minimal.

Avoid gradients unless explicitly required.

---

# Typography

## Primary Font

| Purpose            | Font             |
| ------------------ | ---------------- |
| Entire Application | Manrope Variable |

Import:

```css
@font-face {
  font-family: 'Manrope Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 200 800;
}
```

---

## Font Scale

| Usage          | Size |
| -------------- | ---- |
| Page Title     | 32px |
| Section Title  | 24px |
| Card Title     | 18px |
| Body Text      | 14px |
| Small Text     | 12px |
| Table Metadata | 11px |

---

## Font Weight Scale

| Usage          | Weight |
| -------------- | ------ |
| Hero Title     | 700    |
| Page Titles    | 700    |
| Section Titles | 600    |
| Body Text      | 400    |
| Secondary Text | 500    |

---

# Border Radius Scale

| Token       | Value |
| ----------- | ----- |
| `radius-sm` | 6px   |
| `radius-md` | 10px  |
| `radius-lg` | 14px  |
| `radius-xl` | 18px  |

Usage:

* Buttons → md
* Inputs → md
* Cards → lg
* Modals → xl

---

# Shadows

| Token       | Value           |
| ----------- | --------------- |
| `shadow-sm` | Subtle          |
| `shadow-md` | Card Elevation  |
| `shadow-lg` | Modal Elevation |

Avoid heavy shadows.

Use borders first.

---

# Accessibility Rules

* Minimum contrast ratio must pass WCAG AA.
* Never use color as the only indicator of trade outcome.
* Pair colors with labels and icons.
* Focus states must always be visible.
* Interactive elements must have hover and focus states.

---

# Future Accent Variants (Not V1)

| Theme          | Accent    |
| -------------- | --------- |
| Forest         | `#16A34A` |
| Emerald        | `#10B981` |
| Blue Terminal  | `#2563EB` |
| Amber Terminal | `#D97706` |

V1 uses Forest Green only.
