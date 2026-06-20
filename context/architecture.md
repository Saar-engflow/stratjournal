# StratJournal - Architecture

## Overview

StratJournal is a full-stack web application that allows traders to record, organize, and analyze their trading activity. The system is designed around a single source of truth: manually logged trades. All analytics, calendar views, and performance summaries are derived from trade data stored in the database.

The architecture prioritizes data integrity, user privacy, and maintainability over feature complexity.

---

# Technology Stack

| Layer              | Technology           | Role                                       |
| ------------------ | -------------------- | ------------------------------------------ |
| Frontend Framework | Next.js (App Router) | Application UI, routing, server components |
| Language           | TypeScript           | Type safety across the application         |
| Styling            | Tailwind CSS         | Utility-first styling                      |
| UI Components      | shadcn/ui            | Reusable UI component system               |
| Typography         | Manrope Variable     | Primary application font                   |
| Authentication     | Clerk                | User authentication and session management |
| ORM                | Prisma               | Database access and schema management      |
| Database           | PostgreSQL           | Persistent application data                |
| File Storage       | Cloudinary           | Image upload and delivery                  |
| Validation         | Zod                  | Runtime validation of forms and inputs     |
| Forms              | React Hook Form      | Form state management                      |
| Deployment         | Vercel               | Application hosting                        |
| Charts             | Recharts             | Dashboard analytics visualizations         |
| PWA                | Next.js PWA Support  | Home screen and desktop installation       |

---

# System Boundaries

Each folder owns a specific responsibility.

```text
src/
├── app/
├── components/
├── features/
├── lib/
├── server/
├── types/
├── hooks/
└── styles/
```

---

## app/

Owns routing and page composition.

### Responsibilities

* Route definitions
* Layouts
* Page-level loading states
* Page-level error boundaries

### Must Not Contain

* Business logic
* Database queries
* Ownership validation

---

## components/

Owns reusable UI components.

### Examples

```text
components/
├── ui/
├── layout/
├── dashboard/
├── calendar/
└── charts/
```

### Responsibilities

* Presentational UI
* Shared visual components

### Must Not Contain

* Database access
* Authentication logic

---

## features/

Owns feature-specific UI and workflows.

### Examples

```text
features/
├── accounts/
├── trades/
├── playbooks/
├── notebook/
├── dashboard/
└── calendar/
```

### Responsibilities

* Feature forms
* Feature dialogs
* Feature tables
* Feature actions

### Must Not Contain

* Direct database access

---

## server/

Owns server-side application logic.

### Examples

```text
server/
├── accounts/
├── trades/
├── playbooks/
├── notebook/
└── analytics/
```

### Responsibilities

* Business rules
* Ownership validation
* Data aggregation
* Server actions

### Must Not Contain

* UI rendering

---

## lib/

Owns shared infrastructure.

### Examples

```text
lib/
├── prisma.ts
├── cloudinary.ts
├── auth.ts
├── pwa.ts
└── utils.ts
```

### Responsibilities

* Third-party integrations
* Shared helpers
* Infrastructure configuration

---

## types/

Owns shared TypeScript types.

### Examples

```text
types/
├── trade.ts
├── account.ts
├── playbook.ts
└── notebook.ts
```

---

## hooks/

Owns reusable React hooks.

### Examples

```text
hooks/
├── use-account.ts
├── use-calendar.ts
└── use-dashboard.ts
```

---

# Storage Model

## PostgreSQL Database

Stores all structured application data.

### User

```text
- id
- clerkId
- createdAt
```

### Account

```text
- id
- userId
- name
- currency
- createdAt
- updatedAt
```

### Playbook

```text
- id
- userId
- name
- description
- createdAt
- updatedAt
```

### Trade

```text
- id
- userId
- accountId
- playbookId (optional)
- instrument
- direction
- entryPrice (optional)
- stopLoss (optional)
- takeProfit (optional)
- lotSize
- status
- profitLoss
- createdAt
- updatedAt
- closedAt
```

### TradeNote

```text
- id
- tradeId
- content
- createdAt
- updatedAt
```

### TradeNoteImage

```text
- id
- tradeNoteId
- imageUrl
- publicId
- createdAt
```

### NotebookEntry

```text
- id
- userId
- title
- content
- createdAt
- updatedAt
```

---

## Cloudinary Storage

Stores uploaded images.

### Examples

```text
Trade screenshots
Chart screenshots
Trade review images
```

Database stores only:

```text
imageUrl
publicId
```

The actual image file never lives in PostgreSQL.

---

## Cache

V1 does not introduce a dedicated cache layer.

All reads come directly from PostgreSQL.

Caching can be introduced later if analytics performance becomes a bottleneck.

---

# Authentication Model

Authentication is managed by Clerk.

### Supported Providers

* Email / Password
* Google Sign-In

---

## User Creation Flow

```text
User signs up
        ↓
Clerk creates identity
        ↓
Application creates User record
        ↓
User accesses dashboard
```

---

# Access Model

All application data is private.

### Ownership Hierarchy

```text
User
├── Accounts
├── Playbooks
├── Trades
├── Notebook Entries
└── Trade Notes
```

### Rules

* Users can only access their own data.
* Users cannot access another user's trades.
* Users cannot access another user's notebook entries.
* Users cannot access another user's playbooks.
* Ownership validation must happen server-side.
* Ownership must be verified through resources owned by the authenticated user before data is returned or modified.

---

# Background Tasks

V1 contains no background workers.

All operations are request-driven.

### Examples

* Create trade
* Close trade
* Upload image
* Create playbook

### Future Possibilities

* CSV imports
* Broker synchronization
* Scheduled analytics generation

---

# Analytics Model

Dashboard and calendar data are derived from trades.

### Source Of Truth

```text
Trade
```

### Derived Views

```text
Trades
   ├── Dashboard Metrics
   ├── Calendar Summaries
   └── Playbook Statistics
```

Analytics must never become a separate source of truth.

---

# Progressive Web App

StratJournal is installable as a Progressive Web App.

### Features

* Mobile home-screen installation
* Desktop installation support
* Install prompt after first completed trade
* Manifest configuration
* Application icons

Offline functionality is not part of V1.

---

# Invariants

The following rules must never be violated.

## 1. All Trades Must Belong To An Account

Every trade must reference a valid account.

Invalid:

```text
Trade without accountId
```

---

## 2. Users Can Only Access Their Own Data

No endpoint may return data that belongs to another user.

Ownership validation must occur on the server.

---

## 3. Closed Trades Are Immutable

Once a trade status becomes:

```text
CLOSED
```

the following fields may not change:

* instrument
* direction
* entryPrice
* stopLoss
* takeProfit
* lotSize
* profitLoss
* closedAt

Only note additions are allowed.

---

## 4. Dashboard Data Must Be Derived

Dashboard metrics must always be calculated from trade records.

Metrics may never be stored separately.

---

## 5. Calendar Data Must Be Derived

The calendar is a view of trade activity.

Trade information must not be duplicated into calendar tables.

---

## 6. Cloudinary Stores Files, PostgreSQL Stores Metadata

Image files must never be stored inside PostgreSQL.

Only references and metadata may be stored.

---

## 7. Every Trade Has A Single Trade Note

A trade may have only one associated trade note record.

The note may be updated while the trade is open.

---

## 8. Authentication Does Not Equal Authorization

A signed-in user is not automatically authorized to access data.

Ownership checks are required for every protected resource.

---

## 9. Trades Are The Single Source Of Truth

Dashboard metrics, calendar summaries, and playbook statistics must always be derived from trade records.

The same information must never be stored in multiple places.

Trade records are the authoritative source for all trading analytics.

---

## 10. Installation Prompt Behavior

The installation prompt may only be shown after a user completes their first trade.

The application must remember when a user dismisses the prompt.

The installation prompt must not appear repeatedly after dismissal.

---

## 11. Every Playbook Belongs To A User

A playbook must always belong to exactly one user.

Invalid:

```text
Playbook without userId
```

---

## 12. Every Notebook Entry Belongs To A User

A notebook entry must always belong to exactly one user.

Invalid:

```text
Notebook entry without userId
```

---

## 13. Trades May Reference A Playbook But Are Not Required To

A trade may exist without a linked playbook.

A trade must never be forced to reference a playbook.

Valid:

```text
Trade with playbookId
Trade without playbookId
```

---

## 14. Open Trades Are Editable

While a trade status is:

```text
OPEN
```

the user may:

* update trade details
* update trade notes
* attach images
* modify execution information

Once the trade is closed, immutable fields become locked according to Invariant 3.

```
```
