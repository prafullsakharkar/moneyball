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
      const { collapsed, darkMode, expandedGroups, favoriteItems, recentItems } = useNavigation();
      
      return (
        <div>
          <span data-testid="sidebar-collapsed">{collapsed ? 'collapsed' : 'expanded'}</span>
          <span data-testid="dark-mode">{darkMode ? 'dark' : 'light'}</span>
          <span data-testid="expanded-groups">{expandedGroups.length}</span>
          <span data-testid="favorites">{favoriteItems.length}</span>
          <span data-testid="recent">{recentItems.length}</span>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('sidebar-collapsed')).toHaveTextContent('collapsed');
    expect(screen.getByTestId('dark-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('expanded-groups')).toHaveTextContent('0');
    expect(screen.getByTestId('favorites')).toHaveTextContent('0');
    expect(screen.getByTestId('recent')).toHaveTextContent('0');
  });

  it('should toggle sidebar state', () => {
    const TestComponent = () => {
      const { collapsed, toggleSidebar } = useNavigation();
      
      return (
        <div>
          <span data-testid="sidebar-state">{collapsed ? 'collapsed' : 'expanded'}</span>
          <button onClick={toggleSidebar}>Toggle Sidebar</button>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('sidebar-state')).toHaveTextContent('collapsed');
    
    fireEvent.click(screen.getByRole('button', { name: /Toggle Sidebar/i }));
    expect(screen.getByTestId('sidebar-state')).toHaveTextContent('expanded');
  });

  it('should toggle dark mode', () => {
    const TestComponent = () => {
      const { darkMode, toggleTheme } = useNavigation();
      
      return (
        <div>
          <span data-testid="theme-state">{darkMode ? 'dark' : 'light'}</span>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('theme-state')).toHaveTextContent('light');
    
    fireEvent.click(screen.getByRole('button', { name: /Toggle Theme/i }));
    expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
  });

  it('should expand and collapse groups', () => {
    const TestComponent = () => {
      const { expandedGroups, toggleGroup } = useNavigation();
      
      return (
        <div>
          <span data-testid="expanded-count">{expandedGroups.length}</span>
          <button onClick={() => toggleGroup('competitions')}>Toggle Competitions</button>
        </div>
      );
    };

    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('expanded-count')).toHaveTextContent('0');
    
    fireEvent.click(screen.getByRole('button', { name: /Toggle Competitions/i }));
    expect(screen.getByTestId('expanded-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByRole('button', { name: /Toggle Competitions/i }));
    expect(screen.getByTestId('expanded-count')).toHaveTextContent('0');
  });
});
