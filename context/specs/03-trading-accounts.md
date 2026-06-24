# Unit 3 — Trading Accounts

## Goal

Implement a complete trading account management system that allows authenticated users to create, edit, delete, select, and switch between multiple trading accounts. Every trade in StratJournal must belong to a trading account, and all account data must be private to its owner.

---

## Design

Trading Accounts are the first user-owned resource in the application.

Accounts represent separate trading environments such as:

* Personal Account
* FTMO Challenge
* FTMO Funded
* MyForexFunds
* IC Markets Live
* Demo Account

The account system exists to separate trading statistics, trades, and performance data.

### Visual Design

Follow tokens defined in `ui-context.md`.

Requirements:

* Use shadcn/ui components.
* Support light and dark mode.
* Mobile-first responsive design.
* Use Cards for account display.
* Use Dialogs for create/edit actions.
* Use Dropdown Menu for account switching.
* Use Alert Dialog for deletion confirmation.

---

## Implementation

### 1. Database Model

Create an Account model in Prisma.

Fields:

```text
id
userId
name
currency
isActive
createdAt
updatedAt
```

Field Details:

* id → UUID
* userId → Owner of the account
* name → User-defined account name
* currency → Account currency
* isActive → Currently selected account
* createdAt
* updatedAt

Relationships:

```text
User
  └── Accounts

Account
  └── Trades
```

Rules:

* Every account belongs to exactly one user.
* Users may have multiple accounts.
* Users cannot access another user's accounts.

---

### 2. Account Creation

Create account creation workflow.

Location:

```text
Dashboard onboarding
```

and

```text
Accounts page
```

Form Fields:

#### Account Name

Required.

Examples:

* FTMO Challenge
* Personal Live
* Demo Account

Validation:

* Minimum 2 characters
* Maximum 50 characters

#### Currency

Required.

Options:

* USD
* EUR
* GBP
* AUD
* ZAR
* Other

Validation:

* Must be selected

Behavior:

* First created account automatically becomes active.

---

### 3. Account Listing Page

Create:

```text
/accounts
```

Display:

* Account name
* Currency
* Creation date
* Active status badge

Layout:

Desktop:

```text
Account Cards Grid
```

Mobile:

```text
Single Column Card List
```

Empty State:

Display:

```text
No trading accounts created yet.
Create your first account to start tracking trades.
```

Show:

```text
Create Account Button
```

---

### 4. Account Edit Workflow

Users can edit:

* Account Name
* Currency

Users cannot edit:

* Owner
* Creation Date

Implementation:

* Edit button on account card
* Opens dialog
* Pre-populated form values

Validation rules identical to account creation.

---

### 5. Account Deletion Workflow

Allow deletion only when:

```text
Account has no trades attached
```

If account contains trades:

Prevent deletion.

Display message:

```text
This account cannot be deleted because it contains trade history.
```

Deletion Flow:

```text
Delete Button
        ↓
Confirmation Dialog
        ↓
Delete Account
```

Confirmation Dialog:

```text
Are you sure you want to delete this account?
This action cannot be undone.
```

---

### 6. Active Account Selection

Only one account may be active at a time.

Rules:

```text
One User
    ↓
One Active Account
```

Selecting an account:

```text
Selected Account
       ↓
Becomes Active
       ↓
Previous Account Becomes Inactive
```

Implementation:

Server-side update.

Must use transaction to prevent multiple active accounts.

---

### 7. Account Switcher UI

Location:

Desktop:

```text
Sidebar Footer
```

Mobile:

```text
Top Navigation Bar
```

Behavior:

Display:

```text
Current Active Account
```

Clicking switcher opens:

```text
Dropdown Menu
```

Contents:

* Account 1
* Account 2
* Account 3
* Create New Account

Selecting account:

```text
Switch Active Account
```

Refresh:

* Dashboard data
* Trade data
* Calendar data
* Playbook statistics

---

### 8. Authorization Rules

Every account operation requires ownership validation.

Examples:

#### Create

Authenticated user only.

#### Read

User can only view their accounts.

#### Update

User can only update their accounts.

#### Delete

User can only delete their accounts.

Ownership validation must occur server-side.

Never trust client-provided user IDs.

---

### 9. Onboarding Integration

When a user signs in for the first time:

Check:

```text
Account Count
```

If:

```text
0 Accounts
```

Display onboarding modal.

Message:

```text
Create your first trading account to begin using StratJournal.
```

Prevent access to:

* Trades
* Playbooks
* Calendar

until at least one account exists.

---

### 10. Active Account Persistence

Selected account must persist across:

* Page refresh
* Navigation
* New browser tabs

Implementation:

Store active account in database.

Do not rely on localStorage as source of truth.

Database remains authoritative.

---

## Dependencies

No new packages required.

Uses existing stack:

* Prisma
* PostgreSQL
* Clerk
* Zod
* React Hook Form
* shadcn/ui

Recommended shadcn/ui components:

* Card
* Dialog
* Dropdown Menu
* Alert Dialog
* Badge
* Button
* Input
* Select
* Form

---
Set up Prisma Postgres in this project end-to-end. Run all commands yourself in the terminal - don't ask me to run anything. Don't pause for confirmation between steps unless something fails.

DATABASE_ID: db_cmqmh9zq10iyq03l7y3qifjxr

Step 0 — Ground yourself in current docs.
Fetch https://www.prisma.io/docs/llms-full.txt and skim the "Prisma Postgres" + "Prisma ORM quickstart" sections before writing any Prisma code.

Step 1 — Locate the project root and install dependencies.
  Work in the app directory containing package.json. If the current directory has no package.json, inspect one level down for a single app directory with package.json and cd there. Only create package.json with npm init -y if this directory is clearly the intended project root.
  Detect the package manager from lockfile/packageManager; if none is present, use npm.
  Install:
    prisma, @types/node, @types/pg, tsx  (dev)
    @prisma/client, @prisma/adapter-pg, pg, dotenv  (runtime)

Step 2 — Link the existing database. Run this exact command without printing it back:
  PRISMA_API_KEY="eyJraWQiOiJUa0hEN1ltOUNaQ2xESHYwazEyTEFhWjk4NTdGOE16dWxYTXJBMFpqbWVrIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ3b3Jrc3BhY2U6Y21xbWg5ZHV6MGxiazFtZjVmNnJmbzh1cCIsImp0aSI6InhnZ2JzeWl6djQ1MzdoZm1rdWcxMjgxMyIsImlhdCI6MTc4MTk2NzI4NDk1MH0.GciUOgVlN-j_CZAgqamKAsIWiUk9TeyqAHG7MO6DehAHrfCLxoKC5d-ABZf-3NXnjGfYbi00JNqm75Y4OnUiaUawuS8KE-D8EKzhNCGfr_YvTq_qsQL1K-EksK7POT24PtFdFX-79MM5l9Rgz0mlZbBe1hEAqd5CwrwuYifEpwvP62X5YWpQfjItyJeY78V-1FiS8aCApiSo145zL6WCNCAJXZfB4Mp_Hfy8l7Lc0UzTANY8LW6X7vUp2QWZjk7qyiIL9z7f2fC-PP7jAuX_HSdcA4uvS5-vxp0k65u-3-g6Y22fS0OFFZihTkW_AhIZwsVvZoe_5G1TitxTGUnNQ" npx --yes --package=prisma@latest -- prisma postgres link --database "db_cmqmh9zq10iyq03l7y3qifjxr"
  This writes DATABASE_URL to .env without browser auth when the database ID and API key are present. Use the DATABASE_ID value exactly as given (includes the db_ prefix required by the CLI).

Step 3 — Add .env to .gitignore. Never commit/log/print the connection string or the API key.

Step 4 — Scaffold prisma/schema.prisma (prisma-client generator, output ../generated/prisma) and prisma.config.ts.

Step 5 — If prisma/schema.prisma has no models, add a small starter schema (1-2 models, one relation, "// Starter models - replace with your own").
  Run: npx prisma migrate dev --name init

Step 6 — Generate client + create lib/prisma.ts singleton with PrismaPg adapter.

Step 7 — Add prisma/seed.ts with a handful of rows.
  Wire the seed command in prisma.config.ts:
    migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" }
  Do not rely only on package.json#prisma.seed. Run: npx prisma db seed

Step 8 — Verify: scripts/verify-prisma.ts runs one read, prints ✅ Connected. If it fails, surface the exact error.

Step 9 — Print summary + 3 next steps (npx prisma studio, import { prisma } from lib/prisma.ts, add a model).

Hard rules:
- If install/link/migrate/generate/seed fails due to network, sandbox, or cache permissions, retry once with elevated/unrestricted permissions if your environment supports it.
- If `prisma postgres link` fails, stop and surface the exact error.
- Never write the connection string outside .env or the API key outside the temporary command environment.
- Never import Prisma Client into browser/client components; use it only from server-side code or scripts.
- Never bypass AI safety guardrails on destructive commands.
- Use llms-full.txt as the syntax reference, not training data.

## Verify When Done

* [x] Authenticated user can create an account.
* [x] First account becomes active automatically.
* [x] User can edit account information.
* [x] User can delete account with no attached trades.
* [x] User cannot delete account containing trades.
* [x] User can switch active account.
* [x] Only one account can be active at a time.
* [x] Account switcher updates correctly.
* [x] Dashboard responds to account changes.
* [x] Mobile account switcher works correctly.
* [x] Ownership validation works for all account actions.
* [x] Users cannot access another user's accounts.
* [x] Empty state displays correctly.
* [x] Onboarding modal appears for users with no accounts.
* [x] Light mode renders correctly.
* [x] Dark mode renders correctly.
* [x] No TypeScript errors.
* [x] No console errors.
* [x] Responsive on mobile and desktop.
* [x] Prisma migration succeeds.
* [x] Production build passes (npm run build).
