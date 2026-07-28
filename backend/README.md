# CricketIQ Backend - Microservices Architecture

This directory contains the backend microservices for the CricketIQ platform.

## Project Structure

```
backend/
├── shared/              # Shared utilities and types
├── identity/            # Identity & Authentication Service
├── organization/        # Organization Management Service
├── player/              # Player Management Service
├── team/                # Team Management Service
├── match/               # Match Management Service
├── scoring/             # Scoring Service
├── competition/         # Competition Management Service
├── analytics/           # Analytics Service
├── media/               # Media Management Service
├── finance/             # Finance Service
├── notification/        # Notification Service
├── video-analysis/      # Video Analysis Service
├── training/            # Training Management Service
├── scouting/            # Scouting Service
├── reporting/           # Reporting Service
├── auction/             # Auction Service
├── sponsorship/         # Sponsorship Service
├── admin/               # Admin Service
├── api-gateway/         # API Gateway
├── event-bus/           # Event Bus (Kafka)
├── database/            # Database setup scripts
└── docker-compose.yml   # Docker Compose configuration
```

## Services

### 1. Identity Service (Port 3001)
- User registration and authentication
- JWT token generation and validation
- Role-based access control (RBAC)
- Session management

### 2. Organization Service (Port 3002)
- Cricket organization management
- Venue management
- Organization hierarchy

### 3. Player Service (Port 3003)
- Player profiles and management
- Player statistics
- Player contracts
- Player medical records

### 4. Team Service (Port 3004)
- Team management
- Team rosters
- Team captains and coaches
- Team statistics

### 5. Match Service (Port 3005)
- Match scheduling and management
- Match officials
- Match playing XI
- Match notes

### 6. Scoring Service (Port 3006)
- Ball-by-ball scoring
- Scoring sessions
- Scoring events

### 7. Competition Service (Port 3007)
- Tournament management
- Season management
- Group management
- Fixture generation
- Standings calculation

### 8. Analytics Service (Port 3008)
- Player statistics
- Team statistics
- Match analytics
- Player performance tracking
- Leaderboards

### 9. Media Service (Port 3009)
- Media file management
- Media albums
- Media tags
- Media analytics

### 10. Finance Service (Port 3010)
- Transaction processing
- Invoice management
- Subscription management
- Payment processing
- Refund processing

### 11. Notification Service (Port 3011)
- Notification management
- Notification templates
- Push notifications
- Email notifications

### 12. Video Analysis Service (Port 3012)
- Video upload and processing
- Video analysis sessions
- Video annotations
- Video highlights

### 13. Training Service (Port 3013)
- Training session management
- Training drills
- Player fitness tracking
- Training reports

### 14. Scouting Service (Port 3014)
- Scouting reports
- Scouting sessions
- Player rankings
- Scouting notes

### 15. Reporting Service (Port 3015)
- Report generation
- Report templates
- Report scheduling
- Report permissions

### 16. Auction Service (Port 3016)
- Auction management
- Player auctions
- Team bidding
- Bid tracking

### 17. Sponsorship Service (Port 3017)
- Sponsor management
- Sponsorship packages
- Sponsorship deals
- Payment tracking

### 18. Admin Service (Port 3018)
- Audit logging
- System settings
- System logs
- Cache invalidation
- API rate limiting

## API Gateway (Port 3000)
The API Gateway routes requests to the appropriate microservices and handles authentication.

## Event Bus (Kafka)
The Event Bus uses Apache Kafka for event-driven communication between microservices.

## Getting Started

### Prerequisites
- Node.js 20.x
- PostgreSQL 15.x
- Redis 7.x
- Kafka 3.x
- Docker and Docker Compose

### Installation

1. Clone the repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Start the services using Docker Compose:
```bash
docker-compose up -d
```

4. Initialize the database:
```bash
cd database
npm install
ts-node setup.ts
```

### Development

To run a specific service in development mode:
```bash
cd identity
npm run dev
```

## Environment Variables

Each service requires the following environment variables:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cricketiq_service_name
DB_USER=postgres
DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## License

MIT
