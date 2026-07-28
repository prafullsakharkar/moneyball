# CricketIQ Platform - Complete Rewrite Plan (Microservices Architecture)

## Executive Summary

This document outlines the comprehensive plan for rewriting the CricketIQ platform from scratch using a microservices architecture. The rewrite will be a ground-up implementation with modern technologies, focusing on scalability, maintainability, and enterprise-grade capabilities.

**Vision**: To be the world's most intelligent and comprehensive cricket platform, empowering every level of the cricket ecosystem from grassroots to professional.

**Architecture Approach**: Domain-Driven Design (DDD) with microservices, cloud-native deployment, and modern tech stack.

---

## 1. Technology Stack

### Backend (Microservices)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x LTS | Runtime for microservices |
| **TypeScript** | 5.x | Type-safe development |
| **NestJS** | 10.x | Microservices framework |
| **Express.js** | 4.x | REST API framework |
| **Fastify** | 4.x | High-performance API framework |
| **GraphQL** | 16.x | GraphQL API support |
| **PostgreSQL** | 15.x | Primary database |
| **Redis** | 7.x | Caching and real-time |
| **Elasticsearch** | 8.x | Search and analytics |
| **Kafka** | 3.x | Event streaming |
| **Docker** | 24.x | Containerization |
| **Kubernetes** | 1.28.x | Orchestration |
| **AWS ECS/EKS** | Latest | Cloud deployment |
| **MinIO** | Latest | Object storage (S3-compatible) |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool |
| **Tailwind CSS** | 3.x | Styling |
| **Zustand** | 4.x | Client state management |
| **TanStack Query** | 5.x | Server state management |
| **React Router** | 6.x | Routing |
| **Radix UI** | 1.x | Accessible components |
| **Framer Motion** | 10.x | Animations |
| **Recharts** | 3.x | Charts |

### DevOps & Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| **Terraform** | 1.x | IaC |
| **Ansible** | 9.x | Configuration management |
| **Prometheus** | 2.x | Monitoring |
| **Grafana** | 10.x | Visualization |
| **Jaeger** | 1.x | Tracing |
| **ELK Stack** | 8.x | Logging |
| **GitHub Actions** | Latest | CI/CD |

---

## 2. Microservices Architecture

### 2.1 Service Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         CricketIQ Microservices Architecture                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │   Identity          │  │   Organization      │  │   Competition       │        │
│  │   Service           │  │   Service           │  │   Service           │        │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘        │
│           │                        │                        │                      │
│           ▼                        ▼                        ▼                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │   Player            │  │   Team              │  │   Match             │        │
│  │   Service           │  │   Service           │  │   Service           │        │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘        │
│           │                        │                        │                      │
│           ▼                        ▼                        ▼                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │   Scoring           │  │   Analytics         │  │   Media             │        │
│  │   Service           │  │   Service           │  │   Service           │        │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘        │
│           │                        │                        │                      │
│           ▼                        ▼                        ▼                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │   Finance           │  │   Notification      │  │   Video Analysis    │        │
│  │   Service           │  │   Service           │  │   Service           │        │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘        │
│           │                        │                        │                      │
│           ▼                        ▼                        ▼                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │   Training          │  │   Scouting          │  │   Reporting         │        │
│  │   Service           │  │   Service           │  │   Service           │        │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘        │
│           │                        │                        │                      │
│           ▼                        ▼                        ▼                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │   Auction           │  │   Sponsorship       │  │   Admin             │        │
│  │   Service           │  │   Service           │  │   Service           │        │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘        │
│                                                                                     │
│                    ┌──────────────────────┐                                         │
│                    │   API Gateway        │                                         │
│                    │  (Kong/Apigee)       │                                         │
│                    └──────────────────────┘                                         │
│                                                                                     │
│                    ┌──────────────────────┐                                         │
│                    │   Event Bus          │                                         │
│                    │   (Kafka/RabbitMQ)   │                                         │
│                    └──────────────────────┘                                         │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Service Definitions

#### 1. Identity Service
**Purpose**: User authentication, authorization, and identity management

**Features**:
- User registration and login
- JWT token management
- OAuth2/Social login integration
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- Session management
- Audit logging

**Endpoints**:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/users/{id}`
- `PUT /api/v1/users/{id}`
- `DELETE /api/v1/users/{id}`
- `GET /api/v1/roles`
- `POST /api/v1/permissions`

**Database**: PostgreSQL (users, roles, permissions, sessions)

---

#### 2. Organization Service
**Purpose**: Manage cricket organizations (boards, associations, clubs, academies)

**Features**:
- Organization registration and onboarding
- Organization hierarchy management
- Multi-tenancy support
- Custom branding (white-labeling)
- Organization verification
- Document management

**Endpoints**:
- `POST /api/v1/organizations`
- `GET /api/v1/organizations`
- `GET /api/v1/organizations/{id}`
- `PUT /api/v1/organizations/{id}`
- `DELETE /api/v1/organizations/{id}`
- `GET /api/v1/organizations/{id}/hierarchy`
- `POST /api/v1/organizations/{id}/verify`
- `GET /api/v1/organizations/{id}/settings`
- `PUT /api/v1/organizations/{id}/settings`

**Database**: PostgreSQL (organizations, organization_types, organization_settings)

---

#### 3. Competition Service
**Purpose**: Manage tournaments, leagues, seasons, and competitions

**Features**:
- Tournament creation and configuration
- Season management
- Phase-based tournament structure
- Competition scheduling
- Group management (Round Robin, Knockout)
- Points table management
- Fixture generation

**Endpoints**:
- `POST /api/v1/competitions`
- `GET /api/v1/competitions`
- `GET /api/v1/competitions/{id}`
- `PUT /api/v1/competitions/{id}`
- `DELETE /api/v1/competitions/{id}`
- `POST /api/v1/competitions/{id}/seasons`
- `GET /api/v1/competitions/{id}/fixtures`
- `POST /api/v1/competitions/{id}/fixtures`
- `GET /api/v1/competitions/{id}/standings`
- `POST /api/v1/competitions/{id}/groups`
- `PUT /api/v1/competitions/{id}/groups/{groupId}/points`

**Database**: PostgreSQL (competitions, seasons, fixtures, groups, standings)

---

#### 4. Player Service
**Purpose**: Manage player profiles, performance, and development

**Features**:
- Player registration and onboarding
- Player profile management
- Player performance tracking
- Player statistics calculation
- Player match history
- Player fitness tracking
- Player medical records
- Player contract management
- Player scouting

**Endpoints**:
- `POST /api/v1/players`
- `GET /api/v1/players`
- `GET /api/v1/players/{id}`
- `PUT /api/v1/players/{id}`
- `DELETE /api/v1/players/{id}`
- `GET /api/v1/players/{id}/stats`
- `GET /api/v1/players/{id}/match-history`
- `GET /api/v1/players/{id}/fitness`
- `GET /api/v1/players/{id}/medical`
- `GET /api/v1/players/{id}/contracts`
- `POST /api/v1/players/{id}/scouting`

**Database**: PostgreSQL (players, player_stats, player_fitness, player_medical, player_contracts)

---

#### 5. Team Service
**Purpose**: Manage teams, squads, and team rosters

**Features**:
- Team creation and registration
- Team roster management
- Team captain assignment
- Team coach assignment
- Team documentation
- Team branding

**Endpoints**:
- `POST /api/v1/teams`
- `GET /api/v1/teams`
- `GET /api/v1/teams/{id}`
- `PUT /api/v1/teams/{id}`
- `DELETE /api/v1/teams/{id}`
- `POST /api/v1/teams/{id}/roster`
- `DELETE /api/v1/teams/{id}/roster/{playerId}`
- `PUT /api/v1/teams/{id}/captain`
- `PUT /api/v1/teams/{id}/coach`
- `GET /api/v1/teams/{id}/roster`

**Database**: PostgreSQL (teams, team_rosters, team_captains, team_coaches)

---

#### 6. Match Service
**Purpose**: Manage match scheduling, preparation, and execution

**Features**:
- Match scheduling and calendar
- Match venue assignment
- Match team selection
- Match official assignment
- Match document management
- Match weather tracking
- Match cancellation and rescheduling

**Endpoints**:
- `POST /api/v1/matches`
- `GET /api/v1/matches`
- `GET /api/v1/matches/{id}`
- `PUT /api/v1/matches/{id}`
- `DELETE /api/v1/matches/{id}`
- `GET /api/v1/matches/{id}/schedule`
- `PUT /api/v1/matches/{id}/venue`
- `POST /api/v1/matches/{id}/teams`
- `POST /api/v1/matches/{id}/officials`
- `GET /api/v1/matches/{id}/weather`

**Database**: PostgreSQL (matches, match_venues, match_teams, match_officials)

---

#### 7. Scoring Service
**Purpose**: Record ball-by-ball scoring and match events

**Features**:
- Real-time ball-by-ball scoring
- Multiple scoring options (manual, semi-automated, automated)
- Scoring error correction
- Scoring notes and comments
- Scoring video integration
- Scoring official assignment
- Scoring audit trail

**Endpoints**:
- `POST /api/v1/scoring/sessions`
- `GET /api/v1/scoring/sessions/{id}`
- `POST /api/v1/scoring/events`
- `GET /api/v1/scoring/events`
- `PUT /api/v1/scoring/events/{eventId}`
- `DELETE /api/v1/scoring/events/{eventId}`
- `GET /api/v1/scoring/sessions/{id}/scorecard`
- `POST /api/v1/scoring/sessions/{id}/notes`
- `GET /api/v1/scoring/sessions/{id}/audit`

**Database**: PostgreSQL (scoring_sessions, scoring_events, scoring_notes)

---

#### 8. Analytics Service
**Purpose**: Analyze performance and provide actionable insights

**Features**:
- Player performance analysis
- Team performance analysis
- Match analysis
- Tournament analysis
- Comparative analysis
- Trend analysis
- Projection and forecasting
- Custom analytics
- Export analytics

**Endpoints**:
- `GET /api/v1/analytics/player/{playerId}/stats`
- `GET /api/v1/analytics/team/{teamId}/stats`
- `GET /api/v1/analytics/match/{matchId}/analysis`
- `GET /api/v1/analytics/tournament/{tournamentId}/stats`
- `GET /api/v1/analytics/player/{playerId}/trend`
- `GET /api/v1/analytics/player/{playerId}/comparison`
- `POST /api/v1/analytics/export`

**Database**: PostgreSQL (analytics_data), Elasticsearch (analytics_index)

---

#### 9. Media Service
**Purpose**: Manage media assets and video content

**Features**:
- Media upload and storage
- Media tagging and categorization
- Media search and filtering
- Media thumbnail generation
- Media playback
- Media sharing
- Media rights management

**Endpoints**:
- `POST /api/v1/media/upload`
- `GET /api/v1/media/{id}`
- `PUT /api/v1/media/{id}`
- `DELETE /api/v1/media/{id}`
- `GET /api/v1/media/search`
- `POST /api/v1/media/{id}/tags`
- `GET /api/v1/media/{id}/thumbnail`
- `GET /api/v1/media/{id}/stream`

**Database**: PostgreSQL (media_assets, media_tags), MinIO/S3 (media storage)

---

#### 10. Finance Service
**Purpose**: Manage financial transactions, memberships, and payments

**Features**:
- Payment processing
- Invoice generation
- Receipt generation
- Subscription management
- Membership management
- Fee collection
- Refund processing
- Financial reporting
- Tax management

**Endpoints**:
- `POST /api/v1/finance/payments`
- `GET /api/v1/finance/payments/{id}`
- `POST /api/v1/finance/invoices`
- `GET /api/v1/finance/invoices/{id}`
- `POST /api/v1/finance/subscriptions`
- `GET /api/v1/finance/subscriptions/{id}`
- `GET /api/v1/finance/reports`
- `GET /api/v1/finance/transactions`

**Database**: PostgreSQL (payments, invoices, subscriptions, transactions)

---

#### 11. Notification Service
**Purpose**: Send notifications and enable communication

**Features**:
- Real-time notifications
- Email notifications
- Push notifications
- SMS notifications
- In-app notifications
- Communication templates
- Communication logs
- Subscription preferences

**Endpoints**:
- `POST /api/v1/notifications`
- `GET /api/v1/notifications`
- `PUT /api/v1/notifications/{id}/read`
- `DELETE /api/v1/notifications/{id}`
- `POST /api/v1/notifications/templates`
- `GET /api/v1/notifications/templates`
- `POST /api/v1/notifications/send`
- `GET /api/v1/notifications/preferences`

**Database**: PostgreSQL (notifications, notification_templates, notification_logs)

---

#### 12. Video Analysis Service
**Purpose**: Analyze match and training videos

**Features**:
- Video upload and processing
- Video tagging
- Video annotation
- Breakdown tools
- Comparison tools
- Report generation

**Endpoints**:
- `POST /api/v1/video/upload`
- `GET /api/v1/video/{id}`
- `PUT /api/v1/video/{id}`
- `DELETE /api/v1/video/{id}`
- `POST /api/v1/video/{id}/tags`
- `GET /api/v1/video/{id}/tags`
- `POST /api/v1/video/{id}/annotations`
- `GET /api/v1/video/{id}/breakdown`
- `GET /api/v1/video/{id}/comparison`

**Database**: PostgreSQL (videos, video_tags, video_annotations), MinIO/S3 (video storage)

---

#### 13. Training Service
**Purpose**: Manage training sessions and player development

**Features**:
- Training session scheduling
- Training plan creation
- Training drill management
- Training attendance tracking
- Training performance tracking
- Training reports

**Endpoints**:
- `POST /api/v1/training/sessions`
- `GET /api/v1/training/sessions`
- `GET /api/v1/training/sessions/{id}`
- `PUT /api/v1/training/sessions/{id}`
- `DELETE /api/v1/training/sessions/{id}`
- `POST /api/v1/training/plans`
- `GET /api/v1/training/plans`
- `POST /api/v1/training/sessions/{id}/attendance`
- `GET /api/v1/training/player/{playerId}/performance`

**Database**: PostgreSQL (training_sessions, training_plans, training_attendance)

---

#### 14. Scouting Service
**Purpose**: Identify and evaluate potential players

**Features**:
- Scouting report creation
- Player evaluation
- Scout assignment
- Scouting criteria management
- Scouting notes
- Scouting recommendations

**Endpoints**:
- `POST /api/v1/scouting/reports`
- `GET /api/v1/scouting/reports`
- `GET /api/v1/scouting/reports/{id}`
- `PUT /api/v1/scouting/reports/{id}`
- `DELETE /api/v1/scouting/reports/{id}`
- `POST /api/v1/scouting/players`
- `GET /api/v1/scouting/players`
- `POST /api/v1/scouting/criteria`
- `GET /api/v1/scouting/evaluations`

**Database**: PostgreSQL (scouting_reports, scouting_players, scouting_criteria)

---

#### 15. Reporting Service
**Purpose**: Generate reports and dashboards for stakeholders

**Features**:
- Report generation
- Dashboard creation
- Report scheduling
- Report export
- Dashboard sharing
- Report customization

**Endpoints**:
- `POST /api/v1/reports/generate`
- `GET /api/v1/reports`
- `GET /api/v1/reports/{id}`
- `POST /api/v1/reports/export`
- `POST /api/v1/reports/schedule`
- `GET /api/v1/reports/scheduled`
- `POST /api/v1/reports/dashboards`
- `GET /api/v1/reports/dashboards`

**Database**: PostgreSQL (reports, report_templates, report_schedules)

---

#### 16. Auction Service
**Purpose**: Manage player auctions for leagues

**Features**:
- Auction creation and configuration
- Player pool management
- Bidding system
- Team purse tracking
- Auction history
- Sold players management

**Endpoints**:
- `POST /api/v1/auction`
- `GET /api/v1/auction`
- `GET /api/v1/auction/{id}`
- `POST /api/v1/auction/{id}/players`
- `GET /api/v1/auction/{id}/players`
- `POST /api/v1/auction/{id}/bids`
- `GET /api/v1/auction/{id}/bids`
- `GET /api/v1/auction/{id}/purse`
- `POST /api/v1/auction/{id}/sold`

**Database**: PostgreSQL (auctions, auction_players, auction_bids, auction_purse)

---

#### 17. Sponsorship Service
**Purpose**: Manage sponsorships and branding

**Features**:
- Sponsor management
- Branding management
- Contract management
- Deliverables tracking
- Sponsor reporting

**Endpoints**:
- `POST /api/v1/sponsorship/sponsors`
- `GET /api/v1/sponsorship/sponsors`
- `GET /api/v1/sponsorship/sponsors/{id}`
- `POST /api/v1/sponsorship/contracts`
- `GET /api/v1/sponsorship/contracts`
- `POST /api/v1/sponsorship/deliverables`
- `GET /api/v1/sponsorship/deliverables`

**Database**: PostgreSQL (sponsors, sponsorship_contracts, sponsorship_deliverables)

---

#### 18. Admin Service
**Purpose**: Platform administration and management

**Features**:
- System configuration
- User management
- Permission management
- Audit logging
- Data export
- Data import
- System monitoring

**Endpoints**:
- `GET /api/v1/admin/config`
- `PUT /api/v1/admin/config`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/audit-logs`
- `POST /api/v1/admin/export`
- `POST /api/v1/admin/import`
- `GET /api/v1/admin/monitoring`

**Database**: PostgreSQL (admin_config, admin_audit_logs)

---

## 3. Shared Services (Infrastructure)

### 3.1 API Gateway
**Purpose**: Central entry point for all API requests

**Features**:
- Request routing
- Authentication/Authorization
- Rate limiting
- Load balancing
- Caching
- Request/Response transformation

**Technology**: Kong API Gateway or AWS API Gateway

---

### 3.2 Event Bus
**Purpose**: Asynchronous communication between microservices

**Features**:
- Event publishing and subscription
- Message queuing
- Event persistence
- Dead letter queue

**Technology**: Apache Kafka or RabbitMQ

---

### 3.3 Service Registry
**Purpose**: Service discovery and registration

**Features**:
- Service registration
- Service discovery
- Health checks
- Load balancing

**Technology**: Consul or etcd

---

### 3.4 Configuration Management
**Purpose**: Centralized configuration management

**Features**:
- Configuration storage
- Configuration versioning
- Configuration refresh

**Technology**: Spring Cloud Config or Consul

---

### 3.5 Distributed Tracing
**Purpose**: Track requests across microservices

**Features**:
- Request tracing
- Performance monitoring
- Error tracking

**Technology**: Jaeger or Zipkin

---

## 4. Database Architecture

### 4.1 Primary Database: PostgreSQL

**Purpose**: Main transactional database for all microservices

**Schema Design**:
- Each microservice has its own database schema
- Schema names: `identity`, `organization`, `competition`, `player`, `team`, `match`, `scoring`, `analytics`, `media`, `finance`, `notification`, `video_analysis`, `training`, `scouting`, `reporting`, `auction`, `sponsorship`, `admin`

**Features**:
- Row-level security
- JSONB support
- Full-text search
- Geospatial support
- Partitioning for large tables

---

### 4.2 Cache: Redis

**Purpose**: Caching for high-performance data access

**Use Cases**:
- Session caching
- API response caching
- Real-time data caching
- Rate limiting

**Features**:
- Redis Cluster for high availability
- Redis Streams for pub/sub
- Redis Search for full-text search

---

### 4.3 Search: Elasticsearch

**Purpose**: Search and analytics

**Use Cases**:
- Player search
- Team search
- Tournament search
- Analytics indexing

**Features**:
- Full-text search
- Aggregations
- Real-time indexing

---

### 4.4 Object Storage: MinIO/S3

**Purpose**: Media and video storage

**Use Cases**:
- Player images
- Team logos
- Match videos
- Training videos
- Scouting reports

**Features**:
- S3-compatible API
- Versioning
- Lifecycle policies
- Access control

---

## 5. Frontend Architecture

### 5.1 Application Structure

```
src/
├── app/                      # App-level configuration
│   ├── App.tsx              # Main app component with routing
│   ├── router.tsx           # Route configuration
│   └── providers/           # Global providers
│       ├── QueryClientProvider.tsx
│       ├── ThemeProvider.tsx
│       ├── ToastProvider.tsx
│       └── AuthProvider.tsx
│
├── assets/                   # Static assets
│   ├── icons/               # SVG icons
│   ├── images/              # Images
│   └── styles/              # Global styles
│
├── components/              # Reusable UI components
│   ├── ui/                  # UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── features/            # Feature-specific components
│       └── [feature]/       # e.g., dashboard, player, etc.
│
├── features/                # Feature modules (domain-focused)
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── index.ts
│   ├── player/
│   ├── team/
│   ├── match/
│   ├── fantasy/
│   ├── analytics/
│   └── ...                  # All features organized here
│
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── ...                  # Other reusable hooks
│
├── lib/                     # Utility libraries
│   ├── api/                 # API configuration
│   │   ├── client.ts        # Ky client
│   │   ├── interceptors.ts  # Request/response interceptors
│   │   └── auth.ts          # Auth-related utilities
│   ├── query/               # Query configuration
│   │   └── queryClient.ts
│   ├── utils/               # Generic utilities
│   │   ├── cn.ts            # Class name utility
│   │   ├── format.ts        # Formatting utilities
│   │   └── validate.ts      # Validation utilities
│   └── constants/           # Application constants
│       ├── env.ts
│       ├── routes.ts
│       └── ...              # Other constants
│
├── services/                # External service integrations
│   ├── api/                 # API service definitions
│   │   ├── playerService.ts
│   │   ├── teamService.ts
│   │   └── ...              # Other services
│   └── analytics/           # Analytics services
│
├── stores/                  # Zustand state management
│   ├── authStore.ts
│   ├── themeStore.ts
│   ├── userStore.ts
│   └── appStore.ts
│
├── types/                   # Type definitions
│   ├── api.d.ts            # API type definitions
│   ├── models.d.ts         # Domain models
│   └── index.ts
│
├── utils/                   # Helper utilities
│   ├── auth.ts
│   ├── format.ts
│   └── validation.ts
│
├── constants/               # Application constants
│   ├── env.ts
│   ├── routes.ts
│   ├── themes.ts
│   └── ...                  # Other constants
│
└── pages/                   # Page components (route handlers)
    ├── Home.tsx
    ├── Login.tsx
    ├── Dashboard.tsx
    └── ...                  # Other pages
```

### 5.2 State Management Strategy

**Zustand**: For client-side UI state and form state
- Lightweight and simple
- Good performance
- Easy to use

**TanStack Query**: For server state management
- Automatic caching
- Background updates
- Optimistic updates
- Error retry

**React Context**: For global state (theme, auth, toast)
- Theme context
- Auth context
- Toast context

---

## 6. API Design

### 6.1 REST API Conventions

**Base URL**: `https://api.cricketiq.com/api/v1`

**Authentication**: Bearer token in Authorization header
```
Authorization: Bearer <jwt_token>
```

**Response Format**:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

**Pagination**:
```
GET /api/v1/players?page=1&limit=10&sort=createdAt&order=desc
```

**Filtering**:
```
GET /api/v1/players?name=john&teamId=123&status=active
```

**Searching**:
```
GET /api/v1/players?search=john
```

---

### 6.2 GraphQL API

**Endpoint**: `https://api.cricketiq.com/graphql`

**Features**:
- Query language for APIs
- Single endpoint
- Real-time subscriptions
- Strong typing

**Example Query**:
```graphql
query GetPlayer {
  player(id: "123") {
    id
    firstName
    lastName
    stats {
      matchesPlayed
      runsScored
      battingAverage
    }
  }
}
```

---

## 7. Deployment Architecture

### 7.1 Cloud Infrastructure (AWS)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         CricketIQ AWS Infrastructure                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         Internet Gateway                                    │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                                │
│                                    ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         VPC (Public & Private Subnets)                      │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │   │
│  │  │  Public Subnet   │  │  Private Subnet  │  │  Private Subnet  │          │   │
│  │  │  ┌────────────┐  │  │  ┌────────────┐  │  │  ┌────────────┐  │          │   │
│  │  │  │  ALB       │  │  │  │  ECS Fargate │  │  │  │  RDS       │  │          │   │
│  │  │  │  (Kong)    │  │  │  │  Services    │  │  │  │  (PostgreSQL)│  │          │   │
│  │  │  └────────────┘  │  │  └────────────┘  │  │  └────────────┘  │          │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘          │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │   │
│  │  │  │  Redis       │  │  │  │  ElastiCache│  │  │  │  Elasticsearch│  │          │   │
│  │  │  └────────────┘  │  │  └────────────┘  │  │  └────────────┘  │          │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘          │   │
│  │  ┌──────────────────┐  ┌──────────────────┐                                │   │
│  │  │  │  S3          │  │  │  │  MinIO      │                                │   │
│  │  │  └────────────┘  │  │  └────────────┘                                  │   │
│  │  └──────────────────┘  └──────────────────┘                                │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Kubernetes Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         Kubernetes Cluster                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         Control Plane                                       │   │
│  │  - API Server                                                               │   │
│  │  - Scheduler                                                                │   │
│  │  - Controller Manager                                                       │   │
│  │  - etcd                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                                │
│                                    ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         Worker Nodes                                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │   │
│  │  │  Pod: Identity   │  │  Pod: Organization│  │  Pod: Competition│          │   │
│  │  │  Pod: Player     │  │  Pod: Team        │  │  Pod: Match      │          │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘          │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │   │
│  │  │  Pod: Scoring    │  │  Pod: Analytics   │  │  Pod: Media      │          │   │
│  │  │  Pod: Finance    │  │  Pod: Notification│  │  Pod: Video      │          │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│                    ┌──────────────────────┐                                         │
│                    │   Ingress Controller │                                         │
│                    │   (NGINX/Contour)    │                                         │
│                    └──────────────────────┘                                         │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         CI/CD Pipeline                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   GitHub    │  │   Build     │  │   Test      │  │   Deploy    │  │   Monitor │ │
│  │   (Source)  │  │   (Docker)  │  │   (Unit/E2E)│  │   (K8s)     │  │   (Prom)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│         │               │               │               │               │           │
│         ▼               ▼               ▼               ▼               ▼           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   PR        │  │   Docker    │  │   Jest/     │  │   Helm      │  │   Grafana │ │
│  │   Review    │  │   Build     │  │   Playwright│  │   Deploy    │  │   Alerts  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Security Architecture

### 8.1 Authentication & Authorization

**JWT Tokens**:
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Token refresh endpoint

**OAuth2/Social Login**:
- Google
- Facebook
- Apple

**MFA**:
- TOTP (Google Authenticator)
- SMS
- Email

**RBAC**:
- Role-based access control
- Permission-based access control
- Resource-level permissions

---

### 8.2 Data Security

**Encryption**:
- TLS 1.3 for data in transit
- AES-256 for data at rest
- Database encryption

**Access Control**:
- Row-level security in PostgreSQL
- API-level authorization
- Resource ownership checks

**Audit Logging**:
- All sensitive operations logged
- Immutable audit logs
- Log retention policies

---

### 8.3 Compliance

**GDPR**:
- Data subject rights
- Data portability
- Right to be forgotten

**SOC 2**:
- Security controls
- Availability controls
- Processing integrity controls

---

## 9. Performance Optimization

### 9.1 Caching Strategy

**Redis Caching**:
- API response caching
- Session caching
- Real-time data caching

**CDN**:
- Static assets
- Images
- Videos

**Browser Caching**:
- Service workers
- Local storage
- IndexedDB

---

### 9.2 Database Optimization

**Indexing**:
- Composite indexes
- Partial indexes
- Full-text search indexes

**Partitioning**:
- Time-based partitioning
- Range partitioning
- List partitioning

**Connection Pooling**:
- PgBouncer
- Connection limits

---

### 9.3 API Optimization

**Pagination**:
- Cursor-based pagination
- Limit/offset pagination

**Compression**:
- Gzip compression
- Brotli compression

**Batching**:
- Batch requests
- Batch responses

---

## 10. Monitoring & Observability

### 10.1 Logging

**ELK Stack**:
- Elasticsearch for storage
- Logstash for processing
- Kibana for visualization

**Structured Logging**:
- JSON format
- Correlation IDs
- Context enrichment

---

### 10.2 Metrics

**Prometheus**:
- Application metrics
- System metrics
- Custom metrics

**Grafana**:
- Dashboards
- Alerts
- Annotations

---

### 10.3 Tracing

**Jaeger**:
- Distributed tracing
- Service map
- Performance analysis

---

## 11. Migration Strategy

### 11.1 Phase 1: Foundation (Weeks 1-4)

**Week 1-2**: Setup infrastructure and CI/CD
- AWS account setup
- VPC configuration
- Kubernetes cluster setup
- CI/CD pipeline setup

**Week 3-4**: Build core services
- Identity service
- Organization service
- Database setup
- API gateway setup

---

### 11.2 Phase 2: Core Features (Weeks 5-12)

**Week 5-6**: Player and Team services
- Player management
- Team management
- Roster management

**Week 7-8**: Match and Scoring services
- Match management
- Scoring service
- Real-time updates

**Week 9-10**: Competition service
- Tournament management
- Fixture generation
- Points table

**Week 11-12**: Analytics service
- Performance analytics
- Match analysis
- Export functionality

---

### 11.3 Phase 3: Advanced Features (Weeks 13-20)

**Week 13-14**: Video analysis service
- Video upload
- Video tagging
- Breakdown tools

**Week 15-16**: Training service
- Training sessions
- Drills
- Attendance

**Week 17-18**: Scouting service
- Scouting reports
- Player evaluation
- Scout assignment

**Week 19-20**: Finance and Notification services
- Payment processing
- Invoice generation
- Notifications

---

### 11.4 Phase 4: Advanced Services (Weeks 21-26)

**Week 21-22**: Auction service
- Auction management
- Bidding system
- Player pool

**Week 23-24**: Sponsorship service
- Sponsor management
- Contract management
- Deliverables

**Week 25-26**: Reporting and Admin services
- Report generation
- Dashboard creation
- Admin portal

---

### 11.5 Phase 5: Testing & Deployment (Weeks 27-30)

**Week 27**: Integration testing
- Service integration
- End-to-end testing
- Performance testing

**Week 28**: Security testing
- Penetration testing
- Security audit
- Compliance check

**Week 29**: UAT
- User acceptance testing
- Feedback collection
- Bug fixes

**Week 30**: Production deployment
- Production deployment
- Monitoring setup
- Documentation

---

## 12. Success Metrics

### 12.1 Performance Metrics

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 200ms |
| API Response Time (p99) | < 500ms |
| System Uptime | 99.9% |
| Database Query Time | < 50ms |
| Video Upload Time | < 5 minutes |
| Search Response Time | < 100ms |

---

### 12.2 Business Metrics

| Metric | Target (Year 1) |
|--------|-----------------|
| Total Users | 500K |
| Daily Active Users | 50K |
| Monthly Active Users | 200K |
| Tournaments Managed | 500 |
| Players Registered | 100K |
| Matches Scored | 50K |

---

## 13. Conclusion

This comprehensive rewrite plan outlines a complete microservices architecture for the CricketIQ platform. The plan includes:

1. **Modern Tech Stack**: React, TypeScript, NestJS, PostgreSQL, Redis, Kafka
2. **Microservices Architecture**: 18+ domain-specific services
3. **Cloud-Native Deployment**: Kubernetes, AWS, CI/CD
4. **Comprehensive Security**: JWT, OAuth2, MFA, RBAC
5. **Performance Optimization**: Caching, CDN, database optimization
6. **Monitoring & Observability**: Logging, metrics, tracing
7. **Phased Migration**: 30-week timeline with clear milestones

The architecture is designed for scalability, maintainability, and enterprise-grade capabilities, enabling CricketIQ to serve millions of users across the global cricket ecosystem.

---

**Next Steps**:
1. Review and approve the architecture
2. Set up development environment
3. Begin Phase 1 implementation
4. Establish development standards and guidelines
