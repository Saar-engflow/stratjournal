# Unit 11 — Dashboard Charts

## Goal

Implement a visual analytics layer for the dashboard that allows users to understand trading performance trends over time using charts and recent trade activity. This system must derive all data from the `Trade` table and provide clear visual feedback on performance progression.

---

## Design

The charts layer is a **visual extension of Unit 10 metrics**, not a replacement.

### Layout Structure

```
[ KPI METRICS (Unit 10)  ]
          ↓
[ PERFORMANCE CHART      ]
          ↓
[ TREND VISUALIZATION    ]
          ↓
[ RECENT TRADES LIST     ]
```

---

### Visual Sections

#### 1. Performance Chart *(Main Focus)*

- Shows cumulative profit/loss over time
- Line chart preferred
- X-axis → time *(day/week depending on data volume)*
- Y-axis → cumulative P/L

#### 2. Trend Visualization

Optional supporting chart *(choose one for V1)*:
- Win/loss distribution
- Daily profit bars
- Equity curve smoothing

Keep it simple in V1.

#### 3. Recent Trades Section

List of last 5–10 trades. Each item shows:

| Field | Example |
|---|---|
| Instrument | XAUUSD |
| Direction | BUY / SELL |
| Result | WIN / LOSS |
| Profit/Loss | Value |
| Date | Closed date |

---

## Implementation

### 1. Data Layer (Server)

**File:** `src/server/analytics/dashboard-charts.ts`

#### `getChartData(userId: string)`

**Returns:**

```ts
{
  performance: [
    {
      date:       string
      profitLoss: number
      cumulative: number
    }
  ],
  recentTrades: Trade[]
}
```

---

### 2. Performance Chart Logic

**Rules:**
- Only CLOSED trades included
- Sorted by `closedAt` ascending
- Cumulative sum calculated server-side

**Example:**

```
Day 1: +100   → cumulative: 100
Day 2:  -50   → cumulative:  50
Day 3: +200   → cumulative: 250
```

---

### 3. Chart Library

```
Recharts (already in stack)
```

---

### 4. Components

**File:** `src/components/dashboard/performance-chart.tsx`

Responsibilities:
- Render line chart
- Accept precomputed dataset
- No data transformation inside component

**File:** `src/components/dashboard/recent-trades.tsx`

Responsibilities:
- Display list of last 5–10 trades
- Pure UI component only

**File:** `src/components/dashboard/trend-chart.tsx`

Options *(choose one for V1)*:
- Win/Loss bar chart
- Daily P/L histogram

Keep minimal and readable.

---

### 5. Dashboard Page Integration

**File:** `src/app/(app)/dashboard/page.tsx`

**Flow:**
1. Fetch KPI metrics *(Unit 10)*
2. Fetch chart data *(Unit 11)*
3. Pass to components

---

### 6. Data Rules

| Rule | Detail |
|---|---|
| Trade filter | Only CLOSED trades used in charts |
| OPEN trades | Excluded completely |
| Aggregation | No database aggregation tables |
| Caching | No caching layer in V1 |

---

### 7. Empty State Handling

**No trades exist:**

```
No trading data available yet.
Charts will appear once trades are recorded.
```

**Only OPEN trades exist:** Show empty chart state *(not an error)*

---

### 8. Performance Rules

- All aggregation done server-side
- Avoid recalculating on the client
- Memoize server results if needed later

---

### 9. Access Control

- Only authenticated user data
- Enforce `userId` filtering in all queries
- Never expose cross-user trade data

---

## Dependencies

No new packages required. Already available:

- Recharts
- Prisma
- Clerk
- shadcn/ui

---

## Verification Checklist

- [x] Performance chart renders correctly
- [x] Cumulative P/L is accurate
- [x] Only CLOSED trades are included
- [x] Recent trades display correctly
- [x] Trend visualization renders correctly
- [x] No client-side data aggregation
- [x] Server-side computation works correctly
- [x] Empty state renders properly
- [x] Mobile layout is responsive
- [x] Desktop layout is clean and spaced
- [x] No TypeScript errors
- [x] No console errors
- [x] `npm run build` passes