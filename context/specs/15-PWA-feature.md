# Unit 15 — Progressive Web App (PWA) + Mobile Optimization
## NB: for the logo and app icon and favicon use /icon-logo.png in public folder
## Goal

Transform StratJournal into an installable Progressive Web App (PWA) while ensuring every feature works smoothly on mobile devices. Users should be able to install the application on mobile or desktop, receive an install prompt after completing their first trade, and use the entire application comfortably on small screens.

---

## Design

This unit focuses on usability, installation, and mobile experience.

The application should feel like a native mobile app while maintaining the desktop experience established in previous units.

---

### Mobile Navigation Design

Desktop:

```text
┌─────────────┬──────────────────────┐
│ Sidebar     │ Main Content         │
│ Navigation  │                      │
│             │                      │
└─────────────┴──────────────────────┘
```

Mobile:

```text
┌──────────────────────┐
│ Header               │
├──────────────────────┤
│                      │
│ Main Content         │
│                      │
├──────────────────────┤
│ Bottom Navigation    │
└──────────────────────┘
```

---

### Bottom Navigation Items

Display:

```text
Dashboard
Trades
Calendar
Notebook
More
```

Rules:

* Always visible on mobile.
* Fixed to bottom.
* Respect safe area insets.
* Hidden on desktop.
* Uses icons and labels.

---

### Theme Toggle

Desktop:

```text
Sidebar Footer
```

Mobile:

```text
Inside More menu
```

Do not occupy bottom navigation space.

---

### Install Prompt Design

Prompt should feel native.

Display after:

```text
First CLOSED trade recorded.
```

Not:

```text
First OPEN trade.
```

Reason:

User has already experienced core application value.

Prompt appears as:

```text
Bottom Sheet (mobile)

Modal (desktop)
```

Options:

```text
Install App
Maybe Later
Don't Show Again
```

---

## Implementation

### 1. PWA Manifest

Create:

```text
src/app/manifest.ts
```

Application Name:

```text
StratJournal
```

Short Name:

```text
StratJournal
```

Description:

```text
Trading journal and strategy manager.
```

Display Mode:

```text
standalone
```

Theme Color:

Use approved application theme colors.

Orientation:

```text
portrait
```

Start URL:

```text
/
```

---

### 2. App Icons

Create icons:

```text
public/icons/
```

Required Sizes:

```text
192x192
512x512
180x180 (Apple)
```

Provide:

```text
Light background version
Dark background version
Maskable icon
```

Requirements:

* Sharp at all sizes.
* Uses StratJournal branding.
* Works on Android.
* Works on iOS.

---

### 3. PWA Metadata

Configure:

```text
src/app/layout.tsx
```

Add:

```text
manifest
themeColor
appleWebApp
viewport
icons
```

Requirements:

* Android install support.
* iOS home screen support.
* Desktop install support.

---

### 4. Service Worker

Configure PWA support.

Purpose:

```text
Installability
Asset caching
App shell caching
```

Offline trading functionality is NOT part of V1.

Cache:

```text
Static assets
Icons
Fonts
```

Do Not Cache:

```text
Trades
Dashboard data
Analytics data
Notebook content
```

Application data must remain server-driven.

---

### 5. Install Prompt Tracking

Create install prompt state management.

Location:

```text
src/lib/pwa/
```

Responsibilities:

* Detect install availability.
* Track dismissal.
* Track installation status.

Store:

```text
localStorage
```

Keys:

```text
installPromptDismissed
appInstalled
```

---

### 6. First Trade Install Logic

Install prompt becomes eligible only when:

```text
User closes first trade.
```

Rules:

Before first closed trade:

```text
No install prompt.
```

After first closed trade:

```text
Prompt may appear.
```

Prompt Conditions:

```text
App not installed
Prompt not dismissed
At least one CLOSED trade exists
```

---

### 7. Dismissal Persistence

If user selects:

```text
Maybe Later
```

Store:

```text
installPromptDismissed=true
```

Prompt should not immediately reappear.

Future behavior:

```text
Prompt may return after future version updates.
```

Not implemented in V1.

---

### 8. Mobile Layout Review

Review all pages.

Pages:

```text
Dashboard
Trades
Trade Detail
Playbooks
Notebook
Calendar
Accounts
Settings
```

Requirements:

* No horizontal scrolling.
* No clipped content.
* No overlapping UI.
* Touch targets minimum 44px.
* Comfortable spacing.

---

### 9. Mobile Trade Workflow

Review:

```text
Create Trade
Edit Trade
Close Trade
Trade Notes
Trade Images
```

Requirements:

* Forms stack vertically.
* Inputs full width.
* Numeric inputs remain usable.
* Dialogs fit mobile viewport.

---

### 10. Mobile Calendar Optimization

Calendar is one of the highest-risk mobile screens.

Requirements:

* Calendar fits viewport width.
* Day cells remain tappable.
* Indicators remain visible.
* Detail modal usable on mobile.

Trade previews:

```text
Maximum 2 previews per day cell.
```

Additional items:

```text
+X more
```

---

### 11. Responsive Tables

Review:

```text
Trades Table
Playbook Statistics
Notebook Lists
```

Mobile Behavior:

Replace large tables with:

```text
Card Layout
```

Desktop:

```text
Table Layout
```

Rules:

No horizontal scrolling for core workflows.

---

### 12. Safe Area Support

Support:

```text
iPhone notch
Android gesture navigation
```

Requirements:

* Bottom navigation not clipped.
* Install prompt not clipped.
* Modals not clipped.

Use:

```css
env(safe-area-inset-bottom)
```

where appropriate.

---

### 13. Performance Review

Verify:

* Mobile navigation responsiveness.
* Page transitions.
* Calendar rendering.
* Dashboard rendering.

Remove:

```text
Unused components
Unused hooks
Unused imports
Unused styles
```

---

## Dependencies

Recommended Packages:

```bash
npm install next-pwa
```

Purpose:

```text
Progressive Web App support.
```

No additional packages should be installed unless required during implementation.

Uses existing stack:

* Next.js
* TypeScript
* Prisma
* Clerk
* Tailwind CSS
* shadcn/ui

---

## Verify When Done

* [x] PWA manifest generated correctly.
* [x] App icons render correctly.
* [x] Android install prompt works.
* [x] iOS home screen installation works.
* [x] Desktop installation works.
* [x] Install prompt appears after first CLOSED trade.
* [x] Install prompt does not appear before first CLOSED trade.
* [x] Install prompt respects dismissal state.
* [x] Installed state detected correctly.
* [x] Mobile bottom navigation functions correctly.
* [x] Desktop sidebar remains unchanged.
* [x] Theme toggle accessible on mobile.
* [x] Theme toggle functions correctly.
* [x] Dashboard responsive.
* [x] Trades responsive.
* [x] Trade detail responsive.
* [x] Trade forms responsive.
* [x] Calendar responsive.
* [x] Notebook responsive.
* [x] Playbooks responsive.
* [x] No horizontal scrolling.
* [x] Touch targets meet accessibility requirements.
* [x] Safe area insets respected.
* [x] Light mode verified.
* [x] Dark mode verified.
* [x] No TypeScript errors.
* [x] No console errors.
* [x] Lighthouse PWA audit passes.
* [x] Production build passes (`npm run build`).
