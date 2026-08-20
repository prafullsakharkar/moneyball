import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../providers/AppProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ErrorBoundary } from '../providers/ErrorBoundary';

describe('App Providers', () => {
  it('renders children inside providers without crashing', () => {
    render(
      <ErrorBoundary>
        <ThemeProvider>
          <AppProvider>
            <div>Test Child</div>
          </AppProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Child')).toBeDefined();
  });
});
