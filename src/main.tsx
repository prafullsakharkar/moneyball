import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enable MSW in development mode
if (import.meta.env.DEV) {
  import('./mocks/browser').catch((error) => {
    console.error('Failed to set up MSW:', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);