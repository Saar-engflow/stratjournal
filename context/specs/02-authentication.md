# Unit 2 — Authentication

## Goal

Implement secure authentication using Clerk so that users can sign up, sign in, and access protected areas of StratJournal. All protected routes must enforce authentication and redirect unauthenticated users appropriately.

---

## Design

Authentication is handled entirely by Clerk as the single source of truth.

- Public routes:
  - /sign-in
  - /sign-up

- Protected routes:
  - /dashboard
  - /trades
  - /playbooks
  - /calendar
  - /notebook

Layout rules:
- Unauthenticated users are redirected to /sign-in
- Authenticated users are redirected to /dashboard after login
- No authentication logic should exist inside feature components
- Auth state must be accessed only via Clerk hooks or server helpers

UI behavior:
- Clean auth pages (minimal UI, no sidebar)
- Dashboard only visible after authentication

---

## Implementation

### 1. Install Clerk

Set up Clerk in the Next.js app using App Router support.

### 2. Environment Setup

Add Clerk environment variables:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

### 3. Clerk Provider Setup

Wrap the entire application in ClerkProvider inside:

- src/app/layout.tsx

Ensure it wraps ThemeProvider and all children.

---

### 4. Middleware Protection

Create proxy.ts:

- Protect all routes except:
  - /sign-in
  - /sign-up
  - /api/webhooks (if used later)

Redirect logic:
- If user is not authenticated → /sign-in
- If user is authenticated and on auth page → /dashboard

---

### 5. Auth Pages

Create:
- /sign-in page using Clerk <SignIn />
- /sign-up page using Clerk <SignUp />

These pages must:
- Be centered layouts
- Not include sidebar or app shell
- Use minimal styling

---

### 6. App Layout Protection

Ensure app layout:
- Requires authentication
- Does not render main UI unless user is authenticated

Use Clerk server helpers:
- auth()
- currentUser()

---

### 7. Dashboard Redirect Logic

After login:
- redirect user to /dashboard
- ensure no blank intermediate state

---

### 8. Unauthorized Handling

If user tries to access protected route:
- redirect to /sign-in
- preserve intended destination (optional enhancement)

---

## Dependencies

- @clerk/nextjs (Clerk authentication SDK)

---

## Verification Checklist

- [ ] User can sign up successfully
- [ ] User can sign in successfully
- [ ] Unauthenticated users cannot access protected routes
- [ ] Authenticated users are redirected to dashboard
- [ ] Sign-in and sign-up pages render correctly
- [ ] Clerk session persists on refresh
- [ ] No auth logic exists inside UI components
- [ ] Middleware protection works correctly
- [ ] Build passes without errors