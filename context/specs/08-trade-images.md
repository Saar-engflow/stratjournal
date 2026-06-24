# Unit 8 — Trade Images
## NB: ive added BLOB_STORE_ID and BLOB_READ_WRITE_TOKEN to .env file.
## Goal

Implement image upload and management for trade notes using Vercel Blob. Users should be able to upload, view, and delete screenshots directly within a trade note to support trade reviews and post-trade analysis.

---

## Design

Trade images are supporting evidence for a trade.

**Examples:** Entry screenshots · Exit screenshots · TradingView charts · Marked-up trade reviews · Market structure analysis

**Key rules:**
- Images belong to a trade note
- Images do not exist independently

### Visual Design

- shadcn/ui components throughout
- Light mode and dark mode support
- Mobile-first responsive design
- Image uploads occur inside the trade note section
- Uploaded images appear as a responsive gallery
- Images open in a larger preview when selected
- Delete actions require confirmation
- Upload states must be clearly visible
- Failed uploads must display actionable error messages

---

## Implementation

### 1. Database Model

```prisma
model TradeImage {
  id          String    @id @default(cuid())
  tradeNoteId String

  url         String
  pathname    String

  uploadedAt  DateTime  @default(now())

  tradeNote   TradeNote @relation(fields: [tradeNoteId], references: [id], onDelete: Cascade)
}
```

**Relationship tree:**

```
Trade
 └── TradeNote
       └── TradeImages
```

**Rules:**
- Every image belongs to exactly one trade note
- A trade note may contain multiple images
- Images cannot exist without a trade note
- Users cannot access another user's images

---

### 2. Vercel Blob Integration

```
Image File  →  Vercel Blob  (binary storage)
Metadata    →  PostgreSQL   (url + pathname only)
```

> Never store image files inside PostgreSQL.

**Environment variable required:**

```
BLOB_READ_WRITE_TOKEN
```

**Shared infrastructure:** `src/lib/blob.ts`

Responsibilities: upload image · delete image · shared Blob configuration

---

### 3. Image Upload Workflow

**Location:** Trade Detail Page → Trade Note Section

**Supported formats:** PNG · JPG · JPEG · WEBP

**Validation rules:**

| Rule | Detail |
|---|---|
| Max file size | 10MB |
| File type | Images only |
| Format | Reject unsupported formats |
| Integrity | Reject corrupted uploads |

**Workflow:**

```
Select Image
     ↓
Validate
     ↓
Upload to Blob
     ↓
Save metadata to database
     ↓
Render image
```

Show `Uploading...` indicator while upload is active.

---

### 4. Image Gallery

**Layout:**

| Breakpoint | Layout |
|---|---|
| Desktop | Responsive grid |
| Mobile | Single column |

**Each image card displays:**
- Screenshot preview
- Upload date
- Delete button

**Requirements:** Images scale correctly · maintain aspect ratio · avoid layout shifts

---

### 5. Image Preview

```
Click Image
     ↓
Preview Dialog Opens
```

**Display:** Full image + close button

Use `Dialog` on desktop, `Drawer` on mobile. Preserve image quality on both.

---

### 6. Image Deletion

**Workflow:**

```
Delete Button
     ↓
Confirmation Dialog
     ↓
Delete Blob file
     ↓
Delete database record
```

**Confirmation message:**

```
Are you sure you want to delete this image?
This action cannot be undone.
```

**Rules:**
- Blob file must be deleted
- Database metadata must be deleted
- Partial deletion states must be handled safely

---

### 7. Ownership Rules

**Users may:** Upload · view · delete their own images

**Users may not:** View, delete, or upload images belonging to another user's trades

> Ownership validation must occur server-side. Never trust client-provided IDs.

---

### 8. Trade Status Rules

| Trade State | Upload | Delete | View |
|---|---|---|---|
| OPEN | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| CLOSED | ❌ Disabled | ❌ Disabled | ✅ Allowed |

This preserves historical trade integrity.

---

### 9. Error Handling

**Must handle:** Upload failure · Blob API failure · validation failure · missing image · unauthorized access

**UI behaviour:** User-friendly messages, no silent failures, no stack traces exposed.

**Example messages:**

```
Image upload failed. Please try again.
Unsupported image format.
Image exceeds maximum file size.
```

---

### 10. Future Compatibility

Architecture must support *(do NOT implement yet)*:

- Multiple screenshots
- Annotations
- Trade review galleries
- Image tagging
- AI review features

---

## Dependencies

```bash
npm install @vercel/blob
```

Existing stack: Prisma · PostgreSQL · Clerk · Zod · React Hook Form · shadcn/ui

**Recommended shadcn/ui components:** Button · Card · Dialog · AlertDialog · Skeleton · ScrollArea · Badge

---

## Verification Checklist

- [x] Authenticated user can upload images
- [x] Images are stored in Vercel Blob
- [x] Image metadata is stored in PostgreSQL
- [x] Uploaded images render correctly
- [x] Image previews open correctly
- [x] User can delete images
- [x] Blob files are removed after deletion
- [x] Database metadata is removed after deletion
- [x] Users cannot access another user's images
- [x] Users cannot delete another user's images
- [x] Upload validation works correctly
- [x] Invalid file types are rejected
- [x] Oversized files are rejected
- [x] Closed trades prevent uploads
- [x] Closed trades prevent image deletion
- [x] Open trades allow uploads
- [x] Open trades allow deletion
- [x] Mobile layout renders correctly
- [x] Desktop layout renders correctly
- [x] Light mode renders correctly
- [x] Dark mode renders correctly
- [x] Ownership checks enforced server-side
- [x] No TypeScript errors
- [x] No console errors
- [x] Prisma migration succeeds
- [x] `npm run build` passes
