# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /tournaments/standings without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: Channel closed
```

```
Error: page.waitForTimeout: Test ended.
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
      - generic [ref=e23]:
        - button "Competitions" [ref=e24]
        - generic [ref=e35]:
          - button "Tournament 3" [ref=e36]:
            - generic [ref=e43]: Tournament
            - generic [ref=e44]: "3"
          - button "Fixtures" [ref=e45]
          - button "Points Table" [ref=e49]
          - button "Venues" [ref=e53]
      - button "Teams" [ref=e59]
      - button "Players" [ref=e69]
      - button "Matches 12" [ref=e77]:
        - generic [ref=e80]: Matches
        - generic [ref=e81]: "12"
      - button "Analytics" [ref=e85]
      - button "Video Analysis" [ref=e92]
      - button "Academy" [ref=e100]
      - button "Training" [ref=e108]
      - button "Auction" [ref=e119]
      - button "Fantasy" [ref=e130]
      - button "Notifications" [ref=e136]
      - button "Sponsorship" [ref=e141]
      - button "Monetization" [ref=e145]
      - button "Reports" [ref=e149]
      - button "Administration" [ref=e156]
      - button "More" [ref=e174]
    - generic [ref=e182]:
      - generic [ref=e183]: A
      - generic [ref=e184]:
        - paragraph [ref=e185]: Admin User
        - paragraph [ref=e186]: v1.0.0
  - banner [ref=e187]:
    - button "Search players, teams... ⌘K" [ref=e188]:
      - generic [ref=e192]: Search players, teams...
      - generic [ref=e193]: ⌘K
    - generic [ref=e194]:
      - button [ref=e195]
      - button "AI Assistant" [ref=e198]
      - button [ref=e201]
      - generic [ref=e206]: A
  - main [ref=e207]:
    - generic [ref=e210]:
      - generic [ref=e211]:
        - heading "Tournaments" [level=1] [ref=e212]
        - paragraph [ref=e213]: Manage and analyze all cricket tournaments
      - generic [ref=e214]:
        - generic [ref=e219] [cursor=pointer]:
          - generic [ref=e220]: completed
          - heading "Indian Premier League" [level=3] [ref=e229]
          - paragraph [ref=e230]: 2024 | T20
          - generic [ref=e231]: India
          - generic [ref=e236]:
            - generic [ref=e237]:
              - paragraph [ref=e238]: Teams
              - paragraph [ref=e239]: "10"
            - generic [ref=e240]:
              - paragraph [ref=e241]: Matches
              - paragraph [ref=e242]: "74"
          - generic [ref=e243]: 2024-03-22 - 2024-05-26
        - generic [ref=e254] [cursor=pointer]:
          - generic [ref=e255]: completed
          - heading "Big Bash League" [level=3] [ref=e264]
          - paragraph [ref=e265]: 2023-24 | T20
          - generic [ref=e266]: Australia
          - generic [ref=e271]:
            - generic [ref=e272]:
              - paragraph [ref=e273]: Teams
              - paragraph [ref=e274]: "8"
            - generic [ref=e275]:
              - paragraph [ref=e276]: Matches
              - paragraph [ref=e277]: "44"
          - generic [ref=e278]: 2023-12-07 - 2024-01-24
        - generic [ref=e289] [cursor=pointer]:
          - generic [ref=e290]: completed
          - heading "ICC Cricket World Cup" [level=3] [ref=e299]
          - paragraph [ref=e300]: 2023 | ODI
          - generic [ref=e301]: India
          - generic [ref=e306]:
            - generic [ref=e307]:
              - paragraph [ref=e308]: Teams
              - paragraph [ref=e309]: "10"
            - generic [ref=e310]:
              - paragraph [ref=e311]: Matches
              - paragraph [ref=e312]: "48"
          - generic [ref=e313]: 2023-10-05 - 2023-11-19
```

# Test source

```ts
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
  166 |         await page.goto(`http://localhost:5173${path}`);
  167 |         await page.waitForLoadState('networkidle');
> 168 |         await page.waitForTimeout(2000);
      |                    ^ Error: page.waitForTimeout: Test ended.
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