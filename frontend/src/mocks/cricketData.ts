/**
 * Cricket Mock Data
 * ============================================
 * Seed data for the Competition, Participants, Media, and Intelligence
 * domains. Used by MSW handlers for development and testing.
 */
import type {
  Match,
  Team,
  Tournament,
  AnalyticsQuestion,
  AnalyticsInsight,
  AiInsight,
  AiConversationMessage,
  MediaAsset,
  VideoAsset,
} from '@domain/index';

/* ── Teams ────────────────────────────────────────────── */

export const mockTeams: Team[] = [
  {
    id: 'team_001',
    organizationId: 'org_001',
    name: 'Sydney Thunder',
    shortName: 'THU',
    code: 'THU',
    color: '#A3E635',
    homeGround: 'Sydney Showground',
    coach: 'Trevor Bayliss',
    captainId: 'ply_001',
    captainName: 'David Warner',
    founded: 2011,
    played: 12,
    won: 8,
    lost: 3,
    tied: 0,
    noResult: 1,
    points: 17,
    netRunRate: 0.84,
    form: ['W', 'W', 'L', 'W', 'N'],
    squad: [
      { playerId: 'ply_001', playerName: 'David Warner', role: 'Batter', jerseyNumber: 31, inPlayingXI: true },
      { playerId: 'ply_002', playerName: 'Pat Cummins', role: 'Bowler', jerseyNumber: 30, inPlayingXI: true },
      { playerId: 'ply_003', playerName: 'Glenn Maxwell', role: 'All-rounder', jerseyNumber: 32, inPlayingXI: true },
      { playerId: 'ply_004', playerName: 'Alex Carey', role: 'Wicketkeeper', jerseyNumber: 4, inPlayingXI: true },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'team_002',
    organizationId: 'org_001',
    name: 'Melbourne Stars',
    shortName: 'STA',
    code: 'STA',
    color: '#60A5FA',
    homeGround: 'Melbourne Cricket Ground',
    coach: 'Greg Shipperd',
    captainId: 'ply_005',
    captainName: 'Marcus Stoinis',
    founded: 2011,
    played: 12,
    won: 6,
    lost: 6,
    tied: 0,
    noResult: 0,
    points: 12,
    netRunRate: -0.12,
    form: ['L', 'W', 'L', 'W', 'W'],
    squad: [
      { playerId: 'ply_005', playerName: 'Marcus Stoinis', role: 'All-rounder', jerseyNumber: 17, inPlayingXI: true },
      { playerId: 'ply_006', playerName: 'Adam Zampa', role: 'Bowler', jerseyNumber: 88, inPlayingXI: true },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'team_003',
    organizationId: 'org_001',
    name: 'Brisbane Heat',
    shortName: 'HEA',
    code: 'HEA',
    color: '#F87171',
    homeGround: 'The Gabba',
    coach: 'Wade Seccombe',
    captainId: 'ply_007',
    captainName: 'Usman Khawaja',
    founded: 2011,
    played: 12,
    won: 7,
    lost: 5,
    tied: 0,
    noResult: 0,
    points: 14,
    netRunRate: 0.31,
    form: ['W', 'L', 'W', 'W', 'L'],
    squad: [
      { playerId: 'ply_007', playerName: 'Usman Khawaja', role: 'Batter', jerseyNumber: 1, inPlayingXI: true },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/* ── Matches ──────────────────────────────────────────── */

export const mockMatches: Match[] = [
  {
    id: 'match_001',
    organizationId: 'org_001',
    tournamentId: 'tour_001',
    tournamentName: 'Big Bash League 2024',
    seasonId: 'season_001',
    seasonName: 'BBL 2024',
    format: 't20',
    state: 'live',
    label: 'Match 24',
    venue: 'Sydney Showground',
    city: 'Sydney',
    country: 'Australia',
    startTime: '2024-01-15T08:30:00Z',
    inningsCount: 2,
    target: 178,
    requiredRate: 8.4,
    currentInnings: 2,
    tossWinnerId: 'team_001',
    tossDecision: 'bowl',
    teams: [
      { id: 'team_001', name: 'Sydney Thunder', shortName: 'THU', runs: 177, wickets: 6, overs: 20, runRate: 8.85, batting: false, winner: false },
      { id: 'team_002', name: 'Melbourne Stars', shortName: 'STA', runs: 142, wickets: 4, overs: 16.3, runRate: 8.6, batting: true },
    ],
    innings: [
      {
        number: 1,
        battingTeamId: 'team_001',
        bowlingTeamId: 'team_002',
        runs: 177,
        wickets: 6,
        overs: 20,
        runRate: 8.85,
        status: 'completed',
        batting: [
          { playerId: 'ply_001', playerName: 'David Warner', dismissal: 'c Stoinis b Zampa', runs: 68, balls: 42, fours: 7, sixes: 3, strikeRate: 161.9, position: 1 },
          { playerId: 'ply_003', playerName: 'Glenn Maxwell', dismissal: 'not out', runs: 45, balls: 28, fours: 4, sixes: 2, strikeRate: 160.7, notOut: true, position: 3 },
        ],
        bowling: [
          { playerId: 'ply_006', playerName: 'Adam Zampa', overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.0, wides: 1, noBalls: 0 },
        ],
        fallOfWickets: [
          { wicket: 1, score: 45, overs: 5.2, playerId: 'ply_002', playerName: 'Pat Cummins' },
        ],
        partnerships: [
          { wicket: 1, runs: 45, balls: 32, player1Id: 'ply_001', player1Name: 'David Warner', player2Id: 'ply_002', player2Name: 'Pat Cummins' },
        ],
        extras: { wides: 4, noBalls: 1, byes: 2, legByes: 3, penalty: 0, total: 10 },
        powerplays: [
          { label: 'Powerplay 1', fromOver: 1, toOver: 6, runs: 52, wickets: 1 },
        ],
      },
      {
        number: 2,
        battingTeamId: 'team_002',
        bowlingTeamId: 'team_001',
        runs: 142,
        wickets: 4,
        overs: 16.3,
        runRate: 8.6,
        status: 'in_progress',
        batting: [
          { playerId: 'ply_005', playerName: 'Marcus Stoinis', dismissal: 'not out', runs: 58, balls: 38, fours: 5, sixes: 2, strikeRate: 152.6, notOut: true, position: 1 },
        ],
        bowling: [
          { playerId: 'ply_002', playerName: 'Pat Cummins', overs: 3.3, maidens: 0, runs: 28, wickets: 2, economy: 8.0, wides: 2, noBalls: 0 },
        ],
        fallOfWickets: [],
        partnerships: [],
        extras: { wides: 3, noBalls: 0, byes: 1, legByes: 2, penalty: 0, total: 6 },
        powerplays: [],
      },
    ],
    commentary: [
      { id: 'com_001', over: 16, ball: 3, runs: 4, text: 'FOUR! Stoinis drives through the covers.', batterId: 'ply_005', bowlerId: 'ply_002', timestamp: '2024-01-15T10:12:00Z' },
    ],
    isLive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T10:12:00Z',
  },
  {
    id: 'match_002',
    organizationId: 'org_001',
    tournamentId: 'tour_001',
    tournamentName: 'Big Bash League 2024',
    seasonId: 'season_001',
    seasonName: 'BBL 2024',
    format: 't20',
    state: 'completed',
    label: 'Match 22',
    venue: 'The Gabba',
    city: 'Brisbane',
    country: 'Australia',
    startTime: '2024-01-13T08:30:00Z',
    inningsCount: 2,
    result: 'Sydney Thunder won by 24 runs',
    tossWinnerId: 'team_003',
    tossDecision: 'bat',
    teams: [
      { id: 'team_003', name: 'Brisbane Heat', shortName: 'HEA', runs: 153, wickets: 8, overs: 20, runRate: 7.65, winner: false },
      { id: 'team_001', name: 'Sydney Thunder', shortName: 'THU', runs: 177, wickets: 5, overs: 20, runRate: 8.85, winner: true },
    ],
    innings: [
      {
        number: 1,
        battingTeamId: 'team_001',
        bowlingTeamId: 'team_003',
        runs: 177,
        wickets: 5,
        overs: 20,
        runRate: 8.85,
        status: 'completed',
        batting: [
          { playerId: 'ply_001', playerName: 'David Warner', dismissal: 'c Khawaja b Steketee', runs: 82, balls: 50, fours: 9, sixes: 4, strikeRate: 164.0, position: 1 },
        ],
        bowling: [],
        fallOfWickets: [],
        partnerships: [],
        extras: { wides: 2, noBalls: 0, byes: 0, legByes: 1, penalty: 0, total: 3 },
        powerplays: [],
      },
      {
        number: 2,
        battingTeamId: 'team_003',
        bowlingTeamId: 'team_001',
        runs: 153,
        wickets: 8,
        overs: 20,
        runRate: 7.65,
        status: 'completed',
        batting: [
          { playerId: 'ply_007', playerName: 'Usman Khawaja', dismissal: 'c Carey b Cummins', runs: 44, balls: 34, fours: 5, sixes: 1, strikeRate: 129.4, position: 1 },
        ],
        bowling: [
          { playerId: 'ply_002', playerName: 'Pat Cummins', overs: 4, maidens: 0, runs: 26, wickets: 3, economy: 6.5, wides: 1, noBalls: 0 },
        ],
        fallOfWickets: [],
        partnerships: [],
        extras: { wides: 3, noBalls: 1, byes: 0, legByes: 2, penalty: 0, total: 6 },
        powerplays: [],
      },
    ],
    commentary: [],
    isLive: false,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-13T11:00:00Z',
  },
  {
    id: 'match_003',
    organizationId: 'org_001',
    tournamentId: 'tour_001',
    tournamentName: 'Big Bash League 2024',
    seasonId: 'season_001',
    seasonName: 'BBL 2024',
    format: 't20',
    state: 'scheduled',
    label: 'Match 28',
    venue: 'Melbourne Cricket Ground',
    city: 'Melbourne',
    country: 'Australia',
    startTime: '2024-01-18T08:30:00Z',
    inningsCount: 2,
    tossWinnerId: undefined,
    teams: [
      { id: 'team_002', name: 'Melbourne Stars', shortName: 'STA', runs: 0, wickets: 0, overs: 0 },
      { id: 'team_003', name: 'Brisbane Heat', shortName: 'HEA', runs: 0, wickets: 0, overs: 0 },
    ],
    innings: [],
    commentary: [],
    isLive: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

/* ── Tournaments ──────────────────────────────────────── */

export const mockTournaments: Tournament[] = [
  {
    id: 'tour_001',
    organizationId: 'org_001',
    name: 'Big Bash League 2024',
    shortName: 'BBL 2024',
    format: 'league',
    formatLabel: 'League',
    season: '2024',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-02-15T00:00:00Z',
    status: 'active',
    teamsCount: 8,
    matchesCount: 56,
    standings: [
      { teamId: 'team_001', teamName: 'Sydney Thunder', played: 12, won: 8, lost: 3, tied: 0, noResult: 1, points: 17, netRunRate: 0.84, form: ['W', 'W', 'L', 'W', 'N'] },
      { teamId: 'team_003', teamName: 'Brisbane Heat', played: 12, won: 7, lost: 5, tied: 0, noResult: 0, points: 14, netRunRate: 0.31, form: ['W', 'L', 'W', 'W', 'L'] },
      { teamId: 'team_002', teamName: 'Melbourne Stars', played: 12, won: 6, lost: 6, tied: 0, noResult: 0, points: 12, netRunRate: -0.12, form: ['L', 'W', 'L', 'W', 'W'] },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

/* ── Analytics ────────────────────────────────────────── */

export const mockAnalyticsQuestions: AnalyticsQuestion[] = [
  {
    id: 'aq_001',
    question: 'What changed in the last 5 matches?',
    answer: 'The batting strike rate improved from 128 to 152, driven by a more aggressive powerplay approach.',
    evidence: ['Strike rate: 128 → 152', 'Powerplay runs: 42 → 58'],
    category: 'change',
  },
  {
    id: 'aq_002',
    question: 'Why did bowling performance decline?',
    answer: 'Economy rate rose from 7.2 to 8.6 in the death overs (16-20), largely due to slower-ball execution issues.',
    evidence: ['Death over economy: 7.2 → 8.6'],
    category: 'performance',
  },
  {
    id: 'aq_003',
    question: 'Who is improving?',
    answer: 'Glenn Maxwell has increased his boundary percentage from 18% to 27% over the season.',
    evidence: ['Boundary %: 18% → 27%'],
    category: 'improving',
  },
  {
    id: 'aq_004',
    question: 'Where is the team losing matches?',
    answer: 'The team has lost 4 of 5 matches when conceding more than 40 runs in the final 4 overs.',
    evidence: ['Losses when conceding 40+ in final 4 overs: 4/5'],
    category: 'location',
  },
];

export const mockAnalyticsInsights: AnalyticsInsight[] = [
  {
    id: 'ai_001',
    title: 'Powerplay aggression paying off',
    description: 'Increased boundary rate in the first 6 overs correlates with higher win probability.',
    severity: 'positive',
    metric: 'Powerplay run rate',
    change: 1.4,
    trend: [
      { label: 'M1', value: 7.2 },
      { label: 'M2', value: 7.8 },
      { label: 'M3', value: 8.1 },
      { label: 'M4', value: 8.6 },
      { label: 'M5', value: 9.0 },
    ],
  },
  {
    id: 'ai_002',
    title: 'Death over economy slipping',
    description: 'Economy in overs 16-20 has risen steadily, a concern for close finishes.',
    severity: 'negative',
    metric: 'Death over economy',
    change: -1.4,
    trend: [
      { label: 'M1', value: 7.2 },
      { label: 'M2', value: 7.6 },
      { label: 'M3', value: 8.0 },
      { label: 'M4', value: 8.3 },
      { label: 'M5', value: 8.6 },
    ],
  },
];

/* ── AI / Insights ────────────────────────────────────── */

export const mockAiInsights: AiInsight[] = [
  {
    id: 'ins_001',
    source: 'generated',
    title: 'Maxwell is the key to a strong finish',
    body: 'Glenn Maxwell has scored 45% of his runs in the final 5 overs this season. Protecting his wicket until the 15th over maximizes the team total.',
    context: 'match_001',
    supportingStats: [
      { label: 'Runs in final 5 overs', value: '212' },
      { label: 'Strike rate', value: '168.4' },
    ],
    confidence: 0.87,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ins_002',
    source: 'verified',
    title: 'Cummins leads wicket tally',
    body: 'Pat Cummins is the leading wicket-taker with 18 wickets at an average of 18.2.',
    context: 'tour_001',
    supportingStats: [
      { label: 'Wickets', value: '18' },
      { label: 'Average', value: '18.2' },
    ],
    createdAt: '2024-01-15T09:00:00Z',
  },
];

export const mockAiConversation: AiConversationMessage[] = [
  {
    id: 'msg_001',
    role: 'user',
    content: 'Who should bat at number 3 against spin?',
    createdAt: '2024-01-15T10:05:00Z',
  },
  {
    id: 'msg_002',
    role: 'assistant',
    content: 'Based on matchups, Glenn Maxwell averages 42 against leg-spin with a strike rate of 155. He is the strongest option at number 3 against spin-heavy attacks.',
    source: 'generated',
    createdAt: '2024-01-15T10:05:05Z',
  },
];

/* ── Media ────────────────────────────────────────────── */

export const mockMediaAssets: MediaAsset[] = [
  {
    id: 'media_001',
    organizationId: 'org_001',
    kind: 'video',
    title: 'Match 24 Highlights',
    description: 'Full highlights of Sydney Thunder vs Melbourne Stars.',
    thumbnailUrl: undefined,
    url: undefined,
    duration: 180,
    tags: ['highlights', 'match'],
    matchId: 'match_001',
    playerIds: ['ply_001', 'ply_005'],
    teamId: 'team_001',
    uploadedBy: 'Media Team',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'media_002',
    organizationId: 'org_001',
    kind: 'image',
    title: 'Warner Century Celebration',
    description: 'David Warner celebrates his century.',
    thumbnailUrl: undefined,
    url: undefined,
    tags: ['celebration', 'player'],
    playerIds: ['ply_001'],
    teamId: 'team_001',
    uploadedBy: 'Media Team',
    createdAt: '2024-01-13T11:30:00Z',
  },
];

export const mockVideoAssets: VideoAsset[] = [
  {
    id: 'video_001',
    title: 'Match 24 Full Footage',
    description: 'Complete broadcast footage of Match 24.',
    url: undefined,
    thumbnailUrl: undefined,
    duration: 7200,
    matchId: 'match_001',
    matchLabel: 'Match 24',
    tags: ['full-match', 'broadcast'],
    events: [
      { id: 'evt_001', timestamp: 120, type: 'boundary', label: 'FOUR - Warner', runs: 4, playerId: 'ply_001', playerName: 'David Warner', tags: ['boundary'] },
      { id: 'evt_002', timestamp: 300, type: 'wicket', label: 'WICKET - Cummins', playerId: 'ply_002', playerName: 'Pat Cummins', tags: ['wicket'] },
    ],
    clips: [
      { id: 'clip_001', title: 'Warner 50', start: 100, end: 140, tags: ['milestone'], playerIds: ['ply_001'], createdAt: '2024-01-15T11:00:00Z' },
    ],
    createdAt: '2024-01-15T11:00:00Z',
  },
];
