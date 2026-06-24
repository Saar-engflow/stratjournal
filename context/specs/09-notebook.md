# Unit 9 — Notebook

## Goal

Implement a standalone trading notebook system where users can create, edit, delete, and organize personal trading notes that are independent from trades. The notebook serves as a personal knowledge base for reflections, strategies, and learning.

---

## Design

The notebook is separate from trades and playbooks.

It acts as a personal journal for ideas, not execution records.

Examples:

* Trading psychology notes
* Strategy observations
* Market behavior insights
* Mistake logs
* Learning summaries

### Visual Design

Follow tokens defined in `ui-context.md`.

Requirements:

* Use shadcn/ui components.
* Mobile-first responsive design.
* Light and dark mode support.
* Clean reading-focused layout.

### UI Structure

#### Notebook List Page

```text
/notebook
```

Layout:

Desktop:

* Grid of note cards

Mobile:

* Single column list

Each note card shows:

* Title
* Short preview (max 2–3 lines)
* Created date

Actions:

* Create note button
* Click to open note

---

#### Notebook Detail Page

```text
/notebook/[id]
```

Layout:

* Title header
* Full note content
* Edit button
* Delete button

Focus mode design (reading-first UI).

---

## Implementation

### 1. Database Model

Create `NotebookEntry` model in Prisma.

Fields:

```text
id
userId
title
content
createdAt
updatedAt
```

Rules:

* Each entry belongs to one user.
* Users can create unlimited entries.
* Entries are independent (not linked to trades or playbooks).

---

### 2. Notebook Creation

Location:

```text
/notebook
```

Create Note workflow:

* Button: "New Note"
* Opens dialog or page

Fields:

#### Title

Validation:

* Required
* 3–120 characters

---

#### Content

Validation:

* Required
* 10–10,000 characters

Supports:

* Plain text
* Optional future markdown support (do not implement yet)

---

### 3. Notebook List Page

Fetch all notebook entries for authenticated user.

Display:

* Title
* Preview (first 100–150 characters)
* Created date

Sorting:

* Newest first

Empty state:

```text
No notes yet.

Create your first trading notebook entry.
```

---

### 4. Notebook Detail Page

Route:

```text
/notebook/[id]
```

Displays:

* Title
* Full content
* Created date
* Last updated date

Actions:

* Edit note
* Delete note

Rules:

* Only owner can access
* Server-side validation required

---

### 5. Notebook Editing

Editing allowed for all entries.

Update fields:

* title
* content
* updatedAt auto-updated

Behavior:

* Inline edit or modal edit
* Save button required
* Optimistic UI optional (not required in V1)

---

### 6. Notebook Deletion

Flow:

```text
Delete button
      ↓
Confirmation dialog
      ↓
Delete entry
```

Confirmation message:

```text
Are you sure you want to delete this note?
This action cannot be undone.
```

Rules:

* Hard delete from database
* No recovery system in V1

---

### 7. Ownership Rules

All notebook operations require server-side ownership validation.

Users may:

* Create their own notes
* View their own notes
* Edit their own notes
* Delete their own notes

Users may not:

* Access other users' notes

Never trust client-provided userId.

---

### 8. Validation Rules (Zod)

#### Create / Edit Schema

```ts
title: string (3–120 chars)
content: string (10–10000 chars)
```

Reject invalid submissions with clear error messages.

---

### 9. Error Handling

Handle:

* Unauthorized access
* Missing note
* Validation errors
* Database failures

Rules:

* Show user-friendly messages
* No stack traces exposed
* Fail gracefully

---

### 10. Future Compatibility

Notebook system must support future upgrades:

* Markdown editor
* Tagging system
* Search functionality
* AI summarization
* Folder organization

Do NOT implement these yet.

Only ensure schema supports extension.

---

## Dependencies

No new packages required.

Uses existing stack:

* Prisma
* PostgreSQL
* Clerk
* Zod
* React Hook Form
* shadcn/ui

Recommended shadcn/ui components:

* Card
* Dialog
* Textarea
* Input
* Button
* Alert Dialog
* Skeleton
* Separator

---

## Verify When Done

- [x] User can create notebook entries.
- [x] User can view all entries.
- [x] User can open a single entry.
- [x] User can edit entries.
- [x] User can delete entries.
- [x] Entries are user-specific (ownership enforced).
- [x] Empty state displays correctly.
- [x] Validation works correctly.
- [x] No TypeScript errors.
- [x] No console errors.
- [x] Mobile layout works correctly.
- [x] Desktop layout works correctly.
- [x] Light mode renders correctly.
- [x] Dark mode renders correctly.
- [x] Prisma migration succeeds.
- [x] Production build passes (`npm run build`).
