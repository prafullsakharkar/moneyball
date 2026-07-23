import type {
  AuctionPlayer,
  AuctionTeam,
  BidEntry,
  AuctionDashboardMetrics,
  BudgetBreakdown,
  PlayerRole,
  Country,
  PlayerStatus,
} from '../types';

const PHOTO = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;
const LOGO = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

const flagMap: Record<Country, string> = {
  India: 'IN',
  Australia: 'AU',
  England: 'EN',
  'South Africa': 'ZA',
  'New Zealand': 'NZ',
  'West Indies': 'WI',
  Pakistan: 'PK',
  'Sri Lanka': 'LK',
  Bangladesh: 'BD',
  Afghanistan: 'AF',
};

// ─── Teams ────────────────────────────────────────────────────────────────────
export const auctionTeams: AuctionTeam[] = [
  {
    id: 'team-mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    logoUrl: LOGO('auction-mi'),
    primaryColor: '#1e3a8a',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    logoUrl: LOGO('auction-csk'),
    primaryColor: '#fbbf24',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    logoUrl: LOGO('auction-rcb'),
    primaryColor: '#dc2626',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logoUrl: LOGO('auction-kkr'),
    primaryColor: '#6b21a8',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    logoUrl: LOGO('auction-dc'),
    primaryColor: '#1d4ed8',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    logoUrl: LOGO('auction-pbks'),
    primaryColor: '#b91c1c',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    logoUrl: LOGO('auction-rr'),
    primaryColor: '#ec4899',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
  {
    id: 'team-gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    logoUrl: LOGO('auction-gt'),
    primaryColor: '#1e293b',
    budget: 100000000,
    budgetSpent: 0,
    maxSlots: 25,
    filledSlots: 0,
    playersWon: [],
    overseasCount: 0,
    maxOverseas: 8,
  },
];

// ─── Players ──────────────────────────────────────────────────────────────────
const playerData: Array<Partial<AuctionPlayer> & { name: string; role: PlayerRole; country: Country; basePrice: number }> = [
  { name: 'Virat Kohli', role: 'Batsman', country: 'India', age: 35, basePrice: 20000000, rating: 9.5, matches: 250, runs: 7800, avg: 52.0, strikeRate: 148.2, best: '113', specialization: ['Top Order', 'Run Scorer'], teamInterest: ['team-rcb', 'team-mi'] },
  { name: 'Jasprit Bumrah', role: 'Bowler', country: 'India', age: 30, basePrice: 18000000, rating: 9.4, matches: 180, wickets: 210, economy: 6.5, best: '5/15', specialization: ['Pace', 'Death Bowling'], teamInterest: ['team-mi', 'team-gt'] },
  { name: 'Rohit Sharma', role: 'Batsman', country: 'India', age: 37, basePrice: 20000000, rating: 9.3, matches: 240, runs: 6500, avg: 48.5, strikeRate: 140.1, best: '118', specialization: ['Opener', 'Captain'], teamInterest: ['team-mi'] },
  { name: 'MS Dhoni', role: 'Wicket-keeper', country: 'India', age: 42, basePrice: 15000000, rating: 9.2, matches: 280, runs: 5000, avg: 40.0, strikeRate: 135.5, best: '84*', specialization: ['Finisher', 'Captain'], teamInterest: ['team-csk'] },
  { name: 'Ben Stokes', role: 'All-rounder', country: 'England', age: 32, basePrice: 16000000, rating: 9.0, matches: 150, runs: 3200, wickets: 80, avg: 28.0, economy: 7.8, best: '5/30', specialization: ['All-rounder', 'Finisher'], teamInterest: ['team-csk', 'team-rr'] },
  { name: 'Pat Cummins', role: 'Bowler', country: 'Australia', age: 31, basePrice: 15000000, rating: 9.1, matches: 160, wickets: 180, economy: 7.0, best: '4/22', specialization: ['Pace', 'Captain'], teamInterest: ['team-gt', 'team-srh'] },
  { name: 'Steve Smith', role: 'Batsman', country: 'Australia', age: 34, basePrice: 14000000, rating: 9.0, matches: 170, runs: 4200, avg: 45.0, strikeRate: 130.0, best: '101', specialization: ['Top Order', 'Anchors'], teamInterest: ['team-dc'] },
  { name: 'Kagiso Rabada', role: 'Bowler', country: 'South Africa', age: 28, basePrice: 12000000, rating: 8.9, matches: 140, wickets: 160, economy: 7.2, best: '4/18', specialization: ['Pace', 'Wicket Taker'], teamInterest: ['team-pbks', 'team-gt'] },
  { name: 'Rashid Khan', role: 'Bowler', country: 'Afghanistan', age: 25, basePrice: 15000000, rating: 9.2, matches: 130, wickets: 170, economy: 6.3, best: '4/14', specialization: ['Leg Spin', 'Death Bowling'], teamInterest: ['team-gt', 'team-mi'] },
  { name: 'Hardik Pandya', role: 'All-rounder', country: 'India', age: 30, basePrice: 15000000, rating: 8.8, matches: 160, runs: 2800, wickets: 70, avg: 25.0, economy: 8.0, best: '3/25', specialization: ['All-rounder', 'Finisher'], teamInterest: ['team-mi', 'team-gt'] },
  { name: 'KL Rahul', role: 'Wicket-keeper', country: 'India', age: 31, basePrice: 17000000, rating: 8.9, matches: 180, runs: 4500, avg: 42.0, strikeRate: 138.0, best: '98', specialization: ['Opener', 'Keeper'], teamInterest: ['team-rr', 'team-pbks'] },
  { name: 'Shubman Gill', role: 'Batsman', country: 'India', age: 24, basePrice: 12000000, rating: 8.7, matches: 120, runs: 3200, avg: 38.0, strikeRate: 142.0, best: '94', specialization: ['Opener', 'Technique'], teamInterest: ['team-gt', 'team-kkr'] },
  { name: 'Ravindra Jadeja', role: 'All-rounder', country: 'India', age: 35, basePrice: 16000000, rating: 9.0, matches: 220, runs: 2500, wickets: 150, avg: 22.0, economy: 7.1, best: '5/20', specialization: ['All-rounder', 'Fielder'], teamInterest: ['team-csk'] },
  { name: 'Trent Boult', role: 'Bowler', country: 'New Zealand', age: 34, basePrice: 10000000, rating: 8.8, matches: 150, wickets: 170, economy: 7.3, best: '4/16', specialization: ['Swing', 'Powerplay'], teamInterest: ['team-rr', 'team-mi'] },
  { name: 'Jos Buttler', role: 'Wicket-keeper', country: 'England', age: 33, basePrice: 14000000, rating: 9.0, matches: 160, runs: 3800, avg: 35.0, strikeRate: 150.0, best: '104', specialization: ['Opener', 'Power Hitter'], teamInterest: ['team-rr', 'team-gt'] },
  { name: 'David Warner', role: 'Batsman', country: 'Australia', age: 37, basePrice: 12000000, rating: 8.7, matches: 190, runs: 5500, avg: 41.0, strikeRate: 145.0, best: '109', specialization: ['Opener', 'Aggressive'], teamInterest: ['team-dc', 'team-kkr'] },
  { name: 'Sunil Narine', role: 'All-rounder', country: 'West Indies', age: 36, basePrice: 8000000, rating: 8.5, matches: 200, runs: 1200, wickets: 180, economy: 6.5, best: '5/10', specialization: ['Off Spin', 'Powerplay'], teamInterest: ['team-kkr'] },
  { name: 'Andre Russell', role: 'All-rounder', country: 'West Indies', age: 36, basePrice: 10000000, rating: 8.8, matches: 170, runs: 2200, wickets: 90, avg: 20.0, economy: 9.0, best: '3/20', specialization: ['Power Hitter', 'Finisher'], teamInterest: ['team-kkr', 'team-mi'] },
  { name: 'Shaheen Afridi', role: 'Bowler', country: 'Pakistan', age: 23, basePrice: 11000000, rating: 8.9, matches: 100, wickets: 130, economy: 7.5, best: '4/20', specialization: ['Swing', 'Pace'], teamInterest: ['team-rr', 'team-pbks'] },
  { name: 'Wanindu Hasaranga', role: 'Bowler', country: 'Sri Lanka', age: 26, basePrice: 9000000, rating: 8.6, matches: 90, wickets: 110, economy: 7.0, best: '4/15', specialization: ['Leg Spin', 'Wicket Taker'], teamInterest: ['team-rcb', 'team-rr'] },
  { name: 'Shakib Al Hasan', role: 'All-rounder', country: 'Bangladesh', age: 37, basePrice: 6000000, rating: 8.3, matches: 140, runs: 1800, wickets: 120, avg: 20.0, economy: 6.8, best: '4/22', specialization: ['All-rounder', 'Left Arm Spin'], teamInterest: ['team-kkr', 'team-dc'] },
  { name: 'Quinton de Kock', role: 'Wicket-keeper', country: 'South Africa', age: 31, basePrice: 10000000, rating: 8.7, matches: 150, runs: 3500, avg: 32.0, strikeRate: 143.0, best: '87', specialization: ['Opener', 'Keeper'], teamInterest: ['team-gt', 'team-dc'] },
  { name: 'Yuzvendra Chahal', role: 'Bowler', country: 'India', age: 33, basePrice: 8000000, rating: 8.5, matches: 180, wickets: 190, economy: 7.4, best: '5/25', specialization: ['Leg Spin', 'Middle Overs'], teamInterest: ['team-rr', 'team-pbks'] },
  { name: 'Rishabh Pant', role: 'Wicket-keeper', country: 'India', age: 26, basePrice: 16000000, rating: 8.8, matches: 140, runs: 3200, avg: 30.0, strikeRate: 148.0, best: '88', specialization: ['Middle Order', 'Power Hitter'], teamInterest: ['team-dc', 'team-rcb'] },
  { name: 'Mohammed Siraj', role: 'Bowler', country: 'India', age: 30, basePrice: 7000000, rating: 8.4, matches: 120, wickets: 140, economy: 7.6, best: '4/20', specialization: ['Pace', 'Powerplay'], teamInterest: ['team-rcb', 'team-gt'] },
  { name: 'Suryakumar Yadav', role: 'Batsman', country: 'India', age: 33, basePrice: 12000000, rating: 8.9, matches: 130, runs: 3400, avg: 36.0, strikeRate: 155.0, best: '83', specialization: ['Middle Order', '360 Player'], teamInterest: ['team-mi'] },
  { name: 'Lockie Ferguson', role: 'Bowler', country: 'New Zealand', age: 32, basePrice: 5000000, rating: 8.2, matches: 90, wickets: 100, economy: 8.0, best: '3/28', specialization: ['Pace', 'Express'], teamInterest: ['team-gt', 'team-pbks'] },
  { name: 'Shimron Hetmyer', role: 'Batsman', country: 'West Indies', age: 27, basePrice: 5000000, rating: 8.3, matches: 100, runs: 2200, avg: 25.0, strikeRate: 150.0, best: '75', specialization: ['Finisher', 'Power Hitter'], teamInterest: ['team-rr', 'team-dc'] },
  { name: 'Rashid Khan III', role: 'Bowler', country: 'Afghanistan', age: 22, basePrice: 4000000, rating: 8.0, matches: 60, wickets: 80, economy: 7.2, best: '3/18', specialization: ['Off Spin', 'Young'], teamInterest: ['team-gt'] },
  { name: 'Arshdeep Singh', role: 'Bowler', country: 'India', age: 25, basePrice: 4000000, rating: 8.1, matches: 80, wickets: 90, economy: 8.2, best: '3/25', specialization: ['Left Arm Pace', 'Death Bowling'], teamInterest: ['team-pbks', 'team-mi'] },
  { name: 'Tilak Varma', role: 'Batsman', country: 'India', age: 21, basePrice: 3000000, rating: 7.9, matches: 50, runs: 1200, avg: 34.0, strikeRate: 140.0, best: '61', specialization: ['Middle Order', 'Young Talent'], teamInterest: ['team-mi', 'team-rcb'] },
];

export const auctionPlayers: AuctionPlayer[] = playerData.map((p, i) => {
  const initials = p.name.split(' ').map(n => n[0]).join('');
  return {
    id: `ply-${i + 1}`,
    name: p.name,
    initials,
    photoUrl: PHOTO(`auction-ply${i}`),
    role: p.role,
    country: p.country,
    countryFlag: flagMap[p.country],
    age: p.age!,
    basePrice: p.basePrice,
    currentBid: p.basePrice,
    status: 'available' as PlayerStatus,
    rating: p.rating!,
    matches: p.matches!,
    runs: p.runs,
    wickets: p.wickets,
    avg: p.avg,
    strikeRate: p.strikeRate,
    economy: p.economy,
    best: p.best,
    specialization: p.specialization || [],
    availability: 'full' as const,
    teamInterest: p.teamInterest || [],
  };
});

// ─── Pre-populate some sold players for dashboard ──────────────────────────────
const soldResults: Array<{ playerIdx: number; teamId: string; price: number }> = [
  { playerIdx: 0, teamId: 'team-rcb', price: 21000000 },
  { playerIdx: 1, teamId: 'team-mi', price: 19500000 },
  { playerIdx: 2, teamId: 'team-mi', price: 18000000 },
  { playerIdx: 3, teamId: 'team-csk', price: 14000000 },
  { playerIdx: 4, teamId: 'team-csk', price: 17500000 },
  { playerIdx: 5, teamId: 'team-gt', price: 20000000 },
  { playerIdx: 8, teamId: 'team-gt', price: 16000000 },
  { playerIdx: 9, teamId: 'team-mi', price: 15500000 },
  { playerIdx: 12, teamId: 'team-csk', price: 17000000 },
  { playerIdx: 14, teamId: 'team-rr', price: 15000000 },
  { playerIdx: 23, teamId: 'team-dc', price: 18000000 },
  { playerIdx: 24, teamId: 'team-rcb', price: 8500000 },
];

soldResults.forEach(result => {
  const player = auctionPlayers[result.playerIdx];
  const team = auctionTeams.find(t => t.id === result.teamId)!;
  player.status = 'sold';
  player.soldTo = team.id;
  player.soldPrice = result.price;
  player.currentBid = result.price;
  player.currentBidder = team.id;
  team.budgetSpent += result.price;
  team.filledSlots += 1;
  team.playersWon.push(player.id);
  if (player.country !== 'India') team.overseasCount += 1;
});

// Mark a couple as unsold
auctionPlayers[27].status = 'unsold';
auctionPlayers[28].status = 'unsold';

// ─── Bid History ──────────────────────────────────────────────────────────────
export const mockBidHistory: BidEntry[] = [
  { id: 'bid-1', playerId: 'ply-1', teamId: 'team-rcb', teamName: 'RCB', amount: 20000000, timestamp: '10:30:01' },
  { id: 'bid-2', playerId: 'ply-1', teamId: 'team-mi', teamName: 'MI', amount: 20500000, timestamp: '10:30:05' },
  { id: 'bid-3', playerId: 'ply-1', teamId: 'team-rcb', teamName: 'RCB', amount: 21000000, timestamp: '10:30:09' },
  { id: 'bid-4', playerId: 'ply-2', teamId: 'team-mi', teamName: 'MI', amount: 18000000, timestamp: '10:35:01' },
  { id: 'bid-5', playerId: 'ply-2', teamId: 'team-gt', teamName: 'GT', amount: 18500000, timestamp: '10:35:05' },
  { id: 'bid-6', playerId: 'ply-2', teamId: 'team-mi', teamName: 'MI', amount: 19000000, timestamp: '10:35:09' },
  { id: 'bid-7', playerId: 'ply-2', teamId: 'team-gt', teamName: 'GT', amount: 19500000, timestamp: '10:35:13' },
];

// ─── Dashboard Metrics ───────────────────────────────────────────────────────
const soldPlayers = auctionPlayers.filter(p => p.status === 'sold');
const unsoldPlayers = auctionPlayers.filter(p => p.status === 'unsold');
const availablePlayers = auctionPlayers.filter(p => p.status === 'available');
const totalBudget = auctionTeams.reduce((s, t) => s + t.budget, 0);
const totalSpent = auctionTeams.reduce((s, t) => s + t.budgetSpent, 0);
const highestBid = Math.max(...soldPlayers.map(p => p.soldPrice || 0));
const highestBidPlayer = soldPlayers.find(p => p.soldPrice === highestBid);
const highestBidTeam = auctionTeams.find(t => t.id === highestBidPlayer?.soldTo);

export const auctionDashboardMetrics: AuctionDashboardMetrics = {
  totalPlayers: auctionPlayers.length,
  soldPlayers: soldPlayers.length,
  unsoldPlayers: unsoldPlayers.length,
  availablePlayers: availablePlayers.length,
  totalBudget,
  totalSpent,
  highestBid,
  highestBidPlayer: highestBidPlayer?.name || '-',
  highestBidTeam: highestBidTeam?.name || '-',
  avgSoldPrice: Math.round(highestBid / soldPlayers.length),
  totalTeams: auctionTeams.length,
};

// ─── Budget Breakdown ─────────────────────────────────────────────────────────
export const budgetBreakdown: BudgetBreakdown[] = auctionTeams.map(team => {
  const won = team.playersWon.map(id => auctionPlayers.find(p => p.id === id)).filter(Boolean) as AuctionPlayer[];
  return {
    teamId: team.id,
    teamName: team.name,
    budget: team.budget,
    spent: team.budgetSpent,
    remaining: team.budget - team.budgetSpent,
    purseUtilization: Math.round((team.budgetSpent / team.budget) * 100),
    categoryBreakdown: {
      batsman: won.filter(p => p.role === 'Batsman').reduce((s, p) => s + (p.soldPrice || 0), 0),
      bowler: won.filter(p => p.role === 'Bowler').reduce((s, p) => s + (p.soldPrice || 0), 0),
      allRounder: won.filter(p => p.role === 'All-rounder').reduce((s, p) => s + (p.soldPrice || 0), 0),
      wicketKeeper: won.filter(p => p.role === 'Wicket-keeper').reduce((s, p) => s + (p.soldPrice || 0), 0),
    },
  };
});

// ─── Chart Data ───────────────────────────────────────────────────────────────
export const soldByRoleData = [
  { name: 'Batsman', value: auctionPlayers.filter(p => p.status === 'sold' && p.role === 'Batsman').length, color: '#6366f1' },
  { name: 'Bowler', value: auctionPlayers.filter(p => p.status === 'sold' && p.role === 'Bowler').length, color: '#06b6d4' },
  { name: 'All-rounder', value: auctionPlayers.filter(p => p.status === 'sold' && p.role === 'All-rounder').length, color: '#22c55e' },
  { name: 'Keeper', value: auctionPlayers.filter(p => p.status === 'sold' && p.role === 'Wicket-keeper').length, color: '#f59e0b' },
];

export const budgetUtilizationData = auctionTeams.map(t => ({
  name: t.shortName,
  value: Math.round((t.budgetSpent / t.budget) * 100),
  color: t.primaryColor,
}));

export const topBidsData = [...soldPlayers]
  .sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0))
  .slice(0, 8)
  .map(p => ({
    name: p.initials,
    value: Math.round((p.soldPrice || 0) / 1000000),
    color: auctionTeams.find(t => t.id === p.soldTo)?.primaryColor || '#6366f1',
  }));

export const auctionProgressData = [
  { name: 'Sold', value: soldPlayers.length, color: '#22c55e' },
  { name: 'Available', value: availablePlayers.length, color: '#6366f1' },
  { name: 'Unsold', value: unsoldPlayers.length, color: '#ef4444' },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export function getTeamById(id: string): AuctionTeam | undefined {
  return auctionTeams.find(t => t.id === id);
}

export function getPlayerById(id: string): AuctionPlayer | undefined {
  return auctionPlayers.find(p => p.id === id);
}

export function getPlayersByTeam(teamId: string): AuctionPlayer[] {
  return auctionPlayers.filter(p => p.soldTo === teamId);
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export const roleConfig: Record<PlayerRole, { color: string; bg: string; icon: string }> = {
  Batsman: { color: '#6366f1', bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400', icon: '🏏' },
  Bowler: { color: '#06b6d4', bg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400', icon: '🎯' },
  'All-rounder': { color: '#22c55e', bg: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400', icon: '⚡' },
  'Wicket-keeper': { color: '#f59e0b', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400', icon: '🧤' },
};

export const statusConfig: Record<PlayerStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#6366f1', bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400' },
  sold: { label: 'Sold', color: '#22c55e', bg: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' },
  unsold: { label: 'Unsold', color: '#ef4444', bg: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
  in_auction: { label: 'In Auction', color: '#f59e0b', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
};
