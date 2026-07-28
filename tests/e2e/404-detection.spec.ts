import { test, expect } from '@playwright/test';

// Comprehensive list of all navigation paths from constants/navigation.ts
const navigationPaths = [
  // Dashboard
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/players',
  '/dashboard/matches',
  
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
  '/matches/live',
  '/matches/commentary',
  '/matches/scorecards',
  '/matches/streaming',
  
  // Analytics
  '/analytics',
  '/analytics/predictions',
  '/analytics/predictions/enhanced',
  '/analytics/insights',
  '/analytics/awards',
  '/analytics/awards/leaderboards',
  '/analytics/team',
  '/analytics/player',
  '/analytics/match',
  '/analytics/tournament',
  '/analytics/venue',
  '/analytics/captain',
  '/analytics/batter',
  '/analytics/bowler',
  '/analytics/moneyball',
  
  // AI
  '/ai/insights',
  '/ai/coach',
  '/ai/analyst',
  '/ai/predictions',
  '/ai/reports',
  
  // Video Analysis
  '/video-analysis',
  '/video-analysis/videos',
  '/video-analysis/clips',
  '/video-analysis/tagging',
  '/video-analysis/highlights',
  '/video-analysis/ai-highlights',
  
  // Academy
  '/academy',
  '/academy/students',
  '/academy/coaches',
  '/academy/parents',
  '/academy/curriculum',
  '/academy/reports',
  
  // Training
  '/training',
  '/training/sessions',
  '/training/attendance',
  '/training/fitness',
  '/training/performance',
  
  // Auction
  '/auction',
  '/auction/room',
  '/auction/pool',
  '/auction/budgets',
  '/auction/sold',
  
  // Fantasy
  '/fantasy',
  '/fantasy/leagues',
  '/fantasy/teams',
  '/fantasy/pool',
  '/fantasy/transfers',
  '/fantasy/points',
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
  '/help',
];

// Routes that should return 404 (not defined in router)
const should404Paths: string[] = [];

// Helper function to create tests for a list of paths
function createPathTests(
  description: string,
  paths: string[],
  assertion: (has404: boolean) => void
) {
  for (const path of paths) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error - TypeScript has issues with dynamic test generation
    test(`should ${description} for ${path}`, async ({ page }) => {
      await page.goto(`http://localhost:5173${path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const bodyText = await page.evaluate(() => document.body.innerText);
      const has404 = bodyText.toLowerCase().includes('page not found') ||
                    bodyText.toLowerCase().includes('404') ||
                    bodyText.toLowerCase().includes('not found');

      assertion(has404);
    }, { timeout: 60000 } as any);
  }
}

test.describe('404 Page Detection Tests', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.describe('Navigation Paths - Should All Load Successfully', () => {
    createPathTests('load without 404', navigationPaths, (has404) => {
      expect(has404).toBeFalsy();
    });
  });

  test.describe('Direct Routes - Should Return 404', () => {
    createPathTests('return 404', should404Paths, (has404) => {
      expect(has404).toBeTruthy();
    });
  });
});

test.describe('Root Route Redirect', () => {
  test('should redirect to /dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForURL('**/dashboard');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
  });
});
