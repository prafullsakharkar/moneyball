import type {
  VideoFile,
  VideoStatus,
  VideoQuality,
  VideoSource,
  BallClip,
  BallOutcome,
  ShotTag,
  TimelineEvent,
  VideoComment,
  AIJob,
  AIJobStatus,
  AIJobType,
  PlayerHighlight,
  HighlightCategory,
  VideoDashboardMetrics,
} from '../types';

const THUMB = (seed: string) => `https://picsum.photos/seed/${seed}/320/180`;
const CLIP = (id: string) => `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_${id}.mp4`;

// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export const videoDashboardMetrics: VideoDashboardMetrics = {
  totalVideos: 248,
  taggedBalls: 18432,
  taggedPlayers: 156,
  aiClips: 3421,
  storageUsed: 847.3,
  storageTotal: 2048,
};

// ─── Videos ───────────────────────────────────────────────────────────────────
const matchNames = [
  'CSK vs MI — Final',
  'RCB vs KKR — Qualifier',
  'MI vs SRH — League',
  'CSK vs RCB — League',
  'GT vs RR — Eliminator',
  'DC vs KKR — League',
  'SRH vs CSK — League',
  'RR vs MI — League',
  'RCB vs DC — League',
  'KKR vs GT — League',
  'CSK vs RR — Qualifier 2',
  'MI vs RCB — League',
  'SRH vs KKR — League',
  'DC vs CSK — League',
  'GT vs SRH — League',
  'RR vs RCB — League',
  'KKR vs MI — League',
  'CSK vs GT — Final',
  'RCB vs SRH — League',
  'DC vs RR — League',
  'MI vs GT — League',
  'SRH vs RR — League',
  'CSK vs KKR — League',
  'RCB vs GT — League',
  'DC vs MI — League',
  'RR vs CSK — League',
  'KKR vs SRH — League',
  'GT vs RCB — League',
  'MI vs CSK — League',
  'SRH vs DC — League',
  'CSK vs DC — Qualifier',
  'RCB vs MI — Eliminator',
  'KKR vs RR — League',
  'GT vs CSK — League',
  'SRH vs RCB — League',
  'DC vs KKR — Qualifier',
  'RR vs GT — League',
  'MI vs SRH — League',
  'CSK vs SRH — League',
  'RCB vs KKR — League',
  'GT vs MI — League',
  'DC vs SRH — League',
  'RR vs CSK — League',
  'KKR vs DC — League',
  'CSK vs MI — League',
  'RCB vs RR — League',
  'SRH vs GT — League',
  'MI vs KKR — League',
];

const teamShorts: [string, string][] = [
  ['CSK', 'MI'], ['RCB', 'KKR'], ['MI', 'SRH'], ['CSK', 'RCB'], ['GT', 'RR'],
  ['DC', 'KKR'], ['SRH', 'CSK'], ['RR', 'MI'], ['RCB', 'DC'], ['KKR', 'GT'],
  ['CSK', 'RR'], ['MI', 'RCB'], ['SRH', 'KKR'], ['DC', 'CSK'], ['GT', 'SRH'],
  ['RR', 'RCB'], ['KKR', 'MI'], ['CSK', 'GT'], ['RCB', 'SRH'], ['DC', 'RR'],
  ['MI', 'GT'], ['SRH', 'RR'], ['CSK', 'KKR'], ['RCB', 'GT'], ['DC', 'MI'],
  ['RR', 'CSK'], ['KKR', 'SRH'], ['GT', 'RCB'], ['MI', 'CSK'], ['SRH', 'DC'],
  ['CSK', 'DC'], ['RCB', 'MI'], ['KKR', 'RR'], ['GT', 'CSK'], ['SRH', 'RCB'],
  ['DC', 'KKR'], ['RR', 'GT'], ['MI', 'SRH'], ['CSK', 'SRH'], ['RCB', 'KKR'],
  ['GT', 'MI'], ['DC', 'SRH'], ['RR', 'CSK'], ['KKR', 'DC'], ['CSK', 'MI'],
  ['RCB', 'RR'], ['SRH', 'GT'], ['MI', 'KKR'],
];

const statuses: VideoStatus[] = ['processing', 'ready', 'failed', 'queued'];
const qualities: VideoQuality[] = ['4K', '1080p', '720p', '480p'];
const sources: VideoSource[] = ['broadcast', 'user_upload', 'highlights', 'clip'];

export const mockVideos: VideoFile[] = Array.from({ length: 48 }, (_, i) => {
  const status = i % 7 === 0 ? 'processing' : i % 11 === 0 ? 'failed' : i % 5 === 0 ? 'queued' : 'ready';
  const quality = qualities[i % qualities.length];
  const source = sources[i % sources.length];
  const [t1, t2] = teamShorts[i % teamShorts.length];
  const duration = 3600 + Math.floor(Math.random() * 7200);
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    id: `vid-${i + 1}`,
    title: matchNames[i % matchNames.length],
    matchId: `m-${i + 1}`,
    matchName: matchNames[i % matchNames.length],
    team1Short: t1,
    team2Short: t2,
    duration,
    size: Math.round((duration / 60) * (quality === '4K' ? 50 : quality === '1080p' ? 20 : quality === '720p' ? 10 : 5) * 10) / 10,
    quality,
    source,
    status,
    uploadedAt: date.toISOString(),
    thumbnailUrl: THUMB(`vid-${i + 1}`),
    videoUrl: CLIP(String(i + 1).padStart(3, '0')),
    taggedBalls: status === 'ready' ? Math.floor(Math.random() * 300) + 60 : Math.floor(Math.random() * 30),
    taggedPlayers: status === 'ready' ? Math.floor(Math.random() * 22) + 4 : 0,
    aiClips: status === 'ready' ? Math.floor(Math.random() * 80) + 10 : 0,
    views: Math.floor(Math.random() * 5000) + 100,
    description: i % 3 === 0 ? `Full match coverage of ${matchNames[i % matchNames.length]} with ball-by-ball analysis.` : undefined,
  };
});

// ─── Ball Clips ───────────────────────────────────────────────────────────────
const outcomes: BallOutcome[] = ['dot', 'single', 'double', 'four', 'six', 'wicket', 'wide', 'no_ball'];
const shotTags: ShotTag[] = ['Cover Drive', 'Pull', 'Cut', 'Sweep', 'Reverse Sweep', 'Yorker', 'Bouncer', 'Slower Ball', 'Edge', 'Catch', 'LBW', 'Run Out'];
const batsmen = ['Virat Kohli', 'Rohit Sharma', 'MS Dhoni', 'Shubman Gill', 'Hardik Pandya', 'KL Rahul', 'Rishabh Pant', 'Suryakumar Yadav'];
const bowlers = ['Jasprit Bumrah', 'Ravindra Jadeja', 'Yuzvendra Chahal', 'Mohammed Siraj', 'Bhuvneshwar Kumar', 'Kuldeep Yadav'];

function runsForOutcome(outcome: BallOutcome): number {
  switch (outcome) {
    case 'dot': return 0;
    case 'single': return 1;
    case 'double': return 2;
    case 'triple': return 3;
    case 'four': return 4;
    case 'six': return 6;
    case 'wicket': return 0;
    case 'wide': return 1;
    case 'no_ball': return 1;
    case 'bye': return 1;
    case 'leg_bye': return 1;
    default: return 0;
  }
}

export function generateClips(videoId: string, count: number = 120): BallClip[] {
  const clips: BallClip[] = [];
  for (let i = 0; i < count; i++) {
    const overNumber = Math.floor(i / 6) + 1;
    const ballNumber = (i % 6) + 1;
    const outcome = outcomes[i % outcomes.length];
    const runs = runsForOutcome(outcome);
    const startTime = i * 25 + Math.floor(Math.random() * 10);
    const length = 8 + Math.floor(Math.random() * 12);
    const tagCount = Math.floor(Math.random() * 3) + 1;
    const tags: ShotTag[] = Array.from({ length: tagCount }, (_, j) => shotTags[(i + j) % shotTags.length]);
    clips.push({
      id: `clip-${videoId}-${i + 1}`,
      videoId,
      matchId: `m-1`,
      overNumber,
      ballNumber,
      ballLabel: `${overNumber}.${ballNumber}`,
      startTime,
      endTime: startTime + length,
      length,
      speedKph: outcome === 'wicket' || outcome === 'six' ? 135 + Math.floor(Math.random() * 20) : undefined,
      outcome,
      runs,
      tags: [...new Set(tags)],
      batsman: batsmen[i % batsmen.length],
      bowler: bowlers[i % bowlers.length],
      comments: i % 4 === 0 ? ['Great shot!', 'What a delivery!'] : i % 3 === 0 ? ['Textbook technique'] : [],
      bookmarked: i % 7 === 0,
      thumbnailUrl: THUMB(`clip-${videoId}-${i + 1}`),
      clipUrl: CLIP(`clip${(i % 5) + 1}`),
    });
  }
  return clips;
}

export const mockBallClips: BallClip[] = generateClips('vid-1', 120);

export function getClipsByVideo(videoId: string): BallClip[] {
  if (videoId === 'vid-1') return mockBallClips;
  return generateClips(videoId, 60);
}

export function getTimelineEvents(clips: BallClip[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  clips.forEach((clip) => {
    const eventMeta = (() => {
      switch (clip.outcome) {
        case 'six':
          return { type: 'six' as const, label: `${clip.ballLabel} — SIX!` };
        case 'four':
          return { type: 'boundary' as const, label: `${clip.ballLabel} — FOUR!` };
        case 'wicket':
          return { type: 'wicket' as const, label: `${clip.ballLabel} — WICKET!` };
        case 'wide':
          return { type: 'wide' as const, label: `${clip.ballLabel} — Wide` };
        case 'no_ball':
          return { type: 'no_ball' as const, label: `${clip.ballLabel} — No Ball` };
        case 'dot':
          return { type: 'dot' as const, label: `${clip.ballLabel} — Dot` };
        default:
          return null;
      }
    })();

    if (!eventMeta) {
      return; // skip singles/doubles for timeline
    }

    events.push({
      id: `evt-${clip.id}`,
      time: clip.startTime,
      over: clip.overNumber,
      ball: clip.ballNumber,
      type: eventMeta.type,
      label: eventMeta.label,
      description: `${clip.batsman || 'Batsman'} facing ${clip.bowler || 'Bowler'}`,
    });
  });
  return events;
}

// ─── Comments ─────────────────────────────────────────────────────────────────
const commentAuthors = [
  { name: 'Ravi Kumar', initials: 'RK' },
  { name: 'Sarah Jones', initials: 'SJ' },
  { name: 'Mike Chen', initials: 'MC' },
  { name: 'Priya Sharma', initials: 'PS' },
  { name: 'David Brown', initials: 'DB' },
];

export const mockComments: VideoComment[] = Array.from({ length: 12 }, (_, i) => {
  const author = commentAuthors[i % commentAuthors.length];
  const date = new Date();
  date.setHours(date.getHours() - i * 3);
  return {
    id: `cmt-${i + 1}`,
    videoId: 'vid-1',
    author: author.name,
    authorInitials: author.initials,
    timestamp: i * 180 + Math.floor(Math.random() * 60),
    text: [
      'What an incredible over! The pressure was immense.',
      'That cover drive was pure class — textbook technique.',
      'The bowler set him up beautifully with the slower ball.',
      'Huge wicket at a crucial time in the match.',
      'This partnership is changing the game completely.',
      'The field placement was perfect for that shot.',
      'Amazing variation in pace from the bowler.',
      'That six into the stands was absolutely massive!',
      'Great analysis, the AI tagging is spot on here.',
      'The spin was turning sharply on this surface.',
      'Perfect execution of the yorker under pressure.',
      'This is why he is considered one of the best.',
    ][i],
    createdAt: date.toISOString(),
  };
});

// ─── AI Jobs ──────────────────────────────────────────────────────────────────
const jobTypes: AIJobType[] = ['highlights', 'shot_detection', 'player_tracking', 'auto_tagging', 'clip_generation'];
const jobStatuses: AIJobStatus[] = ['pending', 'processing', 'completed', 'failed'];

export const mockAIJobs: AIJob[] = Array.from({ length: 24 }, (_, i) => {
  const status = i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'failed' : i % 3 === 0 ? 'processing' : 'completed';
  const type = jobTypes[i % jobTypes.length];
  const date = new Date();
  date.setHours(date.getHours() - i * 2);
  const completedDate = new Date(date);
  completedDate.setMinutes(completedDate.getMinutes() + 30);
  return {
    id: `job-${i + 1}`,
    type,
    videoId: `vid-${(i % 48) + 1}`,
    videoTitle: matchNames[i % matchNames.length],
    status,
    progress: status === 'completed' ? 100 : status === 'processing' ? Math.floor(Math.random() * 80) + 10 : status === 'failed' ? Math.floor(Math.random() * 60) + 20 : 0,
    startedAt: date.toISOString(),
    completedAt: status === 'completed' ? completedDate.toISOString() : undefined,
    resultCount: status === 'completed' ? Math.floor(Math.random() * 50) + 5 : undefined,
    error: status === 'failed' ? 'GPU memory exceeded during frame processing' : undefined,
  };
});

// ─── Player Highlights ───────────────────────────────────────────────────────
const playerNames = [
  { name: 'Virat Kohli', initials: 'VK', team: 'RCB' },
  { name: 'Rohit Sharma', initials: 'RS', team: 'MI' },
  { name: 'MS Dhoni', initials: 'MD', team: 'CSK' },
  { name: 'Shubman Gill', initials: 'SG', team: 'GT' },
  { name: 'Hardik Pandya', initials: 'HP', team: 'GT' },
  { name: 'Jasprit Bumrah', initials: 'JB', team: 'MI' },
  { name: 'Ravindra Jadeja', initials: 'RJ', team: 'CSK' },
  { name: 'KL Rahul', initials: 'KL', team: 'LSG' },
  { name: 'Rishabh Pant', initials: 'RP', team: 'DC' },
  { name: 'Yuzvendra Chahal', initials: 'YC', team: 'SRH' },
];

const categories: HighlightCategory[] = ['batting', 'bowling', 'fielding', 'sixes', 'boundaries', 'wickets', 'catches', 'run_outs'];

export const mockPlayerHighlights: PlayerHighlight[] = Array.from({ length: 60 }, (_, i) => {
  const player = playerNames[i % playerNames.length];
  const category = categories[i % categories.length];
  const outcome: BallOutcome = category === 'sixes' ? 'six' : category === 'boundaries' ? 'four' : category === 'wickets' ? 'wicket' : outcomes[i % outcomes.length];
  const overNumber = Math.floor(i / 6) + 1;
  const ballNumber = (i % 6) + 1;
  const duration = 8 + Math.floor(Math.random() * 12);
  const tagCount = Math.floor(Math.random() * 2) + 1;
  return {
    id: `hl-${i + 1}`,
    playerId: `p-${(i % playerNames.length) + 1}`,
    playerName: player.name,
    playerInitials: player.initials,
    teamShort: player.team,
    category,
    clipId: `clip-vid-1-${i + 1}`,
    matchName: matchNames[i % matchNames.length],
    overLabel: `${overNumber}.${ballNumber}`,
    outcome,
    runs: runsForOutcome(outcome),
    thumbnailUrl: THUMB(`hl-${i + 1}`),
    clipUrl: CLIP(`hl${(i % 5) + 1}`),
    duration,
    tags: Array.from({ length: tagCount }, (_, j) => shotTags[(i + j) % shotTags.length]),
  };
});

// ─── Chart Data ───────────────────────────────────────────────────────────────
export const videosPerMatch = matchNames.slice(0, 10).map((name, i) => ({
  name: name.split(' — ')[0],
  value: Math.floor(Math.random() * 8) + 2,
}));

export const videosPerPlayer = playerNames.map((p) => ({
  name: p.name,
  value: Math.floor(Math.random() * 20) + 5,
}));

export const aiProcessingStatus = [
  { name: 'Completed', value: 14, color: '#22c55e' },
  { name: 'Processing', value: 5, color: '#f59e0b' },
  { name: 'Pending', value: 3, color: '#6366f1' },
  { name: 'Failed', value: 2, color: '#ef4444' },
];

export const shotTagDistribution = shotTags.map((tag, i) => ({
  name: tag,
  value: Math.floor(Math.random() * 200) + 20,
  color: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#3b82f6', '#10b981'][i],
}));
