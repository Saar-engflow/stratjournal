# Unit 7 — Trade Notes

## Goal

Implement a trade notes system that allows users to attach a single structured note per trade. Notes are editable only while the trade is OPEN and become read-only once the trade is CLOSED.

---

## Design

Trade notes represent the trader's reasoning, execution context, and post-entry reflection. This feature is tightly coupled to a trade and must always be displayed within the trade detail view.

### Key Concept

Each trade has exactly **one note:**

```
Trade → TradeNote (1:1 relationship)
```

Not multiple notes per trade in V1.

### Note Behavior Rules

- A trade has exactly one note record
- Note can be created or updated only while trade is OPEN
- Once trade is CLOSED, note becomes read-only
- Note is optional at creation time *(can be empty initially)*

---

## Visual Design

**Component library:** shadcn/ui

| Component | Usage |
|---|---|
| `Card` | Note container |
| `Textarea` | Note editor |
| `Button` | Save / update note |
| `Separator` | Section divider |
| `Badge` | Optional "editable / locked" state indicator |

### Layout Placement

Inside the Trade Detail Page:

```
[ Trade Summary       ]
[ Execution Info      ]
[ Trade Note Section  ]  ← NEW
```

---

## Implementation

### 1. Database Model

```prisma
model TradeNote {
  id        String   @id @default(cuid())
  tradeId   String   @unique

  content   String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  trade     Trade    @relation(fields: [tradeId], references: [id], onDelete: Cascade)
}
```

**Relationship rule:**

```
Trade 1 ─── 1 TradeNote
```

Each trade can only have one note. `onDelete: Cascade` ensures the note is removed when the trade is deleted.

---

### 2. Note UI Component

**File:** `/components/trade-note.tsx`

**States:**

| Trade State | UI Behaviour |
|---|---|
| OPEN | Textarea enabled, save button visible, auto-create note if none exists |
| CLOSED | Textarea disabled, save button hidden, display read-only text |

---

### 3. Note Editor

**UI structure:**

```
Trade Note
--------------------------------
[ Textarea ..................... ]
[ Save Button                  ]
```

**Editor behaviour:**
- If note exists → load content
- If not → initialize empty note
- Auto-save: NOT required in V1
- Manual save button: required

---

### 4. Server Actions

#### Save Note — `server/trades/save-note.ts`

Must:
1. Verify user authentication
2. Verify trade ownership
3. Check `trade.status === OPEN`
4. Upsert `TradeNote`: update if exists, create if not

#### Read Note

Included in trade query — join `TradeNote` when fetching trade detail.

---

### 5. Ownership Rules

- User can only access notes for their own trades
- Notes inherit ownership from `Trade`
- No direct note access by ID without trade validation

---

### 6. Note Editing Rules

Editable **only when:**

```
trade.status === "OPEN"
```

If `CLOSED`:
- Disable textarea
- Hide save button
- Prevent server updates

---

### 7. Empty State

If no note exists, display:

```
No notes added for this trade yet.
```

Show an "Add Note" button or auto-open the editor.

---

### 8. UI States

| State | Textarea | Save Button | Notes |
|---|---|---|---|
| No note | Empty | Active | — |
| Editing | Filled | Active | — |
| Saved | Filled | Active | Success toast + updated timestamp |
| Locked (CLOSED) | Disabled | Hidden | "Read-only" badge |

---

### 9. Validation Rules

| Rule | Detail |
|---|---|
| Required | No — optional initially |
| Max length | 10,000 characters |
| Sanitization | No script injection |

---

### 10. Error Handling

**Must handle:**
- Unauthorized access
- Edit attempt on CLOSED trade note
- Missing trade
- Database failures

**UI behaviour:** Toast error messages — no silent failures, no stack traces exposed.

---

## Dependencies

No new packages required. Existing stack:

- Prisma
- Clerk
- Zod
- React Hook Form
- shadcn/ui

---

## Verification Checklist

- [x] User can create a trade note
- [x] Each trade has only one note
- [x] Note is editable only when trade is OPEN
- [x] Note becomes read-only when trade is CLOSED
- [x] Note is correctly displayed in trade detail page
- [x] Upsert logic works correctly
- [x] Ownership enforced server-side
- [x] Empty state displays correctly
- [x] Mobile layout works correctly
- [x] Desktop layout works correctly
- [x] No TypeScript errors
- [x] No console errors
- [x] Prisma migration succeeds
- [x] npm run build passes