# AI Workflow Rules

## Purpose

These rules define how an AI coding agent must operate while building StratJournal.

Follow these rules exactly. Do not substitute personal preferences, alternative architectures, or speculative improvements.

The approved project documents are:

* project-overview.md
* architecture.md
* code-standards.md
* ui-context.md

These documents are the source of truth.

---

# Overall Approach

## Rule 1 — Follow a Spec-Driven Workflow

Implement only what has been explicitly defined in the project documentation.

Do not invent requirements.

Do not infer missing features.

Do not expand scope without approval.

---

## Rule 2 — Build Incrementally

Build one feature unit at a time.

Finish the current unit completely before beginning the next.

Do not leave partially implemented functionality.

---

## Rule 3 — Respect Approved Architecture

Follow the architecture defined in architecture.md.

Do not:

* replace technologies
* introduce new frameworks
* introduce new infrastructure
* move responsibilities between layers

without explicit instruction.

---

# Scoping Rules

## Rule 4 — Work On One Unit Only

When assigned a feature, implement only that feature.

Example:

Valid:

```text
Implement Playbook CRUD
```

Invalid:

```text
Implement Playbook CRUD
Implement Dashboard Analytics
Implement CSV Export
```

during the same task.

---

## Rule 5 — Do Not Build Future Features

Do not build:

* Broker integrations
* CSV imports
* AI coaching
* Notifications
* Discipline scoring
* Gamification
* Public profiles
* Collaboration features

unless explicitly instructed.

---

## Rule 6 — Do Not Perform Speculative Refactoring

Do not rewrite working systems because a different design may be better.

Only refactor when:

* fixing a defect
* implementing an approved requirement
* reducing duplication introduced by the current task

---

# Task Decomposition

## Rule 7 — Split Large Features

Break large features into smaller implementation units.

Example:

Instead of:

```text
Build Trade System
```

Split into:

```text
Create Trade Model
Create Trade Validation
Create Trade Form
Create Trade Create Action
Create Trade List View
Create Trade Detail View
Create Trade Close Flow
```

---

## Rule 8 — Complete Subtasks Sequentially

Finish one subtask completely before beginning another.

Do not leave placeholder implementations.

Do not leave TODOs.

---

# Missing Requirements

## Rule 9 — Never Guess

If a requirement is undefined, stop implementation.

Do not invent behavior.

Do not assume defaults.

Request clarification.

---

## Rule 10 — Present Explicit Options

When requirements are ambiguous:

1. Explain the ambiguity.
2. Present available options.
3. Explain trade-offs.
4. Wait for a decision.

Example:

```text
Trade notes can be:

A. Single note
B. Multiple notes

Please choose.
```

---

## Rule 11 — Preserve Existing Decisions

If documentation defines a behavior:

Follow it.

Do not replace it with an alternative approach.

---

# File Modification Rules

## Rule 12 — Modify Only Relevant Files

Change only files required for the assigned task.

Do not modify unrelated modules.

---

## Rule 13 — Do Not Modify Generated Files

Never modify:

```text
node_modules/
.next/
prisma/generated/
```

---

## Rule 14 — Do Not Modify Shadcn UI Primitives

Do not modify files inside:

```text
src/components/ui/
```

unless explicitly instructed.

Treat these files as vendor-managed.

Create wrappers instead.

Example:

```text
src/features/trades/components/trade-dialog.tsx
```

instead of modifying:

```text
src/components/ui/dialog.tsx
```

---

## Rule 15 — Prisma Schema Ownership

All database changes must originate from:

```text
prisma/schema.prisma
```

Do not manually edit generated migrations.

Do not manually edit generated Prisma client files.

---

# Documentation Synchronization

## Rule 16 — Keep Documentation Current

When implementation changes an approved specification:

Update documentation immediately.

Documentation and implementation must always match.

---

## Rule 17 — Update The Correct Document

Architecture changes:

```text
architecture.md
```

Scope changes:

```text
project-overview.md
```

Coding conventions:

```text
code-standards.md
```

Design system changes:

```text
ui-context.md
```

---

## Rule 18 — No Hidden Decisions

Document every architectural decision.

Do not create undocumented systems.

Do not introduce undocumented conventions.

---

# Validation and Ownership

## Rule 19 — Validate At System Boundaries

Validate all external input.

Validate:

* forms
* route handlers
* server actions
* query parameters

before processing.

Use Zod validation.

---

## Rule 20 — Enforce Authorization

Authentication is not authorization.

Verify ownership before:

* reading data
* updating data
* deleting data

---

## Rule 21 — Respect System Invariants

Do not violate invariants defined in architecture.md.

Examples:

* Every trade belongs to an account.
* Closed trades are immutable.
* Dashboard metrics are derived from trades.
* Calendar data is derived from trades.

---

# Verification Checklist

Before marking a feature unit complete, verify all items below.

## Functional Verification

* Feature works end-to-end.
* User flow is complete.
* No placeholder logic exists.
* Error states are handled.

---

## Validation Verification

* Inputs are validated.
* Invalid data is rejected.
* Error messages are returned correctly.

---

## Authorization Verification

* Ownership checks exist.
* Unauthorized access is blocked.
* Cross-user access is impossible.

---

## Data Verification

* Data persists correctly.
* Relations are correct.
* Database integrity is maintained.

---

## UI Verification

* Desktop layout works.
* Mobile layout works.
* Light mode works.
* Dark mode works.

---

## Code Quality Verification

* TypeScript passes.
* ESLint passes.
* Production build passes.
* No unused code remains.
* No TODO comments remain.

---

## Documentation Verification

* Documentation matches implementation.
* Architecture remains compliant.
* New decisions are documented.

---

# Completion Rule

A feature unit is complete only when:

1. The feature works end-to-end.
2. Validation rules are enforced.
3. Ownership rules are enforced.
4. Documentation is synchronized.
5. Verification checklist passes.
6. CodeRabbit review issues are addressed or explicitly justified.

Rendering a UI is not sufficient for completion.
