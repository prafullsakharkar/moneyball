import { setupWorker } from 'msw/browser';
import { handlers } from './index';

export const worker = setupWorker(...handlers);

// Start the worker in development
if (import.meta.env.DEV) {
  worker.start({
    serviceWorker: {
      url: new URL('./mock-service-worker.js', import.meta.url).href,
    },
    quiet: false,
  });
}