// API Gateway Server for CricketIQ Platform

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

// Service URLs
const SERVICES = {
  identity: process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001',
  organization: process.env.ORGANIZATION_SERVICE_URL || 'http://localhost:3002',
  player: process.env.PLAYER_SERVICE_URL || 'http://localhost:3003',
  team: process.env.TEAM_SERVICE_URL || 'http://localhost:3004',
  match: process.env.MATCH_SERVICE_URL || 'http://localhost:3005',
  scoring: process.env.SCORING_SERVICE_URL || 'http://localhost:3006',
  competition: process.env.COMPETITION_SERVICE_URL || 'http://localhost:3007',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3008',
  media: process.env.MEDIA_SERVICE_URL || 'http://localhost:3009',
  finance: process.env.FINANCE_SERVICE_URL || 'http://localhost:3010',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3011',
  videoAnalysis: process.env.VIDEO_ANALYSIS_SERVICE_URL || 'http://localhost:3012',
  training: process.env.TRAINING_SERVICE_URL || 'http://localhost:3013',
  scouting: process.env.SCOUTING_SERVICE_URL || 'http://localhost:3014',
  reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:3015',
  auction: process.env.AUCTION_SERVICE_URL || 'http://localhost:3016',
  sponsorship: process.env.SPONSORSHIP_SERVICE_URL || 'http://localhost:3017',
  admin: process.env.ADMIN_SERVICE_URL || 'http://localhost:3018'
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// JWKS Client for JWT verification
const client = jwksClient({
  jwksUri: `${SERVICES.identity}/.well-known/jwks.json`
});

function getKey(header: jwt.Header, callback: (error: Error | null, key?: string | jwt.RsaPublicKey) => void) {
  client.getSigningKey(header.kid, (error, key) => {
    if (error) {
      callback(error);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// JWT Verification Middleware
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, getKey, {}, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    (req as any).user = decoded;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', services: SERVICES });
});

// API Routes Proxy
const apiProxyOptions = {
  target: '',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/identity': '/api/v1',
    '^/api/v1/organization': '/api/v1',
    '^/api/v1/player': '/api/v1',
    '^/api/v1/team': '/api/v1',
    '^/api/v1/match': '/api/v1',
    '^/api/v1/scoring': '/api/v1',
    '^/api/v1/competition': '/api/v1',
    '^/api/v1/analytics': '/api/v1',
    '^/api/v1/media': '/api/v1',
    '^/api/v1/finance': '/api/v1',
    '^/api/v1/notification': '/api/v1',
    '^/api/v1/video-analysis': '/api/v1',
    '^/api/v1/training': '/api/v1',
    '^/api/v1/scouting': '/api/v1',
    '^/api/v1/reporting': '/api/v1',
    '^/api/v1/auction': '/api/v1',
    '^/api/v1/sponsorship': '/api/v1',
    '^/api/v1/admin': '/api/v1'
  },
  router: {
    'identity': SERVICES.identity,
    'organization': SERVICES.organization,
    'player': SERVICES.player,
    'team': SERVICES.team,
    'match': SERVICES.match,
    'scoring': SERVICES.scoring,
    'competition': SERVICES.competition,
    'analytics': SERVICES.analytics,
    'media': SERVICES.media,
    'finance': SERVICES.finance,
    'notification': SERVICES.notification,
    'video-analysis': SERVICES.videoAnalysis,
    'training': SERVICES.training,
    'scouting': SERVICES.scouting,
    'reporting': SERVICES.reporting,
    'auction': SERVICES.auction,
    'sponsorship': SERVICES.sponsorship,
    'admin': SERVICES.admin
  }
};

// Identity Service Proxy
app.use('/api/v1/identity', verifyToken, createProxyMiddleware({
  target: SERVICES.identity,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/identity': '/api/v1' }
}));

// Organization Service Proxy
app.use('/api/v1/organization', verifyToken, createProxyMiddleware({
  target: SERVICES.organization,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/organization': '/api/v1' }
}));

// Player Service Proxy
app.use('/api/v1/player', verifyToken, createProxyMiddleware({
  target: SERVICES.player,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/player': '/api/v1' }
}));

// Team Service Proxy
app.use('/api/v1/team', verifyToken, createProxyMiddleware({
  target: SERVICES.team,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/team': '/api/v1' }
}));

// Match Service Proxy
app.use('/api/v1/match', verifyToken, createProxyMiddleware({
  target: SERVICES.match,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/match': '/api/v1' }
}));

// Scoring Service Proxy
app.use('/api/v1/scoring', verifyToken, createProxyMiddleware({
  target: SERVICES.scoring,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/scoring': '/api/v1' }
}));

// Competition Service Proxy
app.use('/api/v1/competition', verifyToken, createProxyMiddleware({
  target: SERVICES.competition,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/competition': '/api/v1' }
}));

// Analytics Service Proxy
app.use('/api/v1/analytics', verifyToken, createProxyMiddleware({
  target: SERVICES.analytics,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/analytics': '/api/v1' }
}));

// Media Service Proxy
app.use('/api/v1/media', verifyToken, createProxyMiddleware({
  target: SERVICES.media,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/media': '/api/v1' }
}));

// Finance Service Proxy
app.use('/api/v1/finance', verifyToken, createProxyMiddleware({
  target: SERVICES.finance,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/finance': '/api/v1' }
}));

// Notification Service Proxy
app.use('/api/v1/notification', verifyToken, createProxyMiddleware({
  target: SERVICES.notification,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/notification': '/api/v1' }
}));

// Video Analysis Service Proxy
app.use('/api/v1/video-analysis', verifyToken, createProxyMiddleware({
  target: SERVICES.videoAnalysis,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/video-analysis': '/api/v1' }
}));

// Training Service Proxy
app.use('/api/v1/training', verifyToken, createProxyMiddleware({
  target: SERVICES.training,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/training': '/api/v1' }
}));

// Scouting Service Proxy
app.use('/api/v1/scouting', verifyToken, createProxyMiddleware({
  target: SERVICES.scouting,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/scouting': '/api/v1' }
}));

// Reporting Service Proxy
app.use('/api/v1/reporting', verifyToken, createProxyMiddleware({
  target: SERVICES.reporting,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/reporting': '/api/v1' }
}));

// Auction Service Proxy
app.use('/api/v1/auction', verifyToken, createProxyMiddleware({
  target: SERVICES.auction,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/auction': '/api/v1' }
}));

// Sponsorship Service Proxy
app.use('/api/v1/sponsorship', verifyToken, createProxyMiddleware({
  target: SERVICES.sponsorship,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/sponsorship': '/api/v1' }
}));

// Admin Service Proxy
app.use('/api/v1/admin', verifyToken, createProxyMiddleware({
  target: SERVICES.admin,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/admin': '/api/v1' }
}));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Proxying to services:');
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`  ${name}: ${url}`);
  });
});

export default app;
