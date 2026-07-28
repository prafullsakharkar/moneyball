/**
 * Integration Tests for Navigation Context
 * ========================================
 * 
 * Tests for navigation context and routing functionality.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationProvider, useNavigation } from '../NavigationContext';

// Mock the navigation context
describe('NavigationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide navigation state', () => {
    const TestComponent = () => {
      const { activePath, setActivePath, isSidebarOpen, toggleSidebar } = useNavigation();
      
      return (
        <div>
          <span data-testid="active-path">{activePath}</span>
          <button onClick={toggleSidebar}>Toggle Sidebar</button>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('active-path')).toHaveTextContent('/');
  });

  it('should update active path', () => {
    const TestComponent = () => {
      const { activePath, setActivePath } = useNavigation();
      
      return (
        <div>
          <span data-testid="active-path">{activePath}</span>
          <button onClick={() => setActivePath('/dashboard')}>Set Dashboard</button>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Set Dashboard/i }));
    expect(screen.getByTestId('active-path')).toHaveTextContent('/dashboard');
  });

  it('should toggle sidebar state', () => {
    const TestComponent = () => {
      const { isSidebarOpen, toggleSidebar } = useNavigation();
      
      return (
        <div>
          <span data-testid="sidebar-state">{isSidebarOpen ? 'open' : 'closed'}</span>
          <button onClick={toggleSidebar}>Toggle Sidebar</button>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('sidebar-state')).toHaveTextContent('open');
    
    fireEvent.click(screen.getByRole('button', { name: /Toggle Sidebar/i }));
    expect(screen.getByTestId('sidebar-state')).toHaveTextContent('closed');
  });
});
