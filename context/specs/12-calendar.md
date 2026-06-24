# Unit 12 — Calendar

## Goal

Implement a monthly trading calendar that visually represents trading activity, allowing users to review performance by day, including profit/loss, trades, and notes. All calendar data must be derived from `Trade` and `TradeNote` records without introducing any new source of truth.

---

## Design

The calendar is a **time-based visualization layer** over trading data.

### Layout Structure

```
[ Month Selector     ]
         ↓
[ Calendar Grid      ]
         ↓
[ Daily Detail Modal ]
```

### Calendar Grid *(Desktop)*

- 7-column grid (Mon–Sun)
- Each cell represents a day
- Highlight trading days

### Mobile Layout

- Vertical list of days OR simplified grid
- Focus on usability over density

### Day Cell Indicators

Each day shows:

| Indicator | Detail |
|---|---|
| Net P/L | Color coded |
| Trade count | Number of trades |
| Note dot | Small dot if notes exist |

**Color rules:** Green → profit · Red → loss · Gray → no activity

### Daily Modal *(Detail View)*

On click, shows:
- List of trades for that day
- Trade previews *(instrument, direction, result)
- Daily P/L summary
- Notes preview *(if any)*

---

## Implementation

### 1. Data Layer (Server)

**File:** `src/server/analytics/calendar-data.ts`

#### `getCalendarData(userId: string, month: number, year: number)`

**Returns:**

```ts
{
  days: {
    date:        string
    profitLoss:  number
    tradesCount: number
    hasNotes:    boolean
    trades:      Trade[]
    notes:       TradeNote[]
  }[]
}
```

---

### 2. Data Rules

| Rule | Detail |
|---|---|
| P/L calculation | Only CLOSED trades count |
| OPEN trades | Shown in previews only, not P/L |
| Notes | Included regardless of trade status |
| Grouping | Group trades by `closedAt` date |

---

### 3. Calendar Generation Logic

1. Fetch all trades for user
2. Filter by selected month/year
3. Group by date (`closedAt`)
4. Calculate per day: total P/L · trade count · note existence

---

### 4. Components

**File:** `src/components/calendar/calendar-grid.tsx`

Responsibilities:
- Render monthly grid
- Display day cells
- Handle navigation *(prev/next month)*

**File:** `src/components/calendar/day-cell.tsx`

Responsibilities:
- Render single day
- Show indicators *(P/L, trades, notes)*
- Handle click interaction

**File:** `src/components/calendar/day-modal.tsx`

Responsibilities:
- Show daily breakdown
- List trades
- Show notes preview

---

### 5. Calendar Page

**Route:** `/calendar`

**Responsibilities:**
- Fetch calendar data from server
- Manage selected month state
- Pass data to grid component

> Must be a **Server + Client hybrid page**.

---

### 6. Month Navigation

**Features:** Next month · Previous month · Current month button

**Rules:**
- Prevent invalid dates
- Default to current month

---

### 7. Trade Preview Rules

Each trade preview shows *(keep compact for modal)*:

```
Instrument · Direction · Result · Profit/Loss
```

---

### 8. Notes Integration

- Pull notes from `TradeNote`
- Show dot indicator on day cell if notes exist
- Display full note preview in daily modal

---

### 9. Performance Rules

- Aggregate data server-side
- Avoid per-cell DB queries
- One query per calendar load

---

### 10. Empty States

**No trades this month:**

```
No trading activity this month.
```

Calendar still renders with empty indicators *(not an error state)*.

---

## Dependencies

No new packages required. Existing stack:

- Prisma
- Clerk
- shadcn/ui
- Date handling *(native JS or `date-fns` if already present)

Optional future: `date-fns` *(recommended for cleaner date logic)

---

## Verification Checklist

- [x] Calendar renders correct month
- [x] Days align correctly (Mon–Sun)
- [x] Profit/Loss displays correctly per day
- [x] Only CLOSED trades affect P/L
- [x] Trade counts are accurate
- [x] Notes indicators show correctly
- [x] Modal opens with correct data
- [x] Month navigation works
- [x] Mobile layout is usable
- [x] Desktop layout is properly aligned
- [x] No TypeScript errors
- [x] No console errors
- [x] Performance is acceptable *(no per-cell queries)*
- [x] `npm run build` passes