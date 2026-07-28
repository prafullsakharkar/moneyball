# CricketIQ - Cricket Intelligence Platform

A comprehensive cricket management platform for teams, players, associations, and tournaments. Built with a modern microservices architecture.

## Architecture

### Backend (Microservices)

The backend is built using a microservices architecture with the following services:

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Central entry point for all API requests |
| Identity | 3001 | User authentication and authorization |
| Organization | 3002 | Cricket organization and venue management |
| Player | 3003 | Player profiles and statistics |
| Team | 3004 | Team management and rosters |
| Match | 3005 | Match scheduling and management |
| Scoring | 3006 | Ball-by-ball scoring |
| Competition | 3007 | Tournament and competition management |
| Analytics | 3008 | Player and team analytics |
| Media | 3009 | Media file management |
| Finance | 3010 | Financial transactions and subscriptions |
| Notification | 3011 | Notification management |
| Video Analysis | 3012 | Video analysis and highlights |
| Training | 3013 | Training session management |
| Scouting | 3014 | Scouting reports and player rankings |
| Reporting | 3015 | Report generation and scheduling |
| Auction | 3016 | Auction management |
| Sponsorship | 3017 | Sponsorship deals and payments |
| Admin | 3018 | System administration and audit |

### Frontend

The frontend is built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- TanStack Query (data fetching)
- React Router (routing)

## Technology Stack

### Backend
- Node.js 20.x
- TypeScript 5.x
- Express.js
- PostgreSQL 15.x
- Redis 7.x (caching)
- Apache Kafka (event bus)
- Docker & Docker Compose

### Frontend
- React 18.x
- TypeScript 5.x
- Vite
- Tailwind CSS
- Zustand
- TanStack Query
- Axios

## Getting Started

### Prerequisites

- Node.js 20.x
- PostgreSQL 15.x
- Redis 7.x
- Kafka 3.x
- Docker and Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moneyball
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

#### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start all services including PostgreSQL, Redis, Kafka, and all microservices.

#### Running Services Individually

1. Start the database services:
```bash
docker-compose up -d postgres redis kafka
```

2. Initialize the database:
```bash
cd backend/database
npm install
ts-node setup.ts
```

3. Start individual services:
```bash
cd backend/identity
npm run dev
```

Repeat for each service, changing the directory accordingly.

4. Start the frontend:
```bash
cd frontend
npm run dev
```

## Environment Variables

Each service requires the following environment variables:

```env
NODE_ENV=development
PORT=<service-port>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cricketiq_<service-name>
DB_USER=postgres
DB_PASSWORD=postgres
KAFKA_BROKERS=localhost:9092
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## API Documentation

Once the API Gateway is running, you can access the API at `http://localhost:3000/api/v1`.

## Project Structure

```
moneyball/
├── backend/
│   ├── shared/              # Shared utilities and types
│   ├── identity/            # Identity Service
│   ├── organization/        # Organization Service
│   ├── player/              # Player Service
│   ├── team/                # Team Service
│   ├── match/               # Match Service
│   ├── scoring/             # Scoring Service
│   ├── competition/         # Competition Service
│   ├── analytics/           # Analytics Service
│   ├── media/               # Media Service
│   ├── finance/             # Finance Service
│   ├── notification/        # Notification Service
│   ├── video-analysis/      # Video Analysis Service
│   ├── training/            # Training Service
│   ├── scouting/            # Scouting Service
│   ├── reporting/           # Reporting Service
│   ├── auction/             # Auction Service
│   ├── sponsorship/         # Sponsorship Service
│   ├── admin/               # Admin Service
│   ├── api-gateway/         # API Gateway
│   ├── event-bus/           # Event Bus (Kafka)
│   ├── database/            # Database setup scripts
│   └── docker-compose.yml   # Docker Compose configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-specific code
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
└── plans/                   # Architecture and planning documents
```

## Development

### Running Linting

```bash
# Backend
cd backend/identity
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production

```bash
# Backend
cd backend/identity
npm run build

# Frontend
cd frontend
npm run build
```

## Deployment

### Docker Deployment

```bash
docker-compose build
docker-compose up -d
```

### Kubernetes Deployment

See the `kubernetes/` directory for Kubernetes manifests (to be created).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For support, email support@cricketiq.com or join our Slack channel.
