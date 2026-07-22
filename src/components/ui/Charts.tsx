import React from 'react';
import {
  AreaChart as ReAreaChart,
  Area,
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadarChart as ReRadarChart,
  Radar,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

// Color palette (matching previous chartColors)
const chartColors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cyan: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316',
};

const colorMap: Record<string, string> = {
  blue: chartColors.primary,
  purple: chartColors.purple,
  green: chartColors.success,
  yellow: chartColors.warning,
  red: chartColors.error,
  cyan: chartColors.cyan,
  pink: chartColors.pink,
  orange: chartColors.orange,
};

// ============ Utility ============

function normalizePointData(
  data: Array<{ x: string | number; y: number }> | number[],
  categories?: string[]
) {
  return data.map((point, index) =>
    typeof point === 'number'
      ? { x: categories?.[index] ?? String(index + 1), y: point }
      : point
  );
}

function normalizeNamedData(
  data: Array<{ name: string; value: number; color?: string }> | Array<number | undefined>,
  categories?: string[]
) {
  return data.map((point, index) =>
    typeof point === 'number' || point === undefined
      ? { name: categories?.[index] ?? String(index + 1), value: point ?? 0 }
      : point
  );
}

// ============ Custom Tooltip ============

const CustomTooltip = ({ active, payload, formatter }: { active?: boolean; payload?: any[]; formatter?: (value: number, name: string) => React.ReactNode }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg">
        {payload.map((entry, index) => (
          <div key={index} className="text-white text-sm">
            {formatter ? formatter(entry.value as number, entry.name) : (
              <>
                <span style={{ color: (entry.color as string) || (entry.fill as string) }}>●</span>{' '}
                {entry.name}: {entry.value}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ============ AreaChart ============

interface ChartProps {
  title?: string;
  subtitle?: string;
}

interface AreaChartProps extends ChartProps {
  data: Array<{ x: string | number; y: number }> | number[];
  categories?: string[];
  color?: string;
  height?: number;
}

export function AreaChart({ data, categories, color = chartColors.primary, height = 300, title, subtitle }: AreaChartProps) {
  const normalizedData = normalizePointData(data, categories).map(d => ({
    x: String(d.x),
    y: d.y,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>}
      {subtitle && <p className="text-sm text-slate-500 mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart data={normalizedData}>
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="x"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
            content={<CustomTooltip />}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color.replace('#', '')})`}
            dot={false}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ LineChart ============

interface LineChartProps extends ChartProps {
  series?: Array<{ name: string; data: number[]; color?: string }>;
  data?: number[];
  categories?: string[];
  height?: number;
}

export function LineChart({ series, data, categories, height = 300 }: LineChartProps) {
  const normalizedSeries = series ?? [{ name: 'Value', data: data ?? [], color: chartColors.primary }];

  // Build chart data
  const chartData = (categories ?? normalizedSeries[0]?.data.map((_, i) => String(i + 1))).map((cat, i) => {
    const point: Record<string, any> = { category: cat };
    normalizedSeries.forEach(s => {
      point[s.name] = s.data[i] ?? null;
    });
    return point;
  });

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="category"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {normalizedSeries.map((s, i) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={s.color || chartColors.primary}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ BarChart ============

interface BarChartProps extends ChartProps {
  data: Array<{ name: string; value: number; color?: string }> | Array<number | undefined>;
  categories?: string[];
  color?: string;
  horizontal?: boolean;
  height?: number;
}

export function BarChart({ data, categories, color = chartColors.primary, horizontal = false, height = 300 }: BarChartProps) {
  const normalizedData = normalizeNamedData(data, categories);

  const chartData = normalizedData.map(d => ({
    name: d.name,
    value: d.value,
    fill: d.color || color,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={chartData} layout={horizontal ? 'vertical' : 'horizontal'}>
          {horizontal ? (
            <>
              <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 4, 4]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ DonutChart ============

interface DonutChartProps extends ChartProps {
  data: Array<{ name: string; value: number; color?: string }> | Array<number | undefined>;
  categories?: string[];
  labels?: string[];
  height?: number;
  innerSize?: string;
}

export function DonutChart({ data, categories, labels, height = 300, innerSize = '60%' }: DonutChartProps) {
  const normalizedData = normalizeNamedData(data, categories ?? labels).map(d => ({
    name: d.name,
    value: d.value,
    color: d.color || chartColors.primary,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RePieChart>
          <Pie
            data={normalizedData}
            cx="50%"
            cy="50%"
            innerRadius={innerSize}
            label={({ name, percent }) => `${name} ${percent ? ((percent as number) * 100).toFixed(0) : 0}%`}
            labelLine={false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {normalizedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ RadarChart ============

interface RadarChartProps {
  categories: string[];
  data: number[];
  color?: string;
  height?: number;
}

export function RadarChart({ categories, data, color = chartColors.primary, height = 300 }: RadarChartProps) {
  const chartData = categories.map((cat, i) => ({
    category: cat,
    value: data[i] ?? 0,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReRadarChart data={chartData}>
          <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
          <PolarGrid stroke="#e2e8f0" />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Data"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.3}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ WormChart ============

interface WormChartProps extends ChartProps {
  data: Array<{ over: number; team1: number; team2: number }> | number[];
  categories?: string[];
  team1Name?: string;
  team2Name?: string;
  height?: number;
}

export function WormChart({ data, categories, team1Name = 'Team 1', team2Name = 'Team 2', height = 300 }: WormChartProps) {
  const normalizedData = data.map((point, index) =>
    typeof point === 'number'
      ? { over: Number(categories?.[index] ?? index + 1), team1: point, team2: point }
      : { over: point.over, team1: point.team1, team2: point.team2 }
  );

  const chartData = normalizedData.map(d => ({
    over: String(d.over),
    team1: d.team1,
    team2: d.team2,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="over" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="team1" stroke={chartColors.cyan} strokeWidth={2} dot={false} name={team1Name} />
          <Line type="monotone" dataKey="team2" stroke={chartColors.purple} strokeWidth={2} dot={false} name={team2Name} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ ManhattanChart ============

interface ManhattanChartProps extends ChartProps {
  data: Array<{ over: number; runs: number; wicket?: boolean }> | number[];
  categories?: string[];
  color?: string;
  height?: number;
}

export function ManhattanChart({ data, categories, color = chartColors.primary, height = 300 }: ManhattanChartProps) {
  const normalizedData = data.map((point, index) =>
    typeof point === 'number'
      ? { over: Number(categories?.[index] ?? index + 1), runs: point }
      : { over: point.over, runs: point.runs, wicket: point.wicket }
  );

  const chartData = normalizedData.map(d => ({
    over: String(d.over),
    runs: d.runs,
    wicket: d.wicket ?? false,
    color: d.wicket ? chartColors.error : color,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="over" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
          <Tooltip
            content={<CustomTooltip formatter={(value, name) => `Over ${name}: ${value} runs`} />}
          />
          <Bar dataKey="runs" radius={[2, 2, 2, 2]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ GaugeChart ============

interface GaugeChartProps {
  value: number;
  title?: string;
  height?: number;
  yAxisMax?: number;
}

export function GaugeChart({ value, title, height = 200, yAxisMax = 100 }: GaugeChartProps) {
  const normalizedValue = Math.max(0, Math.min(yAxisMax, value));
  const percentage = (normalizedValue / yAxisMax) * 100;
  const color = percentage < 30
    ? chartColors.error
    : percentage < 60
      ? chartColors.warning
      : chartColors.success;

  // Gauge data for semi-circle
  const gaugeData = [
    { name: 'Used', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  const gaugeAngle = (percentage / 100) * 180;
  const x = Math.cos(-Math.PI / 180 * gaugeAngle);
  const y = Math.sin(-Math.PI / 180 * gaugeAngle);

  return (
    <div className="w-full flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart data={[{ name: 'gauge', value: 100 }]}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={chartColors.error} />
              <stop offset="30%" stopColor={chartColors.warning} />
              <stop offset="60%" stopColor={chartColors.success} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <Area
            type="stepAfter"
            dataKey="value"
            stroke="none"
            fill="url(#gaugeGradient)"
            fillOpacity={0.15}
          />
        </ReAreaChart>
      </ResponsiveContainer>

      {/* SVG Gauge */}
      <svg width={height * 1.2} height={height * 0.6} className="mt-2">
        {/* Background arc */}
        <path
          d={`M 20 ${height * 0.5} A ${height * 0.4} ${height * 0.4} 0 0 1 ${height * 1.2 - 20} ${height * 0.5}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={16}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M 20 ${height * 0.5} A ${height * 0.4} ${height * 0.4} 0 0 1 ${20 + (height * 1.2 - 40) * (percentage / 100)} ${height * 0.5 - Math.sqrt(Math.max(0, (height * 0.4) ** 2 - ((height * 1.2 - 40) * (percentage / 100)) ** 2))}`}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
        />
        {/* Value text */}
        <text
          x={height * 0.6}
          y={height * 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={24}
          fontWeight="bold"
        >
          {normalizedValue}
        </text>
      </svg>
    </div>
  );
}

export { chartColors };
