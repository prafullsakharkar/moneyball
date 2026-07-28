# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /analytics/predictions/enhanced without 404
- Location: tests/e2e/404-detection.spec.ts:165:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:5173/analytics/predictions/enhanced", waiting until "load"

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
        - generic [ref=e188]:
          - heading "AI Analytics" [level=1] [ref=e189]
          - paragraph [ref=e190]: Machine learning powered cricket intelligence
        - generic [ref=e191]: AI Powered
      - generic [ref=e200]:
        - generic [ref=e204]:
          - paragraph [ref=e205]: Patterns Detected
          - paragraph [ref=e206]: "4"
        - generic [ref=e215]:
          - paragraph [ref=e216]: Prediction Accuracy
          - paragraph [ref=e217]: 94.2%
        - generic [ref=e221]:
          - paragraph [ref=e222]: Strategies Generated
          - paragraph [ref=e223]: "1"
        - generic [ref=e231]:
          - paragraph [ref=e232]: Anomalies Found
          - paragraph [ref=e233]: "0"
      - generic [ref=e238]:
        - button "AI Insights" [ref=e239]
        - button "Predictions" [ref=e243]
        - button "Strategies" [ref=e252]
        - button "Anomalies" [ref=e255]
      - generic [ref=e260]:
        - generic [ref=e264]:
          - generic [ref=e271]:
            - heading "Batting Form Analysis" [level=3] [ref=e272]
            - paragraph [ref=e273]: AI-detected patterns and recommendations
          - generic [ref=e274]:
            - generic [ref=e276]:
              - generic [ref=e277]: SG
              - generic [ref=e278]:
                - generic [ref=e279]:
                  - paragraph [ref=e280]: Shubman Gill
                  - generic [ref=e281]:
                    - generic [ref=e282]: Confidence
                    - generic [ref=e283]: 92%
                - paragraph [ref=e284]: "Unusually high dot ball percentage (38%) against left-arm spin. Recommendation: Practice against LAM spinners."
            - generic [ref=e286]:
              - generic [ref=e287]: VK
              - generic [ref=e288]:
                - generic [ref=e289]:
                  - paragraph [ref=e290]: Virat Kohli
                  - generic [ref=e291]:
                    - generic [ref=e292]: Confidence
                    - generic [ref=e293]: 88%
                - paragraph [ref=e294]: Strike rate drops 18% in death overs. Recommend aggressive rotation strategy.
            - generic [ref=e296]:
              - generic [ref=e297]: RS
              - generic [ref=e298]:
                - generic [ref=e299]:
                  - paragraph [ref=e300]: Rohit Sharma
                  - generic [ref=e301]:
                    - generic [ref=e302]: Confidence
                    - generic [ref=e303]: 95%
                - paragraph [ref=e304]: Best against pace bowling - averages 52.3 vs pace, 28.1 vs spin.
        - generic [ref=e308]:
          - generic [ref=e313]:
            - heading "Bowling Matchup Insights" [level=3] [ref=e314]
            - paragraph [ref=e315]: AI-detected patterns and recommendations
          - generic [ref=e316]:
            - generic [ref=e318]:
              - generic [ref=e319]: JB
              - generic [ref=e320]:
                - generic [ref=e321]:
                  - paragraph [ref=e322]: Jasprit Bumrah
                  - generic [ref=e323]:
                    - generic [ref=e324]: Confidence
                    - generic [ref=e325]: 91%
                - paragraph [ref=e326]: Most effective in first 6 overs - economy 5.2 with 56% dot balls.
            - generic [ref=e328]:
              - generic [ref=e329]: YC
              - generic [ref=e330]:
                - generic [ref=e331]:
                  - paragraph [ref=e332]: Yuzvendra Chahal
                  - generic [ref=e333]:
                    - generic [ref=e334]: Confidence
                    - generic [ref=e335]: 84%
                - paragraph [ref=e336]: Struggles against left-handed batsmen. Economy rises from 7.1 to 9.8.
            - generic [ref=e338]:
              - generic [ref=e339]: RJ
              - generic [ref=e340]:
                - generic [ref=e341]:
                  - paragraph [ref=e342]: Ravindra Jadeja
                  - generic [ref=e343]:
                    - generic [ref=e344]: Confidence
                    - generic [ref=e345]: 89%
                - paragraph [ref=e346]: Best impact in middle overs - taking 2.3 wickets per innings avg.
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