
# StratJournal

A free, web-based trading journal designed to help traders accurately record, organize, and review their trading activity. StratJournal focuses on structured trade tracking, playbook adherence, trade notes, and performance analysis rather than trade coaching or automation.


### Screenshots

| Screenshot | Description |
|------------|-------------|
| ![dashboard](public/SJ-1.png) | **Dashboard Overview** - View your total trades, win rate, net profit/loss, and performance charts at a glance |
| ![dashboard dark mode](public/SJ-2.png) | **Dark Mode** - Enjoy the app in dark mode for comfortable night trading |
| ![calender](public/SJ-3.png) | **Calendar View** - See your trading activity and results day-by-day |
| ![playbook](public/SJ-4.png) | **Playbook Management** - Follow your trading rules strictly before placing trades |
| ![trade form](public/SJ-5.png) | **Trade Logging** - Manually log your trades with all relevant details |

## Key Features

### Core Functionality
- ✅ **Authentication**: Email/password and Google Sign-In via Clerk
- ✅ **Trading Accounts**: Create and manage multiple accounts with different currencies
- ✅ **Playbooks**: Document your trading strategies with rules and descriptions
- ✅ **Trade Logging**: Manually log open trades with instrument, direction, prices, and lot size
- ✅ **Trade Management**: Update open trades, close trades with profit/loss
- ✅ **Trade Notes**: Attach notes and images to trades
- ✅ **Notebook**: Keep independent research notes not tied to specific trades
- ✅ **Dashboard Analytics**: View total trades, win rate, net profit/loss, and charts
- ✅ **Calendar View**: See trading activity and results day-by-day
- ✅ **Data Export**: Export trade and notebook data as CSV
- ✅ **Progressive Web App (PWA)**: Installable on desktop and mobile devices
- ✅ **Light & Dark Mode**: Switch between themes
- ✅ **Mobile Responsive**: Works great on phones and tablets



## Tech Stack

| Layer              | Technology           |
| ------------------ | -------------------- |
| Frontend Framework | Next.js 16 (App Router) |
| Language           | TypeScript 5         |
| Styling            | Tailwind CSS 3       |
| UI Components      | shadcn/ui            |
| Authentication     | Clerk                |
| ORM                | Prisma 6             |
| Database           | PostgreSQL           |
| File Storage       | Vercel Blob Storage  |
| Validation         | Zod 4                |
| Forms              | React Hook Form      |
| Charts             | Recharts             |
| Deployment         | Vercel               |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud-hosted)
- Clerk account (for authentication)
- Vercel account (for Blob Storage and optional deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd stratjournal
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local`:
```bash
# If you're on Windows PowerShell
Copy-Item .env.example .env.local

# If you're on macOS/Linux
cp .env.example .env.local
```

Then fill in the values in `.env.local`:

```env
# Clerk Authentication - Get from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database URL
# Options:
# 1. Local PostgreSQL: postgresql://user:password@localhost:5432/stratjournal
# 2. Vercel Postgres: Copy from Vercel dashboard
# 3. Supabase: Copy from Supabase dashboard
DATABASE_URL=postgresql://user:password@localhost:5432/stratjournal

# Vercel Blob Storage - Get from https://vercel.com/dashboard/stores
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

4. **Set up your database**

Option A - Local PostgreSQL:
- Install PostgreSQL on your machine
- Create a new database called `stratjournal`
- Update `DATABASE_URL` in `.env.local` with your PostgreSQL credentials

Option B - Vercel Postgres (Recommended):
- Go to https://vercel.com/dashboard/stores
- Create a new Postgres database
- Copy the connection string and paste it as `DATABASE_URL` in `.env.local`

Option C - Supabase:
- Go to https://supabase.com
- Create a new project
- In project settings, copy the connection string and use it as `DATABASE_URL`

5. **Generate Prisma Client**
```bash
npx prisma generate
```

6. **Run database migrations**
```bash
npx prisma migrate dev
```

7. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```text
stratjournal/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Prisma migrations
├── public/                    # Static assets (icons, images, manifest)
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, routes)
│   ├── components/            # Reusable UI components
│   │   └── ui/                # shadcn/ui primitives
│   ├── features/              # Feature-specific UI and workflows
│   │   ├── accounts/
│   │   ├── trades/
│   │   ├── playbooks/
│   │   └── notebook/
│   ├── lib/                   # Shared utilities and third-party integrations
│   ├── server/                # Server-side business logic
│   │   ├── accounts/
│   │   ├── trades/
│   │   ├── playbooks/
│   │   ├── notebook/
│   │   ├── analytics/
│   │   └── export/
│   └── types/                 # Shared TypeScript types
├── context/                   # Project documentation and specifications
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-context.md
│   └── progress-tracker.md
└── package.json
```

## Architecture Overview

### Core Principles

1. **Data Integrity**: All trades are the single source of truth. Analytics and calendar data are always derived from trade records.
2. **User Privacy**: All user data is private and only accessible by the owner. Ownership validation happens server-side for every protected resource.
3. **Immutable Closed Trades**: Once a trade is closed, its execution data becomes locked and cannot be modified. Only notes may be added.
4. **Server-First**: Business logic lives on the server. Client components only handle UI interactions and display results.

### Invariants (Must Never Be Violated)

1. All trades must belong to an account
2. Users can only access their own data
3. Closed trades are immutable
4. Dashboard data must be derived from trades
5. Calendar data must be derived from trades
6. Vercel Blob Storage stores files, PostgreSQL stores metadata
7. Every trade has a single trade note
8. Authentication does not equal authorization
9. Trades are the single source of truth
10. Every playbook belongs to a user
11. Every notebook entry belongs to a user
12. Trades may reference a playbook but are not required to
13. Open trades are editable

## Database Schema

The database uses PostgreSQL with Prisma ORM. Here's a summary of the core models:

### User
Stores user identity linked to Clerk

### Account
Trading accounts with name, currency, and active status

### Playbook
Trading strategies with name, description, and rules (JSON array)

### Trade
- instrument
- direction (BUY/SELL)
- entryPrice, stopLoss, takeProfit
- lotSize
- status (OPEN/CLOSED)
- profitLoss (for closed trades)
- timestamps for creation, update, and closure

### TradeNote
One note per trade with optional content

### TradeImage
Images attached to trade notes, stored in Vercel Blob Storage

### NotebookEntry
Independent research notes not tied to specific trades

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Standards

- TypeScript strict mode is required
- Use Zod for all input validation
- Prefer Server Components, use `"use client"` only when necessary
- Keep business logic in the server layer
- All protected resources must verify ownership server-side
- Follow the folder structure defined in `context/architecture.md`

## Deployment

The easiest way to deploy StratJournal is to use [Vercel](https://vercel.com), which has first-class support for Next.js.

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to set up a PostgreSQL database (Vercel Postgres or external provider) and configure Vercel Blob Storage.

## Contributing

This project follows a strict scope defined in `context/project-overview.md`. Please read the documentation before making contributions.

## License

This project is open source.

## Support

For questions or issues, please refer to the documentation in the `context/` folder.

