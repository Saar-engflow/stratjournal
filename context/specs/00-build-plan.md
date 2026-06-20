# StratJournal Build Units

## Unit 1 — Project Foundation

### Builds

* Next.js application setup
* TypeScript configuration
* Tailwind CSS
* shadcn/ui
* Manrope font
* Light/Dark mode
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
* Trade validation
* Playbook linking
* Account linking

### Visible Result

User can create and save open trades.

### Dependencies

* Unit 4

---

## Unit 6 — Trade Management

### Builds

* Trade listing
* Trade detail page
* Trade editing
* Trade status management
* Trade close workflow
* Profit/Loss recording
* Trade locking rules

### Visible Result

User can manage trades and close them with recorded results.

### Dependencies

* Unit 5

---

## Unit 7 — Trade Notes

### Builds

* Trade note model
* Single note per trade
* Note editor
* Note updates
* Note display inside trade detail

### Visible Result

User can record trade-specific notes.

### Dependencies

* Unit 6

---

## Unit 8 — Trade Images

### Builds

* Cloudinary integration
* Image upload
* Image embedding inside notes
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
* Net profit/loss KPI

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

* Monthly calendar
* Trade day indicators
* Daily profit/loss calculation
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

* Trade export
* Notebook export
* CSV generation
* Download workflow

### Visible Result

User can export their data.

### Dependencies

* Unit 9
* Unit 12

---

## Unit 15 — Mobile Optimization

### Builds

* Responsive layouts
* Mobile navigation
* Mobile trade workflow
* Mobile calendar usability

### Visible Result

Entire application works smoothly on mobile devices.

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
Mobile Optimization
    ↓
Polish & Verification
```

# V1 Completion Point

StratJournal V1 is complete when Unit 16 is complete.

Anything beyond Unit 16 belongs to V2 and later.

Examples:

* Broker integrations
* CSV imports
* AI coaching
* Notifications
* Discipline scoring
* Strategy recommendations
* Social features
