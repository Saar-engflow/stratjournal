# Unit 13 — Account Filtering

## Goal

Implement a global account-scoped filtering system that ensures all trading data (trades, dashboard metrics, calendar, and playbooks) is always filtered by the currently active trading account. This ensures users only see and interact with data belonging to a selected account.

---

## Design

Account filtering is a **global state layer** that sits above all features.

### Core Principle

Every query in the system must respect:

```
activeAccountId
```

This becomes a required filter for:
- Trades
- Dashboard metrics
- Calendar data
- Playbooks *(future analytics)*
- Notebook entries *(optional future scope)*

---

### UI Design

#### 1. Global Account Switcher

**Location:** Top Navigation Bar (Header)

**Behaviour:**
- Always visible
- Displays active account name
- Dropdown to switch accounts
- "Create new account" shortcut *(optional)*

**UI pattern:** shadcn/ui `DropdownMenu` or `Select` · Badge showing currency (e.g. USD, EUR) · Subtle highlight for active account

#### 2. Account Context Indicator

Every page must clearly reflect the active account:

```
Viewing: Demo Account (USD)
```

**Optional placement:** Top-right of dashboard header · Under page title

#### 3. Mobile Design

- Account switcher moves into sidebar or bottom sheet
- Must remain accessible within 1 tap
- Never hidden behind deep navigation

---

## Implementation

### 1. Active Account State (Global Layer)

**File:** `src/features/accounts/account-context.tsx`

**Responsibilities:**
- Store `activeAccountId`
- Store `activeAccount` object
- Provide setter function
- Persist selection in `localStorage`

**State shape:**

```ts
activeAccountId: string | null
activeAccount:   Account | null
```

---

### 2. Account Provider Wrapper

Wrap the application after authentication:

```
App Layout → AccountProvider → Children
```

Ensures all features can access the active account.

---

### 3. Account Switch Logic

When user selects an account:
1. Update context state
2. Persist to `localStorage`
3. Trigger refetch of all dependent data

> **Switching account must refresh ALL dependent queries.**

---

### 4. Server-Side Enforcement

Every Prisma query must include:

```ts
where: {
  userId:    clerkUserId,
  accountId: activeAccountId
}
```

**Applies to:** Trades · Dashboard metrics · Calendar queries · Playbooks *(when linked)*

---

### 5. Account Middleware Utility

**File:** `src/server/accounts/get-active-account.ts`

**Responsibilities:**
- Validate user owns the account
- Return active account
- Prevent unauthorized access

---

### 6. Frontend Hook

```ts
useActiveAccount()
```

**Returns:**

```ts
{
  activeAccount,
  activeAccountId,
  setActiveAccount
}
```

**Used across:** Dashboard · Trades · Calendar · Playbooks

---

### 7. Data Fetching Updates

All existing queries must be updated:

| Feature | Update |
|---|---|
| Trades | Filter by `accountId` |
| Dashboard Metrics | Aggregate only active account trades |
| Calendar | Show only trades from active account |
| Playbooks | Show per-account playbooks only *(if scoped)* |

---

### 8. Default Account Behaviour

**On first login:**
1. Fetch user's accounts
2. Auto-select first account
3. Persist selection

**If no accounts exist:**
- Prompt user to create one
- Block dashboard access until created

---

### 9. Edge Cases

| Scenario | Behaviour |
|---|---|
| Active account deleted | Fallback to first available account |
| No accounts exist | Show onboarding state |
| Switching accounts mid-session | Refresh all queries safely |

---

## Dependencies

No new packages required. Existing stack:

- Prisma
- Clerk
- React Context API
- `localStorage` *(browser API)*

Optional *(recommended later)*: Zustand *(if context becomes heavy)*

---

## Verification Checklist

- [x] User can create multiple accounts
- [x] User can switch accounts
- [x] All trades filter by active account
- [x] Dashboard reflects selected account only
- [x] Calendar updates on account switch
- [x] Playbooks reflect account scope
- [x] Active account persists on refresh
- [x] No cross-account data leakage
- [x] Default account auto-select works
- [x] Mobile account switching works
- [x] No TypeScript errors
- [x] No console errors
- [x] `npm run build` passes
