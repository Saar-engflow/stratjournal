# StratJournal Build Units

## Unit 1 — Project Foundation

### Builds

* Next.js application setup
* TypeScript configuration
* Tailwind CSS
* shadcn/ui setup
* Manrope font integration
* Light/Dark mode system
* Application layout shell
* Sidebar navigation
* Route structure

### Visible Result

User can open StratJournal and navigate between empty pages using the final application layout.

### Dependencies

None

---

## Unit 2 — Authentication

### Builds

* Clerk integration
* Sign up
* Sign in
* Protected routes
* Dashboard redirect
* Unauthorized access handling

### Visible Result

A user can create an account, sign in, and access protected pages.

### Dependencies

* Unit 1

---

## Unit 3 — Trading Accounts

### Builds

* Account database model
* Account creation
* Account editing
* Account deletion
* Active account selection
* Account switcher UI

### Visible Result

User can create one or more trading accounts and switch between them.

### Dependencies

* Unit 2

---

## Unit 4 — Playbook Management

### Builds

* Playbook database model
* Create playbook
* Edit playbook
* Delete playbook
* Playbook list page
* Playbook detail page

### Visible Result

User can create and manage trading playbooks.

### Dependencies

* Unit 3

---

## Unit 5 — Trade Creation

### Builds

* Trade database model
* Trade form
* Open trade workflow
* Trade validation (Zod)
* Playbook linking (optional)
* Account linking (required)
* Input validation rules

### Visible Result

User can create and save open trades.

### Dependencies

* Unit 4

---

## Unit 6 — Trade Management

### Builds

* Trade listing
* Trade detail page
* Trade editing (only for OPEN trades)
* Trade status management
* Trade close workflow
* Profit/Loss recording (required on close)
* Trade locking rules

### Visible Result

User can manage trades and close them with recorded results.

### Dependencies

* Unit 5

---

## Unit 7 — Trade Notes

### Builds

* Trade note model (single note per trade)
* Note editor
* Note updates (only while trade is OPEN)
* Note display inside trade detail

### Visible Result

User can record trade-specific notes.

### Dependencies

* Unit 6

---

## Unit 8 — Trade Images

### Builds

* Vercel blob storage integration
* Image upload
* Image embedding inside trade notes
* Image rendering
* Image deletion

### Visible Result

User can upload and view screenshots within trade notes.

### Dependencies

* Unit 7

---

## Unit 9 — Notebook

### Builds

* Notebook entry model
* Create note
* Edit note
* Delete note
* Note list page
* Note detail page

### Visible Result

User can maintain an independent trading notebook.

### Dependencies

* Unit 3

---

## Unit 10 — Dashboard Metrics

### Builds

* Total trades KPI
* Open trades KPI
* Closed trades KPI
* Win rate KPI
* Net profit/loss KPI (derived from closed trades only)

### Visible Result

Dashboard displays meaningful trading statistics.

### Dependencies

* Unit 6

---

## Unit 11 — Dashboard Charts

### Builds

* Performance chart
* Trend visualization
* Recent trades section

### Visible Result

User can visually review performance trends.

### Dependencies

* Unit 10

---

## Unit 12 — Calendar

### Builds

* Monthly trading calendar
* Trade day indicators
* Daily profit/loss calculation (derived from closed trades only)
* Trade previews
* Note previews
* Calendar detail modal

### Visible Result

User can review historical trading activity from a calendar.

### Dependencies

* Unit 7

---

## Unit 13 — Account Filtering

### Builds

* Global account filter
* Dashboard filtering
* Calendar filtering
* Trade filtering
* Playbook filtering

### Visible Result

User can view data for a specific trading account.

### Dependencies

* Unit 12

---

## Unit 14 — Data Export

### Builds

* Trade export (CSV)
* Notebook export (CSV)
* Download workflow

### Visible Result

User can export their data.

### Dependencies

* Unit 9
* Unit 12

---

## Unit 15 — Progressive Web App (PWA) + Mobile Optimization

### Builds

* PWA manifest configuration
* App icons and branding setup
* Installable app behavior
* First-trade install prompt logic
* Remember dismissed install prompt state
* Responsive layouts
* Mobile navigation
* Mobile trade workflow
* Mobile calendar usability

### Visible Result

* App is installable on mobile and desktop
* User is prompted to install after first completed trade
* Entire application works smoothly on mobile devices

### Dependencies

* Units 1–14

---

## Unit 16 — Polish & Verification

### Builds

* Loading states
* Empty states
* Error states
* Accessibility pass
* Dark mode verification
* Light mode verification
* Performance review
* CodeRabbit review cleanup
* API authorization verification pass

### Visible Result

Application feels production-ready.

### Dependencies

* Units 1–15

---

# Dependency Flow

```text
Foundation
    ↓
Authentication
    ↓
Accounts
    ↓
Playbooks
    ↓
Trade Creation
    ↓
Trade Management
    ↓
Trade Notes
    ↓
Trade Images
    ↓
Dashboard Metrics
    ↓
Dashboard Charts
    ↓
Calendar
    ↓
Account Filtering
    ↓
Export
    ↓
PWA + Mobile Optimization
    ↓
Polish & Verification
```

---

# V1 Completion Point

StratJournal V1 is complete when Unit 16 is finished.

Anything beyond this belongs to V2 and later.

### Explicitly Out of Scope for V1

* Broker integrations
* CSV imports (data ingestion)
* AI coaching or suggestions
* Notifications or alerts
* Discipline scoring systems
* Gamification (badges, streaks, points)
* Social features
* Shared journals
* Real-time trading execution
* Strategy optimization engines
* Mobile native applications
