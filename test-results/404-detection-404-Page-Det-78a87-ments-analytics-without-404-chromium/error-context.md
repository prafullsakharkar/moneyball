# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /tournaments/analytics without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: expect(received).toBeFalsy()

Matcher error: this matcher must not have an expected argument

Expected has type:  string
Expected has value: "Path /tournaments/analytics returned 404 or not found message"
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
      - generic [ref=e84]:
        - button "Analytics" [ref=e85]
        - generic [ref=e92]:
          - button "Team" [ref=e93]
          - button "Player" [ref=e100]
          - button "Match" [ref=e105]
          - button "Tournament" [ref=e109]
          - button "AI" [ref=e117]
      - button "Video Analysis" [ref=e128]
      - button "Academy" [ref=e136]
      - button "Training" [ref=e144]
      - button "Auction" [ref=e155]
      - button "Fantasy" [ref=e166]
      - button "Notifications" [ref=e172]
      - button "Sponsorship" [ref=e177]
      - button "Monetization" [ref=e181]
      - button "Reports" [ref=e185]
      - button "Administration" [ref=e192]
      - button "More" [ref=e210]
    - generic [ref=e218]:
      - generic [ref=e219]: A
      - generic [ref=e220]:
        - paragraph [ref=e221]: Admin User
        - paragraph [ref=e222]: v1.0.0
  - banner [ref=e223]:
    - button "Search players, teams... ⌘K" [ref=e224]:
      - generic [ref=e228]: Search players, teams...
      - generic [ref=e229]: ⌘K
    - generic [ref=e230]:
      - button [ref=e231]
      - button "AI Assistant" [ref=e234]
      - button [ref=e237]
      - generic [ref=e242]: A
  - main [ref=e243]:
    - generic [ref=e246]:
      - generic [ref=e247]:
        - heading "Tournaments" [level=1] [ref=e248]
        - paragraph [ref=e249]: Manage and analyze all cricket tournaments
      - generic [ref=e250]:
        - generic [ref=e255] [cursor=pointer]:
          - generic [ref=e256]: completed
          - heading "Indian Premier League" [level=3] [ref=e265]
          - paragraph [ref=e266]: 2024 | T20
          - generic [ref=e267]: India
          - generic [ref=e272]:
            - generic [ref=e273]:
              - paragraph [ref=e274]: Teams
              - paragraph [ref=e275]: "10"
            - generic [ref=e276]:
              - paragraph [ref=e277]: Matches
              - paragraph [ref=e278]: "74"
          - generic [ref=e279]: 2024-03-22 - 2024-05-26
        - generic [ref=e290] [cursor=pointer]:
          - generic [ref=e291]: completed
          - heading "Big Bash League" [level=3] [ref=e300]
          - paragraph [ref=e301]: 2023-24 | T20
          - generic [ref=e302]: Australia
          - generic [ref=e307]:
            - generic [ref=e308]:
              - paragraph [ref=e309]: Teams
              - paragraph [ref=e310]: "8"
            - generic [ref=e311]:
              - paragraph [ref=e312]: Matches
              - paragraph [ref=e313]: "44"
          - generic [ref=e314]: 2023-12-07 - 2024-01-24
        - generic [ref=e325] [cursor=pointer]:
          - generic [ref=e326]: completed
          - heading "ICC Cricket World Cup" [level=3] [ref=e335]
          - paragraph [ref=e336]: 2023 | ODI
          - generic [ref=e337]: India
          - generic [ref=e342]:
            - generic [ref=e343]:
              - paragraph [ref=e344]: Teams
              - paragraph [ref=e345]: "10"
            - generic [ref=e346]:
              - paragraph [ref=e347]: Matches
              - paragraph [ref=e348]: "48"
          - generic [ref=e349]: 2023-10-05 - 2023-11-19
```

# Test source

```ts
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
  168 |         await page.waitForTimeout(2000);
  169 | 
  170 |         // Check for 404 indicators
  171 |         const bodyText = await page.evaluate(() => document.body.innerText);
  172 |         const has404 = bodyText.toLowerCase().includes('page not found') || 
  173 |                       bodyText.toLowerCase().includes('404') ||
  174 |                       bodyText.toLowerCase().includes('not found');
  175 | 
> 176 |         expect(has404).toBeFalsy(`Path ${path} returned 404 or not found message`);
      |                        ^ Error: expect(received).toBeFalsy()
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