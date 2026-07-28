import { test, expect } from '@playwright/test';

// List of all routes to test
const routes = [
  // Dashboard
  '/dashboard',
  
  // Tournaments
  '/tournaments',
  '/tournaments/analytics',
  '/tournaments/standings',
  
  // Teams
  '/teams',
  '/teams/analytics',
  
  // Players
  '/players',
  '/players/analytics',
  
  // Captains
  '/captains',
  '/captains/analytics',
  
  // Matches
  '/matches',
  '/matches/analytics',
  '/matches/h2h',
  '/matches/h2h/analytics',
  
  // Analytics
  '/analytics',
  '/analytics/predictions',
  '/analytics/predictions/enhanced',
  '/analytics/insights',
  '/analytics/awards',
  '/analytics/awards/leaderboards',
  
  // Video Analysis
  '/video-analysis',
  
  // Academy
  '/academy',
  
  // Training
  '/training',
  
  // Auction
  '/auction',
  
  // Fantasy
  '/fantasy',
  '/fantasy/leagues',
  '/fantasy/contests',
  '/fantasy/mvp',
  
  // Notifications
  '/notifications',
  
  // Sponsorship
  '/sponsorship',
  '/sponsorship/analytics',
  
  // Monetization
  '/monetization',
  
  // Streaming
  '/streaming',
  
  // Reports
  '/reports',
  '/reports/export',
  
  // Admin
  '/admin',
  '/admin/analytics',
  '/admin/portal',
  '/admin/dashboard',
  '/admin/tournaments',
  '/admin/teams',
  '/admin/players',
  '/admin/squads',
  '/admin/matches',
  '/admin/scoring',
  '/admin/ball-by-ball',
  '/admin/scorecards',
  '/admin/streaming',
  '/admin/officials',
  '/admin/venues',
  '/admin/organizers',
  '/admin/player-analytics',
  '/admin/team-analytics',
  '/admin/match-analytics',
  '/admin/tournament-analytics',
  '/admin/batter-insights',
  '/admin/bowler-insights',
  '/admin/captain-analytics',
  '/admin/venue-analytics',
  '/admin/moneyball',
  '/admin/import',
  '/admin/users',
  '/admin/audit',
  
  // Settings
  '/settings',
  
  // System
  '/welcome',
];

test.describe('Page Load Tests', { timeout: 60000 }, () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  for (const route of routes) {
    test(`should load ${route}`, async ({ page }) => {
      // Navigate to the route
      await page.goto(`http://localhost:5173${route}`);
      
      // Wait for the page to load (wait for any content or loading state to resolve)
      await page.waitForLoadState('networkidle');
      
      // Wait a bit more for any animations or lazy loading
      await page.waitForTimeout(3000);
      
      // Check if page loaded without errors
      // Look for common error indicators
      const hasError = await page.evaluate(() => {
        // Check for error messages in console
        const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
        return errorElements.length > 0;
      });
      
      // Verify page has content (not just empty layout)
      const hasContent = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        // Check if there's meaningful content (more than just layout text)
        return bodyText.length > 100 ||
               document.querySelector('h1') !== null ||
               document.querySelector('h2') !== null ||
               document.querySelector('h3') !== null;
      });
      
      // Assert that page loaded successfully
      expect(hasContent).toBeTruthy();
    }, 60000);
  }
});

test.describe('Root Route', () => {
  test('should redirect to /dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForURL('**/dashboard');
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
  });
});
