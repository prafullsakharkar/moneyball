# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /captains/analytics without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:5173/captains/analytics", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - generic [ref=e188]:
          - heading "Captain Analytics" [level=1] [ref=e189]
          - paragraph [ref=e190]: Premier leadership intelligence
        - generic [ref=e194]:
          - generic [ref=e199]:
            - heading "Captain Rankings" [level=3] [ref=e200]
            - paragraph [ref=e201]: Based on Leadership Score
          - generic [ref=e202]:
            - generic [ref=e203]:
              - generic [ref=e204]: "1"
              - paragraph [ref=e205]: MS Dhoni
              - paragraph [ref=e206]: CSK
              - generic [ref=e207]:
                - paragraph [ref=e208]: "87.5"
                - paragraph [ref=e209]: Leadership Score
            - generic [ref=e210]:
              - generic [ref=e211]: "2"
              - paragraph [ref=e212]: Hardik Pandya
              - paragraph [ref=e213]: GT
              - generic [ref=e214]:
                - paragraph [ref=e215]: "82.1"
                - paragraph [ref=e216]: Leadership Score
            - generic [ref=e217]:
              - generic [ref=e218]: "3"
              - paragraph [ref=e219]: Rohit Sharma
              - paragraph [ref=e220]: MI
              - generic [ref=e221]:
                - paragraph [ref=e222]: "72.3"
                - paragraph [ref=e223]: Leadership Score
        - generic [ref=e225]:
          - heading "All Captains" [level=3] [ref=e226]
          - table [ref=e228]:
            - rowgroup [ref=e229]:
              - row [ref=e230]:
                - columnheader "Captain" [ref=e231]
                - columnheader "Team" [ref=e232]
                - columnheader "Matches" [ref=e233]
                - columnheader "Wins" [ref=e234]
                - columnheader "Losses" [ref=e235]
                - columnheader "Win %" [ref=e236]
                - columnheader "Score" [ref=e237]
            - rowgroup [ref=e238]:
              - row [ref=e239]:
                - cell "MD MS Dhoni" [ref=e240]:
                  - generic [ref=e241]:
                    - generic [ref=e242]: MD
                    - generic [ref=e243]: MS Dhoni
                - cell "CSK" [ref=e244]
                - cell "14" [ref=e245]
                - cell "10" [ref=e246]
                - cell "4" [ref=e247]
                - cell "71.4%" [ref=e248]
                - cell "87.5" [ref=e250]
              - row [ref=e251]:
                - cell "HP Hardik Pandya" [ref=e252]:
                  - generic [ref=e253]:
                    - generic [ref=e254]: HP
                    - generic [ref=e255]: Hardik Pandya
                - cell "GT" [ref=e256]
                - cell "14" [ref=e257]
                - cell "9" [ref=e258]
                - cell "5" [ref=e259]
                - cell "64.3%" [ref=e260]
                - cell "82.1" [ref=e262]
              - row [ref=e263]:
                - cell "RS Rohit Sharma" [ref=e264]:
                  - generic [ref=e265]:
                    - generic [ref=e266]: RS
                    - generic [ref=e267]: Rohit Sharma
                - cell "MI" [ref=e268]
                - cell "14" [ref=e269]
                - cell "7" [ref=e270]
                - cell "7" [ref=e271]
                - cell "50.0%" [ref=e272]
                - cell "72.3" [ref=e274]
        - generic [ref=e275]:
          - generic [ref=e277]:
            - heading "Leadership Radar" [level=3] [ref=e278]
            - application [ref=e282]:
              - generic [ref=e295]:
                - generic [ref=e298]:
                  - generic [ref=e299]: Wins
                  - generic [ref=e301]: Toss
                  - generic [ref=e304]: Chase
                  - generic [ref=e307]: Defense
                  - generic [ref=e310]: Adaptation
                - generic [ref=e315]:
                  - generic [ref=e316]: "0"
                  - generic [ref=e318]: "25"
                  - generic [ref=e320]: "50"
                  - generic [ref=e322]: "75"
                  - generic [ref=e324]: "100"
          - generic [ref=e327]:
            - heading "Win Rate Trend" [level=3] [ref=e328]
            - application [ref=e332]:
              - generic [ref=e352]:
                - generic [ref=e353]:
                  - generic [ref=e354]: "1"
                  - generic [ref=e356]: "2"
                  - generic [ref=e358]: "3"
                  - generic [ref=e360]: "4"
                  - generic [ref=e362]: "5"
                  - generic [ref=e364]: "6"
                  - generic [ref=e366]: "7"
                  - generic [ref=e368]: "8"
                - generic [ref=e370]:
                  - generic [ref=e371]: "0"
                  - generic [ref=e373]: "1500"
                  - generic [ref=e375]: "3000"
                  - generic [ref=e377]: "4500"
                  - generic [ref=e379]: "6000"
  - generic [ref=e381]: "0"
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