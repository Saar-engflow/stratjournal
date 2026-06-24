# Unit 1 — Project Foundation (Spec)

## Goal

Set up a fully structured StratJournal frontend foundation using Next.js App Router, including styling, UI system, layout shell, routing structure, and theme system so the application is ready for feature development.

## Design

The application uses a dashboard-style SaaS layout with:

- Left sidebar for primary navigation
- Main content area for routed pages
- Persistent layout across all authenticated pages
- Light/Dark mode support using CSS variables
- Minimal, clean trading-focused UI (not decorative)

### Visual Language

- Neutral dark/light surfaces
- Single accent color (StratJournal green defined in design system later)
- Compact spacing for data density (trading-focused UI)
- No clutter, no animation-heavy UI in V1

### Layout Structure

```
App Shell
├── Sidebar (persistent)
├── Top header (optional later)
└── Main content (route outlet)
```

## Implementation

### 1. Project Assumption Setup

You already ran:

```bash
npx create-next-app@latest .
```

Ensure configuration is:

- App Router enabled
- TypeScript enabled
- ESLint enabled
- Tailwind enabled
- `src/` directory enabled (if not, migrate to it)

### 2. Install Core UI Dependencies

Install required UI system packages:

```bash
npm install clsx tailwind-merge
npm install lucide-react
```

Then install shadcn/ui:

```bash
npx shadcn@latest init
```

Configuration:

- Style: Default
- Base color: Neutral
- CSS variables: YES
- Components dir: `src/components`
- Utils: `src/lib/utils`

### 3. Manrope Font Setup

Install font:

```bash
npm install @fontsource-variable/manrope
```

Add to `layout.tsx`:

- Import Manrope variable font
- Apply globally to body

### 4. Theme System (Light/Dark)

Implement theme provider:

Install:

```bash
npm install next-themes
```

Create:

```
src/components/theme-provider.tsx
```

Requirements:

- System + manual theme toggle support
- Persist theme in localStorage
- Default to system preference

Wrap root layout with provider.

### 5. Global Layout Shell

Create structure:

```
src/app/(app)/
```

Add:

- `layout.tsx` → App shell wrapper
- `page.tsx` → dashboard placeholder

Layout must include:

- Sidebar (persistent)
- Main content wrapper

### 6. Sidebar Navigation

Create:

```
src/components/layout/sidebar.tsx
```

Must include navigation links:

- Dashboard (`/`)
- Trades (`/trades`)
- Playbooks (`/playbooks`)
- Accounts (`/accounts`)
- Calendar (`/calendar`)
- Notebook (`/notebook`)

Rules:

- Icons only + label (collapsible later optional)
- Active route highlighting
- Fixed width sidebar

### 7. Route Structure

Create route folders:

```
src/app/(app)/dashboard
src/app/(app)/trades
src/app/(app)/playbooks
src/app/(app)/accounts
src/app/(app)/calendar
src/app/(app)/notebook
```

Each page initially returns placeholder:

```
"Coming soon"
```

### 8. Utility Setup

Create:

```
src/lib/utils.ts
```

Include:

- `cn()` helper for Tailwind class merging

### 9. Base Styling

In `globals.css`:

- Enable CSS variables from shadcn
- Define background + foreground tokens
- Ensure dark mode support
- Remove default styling clutter

## Dependencies

- `next` (App Router framework)
- `react` (UI layer)
- `tailwindcss` (styling system)
- `shadcn/ui` (UI primitives)
- `lucide-react` (icons)
- `clsx` (conditional classes)
- `tailwind-merge` (class merging)
- `next-themes` (dark mode system)
- `@fontsource-variable/manrope` (font system)

## Verify When Done

- [x] App runs with `npm run dev`
- [x] Sidebar renders on all app pages
- [x] Navigation routes work (no 404s)
- [x] Dark mode toggles correctly
- [x] Light mode renders correctly
- [x] Manrope font applied globally
- [x] shadcn/ui is installed and working
- [x] Layout persists across routes
- [x] No TypeScript errors
- [x] No console errors
- [x] Responsive on mobile and desktop
- [x] Build passes (`npm run build`)