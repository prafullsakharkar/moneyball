// Entry point for Event Bus

export { produceEvent, consumeEvents, eventHandlers, startProducer, startConsumer, stop } from './server';
export { kafka, TOPICS as KAFKA_TOPICS } from './config/kafka';
