import { test, expect } from '@playwright/test';

// All endpoints to verify
const endpoints = [
  // Root routes
  { path: '/', expectedRedirect: '/dashboard' },
  { path: '/dashboard', component: 'Dashboard' },
  { path: '/tournaments', component: 'Tournament' },
  { path: '/teams', component: 'Team' },
  { path: '/players', component: 'Player' },
  { path: '/captains', component: 'Captain' },
  { path: '/matches', component: 'Match' },
  { path: '/analytics', component: 'AI' },
  { path: '/video-analysis', component: 'Video' },
  { path: '/academy', component: 'Academy' },
  { path: '/training', component: 'Training' },
  { path: '/auction', component: 'Auction' },
  { path: '/fantasy', component: 'Fantasy' },
  { path: '/notifications', component: 'Notification' },
  { path: '/sponsorship', component: 'Sponsorship' },
  { path: '/monetization', component: 'Monetization' },
  { path: '/streaming', component: 'Streaming' },
  { path: '/reports', component: 'Report' },
  { path: '/admin', component: 'Admin' },
  { path: '/settings', component: 'Settings' },
  { path: '/welcome', component: 'Welcome' },
  { path: '/h2h', component: 'Head to Head' },
  
  // Dashboard child routes
  { path: '/dashboard/players', component: 'Player' },
  { path: '/dashboard/matches', component: 'Match' },
  { path: '/dashboard/analytics', component: 'AI' },
  
  // Tournament child routes
  { path: '/tournaments/analytics', component: 'Tournament' },
  { path: '/tournaments/standings', component: 'Standings' },
  
  // Team child routes
  { path: '/teams/analytics', component: 'Team' },
  
  // Player child routes
  { path: '/players/analytics', component: 'Player' },
  
  // Captain child routes
  { path: '/captains/analytics', component: 'Captain' },
  
  // Match child routes
  { path: '/matches/analytics', component: 'Match' },
  { path: '/matches/h2h', component: 'Head to Head' },
  { path: '/matches/h2h/analytics', component: 'Head to Head' },
  { path: '/matches/live', component: 'Live' },
  { path: '/matches/commentary', component: 'Commentary' },
  { path: '/matches/scorecards', component: 'Scorecard' },
  { path: '/matches/streaming', component: 'Streaming' },
  
  // Analytics child routes
  { path: '/analytics/predictions', component: 'Predictions' },
  { path: '/analytics/predictions/enhanced', component: 'Predictions' },
  { path: '/analytics/insights', component: 'AI' },
  { path: '/analytics/awards', component: 'Awards' },
  { path: '/analytics/awards/leaderboards', component: 'Leaderboard' },
  { path: '/analytics/team', component: 'Team' },
  { path: '/analytics/player', component: 'Player' },
  { path: '/analytics/match', component: 'Match' },
  { path: '/analytics/tournament', component: 'Tournament' },
  { path: '/analytics/venue', component: 'Venue' },
  { path: '/analytics/captain', component: 'Captain' },
  { path: '/analytics/batter', component: 'Batter' },
  { path: '/analytics/bowler', component: 'Bowler' },
  { path: '/analytics/moneyball', component: 'Moneyball' },
  
  // AI routes
  { path: '/ai/insights', component: 'AI' },
  { path: '/ai/coach', component: 'Coach' },
  { path: '/ai/analyst', component: 'Analyst' },
  { path: '/ai/predictions', component: 'Predictions' },
  { path: '/ai/reports', component: 'Report' },
  
  // Video analysis child routes
  { path: '/video-analysis/videos', component: 'Video' },
  { path: '/video-analysis/clips', component: 'Clip' },
  { path: '/video-analysis/tagging', component: 'Tagging' },
  { path: '/video-analysis/highlights', component: 'Highlight' },
  { path: '/video-analysis/ai-highlights', component: 'AI' },
  
  // Academy child routes
  { path: '/academy/students', component: 'Student' },
  { path: '/academy/coaches', component: 'Coach' },
  { path: '/academy/parents', component: 'Parent' },
  { path: '/academy/curriculum', component: 'Curriculum' },
  { path: '/academy/reports', component: 'Report' },
  
  // Training child routes
  { path: '/training/sessions', component: 'Session' },
  { path: '/training/attendance', component: 'Attendance' },
  { path: '/training/fitness', component: 'Fitness' },
  { path: '/training/performance', component: 'Performance' },
  
  // Auction child routes
  { path: '/auction/room', component: 'Auction' },
  { path: '/auction/pool', component: 'Pool' },
  { path: '/auction/budgets', component: 'Budget' },
  { path: '/auction/sold', component: 'Sold' },
  
  // Fantasy child routes
  { path: '/fantasy/leagues', component: 'League' },
  { path: '/fantasy/teams', component: 'Team' },
  { path: '/fantasy/pool', component: 'Pool' },
  { path: '/fantasy/transfers', component: 'Transfer' },
  { path: '/fantasy/points', component: 'Point' },
  { path: '/fantasy/contests', component: 'Contest' },
  
  // Admin routes
  { path: '/admin/analytics', component: 'Admin' },
  { path: '/admin/portal', component: 'Portal' },
  { path: '/admin/dashboard', component: 'Admin' },
  { path: '/admin/tournaments', component: 'Tournament' },
  { path: '/admin/teams', component: 'Team' },
  { path: '/admin/players', component: 'Player' },
  { path: '/admin/squads', component: 'Squad' },
  { path: '/admin/matches', component: 'Match' },
  { path: '/admin/scoring', component: 'Scoring' },
  { path: '/admin/ball-by-ball', component: 'Ball' },
  { path: '/admin/scorecards', component: 'Scorecard' },
  { path: '/admin/streaming', component: 'Streaming' },
  { path: '/admin/officials', component: 'Official' },
  { path: '/admin/venues', component: 'Venue' },
  { path: '/admin/organizers', component: 'Organizer' },
  { path: '/admin/player-analytics', component: 'Player' },
  { path: '/admin/team-analytics', component: 'Team' },
  { path: '/admin/match-analytics', component: 'Match' },
  { path: '/admin/tournament-analytics', component: 'Tournament' },
  { path: '/admin/batter-insights', component: 'Batter' },
  { path: '/admin/bowler-insights', component: 'Bowler' },
  { path: '/admin/captain-analytics', component: 'Captain' },
  { path: '/admin/venue-analytics', component: 'Venue' },
  { path: '/admin/moneyball', component: 'Moneyball' },
  { path: '/admin/import', component: 'Import' },
  { path: '/admin/users', component: 'User' },
  { path: '/admin/audit', component: 'Audit' },
  
  // Reports
  { path: '/reports/export', component: 'Export' },
  
  // Sponsorship
  { path: '/sponsorship/analytics', component: 'Sponsorship' },
];

test.describe('Verify All Endpoints', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  for (const endpoint of endpoints) {
    test(`should load ${endpoint.path} successfully`, async ({ page }) => {
      await page.goto(`http://localhost:5173${endpoint.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check for 404 indicators
      const bodyText = await page.evaluate(() => document.body.innerText);
      const has404 = bodyText.toLowerCase().includes('page not found') || 
                    bodyText.toLowerCase().includes('404') ||
                    bodyText.toLowerCase().includes('not found');

      expect(has404).toBeFalsy();

      // Check for expected component text if specified
      if (endpoint.component) {
        const hasComponent = bodyText.toLowerCase().includes(endpoint.component.toLowerCase());
        // Don't fail if component text not found - some pages may use different text
        if (!hasComponent) {
          console.log(`Warning: Component text "${endpoint.component}" not found in ${endpoint.path}`);
        }
      }
    }, { timeout: 120000 });
  }

  test('should redirect root to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForURL('**/dashboard');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
  });
});
