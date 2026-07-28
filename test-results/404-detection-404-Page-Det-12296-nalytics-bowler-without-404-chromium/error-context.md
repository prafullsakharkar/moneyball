# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /analytics/bowler without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:5173/analytics/bowler", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: C
      - generic [ref=e7]:
        - paragraph [ref=e8]: CricketIQ
        - paragraph [ref=e9]: Analytics Platform
      - button [ref=e10]
    - navigation [ref=e14]:
      - button "Dashboard" [ref=e15]
      - button "Competitions" [ref=e24]
      - button "Teams" [ref=e35]
      - button "Players" [ref=e45]
      - button "Matches 12" [ref=e53]:
        - generic [ref=e56]: Matches
        - generic [ref=e57]: "12"
      - button "Analytics" [ref=e61]
      - button "Video Analysis" [ref=e68]
      - button "Academy" [ref=e76]
      - button "Training" [ref=e84]
      - button "Auction" [ref=e95]
      - button "Fantasy" [ref=e106]
      - button "Notifications" [ref=e112]
      - button "Sponsorship" [ref=e117]
      - button "Monetization" [ref=e121]
      - button "Reports" [ref=e125]
      - button "Administration" [ref=e132]
      - button "More" [ref=e150]
    - generic [ref=e158]:
      - generic [ref=e159]: A
      - generic [ref=e160]:
        - paragraph [ref=e161]: Admin User
        - paragraph [ref=e162]: v1.0.0
  - banner [ref=e163]:
    - button "Search players, teams... ⌘K" [ref=e164]:
      - generic [ref=e168]: Search players, teams...
      - generic [ref=e169]: ⌘K
    - generic [ref=e170]:
      - button [ref=e171]
      - button "AI Assistant" [ref=e174]
      - button [ref=e177]
      - generic [ref=e182]: A
  - main [ref=e183]:
    - generic [ref=e186]:
      - heading "Bowler Analytics" [level=2] [ref=e187]
      - paragraph [ref=e188]: Bowler performance analysis.
```

# Test source

```ts
  66  |   '/video-analysis/tagging',
  67  |   '/video-analysis/highlights',
  68  |   '/video-analysis/ai-highlights',
  69  |   
  70  |   // Academy
  71  |   '/academy',
  72  |   '/academy/students',
  73  |   '/academy/coaches',
  74  |   '/academy/parents',
  75  |   '/academy/curriculum',
  76  |   '/academy/reports',
  77  |   
  78  |   // Training
  79  |   '/training',
  80  |   '/training/sessions',
  81  |   '/training/attendance',
  82  |   '/training/fitness',
  83  |   '/training/performance',
  84  |   
  85  |   // Auction
  86  |   '/auction',
  87  |   '/auction/room',
  88  |   '/auction/pool',
  89  |   '/auction/budgets',
  90  |   '/auction/sold',
  91  |   
  92  |   // Fantasy
  93  |   '/fantasy',
  94  |   '/fantasy/leagues',
  95  |   '/fantasy/teams',
  96  |   '/fantasy/pool',
  97  |   '/fantasy/transfers',
  98  |   '/fantasy/points',
  99  |   '/fantasy/contests',
  100 |   '/fantasy/mvp',
  101 |   
  102 |   // Notifications
  103 |   '/notifications',
  104 |   
  105 |   // Sponsorship
  106 |   '/sponsorship',
  107 |   '/sponsorship/analytics',
  108 |   
  109 |   // Monetization
  110 |   '/monetization',
  111 |   
  112 |   // Streaming
  113 |   '/streaming',
  114 |   
  115 |   // Reports
  116 |   '/reports',
  117 |   '/reports/export',
  118 |   
  119 |   // Admin
  120 |   '/admin',
  121 |   '/admin/analytics',
  122 |   '/admin/portal',
  123 |   '/admin/dashboard',
  124 |   '/admin/tournaments',
  125 |   '/admin/teams',
  126 |   '/admin/players',
  127 |   '/admin/squads',
  128 |   '/admin/matches',
  129 |   '/admin/scoring',
  130 |   '/admin/ball-by-ball',
  131 |   '/admin/scorecards',
  132 |   '/admin/streaming',
  133 |   '/admin/officials',
  134 |   '/admin/venues',
  135 |   '/admin/organizers',
  136 |   '/admin/player-analytics',
  137 |   '/admin/team-analytics',
  138 |   '/admin/match-analytics',
  139 |   '/admin/tournament-analytics',
  140 |   '/admin/batter-insights',
  141 |   '/admin/bowler-insights',
  142 |   '/admin/captain-analytics',
  143 |   '/admin/venue-analytics',
  144 |   '/admin/moneyball',
  145 |   '/admin/import',
  146 |   '/admin/users',
  147 |   '/admin/audit',
  148 |   
  149 |   // Settings
  150 |   '/settings',
  151 |   
  152 |   // System
  153 |   '/welcome',
  154 |   '/help',
  155 | ];
  156 | 
  157 | // Routes that should return 404 (not defined in router)
  158 | const should404Paths = [];
  159 | 
  160 | test.describe('404 Page Detection Tests', () => {
  161 |   test.use({ viewport: { width: 1920, height: 1080 } });
  162 | 
  163 |   test.describe('Navigation Paths - Should All Load Successfully', () => {
  164 |     for (const path of navigationPaths) {
  165 |       test(`should load ${path} without 404`, async ({ page }) => {
> 166 |         await page.goto(`http://localhost:5173${path}`);
      |                    ^ Error: page.goto: Test ended.
  167 |         await page.waitForLoadState('networkidle');
  168 |         await page.waitForTimeout(2000);
  169 | 
  170 |         // Check for 404 indicators
  171 |         const bodyText = await page.evaluate(() => document.body.innerText);
  172 |         const has404 = bodyText.toLowerCase().includes('page not found') || 
  173 |                       bodyText.toLowerCase().includes('404') ||
  174 |                       bodyText.toLowerCase().includes('not found');
  175 | 
  176 |         expect(has404).toBeFalsy(`Path ${path} returned 404 or not found message`);
  177 |       }, { timeout: 60000 });
  178 |     }
  179 |   });
  180 | 
  181 |   test.describe('Direct Routes - Should Return 404', () => {
  182 |     for (const path of should404Paths) {
  183 |       test(`should return 404 for ${path}`, async ({ page }) => {
  184 |         await page.goto(`http://localhost:5173${path}`);
  185 |         await page.waitForLoadState('networkidle');
  186 |         await page.waitForTimeout(2000);
  187 | 
  188 |         const bodyText = await page.evaluate(() => document.body.innerText);
  189 |         const has404 = bodyText.toLowerCase().includes('page not found') || 
  190 |                       bodyText.toLowerCase().includes('404') ||
  191 |                       bodyText.toLowerCase().includes('not found');
  192 | 
  193 |         expect(has404).toBeTruthy(`Path ${path} should return 404 but loaded successfully`);
  194 |       }, { timeout: 60000 });
  195 |     }
  196 |   });
  197 | });
  198 | 
  199 | test.describe('Root Route Redirect', () => {
  200 |   test('should redirect to /dashboard', async ({ page }) => {
  201 |     await page.goto('http://localhost:5173/');
  202 |     await page.waitForURL('**/dashboard');
  203 |     const currentUrl = page.url();
  204 |     expect(currentUrl).toContain('/dashboard');
  205 |   });
  206 | });
  207 | 
```