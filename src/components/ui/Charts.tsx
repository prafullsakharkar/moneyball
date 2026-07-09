import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { chartColors } from '../../lib/mock-data';

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

function normalizePointData(data: Array<{ x: string | number; y: number }> | number[], categories?: string[]) {
  return data.map((point, index) => (
    typeof point === 'number'
      ? { x: categories?.[index] ?? index + 1, y: point }
      : point
  ));
}

function normalizeNamedData(data: Array<{ name: string; value: number; color?: string }> | Array<number | undefined>, categories?: string[]) {
  return data.map((point, index) => (
    typeof point === 'number' || point === undefined
      ? { name: categories?.[index] ?? String(index + 1), value: point ?? 0 }
      : point
  ));
}

export function AreaChart({ data, categories, color = chartColors.primary, height = 300, title, subtitle }: AreaChartProps) {
  const normalizedData = normalizePointData(data, categories);
  const options: Highcharts.Options = {
    chart: {
      type: 'areaspline',
      height,
      backgroundColor: 'transparent',
      style: { fontFamily: 'Inter, sans-serif' },
    },
    title: { text: title || '', style: { display: 'none' } },
    subtitle: { text: subtitle || '', style: { display: 'none' } },
    xAxis: {
      categories: normalizedData.map(d => String(d.x)),
      labels: { style: { color: '#64748b', fontSize: '11px' } },
      lineColor: '#e2e8f0',
      tickColor: '#e2e8f0',
    },
    yAxis: {
      labels: { style: { color: '#64748b', fontSize: '11px' } },
      gridLineColor: '#f1f5f9',
      title: { text: '' },
    },
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, color + '40'],
            [1, color + '00'],
          ],
        },
        lineColor: color,
        lineWidth: 2,
        marker: { enabled: false },
      },
    },
    series: [{
      type: 'areaspline',
      data: normalizedData.map(d => d.y),
    }],
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderRadius: 8,
      style: { color: '#fff' },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface LineChartProps extends ChartProps {
  series?: Array<{ name: string; data: number[]; color?: string }>;
  data?: number[];
  categories?: string[];
  height?: number;
}

export function LineChart({ series, data, categories, height = 300 }: LineChartProps) {
  const normalizedSeries = series ?? [{ name: 'Value', data: data ?? [], color: chartColors.primary }];
  const options: Highcharts.Options = {
    chart: { type: 'line', height, backgroundColor: 'transparent', style: { fontFamily: 'Inter' } },
    title: { text: '' },
    xAxis: {
      categories: categories || normalizedSeries[0]?.data.map((_, i) => String(i + 1)),
      labels: { style: { color: '#64748b' } },
      lineColor: '#e2e8f0',
    },
    yAxis: {
      labels: { style: { color: '#64748b' } },
      gridLineColor: '#f1f5f9',
      title: { text: '' },
    },
    credits: { enabled: false },
    legend: { itemStyle: { color: '#64748b' } },
    plotOptions: {
      line: { marker: { enabled: true, radius: 4 }, lineWidth: 2 },
    },
    series: normalizedSeries.map(s => ({ ...s, type: 'line' as const })),
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, style: { color: '#fff' } },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface BarChartProps extends ChartProps {
  data: Array<{ name: string; value: number; color?: string }> | Array<number | undefined>;
  categories?: string[];
  color?: string;
  horizontal?: boolean;
  height?: number;
}

export function BarChart({ data, categories, color = chartColors.primary, horizontal = false, height = 300 }: BarChartProps) {
  const normalizedData = normalizeNamedData(data, categories);
  const options: Highcharts.Options = {
    chart: { type: horizontal ? 'bar' : 'column', height, backgroundColor: 'transparent', style: { fontFamily: 'Inter' } },
    title: { text: '' },
    xAxis: {
      categories: normalizedData.map(d => d.name),
      labels: { style: { color: '#64748b' } },
      lineColor: '#e2e8f0',
    },
    yAxis: {
      labels: { style: { color: '#64748b' } },
      gridLineColor: '#f1f5f9',
      title: { text: '' },
    },
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 4 },
      column: { borderRadius: 4 },
    },
    series: [{
      type: horizontal ? 'bar' : 'column',
      data: normalizedData.map(d => ({ y: d.value, color: d.color || color })),
    }],
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, style: { color: '#fff' } },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface DonutChartProps extends ChartProps {
  data: Array<{ name: string; value: number; color?: string }> | Array<number | undefined>;
  categories?: string[];
  labels?: string[];
  height?: number;
  innerSize?: string;
}

export function DonutChart({ data, categories, labels, height = 300, innerSize = '60%' }: DonutChartProps) {
  const normalizedData = normalizeNamedData(data, categories ?? labels);
  const options: Highcharts.Options = {
    chart: { type: 'pie', height, backgroundColor: 'transparent', style: { fontFamily: 'Inter' } },
    title: { text: '' },
    plotOptions: {
      pie: {
        innerSize,
        borderWidth: 0,
        dataLabels: { enabled: true, style: { color: '#64748b' } },
      },
    },
    credits: { enabled: false },
    series: [{
      type: 'pie',
      data: normalizedData.map(d => ({ name: d.name, y: d.value, color: d.color || chartColors.primary })),
    }],
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, style: { color: '#fff' } },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface RadarChartProps {
  categories: string[];
  data: number[];
  color?: string;
  height?: number;
}

export function RadarChart({ categories, data, color = chartColors.primary, height = 300 }: RadarChartProps) {
  const options: Highcharts.Options = {
    chart: { polar: true, type: 'line', height, backgroundColor: 'transparent', style: { fontFamily: 'Inter' } },
    title: { text: '' },
    pane: { size: '80%' },
    xAxis: {
      categories,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      labels: { style: { color: '#64748b', fontSize: '11px' } },
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      labels: { enabled: false },
    },
    credits: { enabled: false },
    legend: { enabled: false },
    series: [{
      type: 'line',
      data,
      color,
      lineWidth: 2,
      marker: { enabled: true, radius: 4, fillColor: color },
    }],
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, style: { color: '#fff' } },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface WormChartProps extends ChartProps {
  data: Array<{ over: number; team1: number; team2: number }> | number[];
  categories?: string[];
  team1Name?: string;
  team2Name?: string;
  height?: number;
}

export function WormChart({ data, categories, team1Name = 'Team 1', team2Name = 'Team 2', height = 300 }: WormChartProps) {
  const normalizedData = data.map((point, index) => (
    typeof point === 'number'
      ? { over: Number(categories?.[index] ?? index + 1), team1: point, team2: point }
      : point
  ));
  const options: Highcharts.Options = {
    chart: { type: 'line', height, backgroundColor: 'transparent', style: { fontFamily: 'Inter' } },
    title: { text: '' },
    xAxis: {
      title: { text: 'Overs', style: { color: '#64748b' } },
      labels: { style: { color: '#64748b' } },
      lineColor: '#e2e8f0',
    },
    yAxis: {
      title: { text: 'Runs', style: { color: '#64748b' } },
      labels: { style: { color: '#64748b' } },
      gridLineColor: '#f1f5f9',
    },
    credits: { enabled: false },
    legend: { itemStyle: { color: '#64748b' } },
    plotOptions: { line: { lineWidth: 2, marker: { enabled: false } } },
    series: [
      { type: 'line', name: team1Name, data: normalizedData.map(d => d.team1), color: chartColors.cyan },
      { type: 'line', name: team2Name, data: normalizedData.map(d => d.team2), color: chartColors.purple },
    ],
    tooltip: { shared: true, backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, style: { color: '#fff' } },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface ManhattanChartProps extends ChartProps {
  data: Array<{ over: number; runs: number; wicket?: boolean }> | number[];
  categories?: string[];
  color?: string;
  height?: number;
}

export function ManhattanChart({ data, categories, color = chartColors.primary, height = 300 }: ManhattanChartProps) {
  const normalizedData = data.map((point, index) => (
    typeof point === 'number'
      ? { over: Number(categories?.[index] ?? index + 1), runs: point }
      : point
  ));
  const options: Highcharts.Options = {
    chart: { type: 'column', height, backgroundColor: 'transparent', style: { fontFamily: 'Inter' } },
    title: { text: '' },
    xAxis: {
      categories: normalizedData.map(d => String(d.over)),
      title: { text: 'Over', style: { color: '#64748b' } },
      labels: { style: { color: '#64748b' } },
      lineColor: '#e2e8f0',
    },
    yAxis: {
      title: { text: 'Runs', style: { color: '#64748b' } },
      labels: { style: { color: '#64748b' } },
      gridLineColor: '#f1f5f9',
    },
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: { column: { borderRadius: 2, pointPadding: 0.1 } },
    series: [{
      type: 'column',
      data: normalizedData.map(d => ({
        y: d.runs,
        color: d.wicket ? chartColors.error : color,
      })),
    }],
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderRadius: 8,
      style: { color: '#fff' },
      formatter: function() { return `<b>Over ${this.x}</b><br/>Runs: ${this.y}`; },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

interface GaugeChartProps {
  value: number;
  title?: string;
  height?: number;
}

export function GaugeChart({ value, title, height = 200 }: GaugeChartProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  const color = normalizedValue < 30
    ? chartColors.error
    : normalizedValue < 60
      ? chartColors.warning
      : chartColors.success;

  return (
    <div className="flex flex-col items-center justify-center" style={{ height }}>
      {title && <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>}
      <div
        className="relative h-32 w-32 rounded-full"
        style={{
          background: `conic-gradient(${color} ${normalizedValue * 3.6}deg, #e2e8f0 0deg)`,
        }}
      >
        <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white dark:bg-slate-900">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(normalizedValue)}%</span>
        </div>
      </div>
    </div>
  );
}

export { chartColors };
