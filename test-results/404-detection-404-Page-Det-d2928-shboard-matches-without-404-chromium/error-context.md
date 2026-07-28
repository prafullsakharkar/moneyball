# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /dashboard/matches without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: expect(received).toBeFalsy()

Matcher error: this matcher must not have an expected argument

Expected has type:  string
Expected has value: "Path /dashboard/matches returned 404 or not found message"
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
      - generic [ref=e187]:
        - heading "Match Center" [level=1] [ref=e188]
        - paragraph [ref=e189]: Live scores and match analytics
      - generic [ref=e190]:
        - generic [ref=e195]:
          - generic [ref=e196]: Live
          - generic [ref=e201]:
            - generic [ref=e205]: Chennai
            - generic [ref=e206]: "|"
            - generic [ref=e207]: League
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]: CSK
              - paragraph [ref=e211]: CSK
              - paragraph [ref=e212]:
                - text: 156/4
                - generic [ref=e213]: (17.2)
            - generic [ref=e214]: VS
            - generic [ref=e215]:
              - generic [ref=e216]: MI
              - paragraph [ref=e217]: MI
              - paragraph [ref=e218]:
                - text: 180/6
                - generic [ref=e219]: (20)
          - button "View Live" [ref=e220]
        - generic [ref=e231]:
          - generic [ref=e232]: Live
          - generic [ref=e237]:
            - generic [ref=e241]: Bangalore
            - generic [ref=e242]: "|"
            - generic [ref=e243]: League
          - generic [ref=e244]:
            - generic [ref=e245]:
              - generic [ref=e246]: RCB
              - paragraph [ref=e247]: RCB
              - paragraph [ref=e248]:
                - text: 89/2
                - generic [ref=e249]: (10.4)
            - generic [ref=e250]: VS
            - generic [ref=e251]:
              - generic [ref=e252]: KKR
              - paragraph [ref=e253]: KKR
              - paragraph [ref=e254]:
                - text: 0/0
                - generic [ref=e255]: (0)
          - button "View Live" [ref=e256]
      - generic [ref=e264]:
        - heading "Upcoming Matches" [level=3] [ref=e265]
        - generic [ref=e266]:
          - generic [ref=e267]:
            - generic [ref=e268]:
              - generic [ref=e269]: CSK
              - generic [ref=e270]: vs
              - generic [ref=e271]: MI
            - generic [ref=e272]: Tomorrow, 7:30 PM
          - generic [ref=e273]:
            - generic [ref=e274]:
              - generic [ref=e275]: RCB
              - generic [ref=e276]: vs
              - generic [ref=e277]: KKR
            - generic [ref=e278]: Tomorrow, 3:30 PM
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