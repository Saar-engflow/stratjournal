# Unit 6 — Trade Management

## Goal

Implement a complete trade management system that allows users to view, edit (only open trades), and close trades with final profit/loss recording. This unit ensures trades transition from "open execution state" to "closed immutable record state".

---

## Design

Trades are the central execution log of the system. This unit introduces **state transitions and locking rules**, making trade lifecycle behavior strict and predictable.

### Trade Lifecycle

```
OPEN → (EDITABLE)
  ↓
CLOSED → (LOCKED IMMUTABLE)
```

### Key Behavior Rules

- OPEN trades can be edited
- CLOSED trades are locked — no edits allowed *(except notes in future units)*
- Profit/Loss is **only** recorded at closure
- Closing a trade is a destructive-state transition — cannot be undone in V1

---

## Visual Design

**Component library:** shadcn/ui

| Component | Usage |
|---|---|
| `Card` | Trade list items |
| `Table` | Desktop trade listing |
| `Dialog` | Close trade confirmation |
| `Badge` | Trade status (OPEN / CLOSED) |
| `Drawer` | Trade details *(optional mobile)* |
| `Button` | Actions (edit, close, view) |

**Layout:**

| Breakpoint | Layout |
|---|---|
| Mobile | Card-based trade list, tap opens detail drawer/page, sticky action buttons |
| Desktop | Table layout with sortable columns, right-side detail panel or separate page |

---

## Implementation

### 1. Trade Listing Page

**Route:** `/trades`

**Each trade row/card shows:**

| Field | Notes |
|---|---|
| Instrument | |
| Direction | |
| Entry price | |
| Status | Badge (OPEN / CLOSED) |
| Account name | |
| Playbook name | If linked |
| Created date | |
| P/L | Only if CLOSED |

**Actions per trade:** View · Edit *(OPEN only)* · Close *(OPEN only)*

---

### 2. Trade Detail Page

**Route:** `/trades/[id]`

#### Header
- Instrument
- Status badge (OPEN / CLOSED)

#### Trade Info
- Direction · Entry price · Stop loss · Take profit · Lot size · Account · Playbook *(if linked)*

#### Execution Results *(CLOSED only)*
- Profit/Loss
- Closed date

#### Actions

| State | Actions |
|---|---|
| OPEN | Edit button, Close button |
| CLOSED | Disabled / read-only UI |

---

### 3. Trade Editing (OPEN Only)

**Route:** `/trades/[id]/edit`

Editing allowed **only if** `trade.status === "OPEN"`.

**Editable fields:**

```
instrument · direction · entryPrice · stopLoss
takeProfit · lotSize · accountId · playbookId
```

**Not editable:**

```
status · profitLoss · closedAt
```

> Even if the UI blocks it, the server **must** reject edits if `status === CLOSED`.

---

### 4. Trade Close Workflow

```
User clicks "Close Trade"
         ↓
Confirmation modal opens
         ↓
User enters Profit/Loss (required)
         ↓
Submit
         ↓
Server validates
         ↓
status   = CLOSED
closedAt = now()
profitLoss = input
         ↓
Trade becomes immutable
```

**Close modal includes:**
- Read-only trade summary
- Input: Profit/Loss *(required)*
- Confirm button

---

### 5. Profit/Loss Recording

| Rule | Detail |
|---|---|
| Required on close | Cannot submit without it |
| Can be positive or negative | Covers wins and losses |
| Stored only once | Set at closure |
| Cannot be modified | Immutable after close |

**Validation:**

```ts
z.number().finite()
// No NaN / Infinity allowed
```

---

### 6. Trade Status Management

| Status | Description |
|---|---|
| `OPEN` | Default on creation, editable |
| `CLOSED` | Set by server on close, immutable |

- Default = `OPEN`
- Only the server can transition to `CLOSED`
- No other statuses in V1

---

### 7. Trade Locking Rules

Once `CLOSED`, the following fields are **locked:**

```
instrument · direction · entryPrice · stopLoss
takeProfit · lotSize · accountId · playbookId
profitLoss · closedAt
```

**Allowed on closed trades:**
- Viewing
- Reading
- *(Future)* Notes

---

### 8. Server Actions

#### Update Trade — `server/trades/update-trade.ts`

Must:
1. Verify user authentication
2. Verify trade ownership
3. Check `status === OPEN`
4. Update allowed fields only

#### Close Trade — `server/trades/close-trade.ts`

Must:
1. Verify user authentication
2. Verify trade ownership
3. Ensure `status === OPEN`
4. Set `status = CLOSED`, `profitLoss = input`, `closedAt = now()`

---

### 9. Trade Listing Data Rules

Query must:
- Filter only the current user's trades
- Include `account` + `playbook` relations
- Compute derived display fields only *(never store)*

---

### 10. Error Handling

**Must handle:**

| Error | Behavior |
|---|---|
| Edit attempt on CLOSED trade | Reject with error |
| Missing P/L on close | Block submission |
| Unauthorized access | Reject server-side |
| Invalid trade ID | 404 or error response |
| Prisma errors | Catch and surface cleanly |

**UI behavior:** Toast error messages — no silent failures, no stack traces exposed.

---

## Dependencies

No new packages required. Existing stack:

- Prisma
- Clerk
- Zod
- React Hook Form
- shadcn/ui

---

## Verification Checklist

- [x] User can view all trades
- [x] Trade list displays correct data
- [x] Trade detail page works
- [x] OPEN trades can be edited
- [x] CLOSED trades cannot be edited
- [x] Close trade workflow works
- [x] Profit/Loss is required on close
- [x] CLOSED trades become immutable
- [x] Trade status updates correctly
- [x] Ownership enforced server-side
- [x] Mobile layout works correctly
- [x] Desktop layout works correctly
- [x] No TypeScript errors
- [ ] No console errors
- [x] Prisma migration succeeds
- [ ] `npm run build` passes
