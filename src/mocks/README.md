# Mock API Documentation

This directory contains mock data and configuration for the local API server.

## Structure

```
src/mocks/
├── data/          # JSON files containing mock data
│   ├── teams.json
│   ├── players.json
│   ├── tournaments.json
│   └── matches.json
├── index.ts       # Mock server setup
└── browser.ts     # Service worker registration
```

## Available Endpoints

### Teams
- `GET /api/v1/teams` - List all teams with pagination
  - Query params: `page`, `limit`, `search`, `city`
- `GET /api/v1/teams/:id` - Get team by ID

### Players
- `GET /api/v1/players` - List all players with pagination
  - Query params: `page`, `limit`, `search`, `teamId`, `role`
- `GET /api/v1/players/:id` - Get player by ID

### Tournaments
- `GET /api/v1/tournaments` - List all tournaments
  - Query params: `page`, `limit`, `search`, `status`
- `GET /api/v1/tournaments/:id` - Get tournament by ID

### Matches
- `GET /api/v1/matches` - List all matches
  - Query params: `page`, `limit`, `tournamentId`, `status`
- `GET /api/v1/matches/:id` - Get match by ID

## Adding a New Mock Endpoint

1. Create a JSON file in `src/mocks/data/` with your mock data
2. Add a handler in `src/mocks/index.ts` using MSW's `rest` API
3. Create a service module in `src/api/services/` with typed interfaces
4. Create a React Query hook in `src/hooks/`
5. Use the hook in your component

### Example: Adding a New Mock Endpoint

1. **Create mock data** (`src/mocks/data/new-resource.json`):
```json
{
  "resources": [
    {
      "id": "1",
      "name": "Example Resource"
    }
  ]
}
```

2. **Add handler** (`src/mocks/index.ts`):
```typescript
import newResourceData from './data/new-resource.json';

rest.get('/api/v1/new-resources', (req, res, ctx) => {
  return res(ctx.json(newResourceData));
}),

rest.get('/api/v1/new-resources/:id', (req, res, ctx) => {
  const { id } = req.params;
  const resource = newResourceData.resources.find(r => r.id === id);
  if (!resource) return res(ctx.status(404));
  return res(ctx.json(resource));
}),
```

3. **Create service** (`src/api/services/newResources.ts`):
```typescript
export interface NewResource {
  id: string;
  name: string;
}

export async function getNewResources(): Promise<NewResource[]> {
  const response = await apiClient.get('/api/v1/new-resources');
  return handleApiResponse(response);
}
```

4. **Create hook** (`src/hooks/useNewResources.ts`):
```typescript
export function useNewResources() {
  return useQuery({
    queryKey: ['newResources'],
    queryFn: () => getNewResources(),
  });
}
```

## Simulated Behaviors

### Latency
All requests have a simulated latency of 400-800ms to mimic real API behavior.

### Error Responses
To test error states, append error codes to the URL:
- `GET /api/v1/error/404` - Returns 404 Not Found
- `GET /api/v1/error/500` - Returns 500 Internal Server Error
- `GET /api/v1/error/401` - Returns 401 Unauthorized

## Swapping to Real Backend

To use a real backend instead of mocks:

1. Set `VITE_API_BASE_URL` in your `.env` file:
```
VITE_API_BASE_URL=https://api.yourbackend.com
```

2. The existing service modules will automatically use the real endpoints without any code changes.

3. Remove or disable the MSW setup in `src/main.tsx` if needed.