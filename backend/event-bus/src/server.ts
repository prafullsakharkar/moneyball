// Event Bus Server for CricketIQ Platform

import { kafka, TOPICS } from './config/kafka';

const PRODUCER = kafka.producer();
const CONSUMER = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'cricketiq-consumers' });

// Event types
interface Event {
  id: string;
  type: string;
  timestamp: string;
  payload: Record<string, unknown>;
  metadata?: {
    sourceService?: string;
    correlationId?: string;
    userId?: string;
  };
}

// Producer functions
export const produceEvent = async (topic: string, event: Event): Promise<void> => {
  await PRODUCER.send({
    topic,
    messages: [
      {
        key: event.id,
        value: JSON.stringify(event),
        timestamp: event.timestamp
      }
    ]
  });
  console.log(`Event produced to ${topic}: ${event.type}`);
};

// Consumer functions
export const consumeEvents = async (topic: string, handler: (event: Event) => Promise<void>): Promise<void> => {
  await CONSUMER.subscribe({ topic, fromBeginning: true });
  await CONSUMER.run({
    eachMessage: async ({ message }) => {
      try {
        const event: Event = JSON.parse(message.value?.toString() || '{}');
        await handler(event);
        console.log(`Event consumed from ${topic}: ${event.type}`);
      } catch (error) {
        console.error(`Error consuming event from ${topic}:`, error);
      }
    }
  });
};

// Event handlers
export const eventHandlers = {
  // Identity events
  onUserCreated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.USER_CREATED, handler);
  },
  onUserUpdated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.USER_UPDATED, handler);
  },
  onUserDeleted: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.USER_DELETED, handler);
  },

  // Player events
  onPlayerCreated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.PLAYER_CREATED, handler);
  },
  onPlayerUpdated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.PLAYER_UPDATED, handler);
  },
  onPlayerStatsUpdated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.PLAYER_STATS_UPDATED, handler);
  },

  // Match events
  onMatchStarted: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.MATCH_STARTED, handler);
  },
  onMatchCompleted: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.MATCH_COMPLETED, handler);
  },

  // Scoring events
  onScoringEventCreated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.SCORING_EVENT_CREATED, handler);
  },
  onBallByBallScoring: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.BALL_BY_BALL_SCORING, handler);
  },

  // Competition events
  onFixtureCompleted: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.FIXTURE_COMPLETED, handler);
  },
  onStandingsUpdated: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.STANDINGS_UPDATED, handler);
  },

  // Auction events
  onAuctionStarted: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.AUCTION_STARTED, handler);
  },
  onPlayerSold: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.PLAYER_SOLD, handler);
  },
  onBidPlaced: async (handler: (event: Event) => Promise<void>) => {
    await consumeEvents(TOPICS.BID_PLACED, handler);
  }
};

// Start producer
export const startProducer = async (): Promise<void> => {
  await PRODUCER.connect();
  console.log('Producer connected to Kafka');
};

// Start consumer
export const startConsumer = async (): Promise<void> => {
  await CONSUMER.connect();
  console.log('Consumer connected to Kafka');
};

// Stop producer and consumer
export const stop = async (): Promise<void> => {
  await PRODUCER.disconnect();
  await CONSUMER.disconnect();
  console.log('Kafka connections closed');
};

export default {
  produceEvent,
  consumeEvents,
  eventHandlers,
  startProducer,
  startConsumer,
  stop,
  TOPICS
};
