# Unit 10 — Dashboard Metrics

## Goal

Implement a server-derived dashboard metrics system that calculates and displays key trading performance indicators (KPIs) based entirely on the user's trade data. The dashboard must provide real-time insights into trading performance without storing any computed analytics in the database.

---

## Design

The dashboard is a **read-only analytics layer** built on top of the `Trade` model (single source of truth).

### KPI Cards Layout

**Desktop:**

```
[ Total Trades ] [ Open Trades ] [ Closed Trades ] [ Win Rate ] [ Net P/L ]
```

**Mobile:** Single column stacked KPI cards

### Visual Rules

- Use `Card` from shadcn/ui for each KPI
- Consistent color semantics: Profit → green · Loss → red · Neutral → gray
- Subtle background tinting *(not hard colors)*
- Numbers: large and bold
- Labels: small and muted

### Data Flow

```
Database (Trade table)
         ↓
Server Layer (analytics.ts)
         ↓
Dashboard Server Component
         ↓
KPI UI Components
```

### Important Rule

All metrics must be:
- Computed server-side
- Derived from `Trade`
- Never stored in the database
- Never cached in DB tables

---

## Implementation

### 1. Server Analytics Layer

**File:** `src/server/analytics/dashboard-metrics.ts`

#### `getDashboardMetrics(userId: string)`

**Returns:**

```ts
{
  totalTrades:    number
  openTrades:     number
  closedTrades:   number
  winRate:        number
  netProfitLoss:  number
}
```

**Logic:**

| Metric | Calculation |
|---|---|
| `totalTrades` | All trades for user |
| `openTrades` | Trades where `status = "OPEN"` |
| `closedTrades` | Trades where `status = "CLOSED"` |
| `winRate` | `(winning trades / closedTrades) * 100` |
| `netProfitLoss` | `sum(profitLoss)` for CLOSED trades only |

---

### 2. Prisma Queries

- Use a single optimised query to fetch all trades for the user
- Filter in memory, or use grouped queries if needed later

> **Always enforce `userId` filter. Never query cross-user data.**

---

### 3. Dashboard Page Integration

**File:** `src/app/(app)/dashboard/page.tsx`

**Responsibilities:**
- Call `getDashboardMetrics`
- Render KPI cards
- Pass data to UI components

> Must be a **Server Component**.

---

### 4. KPI Components

**File:** `src/components/dashboard/kpi-card.tsx`

**Props:**

```ts
{
  title:     string
  value:     string | number
  subtitle?: string
  variant?:  "default" | "profit" | "loss"
}
```

**Rules:**
- No business logic inside component
- Display formatting only
- Accept pre-calculated values only

---

### 5. Win Rate Calculation Rules

| Edge Case | Behaviour |
|---|---|
| `closedTrades = 0` | `winRate = 0` |
| Winning trade | `profitLoss > 0` |
| Breakeven | Not counted as win *(until explicitly defined)* |

---

### 6. Net Profit/Loss Rules

- Only CLOSED trades included
- Sum all `profitLoss` values
- Can be positive or negative
- Format as currency using account currency *(if available later)*

---

### 7. Loading & Empty States

**No trades exist:**

```
No trading data available yet.
Start by creating your first trade.
```

**Loading:** Use `Skeleton` KPI cards

---

### 8. Access Control

- Only authenticated users can access the dashboard
- Must use `requireUser()` from existing auth layer
- All queries must use `userId` from Clerk

---

## Dependencies

No new packages required. Existing stack:

- Prisma *(data access)*
- Clerk *(auth)*
- shadcn/ui *(UI components)*
- React *(Server Components)*

Optional future: `date-fns` *(if time-based metrics are added later)*

---

## Verification Checklist

- [x] Total trades count is accurate
- [x] Open trades count is accurate
- [x] Closed trades count is accurate
- [x] Win rate is correctly calculated
- [x] Net P/L only includes closed trades
- [x] No database fields store computed metrics
- [x] Metrics are derived only from Trade table
- [x] Server-side calculation only *(no client mutation)*
- [x] Mobile layout stacks correctly
- [x] Desktop layout grid works
- [x] Loading states display correctly
- [x] Empty states display correctly
- [x] No TypeScript errors
- [x] No console errors
- [x] `npm run build` passes
