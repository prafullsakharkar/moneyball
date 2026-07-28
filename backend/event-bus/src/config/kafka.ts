// Kafka Configuration for Event Bus

import { Kafka } from 'kafkajs';

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  ssl: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
}

export const getKafkaConfig = (): KafkaConfig => {
  return {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'cricketiq-event-bus',
    groupId: process.env.KAFKA_GROUP_ID || 'cricketiq-consumers',
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: process.env.KAFKA_SASL === 'true' ? {
      mechanism: (process.env.KAFKA_SASL_MECHANISM || 'plain') as any,
      username: process.env.KAFKA_SASL_USERNAME || '',
      password: process.env.KAFKA_SASL_PASSWORD || ''
    } : undefined
  };
};

export const createKafka = (): Kafka => {
  const config = getKafkaConfig();
  return new Kafka({
    clientId: config.clientId,
    brokers: config.brokers,
    ssl: config.ssl ? {
      rejectUnauthorized: true
    } : undefined,
    sasl: config.sasl ? {
      mechanism: config.sasl.mechanism,
      username: config.sasl.username,
      password: config.sasl.password
    } : undefined
  });
};

export const kafka = createKafka();

// Topic names
export const TOPICS = {
  // Identity topics
  USER_CREATED: 'identity.user.created',
  USER_UPDATED: 'identity.user.updated',
  USER_DELETED: 'identity.user.deleted',
  USER_SESSION_CREATED: 'identity.session.created',
  USER_SESSION_DELETED: 'identity.session.deleted',

  // Organization topics
  ORGANIZATION_CREATED: 'organization.created',
  ORGANIZATION_UPDATED: 'organization.updated',
  ORGANIZATION_DELETED: 'organization.deleted',
  VENUE_CREATED: 'organization.venue.created',
  VENUE_UPDATED: 'organization.venue.updated',
  VENUE_DELETED: 'organization.venue.deleted',

  // Player topics
  PLAYER_CREATED: 'player.created',
  PLAYER_UPDATED: 'player.updated',
  PLAYER_DELETED: 'player.deleted',
  PLAYER_STATS_UPDATED: 'player.stats.updated',
  PLAYER_CONTRACT_CREATED: 'player.contract.created',
  PLAYER_CONTRACT_UPDATED: 'player.contract.updated',
  PLAYER_CONTRACT_EXPIRED: 'player.contract.expired',

  // Team topics
  TEAM_CREATED: 'team.created',
  TEAM_UPDATED: 'team.updated',
  TEAM_DELETED: 'team.deleted',
  TEAM_ROSTER_UPDATED: 'team.roster.updated',
  TEAM_CAPTAIN_CHANGED: 'team.captain.changed',

  // Match topics
  MATCH_CREATED: 'match.created',
  MATCH_UPDATED: 'match.updated',
  MATCH_DELETED: 'match.deleted',
  MATCH_STARTED: 'match.started',
  MATCH_COMPLETED: 'match.completed',
  MATCH_SCHEDULED: 'match.scheduled',

  // Scoring topics
  SCORING_SESSION_CREATED: 'scoring.session.created',
  SCORING_SESSION_UPDATED: 'scoring.session.updated',
  SCORING_EVENT_CREATED: 'scoring.event.created',
  BALL_BY_BALL_SCORING: 'scoring.ballbyball',

  // Competition topics
  COMPETITION_CREATED: 'competition.created',
  COMPETITION_UPDATED: 'competition.updated',
  SEASON_CREATED: 'competition.season.created',
  SEASON_UPDATED: 'competition.season.updated',
  FIXTURE_CREATED: 'competition.fixture.created',
  FIXTURE_UPDATED: 'competition.fixture.updated',
  FIXTURE_COMPLETED: 'competition.fixture.completed',
  STANDINGS_UPDATED: 'competition.standings.updated',

  // Analytics topics
  PLAYER_STATS_COMPUTED: 'analytics.player.stats.computed',
  TEAM_STATS_COMPUTED: 'analytics.team.stats.computed',
  LEADERBOARD_UPDATED: 'analytics.leaderboard.updated',

  // Media topics
  MEDIA_UPLOADED: 'media.uploaded',
  MEDIA_PROCESSED: 'media.processed',
  MEDIA_DELETED: 'media.deleted',

  // Finance topics
  PAYMENT_PROCESSED: 'finance.payment.processed',
  INVOICE_CREATED: 'finance.invoice.created',
  SUBSCRIPTION_CREATED: 'finance.subscription.created',
  SUBSCRIPTION_EXPIRED: 'finance.subscription.expired',

  // Notification topics
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',

  // Video Analysis topics
  VIDEO_UPLOADED: 'video-analysis.uploaded',
  VIDEO_PROCESSED: 'video-analysis.processed',
  ANALYSIS_COMPLETED: 'video-analysis.analysis.completed',

  // Training topics
  TRAINING_SESSION_CREATED: 'training.session.created',
  TRAINING_SESSION_COMPLETED: 'training.session.completed',
  PLAYER_FITNESS_UPDATED: 'training.fitness.updated',

  // Scouting topics
  SCOUTING_REPORT_CREATED: 'scouting.report.created',
  SCOUTING_REPORT_UPDATED: 'scouting.report.updated',
  PLAYER_RANKING_UPDATED: 'scouting.ranking.updated',

  // Auction topics
  AUCTION_CREATED: 'auction.created',
  AUCTION_STARTED: 'auction.started',
  AUCTION_ENDED: 'auction.ended',
  PLAYER_SOLD: 'auction.player.sold',
  BID_PLACED: 'auction.bid.placed',

  // Sponsorship topics
  SPONSORSHIP_DEAL_CREATED: 'sponsorship.deal.created',
  SPONSORSHIP_DEAL_UPDATED: 'sponsorship.deal.updated',
  SPONSORSHIP_DEAL_EXPIRED: 'sponsorship.deal.expired',
  PAYMENT_RECEIVED: 'sponsorship.payment.received'
};

export default {
  kafka,
  TOPICS
};
