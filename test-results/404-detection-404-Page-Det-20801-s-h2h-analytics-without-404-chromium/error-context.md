# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /matches/h2h/analytics without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:5173/matches/h2h/analytics", waiting until "load"

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
      - generic [ref=e76]:
        - button "Matches 12" [ref=e77]:
          - generic [ref=e80]: Matches
          - generic [ref=e81]: "12"
        - generic [ref=e85]:
          - button "Match Center" [ref=e86]
          - button "Match Analytics" [ref=e90]
          - button "Head to Head" [ref=e94]
          - button "H2H Analytics" [ref=e101]
      - button "Analytics" [ref=e106]
      - button "Video Analysis" [ref=e113]
      - button "Academy" [ref=e121]
      - button "Training" [ref=e129]
      - button "Auction" [ref=e140]
      - button "Fantasy" [ref=e151]
      - button "Notifications" [ref=e157]
      - button "Sponsorship" [ref=e162]
      - button "Monetization" [ref=e166]
      - button "Reports" [ref=e170]
      - button "Administration" [ref=e177]
      - button "More" [ref=e195]
    - generic [ref=e203]:
      - generic [ref=e204]: A
      - generic [ref=e205]:
        - paragraph [ref=e206]: Admin User
        - paragraph [ref=e207]: v1.0.0
  - banner [ref=e208]:
    - button "Search players, teams... ⌘K" [ref=e209]:
      - generic [ref=e213]: Search players, teams...
      - generic [ref=e214]: ⌘K
    - generic [ref=e215]:
      - button [ref=e216]
      - button "AI Assistant" [ref=e219]
      - button [ref=e222]
      - generic [ref=e227]: A
  - main [ref=e228]:
    - generic [ref=e231]:
      - generic [ref=e232]:
        - heading "Match Center" [level=1] [ref=e233]
        - paragraph [ref=e234]: Live scores and match analytics
      - generic [ref=e235]:
        - generic [ref=e240]:
          - generic [ref=e241]: Live
          - generic [ref=e246]:
            - generic [ref=e250]: Chennai
            - generic [ref=e251]: "|"
            - generic [ref=e252]: League
          - generic [ref=e253]:
            - generic [ref=e254]:
              - generic [ref=e255]: CSK
              - paragraph [ref=e256]: CSK
              - paragraph [ref=e257]:
                - text: 156/4
                - generic [ref=e258]: (17.2)
            - generic [ref=e259]: VS
            - generic [ref=e260]:
              - generic [ref=e261]: MI
              - paragraph [ref=e262]: MI
              - paragraph [ref=e263]:
                - text: 180/6
                - generic [ref=e264]: (20)
          - button "View Live" [ref=e265]
        - generic [ref=e276]:
          - generic [ref=e277]: Live
          - generic [ref=e282]:
            - generic [ref=e286]: Bangalore
            - generic [ref=e287]: "|"
            - generic [ref=e288]: League
          - generic [ref=e289]:
            - generic [ref=e290]:
              - generic [ref=e291]: RCB
              - paragraph [ref=e292]: RCB
              - paragraph [ref=e293]:
                - text: 89/2
                - generic [ref=e294]: (10.4)
            - generic [ref=e295]: VS
            - generic [ref=e296]:
              - generic [ref=e297]: KKR
              - paragraph [ref=e298]: KKR
              - paragraph [ref=e299]:
                - text: 0/0
                - generic [ref=e300]: (0)
          - button "View Live" [ref=e301]
      - generic [ref=e309]:
        - heading "Upcoming Matches" [level=3] [ref=e310]
        - generic [ref=e311]:
          - generic [ref=e312]:
            - generic [ref=e313]:
              - generic [ref=e314]: CSK
              - generic [ref=e315]: vs
              - generic [ref=e316]: MI
            - generic [ref=e317]: Tomorrow, 7:30 PM
          - generic [ref=e318]:
            - generic [ref=e319]:
              - generic [ref=e320]: RCB
              - generic [ref=e321]: vs
              - generic [ref=e322]: KKR
            - generic [ref=e323]: Tomorrow, 3:30 PM
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