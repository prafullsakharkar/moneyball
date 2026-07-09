import React from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, Radio, TrendingUp, TrendingDown, Target, Activity,
  BarChart3, LineChart, Users, Award
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Run Rate Chart Component
const RunRateChart = () => {
  const data = [3.5, 4.2, 5.8, 7.2, 8.5, 8.1, 9.2, 10.5, 11.2, 8.5];
  const requiredRate = [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0];
  const maxVal = Math.max(...data, ...requiredRate) * 1.2;

  return (
    <GlassCard>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-500" />
        Run Rate vs Required Rate
      </h3>
      <div className="h-48 flex items-end gap-1">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="relative w-full flex flex-col items-center" style={{ height: '160px' }}>
              {/* Required rate line */}
              <div
                className="absolute w-full border-t-2 border-dashed border-warning-400"
                style={{ bottom: `${(requiredRate[i] / maxVal) * 100}%`, width: '100%' }}
              />
              {/* Actual rate bar */}
              <div
                className={cn(
                  'w-3/4 rounded-t-sm transition-all',
                  val >= requiredRate[i] ? 'bg-success-500' : 'bg-error-500'
                )}
                style={{ height: `${(val / maxVal) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{i + 1}-{i + 2}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success-500" />
          <span className="text-xs text-slate-500">Below Required</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-error-500" />
          <span className="text-xs text-slate-500">Above Required</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 border-t-2 border-dashed border-warning-400" />
          <span className="text-xs text-slate-500">Required Rate</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Wagon Wheel Component
const WagonWheel = () => {
  const sectors = [
    { start: 0, end: 36, label: 'Fine Leg', fours: 2, sixes: 0 },
    { start: 36, end: 72, label: 'Square Leg', fours: 4, sixes: 2 },
    { start: 72, end: 108, label: 'Mid-wicket', fours: 3, sixes: 1 },
    { start: 108, end: 144, label: 'Cover', fours: 5, sixes: 1 },
    { start: 144, end: 180, label: 'Point', fours: 2, sixes: 0 },
    { start: 180, end: 216, label: 'Third Man', fours: 1, sixes: 0 },
    { start: 216, end: 252, label: 'Fine Leg', fours: 0, sixes: 0 },
    { start: 252, end: 288, label: 'Long-on', fours: 1, sixes: 3 },
    { start: 288, end: 324, label: 'Long-off', fours: 0, sixes: 2 },
    { start: 324, end: 360, label: 'Third Man', fours: 2, sixes: 0 },
  ];

  const getColor = (fours: number, sixes: number) => {
    const total = fours + sixes;
    if (total >= 6) return 'bg-primary-500';
    if (total >= 4) return 'bg-cyan-500';
    if (total >= 2) return 'bg-success-500';
    return 'bg-slate-300';
  };

  return (
    <GlassCard>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-cyan-500" />
        Wagon Wheel - Scoring Zones
      </h3>
      <div className="relative w-64 h-64 mx-auto">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
          22
        </div>
        {/* Pitch */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-20 bg-amber-200 dark:bg-amber-800 rounded" />

        {/* Sectors */}
        {sectors.map((sector, i) => {
          const startAngle = (sector.start - 90) * (Math.PI / 180);
          const endAngle = (sector.end - 90) * (Math.PI / 180);
          const radius = 80;
          const midAngle = (startAngle + endAngle) / 2;
          const labelRadius = 110;
          const labelX = Math.cos(midAngle) * labelRadius;
          const labelY = Math.sin(midAngle) * labelRadius;

          return (
            <div
              key={i}
              className={cn(
                'absolute top-1/2 left-1/2 origin-center rounded-full transition-all',
                getColor(sector.fours, sector.sixes)
              )}
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                marginLeft: `-${radius}px`,
                marginTop: `-${radius}px`,
                clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(startAngle)}% ${50 + 50 * Math.sin(startAngle)}%, ${50 + 50 * Math.cos(endAngle)}% ${50 + 50 * Math.sin(endAngle)}%)`,
                opacity: 0.6
              }}
              title={`${sector.label}: ${sector.fours} fours, ${sector.sixes} sixes`}
            />
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary-500" />
          <span className="text-xs text-slate-500">High scoring</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success-500" />
          <span className="text-xs text-slate-500">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-300" />
          <span className="text-xs text-slate-500">Low</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Manhattan Chart Component
const ManhattanChart = () => {
  const overData = [
    { over: 1, runs: 8, wickets: 0 },
    { over: 2, runs: 12, wickets: 0 },
    { over: 3, runs: 6, wickets: 1 },
    { over: 4, runs: 15, wickets: 0 },
    { over: 5, runs: 4, wickets: 1 },
    { over: 6, runs: 10, wickets: 0 },
    { over: 7, runs: 8, wickets: 0 },
    { over: 8, runs: 14, wickets: 1 },
    { over: 9, runs: 3, wickets: 0 },
    { over: 10, runs: 18, wickets: 0 },
  ];

  const maxRuns = Math.max(...overData.map(o => o.runs)) * 1.2;

  return (
    <GlassCard>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-warning-500" />
        Manhattan Chart - Runs per Over
      </h3>
      <div className="h-48 flex items-end gap-2">
        {overData.map((over) => (
          <div key={over.over} className="flex-1 flex flex-col items-center gap-1">
            <div className="relative w-full flex flex-col items-center" style={{ height: '160px' }}>
              {over.wickets > 0 && (
                <div
                  className="absolute w-4 h-4 rounded-full bg-error-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ bottom: `${(over.runs / maxRuns) * 100}%` }}
                >
                  W
                </div>
              )}
              <div
                className={cn(
                  'w-3/4 rounded-t-sm transition-all',
                  over.runs >= 12 ? 'bg-success-500' :
                  over.runs >= 6 ? 'bg-primary-500' :
                  'bg-warning-500'
                )}
                style={{ height: `${(over.runs / maxRuns) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{over.over}</span>
            <span className="text-xs font-medium text-slate-900 dark:text-white">{over.runs}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success-500" />
          <span className="text-xs text-slate-500">Good over (12+)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning-500" />
          <span className="text-xs text-slate-500">Low/Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-error-500 text-white text-xs flex items-center justify-center">W</div>
          <span className="text-xs text-slate-500">Wicket</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Worm Chart Component
const WormChart = () => {
  const inningsData = {
    first: [0, 5, 15, 28, 42, 51, 68, 78, 92, 105, 118, 130, 140, 156, 170, 182, 195, 206, 215, 220],
    second: [0, 8, 18, 32, 45, 50, 62, 70, 85, 98, 110, 125, 138, 148, 158, 170, 0, 0, 0, 0],
  };

  const maxHeight = Math.max(...inningsData.first, ...inningsData.second) * 1.1;
  const widthPerOver = 100 / 20;

  return (
    <GlassCard>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <LineChart className="w-5 h-5 text-cyan-500" />
        Worm Chart - Progression
      </h3>
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 200 160" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <line key={pct} x1="0" y1={160 - (pct * 1.6)} x2="200" y2={160 - (pct * 1.6)} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />
          ))}

          {/* First innings line */}
          <polyline
            points={inningsData.first.map((runs, i) => `${i * 10},${160 - (runs / maxHeight) * 160}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Second innings line */}
          <polyline
            points={inningsData.second.filter(r => r > 0).map((runs, i) => `${i * 10},${160 - (runs / maxHeight) * 160}`).join(' ')}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
          />

          {/* Target line */}
          <line
            x1="0"
            y1={160 - (220 / maxHeight) * 160}
            x2="200"
            y2={160 - (220 / maxHeight) * 160}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="10,5"
          />
        </svg>

        {/* Labels */}
        <div className="absolute left-0 top-0 text-xs text-slate-500">220</div>
        <div className="absolute left-0 bottom-0 text-xs text-slate-500">0</div>
        <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-xs text-slate-500">
          <span>0</span>
          <span>10</span>
          <span>20</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex items-center gap-1">
          <div className="w-6 border-t-2 border-dashed border-blue-500" />
          <span className="text-xs text-slate-500">1st Innings (CSK: 220/4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 border-t-2 border-cyan-500" />
          <span className="text-xs text-slate-500">2nd Innings (MI: 170/5 @ 16ov)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 border-t-2 border-dashed border-error-500" />
          <span className="text-xs text-slate-500">Target</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Partnership Chart Component
const PartnershipChart = () => {
  const partnerships = [
    { pair: 'Ruturaj & Conway', runs: 87, balls: 58, wicket: 1 },
    { pair: 'Ruturaj & Gaikwad', runs: 45, balls: 32, wicket: 1 },
    { pair: 'Jadeja & Dhoni', runs: 50, balls: 24, wicket: 1 },
    { pair: 'Dhoni & Moeen', runs: 38, balls: 18, wicket: 0 },
  ];

  const maxRuns = Math.max(...partnerships.map(p => p.runs)) * 1.2;

  return (
    <GlassCard>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-success-500" />
        Partnership Breakdown
      </h3>
      <div className="space-y-3">
        {partnerships.map((p, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-40 text-sm text-slate-600 dark:text-slate-400 truncate">
              {p.pair}
            </div>
            <div className="flex-1 relative h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(p.runs / maxRuns) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  'h-full rounded-lg flex items-center justify-end pr-2 text-white font-medium text-sm',
                  p.wicket ? 'bg-primary-500' : 'bg-success-500'
                )}
              >
                <span>{p.runs} ({p.balls})</span>
              </motion.div>
            </div>
            <div className="text-xs text-slate-500">
              {(p.runs / p.balls * 6).toFixed(1)} RR
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success-500" />
          <span className="text-xs text-slate-500">Unbroken</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary-500" />
          <span className="text-xs text-slate-500">Broken</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Main Live Dashboard Component
export function LiveDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Live Match Dashboard</h1>
              <p className="text-white/80">CSK vs MI • IPL 2024 • Chennai</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-error-500 animate-pulse" />
              LIVE - 2nd Innings
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RunRateChart />
        <ManhattanChart />
        <WormChart />
        <WagonWheel />
        <div className="lg:col-span-2">
          <PartnershipChart />
        </div>
      </div>
    </div>
  );
}

export default LiveDashboard;
