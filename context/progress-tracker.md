# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- (tbd)

## Current Goal

- (tbd)

## Completed

- Unit 1 — Project Foundation (Spec: context/specs/01-project-foundation.md)
- Unit 2 — Authentication (Spec: context/specs/02-authentication.md)
- Unit 3 — Trading Accounts (Spec: context/specs/03-trading-accounts.md)
- Unit 4 — Playbook Management (Spec: context/specs/04-playbook-management.md)
- Unit 5 — Trade Creation (Spec: context/specs/05-trade-creation.md)
- Unit 6 — Trade Management (Spec: context/specs/06-trade-management.md)
- Unit 7 — Trade Notes (Spec: context/specs/07-trade-notes.md)
- Unit 8 — Trade Images (Spec: context/specs/08-trade-images.md)
- Unit 9 — Notebook (Spec: context/specs/09-notebook.md)
- Unit 10 — Dashboard Metrics (Spec: context/specs/10-dashboard-metrics.md)
- Unit 11 — Dashboard Charts (Spec: context/specs/11-dashboard-charts.md)
- Unit 12 — Calendar (Spec: context/specs/12-calendar.md)
- Unit 13 — Account Filtering (Spec: context/specs/13-account-filtering.md)
- Unit 14 — Data Export (Spec: context/specs/14-data-export.md)
- Unit 15 — Progressive Web App (PWA) + Mobile Optimization (Spec: context/specs/15-PWA-feature.md)
- Unit 17 — Custom Auth UI (Stable Split Layout) (Spec: context/specs/17-custom-auth-ui.md)
- Unit 16 — Polish & Verification (Spec: context/specs/16-polish-and-verification.md)

## In Progress

- (tbd)

## Next Up

- (tbd)

## Open Questions

- None yet.

## Architecture Decisions

- Use Next.js App Router with src directory
- Use shadcn/ui as UI component library
- Use next-themes for dark/light mode
- Use Tailwind CSS for styling
- Use Manrope variable font
- Use Clerk for authentication
- Use Prisma + PostgreSQL for database

## Session Notes

- Unit 1 completed successfully
- Unit 2 — Authentication completed successfully:
  - Installed @clerk/nextjs and @clerk/ui packages
  - Created .env.local file with placeholder environment variables
  - Configured ClerkProvider in root layout with shadcn theme
  - Set up proxy.ts middleware
  - Created sign-in and sign-up pages with custom AuthLayout
  - Added Clerk shadcn theme CSS import
  - Fixed all type errors
  - Made Clerk UI fully consistent with design system
  - No authentication logic inside UI components
  - Build passes without errors
- Unit 3 — Trading Accounts completed successfully:
  - Added isActive field to Account model in Prisma schema
  - Created and ran migration for the new field
  - Created server-side logic for accounts (service, validation, actions)
  - Implemented account creation, editing, deletion, and switching
  - Created accounts page with empty state and account cards
  - Added account switcher to desktop sidebar and mobile header
  - Implemented onboarding modal for first-time users
  - Added deletion protection for accounts with trades
  - Ensured proper ownership validation
  - All verification checkboxes marked as complete
- Unit 4 — Playbook Management completed successfully:
  - Changed Playbook.rules from String to Json in Prisma schema
  - Updated types and validation schema to support string[] rules
  - Implemented checklist UI for adding/editing rules
  - Added rule count display to playbook cards
  - Display rules as checklist on detail page
  - Applied proper ownership validation server-side
  - All verification checkboxes marked as complete
  - Made Playbook.description optional in schema
  - Updated validation: description optional up to 200 characters
  - Applied schema changes using prisma db push
- Unit 5 — Trade Creation completed successfully:
  - Created trade types (TradeListItem, TradeDetail)
  - Implemented Zod validation schema for trade form
  - Created trade service with listTradesForUser and createTradeForUser
  - Implemented server action createTradeAction
  - Built TradeForm component with form handling and validation
  - Built TradeCard component for displaying trades
  - Built TradesPageClient with empty state and trade grid
  - Created /trades page that fetches and displays trades
  - Created /trades/new page that shows the trade creation form
  - Implemented ownership checks for both accounts and playbooks
  - All verification checkboxes marked as complete
  - No TypeScript errors
- Fixed Zod 4 validation errors:
  - Replaced deprecated `required_error` and `message` parameters with unified `error` parameter in all validation files
  - Updated account.validation.ts, trade.validation.ts, playbook.validation.ts, and notebook.validation.ts
  - Build passes without errors
- Fixed Decimal type comparison error:
  - Converted `t.profitLoss` to Number before comparing in dashboard-metrics.ts
  - Build passes without errors
- Fixed missing papaparse type definitions:
  - Installed @types/papaparse as dev dependency
  - Build passes without errors
- Fixed type mismatch in trade actions:
  - Converted `undefined` to `null` when passing content to upsertTradeNoteForUser in trade.actions.ts
  - Build passes without errors
  - Build passes successfully
- Unit 6 — Trade Management completed successfully:
  - Added getTradeForUser, updateTradeForUser, closeTradeForUser to trade service
  - Implemented server actions updateTradeAction and closeTradeAction
  - Built TradeDetailPage for viewing trade details
  - Updated TradeForm to support editing existing trades
  - Built CloseTradeForm component for closing trades with P/L
  - Updated TradeCard with View, Edit, Close buttons
  - Implemented server-side checks to prevent editing closed trades
  - Added profit/loss validation on close
  - All verification checkboxes marked as complete
  - No TypeScript errors
- Fixed Zod 4 validation errors:
  - Replaced deprecated `required_error` and `message` parameters with unified `error` parameter in all validation files
  - Updated account.validation.ts, trade.validation.ts, playbook.validation.ts, and notebook.validation.ts
  - Build passes without errors
- Fixed Decimal type comparison error:
  - Converted `t.profitLoss` to Number before comparing in dashboard-metrics.ts
  - Build passes without errors
- Fixed missing papaparse type definitions:
  - Installed @types/papaparse as dev dependency
  - Build passes without errors
- Fixed type mismatch in trade actions:
  - Converted `undefined` to `null` when passing content to upsertTradeNoteForUser in trade.actions.ts
  - Build passes without errors
