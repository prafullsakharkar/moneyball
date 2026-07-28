# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404-detection.spec.ts >> 404 Page Detection Tests >> Navigation Paths - Should All Load Successfully >> should load /dashboard without 404
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
        - generic [ref=e187]:
          - generic [ref=e188]:
            - heading "Dashboard" [level=1] [ref=e189]
            - paragraph [ref=e190]: Cricket Analytics & Tournament Intelligence
          - combobox [ref=e191]:
            - option "IPL 2024" [selected]
            - option "BBL 2023-24"
            - option "World Cup 2023"
        - generic [ref=e192]:
          - generic [ref=e196]:
            - paragraph [ref=e197]: Total Tournaments
            - paragraph [ref=e198]: "3"
            - generic [ref=e199]:
              - generic [ref=e200]: ↑
              - generic [ref=e201]: 10%
          - generic [ref=e213]:
            - paragraph [ref=e214]: Total Teams
            - paragraph [ref=e215]: "28"
            - generic [ref=e216]:
              - generic [ref=e217]: ↑
              - generic [ref=e218]: 5%
          - generic [ref=e229]:
            - paragraph [ref=e230]: Total Players
            - paragraph [ref=e231]: "521"
            - generic [ref=e232]:
              - generic [ref=e233]: ↑
              - generic [ref=e234]: 8%
          - generic [ref=e243]:
            - paragraph [ref=e244]: Total Matches
            - paragraph [ref=e245]: "166"
            - generic [ref=e246]:
              - generic [ref=e247]: ↑
              - generic [ref=e248]: 15%
        - generic [ref=e253]:
          - generic [ref=e257]:
            - paragraph [ref=e258]: Total Runs
            - paragraph [ref=e259]: 128,456
          - generic [ref=e268]:
            - paragraph [ref=e269]: Total Wickets
            - paragraph [ref=e270]: 3,892
          - generic [ref=e280]:
            - paragraph [ref=e281]: Total Boundaries
            - paragraph [ref=e282]: 18,456
          - generic [ref=e290]:
            - paragraph [ref=e291]: Total Sixes
            - paragraph [ref=e292]: 6,823
            - generic [ref=e293]:
              - generic [ref=e294]: ↑
              - generic [ref=e295]: 12%
        - generic [ref=e300]:
          - generic [ref=e302]:
            - heading "Tournament Activity" [level=3] [ref=e303]
            - application [ref=e307]:
              - generic [ref=e325]:
                - generic [ref=e326]:
                  - generic [ref=e327]: Jan
                  - generic [ref=e329]: Feb
                  - generic [ref=e331]: Mar
                  - generic [ref=e333]: Apr
                  - generic [ref=e335]: May
                  - generic [ref=e337]: Jun
                  - generic [ref=e339]: Jul
                  - generic [ref=e341]: Aug
                  - generic [ref=e343]: Sep
                  - generic [ref=e345]: Oct
                  - generic [ref=e347]: Nov
                  - generic [ref=e349]: Dec
                - generic [ref=e351]:
                  - generic [ref=e352]: "0"
                  - generic [ref=e354]: "1500"
                  - generic [ref=e356]: "3000"
                  - generic [ref=e358]: "4500"
                  - generic [ref=e360]: "6000"
          - generic [ref=e365]:
            - heading "Live Stats" [level=3] [ref=e366]
            - generic [ref=e367]:
              - generic [ref=e368]:
                - paragraph [ref=e369]: Live Matches
                - paragraph [ref=e370]: "3"
              - generic [ref=e371]:
                - paragraph [ref=e372]: Avg Run Rate
                - paragraph [ref=e373]: "8.4"
              - generic [ref=e374]:
                - paragraph [ref=e375]: Avg Score
                - paragraph [ref=e376]: "175"
              - generic [ref=e377]:
                - paragraph [ref=e378]: Avg Win Margin
                - paragraph [ref=e379]: "45"
        - generic [ref=e380]:
          - generic [ref=e384]:
            - heading "AI Insights" [level=3] [ref=e395]
            - generic [ref=e396]:
              - generic [ref=e397]:
                - paragraph [ref=e398]: batsman
                - paragraph [ref=e399]: Shubman Gill - Breakthrough Season
                - paragraph [ref=e400]: Gill is having a career-best season with a 50+ average and 150+ strike rate. His ability to rotate strike consistently makes him the MVP contender.
              - generic [ref=e401]:
                - paragraph [ref=e402]: bowler
                - paragraph [ref=e403]: Jasprit Bumrah - Death Over Specialist
                - paragraph [ref=e404]: Bumrah has an economy of just 6.2 in the final 5 overs, the best among all bowlers this season.
              - generic [ref=e405]:
                - paragraph [ref=e406]: captain
                - paragraph [ref=e407]: MS Dhoni - Leadership Impact
                - paragraph [ref=e408]: Under Dhoni, CSK has won 7 of 10 matches when defending totals below 160.
          - generic [ref=e410]:
            - heading "Team Standings" [level=3] [ref=e411]
            - table [ref=e413]:
              - rowgroup [ref=e414]:
                - row [ref=e415]:
                  - columnheader "#" [ref=e416]
                  - columnheader "Team" [ref=e417]
                  - columnheader "P" [ref=e418]
                  - columnheader "W" [ref=e419]
                  - columnheader "L" [ref=e420]
                  - columnheader "Pts" [ref=e421]
                  - columnheader "NRR" [ref=e422]
              - rowgroup [ref=e423]:
                - row [ref=e424]:
                  - cell "1" [ref=e425]
                  - cell "C Chennai Super Kings" [ref=e427]:
                    - generic [ref=e428]:
                      - generic [ref=e429]: C
                      - generic [ref=e430]: Chennai Super Kings
                  - cell "14" [ref=e431]
                  - cell "10" [ref=e432]
                  - cell "4" [ref=e433]
                  - cell "20" [ref=e434]
                  - cell "+0.765" [ref=e435]
                - row [ref=e436]:
                  - cell "2" [ref=e437]
                  - cell "G Gujarat Titans" [ref=e439]:
                    - generic [ref=e440]:
                      - generic [ref=e441]: G
                      - generic [ref=e442]: Gujarat Titans
                  - cell "14" [ref=e443]
                  - cell "9" [ref=e444]
                  - cell "4" [ref=e445]
                  - cell "18" [ref=e446]
                  - cell "+0.567" [ref=e447]
                - row [ref=e448]:
                  - cell "3" [ref=e449]
                  - cell "R Royal Challengers Bangalore" [ref=e451]:
                    - generic [ref=e452]:
                      - generic [ref=e453]: R
                      - generic [ref=e454]: Royal Challengers Bangalore
                  - cell "14" [ref=e455]
                  - cell "8" [ref=e456]
                  - cell "5" [ref=e457]
                  - cell "17" [ref=e458]
                  - cell "+0.432" [ref=e459]
                - row [ref=e460]:
                  - cell "4" [ref=e461]
                  - cell "S Sunrisers Hyderabad" [ref=e463]:
                    - generic [ref=e464]:
                      - generic [ref=e465]: S
                      - generic [ref=e466]: Sunrisers Hyderabad
                  - cell "14" [ref=e467]
                  - cell "9" [ref=e468]
                  - cell "5" [ref=e469]
                  - cell "18" [ref=e470]
                  - cell "+0.845" [ref=e471]
                - row [ref=e472]:
                  - cell "5" [ref=e473]
                  - cell "M Mumbai Indians" [ref=e475]:
                    - generic [ref=e476]:
                      - generic [ref=e477]: M
                      - generic [ref=e478]: Mumbai Indians
                  - cell "14" [ref=e479]
                  - cell "7" [ref=e480]
                  - cell "7" [ref=e481]
                  - cell "14" [ref=e482]
                  - cell "+0.123" [ref=e483]
        - generic [ref=e484]:
          - generic [ref=e486]:
            - generic [ref=e492]:
              - heading "Orange Cap" [level=3] [ref=e493]
              - paragraph [ref=e494]: Top Run Scorers
            - generic [ref=e495]:
              - generic [ref=e496]:
                - generic [ref=e497]: "1"
                - generic [ref=e498]:
                  - paragraph [ref=e499]: Shubman Gill
                  - paragraph [ref=e500]: GT
                - paragraph [ref=e501]: "890"
              - generic [ref=e502]:
                - generic [ref=e503]: "2"
                - generic [ref=e504]:
                  - paragraph [ref=e505]: Virat Kohli
                  - paragraph [ref=e506]: RCB
                - paragraph [ref=e507]: "784"
              - generic [ref=e508]:
                - generic [ref=e509]: "3"
                - generic [ref=e510]:
                  - paragraph [ref=e511]: Rohit Sharma
                  - paragraph [ref=e512]: MI
                - paragraph [ref=e513]: "654"
              - generic [ref=e514]:
                - generic [ref=e515]: "4"
                - generic [ref=e516]:
                  - paragraph [ref=e517]: Ravindra Jadeja
                  - paragraph [ref=e518]: CSK
                - paragraph [ref=e519]: "632"
              - generic [ref=e520]:
                - generic [ref=e521]: "5"
                - generic [ref=e522]:
                  - paragraph [ref=e523]: Hardik Pandya
                  - paragraph [ref=e524]: GT
                - paragraph [ref=e525]: "598"
          - generic [ref=e527]:
            - generic [ref=e534]:
              - heading "Purple Cap" [level=3] [ref=e535]
              - paragraph [ref=e536]: Top Wicket Takers
            - generic [ref=e537]:
              - generic [ref=e538]:
                - generic [ref=e539]: "1"
                - generic [ref=e540]:
                  - paragraph [ref=e541]: Jasprit Bumrah
                  - paragraph [ref=e542]: MI
                - paragraph [ref=e543]: "32"
              - generic [ref=e544]:
                - generic [ref=e545]: "2"
                - generic [ref=e546]:
                  - paragraph [ref=e547]: Yuzvendra Chahal
                  - paragraph [ref=e548]: SRH
                - paragraph [ref=e549]: "28"
              - generic [ref=e550]:
                - generic [ref=e551]: "3"
                - generic [ref=e552]:
                  - paragraph [ref=e553]: Ravindra Jadeja
                  - paragraph [ref=e554]: CSK
                - paragraph [ref=e555]: "24"
              - generic [ref=e556]:
                - generic [ref=e557]: "4"
                - generic [ref=e558]:
                  - paragraph [ref=e559]: MS Dhoni
                  - paragraph [ref=e560]: CSK
                - paragraph [ref=e561]: "22"
        - generic [ref=e565]:
          - heading "MVP Rankings" [level=3] [ref=e569]
          - generic [ref=e570]:
            - generic [ref=e571]:
              - generic [ref=e572]: "1"
              - paragraph [ref=e573]: Hardik Pandya
              - paragraph [ref=e574]: GT
              - paragraph [ref=e575]: "479"
              - paragraph [ref=e576]: MVP Points
            - generic [ref=e577]:
              - generic [ref=e578]: "2"
              - paragraph [ref=e579]: Ravindra Jadeja
              - paragraph [ref=e580]: CSK
              - paragraph [ref=e581]: "468"
              - paragraph [ref=e582]: MVP Points
            - generic [ref=e583]:
              - generic [ref=e584]: "3"
              - paragraph [ref=e585]: Shubman Gill
              - paragraph [ref=e586]: GT
              - paragraph [ref=e587]: "443"
              - paragraph [ref=e588]: MVP Points
            - generic [ref=e589]:
              - generic [ref=e590]: "4"
              - paragraph [ref=e591]: Rohit Sharma
              - paragraph [ref=e592]: MI
              - paragraph [ref=e593]: "408"
              - paragraph [ref=e594]: MVP Points
            - generic [ref=e595]:
              - generic [ref=e596]: "5"
              - paragraph [ref=e597]: Jasprit Bumrah
              - paragraph [ref=e598]: MI
              - paragraph [ref=e599]: "368"
              - paragraph [ref=e600]: MVP Points
  - generic [ref=e601]: "0"
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