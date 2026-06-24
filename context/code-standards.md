# Code Standards

## General

* Build one feature unit at a time.
* Keep modules small and single-purpose.
* Prefer simple solutions over clever solutions.
* Fix root causes instead of layering workarounds.
* Do not mix unrelated concerns in a single component, route, or service.
* Follow the architecture defined in architecture.md.
* Follow the scope defined in project-overview.md.
* Do not implement speculative features.
* Do not introduce new dependencies without explicit approval.
* Optimize for readability and maintainability before optimization.
* All business rules must exist on the server, not only in the UI.
* Use composition over duplication.
* Every file should have a clear ownership boundary.
* Every feature must be understandable without reading unrelated modules.

---

# TypeScript

* TypeScript strict mode is required.
* Avoid `any`.
* Prefer explicit interfaces and types.
* Validate all external input before use.
* Treat all request data as untrusted.
* Use Zod schemas for runtime validation.
* Prefer discriminated unions over boolean flags where appropriate.
* Export shared types from the `types/` directory.
* Keep type definitions close to their domain.
* Do not suppress TypeScript errors without explicit justification.
* Resolve type errors rather than bypassing them.
* Use Zod schemas for all external input validation.
* Infer TypeScript types from Zod schemas where possible to avoid duplicate type definitions.
* Prefer readonly types for values that should not be mutated after creation.

---

# Next.js

* Use App Router.
* Default to Server Components.
* Add `"use client"` only when browser interactivity requires it.
* Keep route handlers focused on a single responsibility.
* Do not place business logic inside page components.
* Do not query Prisma directly from client components.
* Fetch data on the server whenever possible.
* Keep layouts responsible only for composition and navigation.
* Use loading and error states for all asynchronous routes.
* Server Actions must remain focused and predictable.
* Never perform business logic in client components.
* Client components may only trigger actions and display results.
---

# React

* Components must have a single responsibility.
* Keep components small and composable.
* Extract repeated UI into reusable components.
* Prefer controlled forms using React Hook Form.
* Avoid deeply nested component trees.
* Do not perform database operations inside components.
* Avoid prop drilling when a feature-level context is more appropriate.
* Keep presentation logic separate from business logic.

---

# Styling

* Use Tailwind CSS exclusively.
* Use shadcn/ui as the primary component library.
* Use design tokens and CSS variables for colors.
* Do not hardcode hex values inside components.
* Use the approved StratJournal green theme variables.
* Support both light and dark mode.
* Follow a consistent spacing scale.
* Follow a consistent typography scale.
* Prefer utility classes over custom CSS.
* Create reusable UI patterns instead of duplicating styles.
* Mobile responsiveness is required for all screens.

---

# UI Components

* Treat `components/ui/` as vendor-managed code.
* Do not modify shadcn/ui primitives unless explicitly instructed.
* Create wrapper components when customization is required.
* Shared UI belongs in `components/`.
* Feature-specific UI belongs in `features/`.
* Reusable components must remain domain-agnostic.

---

# API Routes

* Validate request input before any logic executes.
* Authenticate requests before accessing protected resources.
* Verify ownership before returning data.
* Verify ownership before mutations.
* Return consistent response structures.
* Handle expected errors explicitly.
* Do not expose internal implementation details.
* Keep route handlers thin.
* Move business logic into the server layer.
* Reject invalid requests early.

---

# Server Actions

* Server Actions own business operations.
* Validate inputs before mutations.
* Enforce ownership checks.
* Keep actions focused on a single business operation.
* Return predictable results.
* Do not embed UI logic inside server actions.
* Do not bypass validation.

---

# Prisma

* Prisma is the only database access layer.
* All schema changes originate from `schema.prisma`.
* Never manually edit generated Prisma files.
* Never duplicate database models in code.
* Use relations instead of storing duplicated data.
* Keep database queries close to the server layer.
* Avoid unnecessary database round trips.
* Use transactions when updating related records.

---

# Authentication and Authorization

* Clerk is the single source of truth for authentication.
* Authentication does not imply authorization.
* Every protected resource must verify ownership.
* Users may only access their own data.
* Ownership validation must occur server-side.
* Never trust client-provided ownership information.
* Use the authenticated user identity from Clerk.
* Never use userId from request body, params, or client state.
* Always derive user identity from Clerk session.

---

# Data and Storage

* PostgreSQL stores structured application data.
* Cloudinary stores uploaded images.
* The database stores image metadata only.
* Never store image files in PostgreSQL.
* Dashboard metrics are derived from trade data.
* Calendar data is derived from trade data.
* Do not duplicate derived information.
* Do not store calculated analytics as source-of-truth data.
* Trades are the primary source of truth for analytics.

---

# Trade Data Rules

* Every trade must belong to an account.
* A trade may optionally belong to a playbook.
* Every trade has a status.
* Open trades are editable.
* Closed trades are immutable.
* Closed trades may not have their execution data modified.
* Every trade may have only one trade note record.
* Trade notes may contain embedded images.
* Profit and loss values are recorded when trades close.
* Analytics must use closed trades only unless explicitly stated otherwise.
* Open trades are excluded from all performance analytics.
---

# Error Handling

* Handle expected errors gracefully.
* Return actionable error messages.
* Log unexpected errors.
* Never expose stack traces to users.
* Fail safely.
* Do not silently swallow errors.
* Error states must be visible and recoverable.

---

# Testing and Verification

* Verify feature behavior before marking work complete.
* Verify ownership enforcement.
* Verify validation rules.
* Verify mobile responsiveness.
* Verify light mode.
* Verify dark mode.
* Verify database persistence.
* Verify loading states.
* Verify error states.
* Verify accessibility basics.
* Verify TypeScript passes.
* Verify ESLint passes.
* Verify production build passes.

---

# Documentation

* Keep implementation synchronized with documentation.
* Update architecture.md when architecture changes.
* Update project-overview.md when scope changes.
* Update feature documentation when workflows change.
* Do not create undocumented architectural decisions.
* Documentation must describe reality, not intentions.
* add comments to code to explain the flow of control.
* Use clear and concise language in comments.
* Avoid using technical terms unless necessary.

---
# Progressive Web App

- Maintain PWA manifest consistency with branding.
- Do not break installability in feature changes.
- Install prompt logic must remain tied to "first completed trade".

---
# File Organization

| Folder               | Responsibility                                                 |
| -------------------- | -------------------------------------------------------------- |
| `src/app/`           | Routes, layouts, pages, loading states, error boundaries       |
| `src/components/`    | Shared reusable UI components                                  |
| `src/components/ui/` | shadcn/ui primitives (vendor-managed)                          |
| `src/features/`      | Feature-specific UI and workflows                              |
| `src/server/`        | Business logic, authorization, domain services, server actions |
| `src/lib/`           | Infrastructure, utilities, third-party integrations            |
| `src/types/`         | Shared TypeScript types and interfaces                         |
| `src/hooks/`         | Reusable React hooks                                           |
| `prisma/`            | Database schema and migrations                                 |
| `public/`            | Static assets                                                  |
| `docs/`              | Project documentation and specifications                       |

---

# Definition of Done

A feature is complete only when:

1. Requirements are fully implemented.
2. Ownership rules are enforced.
3. Validation rules are enforced.
4. Documentation is synchronized.
5. TypeScript passes.
6. ESLint passes.
7. Production build passes.
8. Mobile responsiveness is verified.
9. Light mode is verified.
10. Dark mode is verified.
11. No placeholder code remains.
12. No TODO comments remain.
13. The feature works end-to-end.
