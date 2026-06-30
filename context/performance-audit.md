# Performance Audit Guide

## Purpose

This document defines the performance optimization workflow for StratJournal.

Performance improvements must always be data-driven. No optimization should be implemented unless a measurable bottleneck has been identified.

The objective is to improve application responsiveness, reduce server load, minimize unnecessary database operations, and ensure the application scales smoothly as the user base grows.

---

# Performance Audit Process

Every page must go through the following workflow.

```
User opens page
        ↓
Measure total page load time
        ↓
Measure individual server operations
        ↓
Count database queries
        ↓
Locate bottleneck
        ↓
Optimize only the bottleneck
        ↓
Measure again
```

Never optimize code based on assumptions.

---

# Phase 1 — Identify Slow Pages

Audit the following pages in order of priority.

| Priority | Page           | Reason                     |
| -------- | -------------- | -------------------------- |
| High     | Dashboard      | Most data-heavy page       |
| High     | Trades List    | Frequent database queries  |
| High     | Calendar       | Derived calculations       |
| Medium   | Trade Detail   | Multiple related resources |
| Medium   | Playbooks      | Moderate database usage    |
| Medium   | Notebook       | Moderate database usage    |
| Low      | Accounts       | Lightweight CRUD           |
| Low      | Authentication | Mostly handled by Clerk    |

---

# Phase 2 — Measure Total Page Time

Begin by measuring the entire page.

Example:

```ts
console.time("Dashboard")

// page logic

console.timeEnd("Dashboard")
```

Record the result.

Example:

```
Dashboard: 432ms
```

This establishes the baseline.

---

# Phase 3 — Measure Individual Operations

Once a slow page has been identified, measure every server-side operation.

Example:

```ts
console.time("requireUser")
const user = await requireUser()
console.timeEnd("requireUser")

console.time("listAccounts")
const accounts = await listAccountsForUser(user.id)
console.timeEnd("listAccounts")

console.time("getDashboardMetrics")
const metrics = await getDashboardMetrics(user.id)
console.timeEnd("getDashboardMetrics")
```

Record every result.

---

# Phase 4 — Measure Database Queries

Every database query should be identified.

Questions to answer:

* How many Prisma queries execute?
* Are queries duplicated?
* Can queries be merged?
* Are related records fetched efficiently?
* Is unnecessary data being selected?

Example:

Instead of

```
Find user

↓

Find accounts

↓

Find trades

↓

Find playbooks

↓

Find notes
```

Determine whether some queries can be combined.

---

# Phase 5 — Profile Heavy Functions

If one function is significantly slower than the others, inspect it separately.

Example:

```
getDashboardMetrics()

↓

calculateWinRate()

↓

calculateProfit()

↓

calculateTradeCounts()

↓

calculatePerformanceHistory()
```

Each sub-function should be measured individually.

---

# Phase 6 — Database Review

For every query verify:

## Index Usage

Check whether frequently filtered fields are indexed.

Examples:

* userId
* accountId
* tradeId
* playbookId
* status
* closedAt
* createdAt

Missing indexes become increasingly expensive as data grows.

---

## Query Size

Avoid retrieving unnecessary fields.

Prefer:

```ts
select: {
    id: true,
    name: true
}
```

instead of retrieving entire records.

---

## N+1 Query Detection

Avoid patterns such as:

```
Loop

↓

Database query

↓

Loop

↓

Database query
```

Instead retrieve related data in a single query whenever practical.

---

## Duplicate Queries

Check whether identical information is fetched multiple times during a single request.

Example:

```
requireUser()

↓

Layout

↓

Dashboard

↓

Server Action
```

The same user should not be queried repeatedly unless necessary.

---

# Phase 7 — Server Components Review

Review all layouts and pages.

Look for:

* repeated data fetching
* duplicated authentication
* nested server requests
* sequential requests that could execute concurrently

Where appropriate, use:

```ts
Promise.all(...)
```

instead of awaiting independent operations sequentially.

---

# Phase 8 — Client Rendering Review

Inspect every client component.

Questions:

* Does it re-render unnecessarily?
* Is state duplicated?
* Can derived values be memoized?
* Is expensive computation happening during render?

---

# Phase 9 — Network Review

Using browser DevTools:

Inspect:

* request duration
* response size
* failed requests
* duplicate requests

Questions:

* Are requests being repeated?
* Are unnecessary API calls occurring?
* Is data being downloaded multiple times?

---

# Phase 10 — User Experience Review

Measure perceived performance.

Questions:

* Does the page appear instantly?
* Does content shift during loading?
* Are loading skeletons displayed?
* Is feedback immediate after user actions?

Perceived speed is as important as actual speed.

---

# Performance Audit Checklist

## Dashboard

* Measure total page time
* Measure every server function
* Count Prisma queries
* Verify dashboard calculations
* Check duplicated queries
* Verify indexes
* Record findings

---

## Trades

* Measure load time
* Measure trade retrieval
* Measure filtering
* Measure pagination
* Count queries
* Record findings

---

## Calendar

* Measure page load
* Measure daily aggregation
* Measure trade grouping
* Count queries
* Record findings

---

## Playbooks

* Measure page load
* Measure retrieval
* Count queries
* Record findings

---

## Notebook

* Measure page load
* Measure retrieval
* Count queries
* Record findings

---

# Database Query Counts Documentation

## Dashboard Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. `getActiveAccountForUser` → `prisma.account.findFirst` (1 query)
3. `getDashboardMetrics` → `prisma.trade.findMany` (1 query)
4. `getChartData` → 2 queries:
   a. `prisma.trade.findMany` (closed trades)
   b. `prisma.trade.findMany` (recent trades)
**Total: 4 queries (no unnecessary writes!)**

## Trades Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. `getActiveAccountForUser` → `prisma.account.findFirst` (1 query)
3. `listTradesForUser` → `prisma.trade.findMany` (1 query)
**Total: 3 queries (no unnecessary writes!)**

## Calendar Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. `getActiveAccountForUser` → `prisma.account.findFirst` (1 query)
3. `getCalendarData` → `prisma.trade.findMany` (1 query)
**Total: 3 queries (no unnecessary writes!)**

## Trade Detail Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. `getTradeForUser` → 1-2 queries (trade + note images if exists)
**Total: 2-3 queries (no unnecessary writes!)**

## Playbooks Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. Playbook list function → `prisma.playbook.findMany` (1 query)
**Total: 2 queries (no unnecessary writes!)**

## Notebook Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. Notebook list function → `prisma.notebookEntry.findMany` (1 query)
**Total: 2 queries (no unnecessary writes!)**

## Accounts Page
1. `requireUser` → `prisma.user.findUnique` (read only, 1 query; only write if user doesn't exist)
2. `listAccountsForUser` → `prisma.account.findMany` (1 query)
**Total: 2 queries (no unnecessary writes!)**

---

# Performance Audit Table

| Page         | Total Load Time | DB Queries | Slowest Function | Needs Optimization | Notes |
| ------------ | --------------- | ---------- | ---------------- | ------------------ | ----- |
| Dashboard    | (tbd)           | 4          | getChartData     | No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |
| Trades       | (tbd)           | 3          | listTradesForUser| No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |
| Calendar     | (tbd)           | 3          | getCalendarData  | No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |
| Trade Detail | (tbd)           | 2-3        | getTradeForUser  | No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |
| Playbooks    | (tbd)           | 2          | (tbd)            | No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |
| Notebook     | (tbd)           | 2          | (tbd)            | No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |
| Accounts     | (tbd)           | 2          | (tbd)            | No                 | Optimized: requireUser now does findUnique instead of upsert; no unnecessary writes |

---

# Optimization Rules

Always follow these principles.

1. Measure before changing code.
2. Optimize only verified bottlenecks.
3. Re-measure after every optimization.
4. Prefer simpler solutions over complex abstractions.
5. Reduce database queries before changing infrastructure.
6. Never sacrifice readability for micro-optimizations.
7. Profile again after deploying to production.
8. Every optimization must produce measurable improvement.

---

# Success Criteria

The audit is complete when:

* Every major page has been measured.
* Slow functions have been identified.
* Database query counts are documented.
* Duplicate queries have been removed where appropriate.
* Heavy queries have been optimized.
* Missing indexes have been added.
* Layout-level data fetching has been reviewed.
* Production performance has improved measurably.
* No optimization was implemented without supporting measurements.
