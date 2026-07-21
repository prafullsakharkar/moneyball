# moneyball — CricketIQ Analytics Platform

> Enterprise-grade Cricket Analytics & Management Platform

## 📋 Overview

Moneyball (CricketIQ) is a comprehensive cricket analytics and management platform built for tournaments, teams, players, coaches, and administrators. It provides real-time scoring, advanced analytics, video analysis, training management, academy operations, and live auction capabilities — all in a modern, responsive web application.

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 + Tailwind Merge |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM 7 |
| **Data Fetching** | TanStack React Query 5 |
| **Backend** | Supabase |
| **Charts** | Highcharts + highcharts-react-official |
| **HTTP Client** | Ky |
| **Icons** | Lucide React |
| **Linting** | ESLint + TypeScript ESLint |

## 📁 Project Structure

```
moneyball/
├── src/
│   ├── components/                 # Shared UI components
│   │   ├── layout/                 # Layout, Sidebar with navigation
│   │   └── ui/                     # Charts, GlassCard
│   ├── modules/                    # Feature modules (self-contained)
│   │   ├── video-analysis/         # Video library, clips, tagging, highlights
│   │   ├── training/               # Coach dashboard, sessions, fitness, attendance
│   │   ├── academy/                # Students, batches, curriculum, progress
│   │   └── auction/                # Auction room, player pool, budget
│   ├── pages/                      # Public-facing pages
│   │   └── admin/                  # Admin portal pages
│   ├── App.tsx                     # Route definitions & app shell
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles (Tailwind)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Features

### Public Pages
| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of tournaments, teams, matches, and key stats |
| **Tournaments** | Browse tournaments with detailed analytics |
| **Teams** | Team rosters, standings, and performance metrics |
| **Players** | Player profiles, statistics, and career analytics |
| **Captains** | Captain performance dashboard and analytics |
| **Matches** | Match center with schedules, results, and details |
| **Head-to-Head** | Player/team comparison with detailed analytics |
| **Awards** | Orange Cap, leaderboards, and achievement tracking |
| **MVP / Fantasy** | Fantasy cricket and MVP predictions |
| **AI Analytics** | AI-powered insights and recommendations |
| **Predictions** | Match and tournament predictions |

### Video Analysis Module
- **Video Library** — Upload, organize, and browse match videos
- **Ball Clips** — Extract and manage ball-by-ball highlight clips
- **Shot Tagging** — Tag shots and batting techniques
- **Player Highlights** — Individual player highlight reels
- **AI Highlights** — AI-generated key moments

### Training Module
- **Coach Dashboard** — Training overview and planning
- **Practice Sessions** — Schedule and manage sessions
- **Fitness Tracking** — Monitor player fitness metrics
- **Attendance** — Track session attendance
- **Performance Tracking** — Player performance analytics

### Academy Module
- **Academy Dashboard** — Overview of all batches and students
- **Students** — Student management and profiles
- **Batches** — Batch scheduling and management
- **Curriculum** — Course and training curriculum
- **Student Progress** — Track learning and skill development

### Auction Module
- **Auction Dashboard** — Live auction overview
- **Auction Room** — Real-time bidding interface
- **Player Pool** — Available players for auction
- **Budget Tracker** — Team budget management

### Admin Portal
| Category | Features |
|----------|----------|
| **Management** | Tournaments, Teams, Players, Squads, Venues, Organizers |
| **Matches & Scoring** | Match management, Live scoring, Ball-by-ball scoring, Scorecards, Streaming |
| **Analytics** | Player, Team, Match, Tournament dashboards; Batter/Bowler insights; MVP, Captain, Venue analytics; Moneyball analytics |
| **Reports** | Generate reports, Import center |
| **System** | User management, Audit logs |

## 📊 Route Map

### Public Routes (40+)
```
/                              → Dashboard
/tournaments                   → Tournament List
/tournaments/analytics         → Tournament Analytics
/teams                         → Team List
/teams/analytics               → Team Analytics
/players                       → Player List
/players/analytics             → Player Analytics
/captains                      → Captain Dashboard
/captains/analytics            → Captain Analytics
/matches                       → Match Center
/matches/analytics             → Match Analytics
/h2h                           → Head-to-Head Comparison
/h2h/analytics                 → H2H Detailed Analytics
/awards                        → Awards (Orange Cap)
/awards/leaderboards           → Leaderboards
/mvp                           → MVP / Fantasy
/ai                            → AI Analytics
/ai/insights                   → AI Insights
/predictions                   → Predictions
/predictions/detailed          → Detailed Predictions

/video-analysis                → Video Analysis Dashboard
/video-analysis/videos         → Video Library
/video-analysis/clips          → Ball Clips
/video-analysis/tagging        → Shot Tagging
/video-analysis/highlights     → Player Highlights
/video-analysis/ai             → AI Highlights

/training                      → Coach Dashboard
/training/sessions             → Practice Sessions
/training/fitness              → Fitness Tracking
/training/attendance           → Attendance
/training/performance          → Performance Tracking

/academy                       → Academy Dashboard
/academy/students              → Students
/academy/batches               → Batches
/academy/curriculum            → Curriculum
/academy/progress              → Student Progress

/auction                       → Auction Dashboard
/auction/room                  → Auction Room
/auction/players               → Player Pool
/auction/budget                → Budget Tracker
```

### Admin Routes (30+)
```
/admin                              → Admin Dashboard
/admin/analytics                    → Analytics Overview
/admin/portal                       → Admin Portal
/admin/live-dashboard               → Live Dashboard
/admin/tournaments                  → Tournament Management
/admin/teams                        → Team Management
/admin/players                      → Player Management
/admin/squads                       → Squad Management
/admin/venues                       → Venue Management
/admin/organizers                   → Organizer Management
/admin/matches                      → Match Management
/admin/officials                    → Match Officials
/admin/scoring                      → Live Scoring
/admin/ball-by-ball                 → Ball-by-Ball Scoring
/admin/scorecards                   → Scorecard Management
/admin/streaming                    → Streaming Details
/admin/insights                     → AI Insights
/admin/player-analytics             → Player Analytics Dashboard
/admin/team-analytics               → Team Analytics Dashboard
/admin/match-analytics              → Match Analytics Dashboard
/admin/tournament-dashboard         → Tournament Analytics Dashboard
/admin/batter-insights              → Batter Insights
/admin/bowler-insights              → Bowler Insights
/admin/mvp-analytics                → MVP Analytics
/admin/captain-analytics            → Captain Analytics Dashboard
/admin/venue-analytics              → Venue Analytics Dashboard
/admin/moneyball                    → Moneyball Analytics
/admin/leaderboards                 → Leaderboards & MVP
/admin/reports                      → Generate Reports
/admin/import                       → Import Center
/admin/users                        → User Management
/admin/audit                        → Audit Logs
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone git@github.com:prafullsakharkar/moneyball.git
cd moneyball

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck
```

## 🏗️ Architecture

### Module Pattern
Each feature module follows a self-contained structure:
```
module/
├── index.ts            # Barrel exports
├── components/         # Module-specific components
├── pages/              # Module pages
├── services/           # Data services (mock-data.ts)
└── types/              # TypeScript interfaces
```

### Key Design Patterns
- **Collapsible Sidebar Navigation** — Animated with Framer Motion, supports nested groups with badges
- **Dark Mode** — Toggle via class toggle on `<html>` element
- **React Query Integration** — Server-state caching with 5-minute stale time
- **Error Boundary** — Graceful error handling wrapping the entire app
- **Barrel Exports** — Clean imports via `index.ts` files
- **Mock Data** — Development-friendly mock services in each module

## 📦 Dependencies

### Runtime
- `react` / `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `@tanstack/react-query` — Data fetching & caching
- `@supabase/supabase-js` — Backend as a service
- `framer-motion` — Animations
- `highcharts` / `highcharts-react-official` — Data visualization
- `ky` — HTTP client
- `lucide-react` — Icon library
- `tailwind-merge` / `clsx` — Class name utilities

### Development
- `typescript` — Type checking
- `vite` — Build tool
- `tailwindcss` / `postcss` / `autoprefixer` — CSS pipeline
- `eslint` / `eslint-plugin-react-hooks` — Linting

## 📝 License

Private Repository — All rights reserved