# Unit 4 — Playbook Management
## NB: i had already implemented this stage  , please ensure u read the file first then  alter the code  i had already made for unit 4   

## Goal

Implement a playbook system that allows users to create, edit, delete, and manage trading strategies. Each playbook acts as a reusable rule-set that can be attached to trades and later used for performance analysis.

---

## Design

Playbooks represent structured trading strategies used during execution. They must feel like a **practical checklist**, not just a text note.

### Key Idea

Instead of storing rules as plain text paragraphs, the system must support:

- Structured rules (checklist-style input UI)
- Optional description (free text summary)

### Playbook Structure

| Field | Description |
|---|---|
| Name | Strategy title |
| Description | Short explanation |
| Rules | Structured checklist items |

---

## Rules UX

Rules must be editable as a list of items. Each item is a checkbox-style rule.

**User can:**
- Add rule
- Delete rule
- Reorder rule *(optional — not required in V1)*

**Example UI:**

```
☐ Market structure bullish
☐ Liquidity swept
☐ MSS confirmed
☐ Entry on retrace
☐ Risk 1%
```

> This is **NOT** a paragraph field anymore.

**Internal storage:**

```ts
rules: string[]
// or serialized JSON
```

---

## Visual Design

**Component library:** shadcn/ui

| Component | Usage |
|---|---|
| `Card` | Playbook preview |
| `Dialog` | Create / edit playbook |
| `AlertDialog` | Delete confirmation |
| `Input` | Name field |
| `Textarea` | Description field |
| Custom checklist UI | Rules |

**Layout:**

| Breakpoint | Layout |
|---|---|
| Mobile | Single column cards, full-width actions, sticky "Create Playbook" button |
| Desktop | Grid of cards (2–3 columns), optional side-by-side stats preview later |

---

## Implementation

### 1. Database Model

Update `Playbook` model:

```
id
userId
name
description
rules       ← JSON array / string[]
createdAt
updatedAt
```

**Rules field change:**

```ts
// Before
rules: string

// After
rules: string[]   // or Json (prefer string[] if Prisma supports cleanly)
```

---

### 2. Playbook Creation

**Route:** `/playbooks`

#### Step 1 — Basic Info

- Name *(required)*
- Description *(required)*

#### Step 2 — Rules Builder

```
[ + Add rule input          ]  [ Add ]

☐ Rule 1   [delete]
☐ Rule 2   [delete]
```

**Validation:**

| Field | Rule |
|---|---|
| Name | 3–100 characters |
| Description | 10–500 characters |
| Rules | Minimum 1 rule required |
| Each rule | 3–200 characters |

---

### 3. Playbook List Page

**Route:** `/playbooks`

**Each card shows:**
- Name
- Description preview
- Rule count
- Trade count
- Win rate
- Net P/L

**Actions:** View · Edit · Delete

**Mobile:** Stacked cards, full-width buttons
**Desktop:** Grid layout

---

### 4. Playbook Detail Page

**Route:** `/playbooks/[id]`

#### Header
- Playbook name
- `createdAt`
- `updatedAt`

#### Description Section
Simple text block.

#### Rules Section

```
☐ Rule 1
☐ Rule 2
☐ Rule 3
```

> Rules are **NOT** editable here unless in edit mode.

#### Statistics Section

Derived from trades — **never stored in DB, always computed.**

| Stat | Source |
|---|---|
| Total trades | Count of linked trades |
| Wins | Count where result = win |
| Losses | Count where result = loss |
| Win rate | Wins / Total |
| Net P/L | Sum of trade P/L |

#### Recent Trades

Latest linked trades showing: Instrument · Direction · Result · P/L

---

### 5. Playbook Editing

**Editable fields:** Name · Description · Rules (full CRUD on list)

Rules editor behaves the same as during creation.

---

### 6. Playbook Deletion

**Flow:** Delete → Confirm → Remove playbook

**Behavior:**
- Playbook is deleted
- Trades remain intact
- `trade.playbookId` becomes `null`

---

### 7. Trade Integration *(Future Hook)*

Trade form must support:
- Playbook selector *(optional)*
- Stores: `playbookId | null`

---

### 8. Ownership Rules

- Users only access their own playbooks
- Server-side validation required
- **Never trust client `userId`**

---

### 9. Empty State

```
No playbooks yet.
Create your first trading strategy.
```

CTA: **Create Playbook** button

---

### 10. Future Compatibility

Structure must support *(do NOT implement yet)*:

- Strategy performance scoring
- Rule adherence tracking
- Execution quality metrics

Ensure schema supports extension.

---

## Dependencies

No new packages required. Existing stack:

- Prisma
- PostgreSQL
- Clerk
- Zod
- React Hook Form
- shadcn/ui

---

## Verification Checklist

- [ ] User can create playbook
- [ ] User can add rules as checklist items
- [ ] Rules are NOT stored as paragraph text
- [ ] Playbooks display as structured checklist
- [ ] Playbook editing updates rules correctly
- [ ] Playbook deletion works safely
- [ ] Trades remain intact after deletion
- [ ] `playbookId` becomes `null` on delete
- [ ] Mobile layout works correctly
- [ ] Desktop layout works correctly
- [ ] Ownership enforced server-side
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Prisma migration succeeds
- [ ] `npm run build` passes