# StratJournal - Project Overview

## Overview

StratJournal is a free web-based trading journal designed to help traders accurately record, organize, and review their trading activity. The application focuses on structured trade tracking, playbook adherence, trade notes, and performance analysis rather than trade coaching or automation. Users can create trading accounts, define playbooks, log trades, attach notes and images, and review their performance through dashboards and calendars. The goal is to provide a simple, transparent, and disciplined environment for traders to reflect on execution quality and trading outcomes.

---

# Goals

1. Allow authenticated users to create and manage one or more trading accounts.
2. Allow users to create and maintain multiple playbooks that can be linked to trades.
3. Allow users to manually log, update, and close trades with complete trade information.
4. Record profit and loss for every closed trade and make it available throughout the system.
5. Provide a calendar view that displays trading activity, trade outcomes, and notes for each day.
6. Provide a dashboard that summarizes trading performance using accurate trade data.
7. Allow users to maintain both trade-specific notes and independent notebook entries.
8. Allow users to attach images to trade notes.
9. Ensure all user data is private and accessible only by the account owner.
10. Allow users to export their own trading data.
11. Allow users to install StratJournal as a Progressive Web App (PWA) on supported devices.

---

# Core User Flow

1. User opens the application.
2. User signs up or signs in using Clerk authentication.
3. User is redirected to the dashboard.
4. First-time users are prompted to create a trading account.
5. User creates a trading account.
6. User navigates to the Playbooks page.
7. User creates one or more playbooks containing their trading rules and strategy information.
8. User navigates to the Trades page.
9. User creates a new trade.
10. User selects an account.
11. User optionally links a playbook.
12. User enters trade information such as instrument, direction, lot size, entry price, stop loss, and take profit.
13. User adds trade notes and optional images.
14. User saves the trade as an open trade.
15. User can continue updating the trade while it remains open.
16. User closes the trade by entering final trade results including profit or loss amount.
17. If this is the user's first completed trade and the device supports installation, the user is prompted to install StratJournal.
18. The user may install the application or dismiss the prompt.
19. The application remembers the user's choice.
20. Trade execution data becomes locked and immutable after closure. Trade notes remain editable.
21. The trade automatically appears in dashboard analytics.
22. The trade automatically appears on the calendar for the relevant dates.
23. User reviews historical performance through the dashboard, calendar, playbook statistics, and notebook.
24. User can export their data when needed.

---

# Features

## Authentication

* Email/password authentication
* Google sign-in
* Protected routes
* Persistent user sessions

## Accounts

* Create trading accounts
* Manage multiple trading accounts
* Associate trades with accounts
* Filter data by account

## Playbooks

* Create playbooks
* Edit playbooks
* Delete playbooks
* Link trades to playbooks
* Track playbook performance

## Trades

* Create trades manually
* Open and close trade lifecycle
* Trade status tracking
* Profit and loss recording
* Account association
* Playbook association
* Trade locking after closure

## Trade Notes

* One note record per trade
* Editable while trade is open
* Support image embedding
* Timestamp tracking

## Calendar

* Monthly trading calendar
* Daily profit/loss summary
* Trade activity indicators
* Trade note previews
* Trade detail access

## Dashboard

* Total trades
* Closed trades
* Open trades
* Win rate
* Net profit/loss
* Performance trends
* Recent trade activity

## Notebook

* Independent notes not tied to trades
* Create, edit, and delete notes
* Research and study journal

## Export

* Export trade data
* Export notebook data
* CSV format

## Progressive Web App

* Installable on supported browsers
* Mobile home-screen installation
* Desktop installation support
* First completed trade install prompt
* Remember dismissed install prompts

---

# In Scope

* Next.js application
* Clerk authentication
* PostgreSQL database
* Prisma ORM
* Cloudinary image storage
* Multi-account support
* Playbook management
* Manual trade entry
* Open and closed trade lifecycle
* Trade notes
* Embedded images in trade notes
* Trading calendar
* Dashboard analytics
* Notebook system
* Data export
* Responsive desktop and mobile layouts
* Light and dark mode support
* Progressive Web App support
* Application installation prompt
* PWA manifest and icons

---

# Out of Scope

* Broker API integrations
* Automated trade imports
* CSV imports
* AI coaching
* Trade recommendations
* Discipline scoring
* Gamification systems
* Badges, streaks, or points
* Social features
* Shared journals
* Public profiles
* Team collaboration
* Copy trading
* Real-time market data
* Live trade execution
* Mobile native applications
* Push notification systems
* Advanced reporting systems
* Strategy optimization engines

---

# Success Criteria

The project is considered complete when:

1. A new user can sign up and sign in successfully.
2. An authenticated user can create at least one trading account.
3. A user can create, edit, and delete playbooks.
4. A user can create a trade linked to an account.
5. A user can optionally associate a trade with a playbook.
6. A user can create and update trade notes.
7. A user can upload and view images attached to trade notes.
8. A user can save an open trade.
9. A user can close a trade and record profit or loss.
10. Closed trades become read-only except for note additions.
11. Closed trades appear correctly in dashboard analytics.
12. Closed trades appear correctly on the calendar.
13. Calendar days display associated trade information and note previews.
14. Users can create, edit, and delete notebook entries.
15. All user data is isolated and inaccessible to other users.
16. Dashboard metrics accurately reflect underlying trade data.
17. Users can export their trade and notebook data.
18. The application functions correctly on desktop and mobile devices.
19. Light and dark themes function correctly throughout the application.
20. All core functionality works without requiring broker integrations or external trading platforms.
