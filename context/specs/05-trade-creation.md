# Unit 5 — Trade Creation

## Goal

Implement a trade creation system that allows users to log new trades with full validation, linking to accounts (required) and playbooks (optional). Each trade represents a single market execution entry that becomes the source of truth for all analytics.

---

## Design

Trades represent the core data unit of the entire application.

A trade must always be:
- Linked to an Account *(required)*
- Optionally linked to a Playbook
- Validated before creation
- Stored as an immutable record once closed *(future Unit)*

### Trade Concept

| Field | Description |
|---|---|
| Instrument | e.g. XAUUSD, EURUSD |
| Direction | BUY / SELL |
| Entry price | Execution price |
| Stop loss | Risk level |
| Take profit | Target level |
| Lot size | Position size |
| Account | Required link |
| Playbook | Optional link |
| Status | OPEN initially |

---

## Visual Design

**Component library**: shadcn/ui

| Component | Usage |
|---|---|
| `Card` | Form container |
| `Input` | Numeric and text fields |
| `Select` | Dropdowns (account, playbook, direction) |
| `Dialog` | Create trade modal *(optional UX choice)* |
| `Button` | Submit actions |
| `Badge` | Optional preview indicators |

**Layout**:

| Breakpoint | Layout |
|---|---|
| Desktop | Centered form card, two-column layout for price inputs |
| Mobile | Single column stacked form, full-width inputs, bottom sticky "Create Trade" button |

---

## Implementation

### 1. Database Model

```prisma
model Trade {
  id          String   @id @default(cuid())
  userId      String

  accountId   String
  playbookId  String?

  instrument  String
  direction   TradeDirection

  entryPrice  Float
  stopLoss    Float
  takeProfit  Float
  lotSize     Float

  status      TradeStatus @default(OPEN)

  profitLoss  Float?
  createdAt   DateTime @default(now())
  closedAt    DateTime?

  account     Account   @relation(fields: [accountId], references: [id])
  playbook    Playbook? @relation(fields: [playbookId], references: [id])
}

enum TradeDirection {
  BUY
  SELL
}

enum TradeStatus {
  OPEN
  CLOSED
}
```

---

### 2. Trade Form (UI)

**Route**: `/trades/new` or modal inside `/trades`

**Form Fields**:

| Field | Type | Validation |
|---|---|---|
| Instrument | Text input | Required, 3–10 characters |
| Direction | Select (BUY / SELL) | Required |
| Entry Price | Number input | Required, > 0 |
| Stop Loss | Number input | Required, > 0 |
| Take Profit | Number input | Required, > 0 |
| Lot Size | Number input | Required, > 0 |
| Account | Dropdown | Required, must be selected before submit |
| Playbook | Dropdown | Optional, can be null |

---

### 3. Validation (Zod)

```ts
import { z } from "zod"

export const tradeSchema = z.object({
  instrument: z.string().min(3).max(10),

  direction: z.enum(["BUY", "SELL"]),

  entryPrice: z.number().positive(),
  stopLoss:   z.number().positive(),
  takeProfit: z.number().positive(),
  lotSize:    z.number().positive(),

  accountId:  z.string().min(1),

  playbookId: z.string().optional().nullable(),
})
```

---

### 4. Server Action / API

**File**: `server/trades/create-trade.ts`

**Responsibilities**:
1. Validate input using Zod
2. Verify user authentication (Clerk)
3. Verify account belongs to user
4. Verify playbook belongs to user *(if provided)*
5. Create trade in DB
6. Return created trade

---

### 5. Open Trade Workflow

```
User opens form
       ↓
Select account
       ↓
Fill trade details
       ↓
(Optional) select playbook
       ↓
Submit
       ↓
Validation (Zod)
       ↓
Server ownership checks
       ↓
Trade created
       ↓
Redirect to /trades or dashboard
```

---

### 6. Account Linking

Every trade **must** include `accountId`.

| Rule | Detail |
|---|---|
| Must exist | Checked server-side |
| Must belong to current user | Ownership enforced |
| Must be active | Optional future constraint |

---

### 7. Playbook Linking

- `playbookId` can be `null`
- If provided: must exist and belong to user

---

### 8. Input Validation Rules

- No negative numbers allowed
- No empty strings
- No malformed instrument names
- Numeric precision: 2–5 decimals acceptable

---

### 9. Trade Status Logic

On creation:

```
status = OPEN
```

Future units will handle: `CLOSE` → `profitLoss` calculation

---

### 10. Error Handling

**Must handle**:
- Missing fields
- Invalid account
- Invalid playbook
- Unauthorized user
- Prisma failures

**Return**: Friendly UI errors — no stack traces exposed

---

## Dependencies

No new packages required. Existing stack:

- Prisma
- PostgreSQL
- Clerk
- Zod
- React Hook Form
- shadcn/ui

---

## Verification Checklist

- [x] User can create a trade
- [x] Account selection is required
- [x] Playbook selection is optional
- [x] Zod validation blocks invalid input
- [x] Trade is saved to database
- [x] Trade belongs to authenticated user
- [x] Account ownership is enforced
- [x] Playbook ownership is enforced
- [x] Trade appears in list after creation
- [x] Mobile form works correctly
- [x] Desktop form works correctly
- [x] No TypeScript errors
- [ ] No console errors
- [x] Prisma migration succeeds
- [x] `npm run build` passes
