# Unit 14 — Data Export

## Goal

Implement a data export system that allows users to download their trade history and notebook entries as CSV files. Users must be able to export only their own data and receive properly formatted files suitable for spreadsheet applications such as Excel, Google Sheets, and LibreOffice.

---

## Design

The export feature is a utility feature focused on data portability.

Exports are generated on demand and downloaded immediately.

No export history is stored.

No background jobs are required.

Exports should be accessible from:

```text
Dashboard
Trades Page
Notebook Page
Settings Page (optional future location)
```

### Visual Design

Follow tokens defined in `ui-context.md`.

Requirements:

* Use shadcn/ui components.
* Support light mode and dark mode.
* Mobile-first responsive design.
* Use Button components for export actions.
* Use Dropdown Menu when multiple export types exist.
* Use Toast notifications for success and failure feedback.
* Use loading states while generating exports.

Export actions should be visually secondary compared to primary application actions.

Example:

```text
[ Export Trades ]
[ Export Notebook ]
```

---

## Implementation

### 1. Export Architecture

Exports must be generated dynamically from database records.

Rules:

* Export data must never be stored.
* CSV files are generated on demand.
* Users may export only their own data.
* Ownership validation must occur server-side.
* CSV generation must use live database records.

Flow:

```text
User clicks Export
        ↓
Server validates ownership
        ↓
Data fetched from database
        ↓
CSV generated
        ↓
File downloaded
```

---

### 2. Trade Export

Create trade export workflow.

Export Format:

```text
CSV
```

File Name Format:

```text
trades-YYYY-MM-DD.csv
```

Example:

```text
trades-2026-06-23.csv
```

Export Fields:

```text
Trade ID
Account Name
Playbook Name
Instrument
Direction
Entry Price
Stop Loss
Take Profit
Lot Size
Status
Profit/Loss
Created At
Closed At
```

Rules:

* Account names should be exported instead of account IDs.
* Playbook names should be exported instead of playbook IDs.
* Empty playbook values should appear blank.
* Dates should be exported in ISO format.
* Numeric values should preserve precision.

Example Row:

```text
12345,Main Account,London Breakout,EURUSD,BUY,1.0800,1.0750,1.0900,0.50,CLOSED,125.50,2026-06-01T08:00:00Z,2026-06-01T12:00:00Z
```

---

### 3. Trade Export Button

Location:

```text
/trades
```

Display:

```text
Export Trades
```

Behavior:

```text
Click Button
        ↓
Generate CSV
        ↓
Download Starts
```

Loading State:

```text
Generating export...
```

Error State:

```text
Unable to generate export.
Please try again.
```

---

### 4. Notebook Export

Create notebook export workflow.

Export Format:

```text
CSV
```

File Name Format:

```text
notebook-YYYY-MM-DD.csv
```

Example:

```text
notebook-2026-06-23.csv
```

Export Fields:

```text
Entry ID
Title
Content
Created At
Updated At
```

Rules:

* Preserve notebook content.
* Preserve line breaks where possible.
* Export timestamps in ISO format.

Example Row:

```text
1,Weekly Review,Need to improve patience.,2026-06-01T08:00:00Z,2026-06-05T10:00:00Z
```

---

### 5. Notebook Export Button

Location:

```text
/notebook
```

Display:

```text
Export Notebook
```

Behavior:

```text
Click Button
        ↓
Generate CSV
        ↓
Download Starts
```

Loading State:

```text
Generating export...
```

Error State:

```text
Unable to generate export.
Please try again.
```

---

### 6. Ownership Validation

Every export must verify ownership.

Users may:

* Export their own trades.
* Export their own notebook entries.

Users may not:

* Export another user's trades.
* Export another user's notebook entries.

Ownership validation must occur server-side.

Never trust client-provided user IDs.

Use authenticated Clerk identity.

---

### 7. CSV Generation Service

Create dedicated export service.

Suggested Location:

```text
src/server/export/
```

Structure:

```text
src/server/export/
├── trade-export.ts
├── notebook-export.ts
└── csv.ts
```

Responsibilities:

* Fetch records
* Validate ownership
* Convert data to CSV
* Return downloadable file

UI components must not generate CSV directly.

---

### 8. Empty Export Handling

Trade Export:

If no trades exist:

```text
No trades available to export.
```

Notebook Export:

If no notebook entries exist:

```text
No notebook entries available to export.
```

Download should not begin.

---

### 9. Future Compatibility

Export architecture should support future formats.

Potential future exports:

```text
Excel (.xlsx)
PDF reports
Playbook exports
Account exports
Analytics exports
```

Do not implement these formats yet.

Only ensure export services remain extensible.

---

## Dependencies

Recommended package:

```text
papaparse
```

Reason:

```text
Reliable CSV generation and formatting.
```

Install:

```bash
npm install papaparse
```

No other dependencies required.

Uses existing stack:

* Prisma
* PostgreSQL
* Clerk
* Next.js
* TypeScript
* shadcn/ui

---

## Verify When Done

* [x] Authenticated user can export trades.
* [x] Authenticated user can export notebook entries.
* [x] CSV downloads successfully.
* [x] Trade export contains correct fields.
* [x] Notebook export contains correct fields.
* [x] Ownership validation enforced server-side.
* [x] Users cannot export another user's data.
* [x] Empty exports handled correctly.
* [x] CSV formatting is valid.
* [x] Dates export correctly.
* [x] Numeric values export correctly.
* [x] Mobile export workflow functions correctly.
* [x] Desktop export workflow functions correctly.
* [x] Light mode renders correctly.
* [x] Dark mode renders correctly.
* [x] Loading states display correctly.
* [x] Error states display correctly.
* [x] No TypeScript errors.
* [x] No console errors.
* [x] Production build passes (`npm run build`).
