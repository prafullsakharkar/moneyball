/**
 * AnalyticsWorkspacePage — CricketOS Analytics Workspace
 * ============================================
 * Premium analytics workspace that answers the core questions:
 *   - What changed? (change)
 *   - Why did performance change? (performance)
 *   - Who is improving / declining? (improving / declining)
 *   - Where is the team losing? (location)
 *   - Which players outperform expectations? (expectation)
 *
 * Charts are purposeful (no decorative visuals), restrained colors, and all
 * cricket metrics use tabular numbers.
 */
import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Chip } from '@mui/material';
import {
  PageShell,
  PageHeader,
  PageActions,
  PageSection,
  EmptyState,
  LoadingState,
  ErrorState,
  Button,
} from '@shared/components';
import { StatCard } from '@shared/components/cricket';
import {
  LineChart,
  BarChart,
  ScatterChart,
  Heatmap,
  DonutChart,
} from '@shared/components/analytics';
import { useAnalyticsQuestions, useAnalyticsInsights } from '@hooks/useCricket';
import type { AnalyticsQuestion, AnalyticsInsight } from '@domain/index';
import InsightsIcon from '@mui/icons-material/Insights';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GridOnIcon from '@mui/icons-material/GridOn';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';

type AnalyticsTab =
  | 'overview'
  | 'questions'
  | 'insights'
  | 'trends'
  | 'comparisons'
  | 'heatmap'
  | 'scatter';

const TABS: { id: AnalyticsTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <InsightsIcon /> },
  { id: 'questions', label: 'Questions', icon: <QuizIcon /> },
  { id: 'insights', label: 'Insights', icon: <TrendingUpIcon /> },
  { id: 'trends', label: 'Trends', icon: <TrendingUpIcon /> },
  { id: 'comparisons', label: 'Comparisons', icon: <CompareArrowsIcon /> },
  { id: 'heatmap', label: 'Heatmap', icon: <GridOnIcon /> },
  { id: 'scatter', label: 'Scatter', icon: <ScatterPlotIcon /> },
];

const CATEGORY_LABELS: Record<AnalyticsQuestion['category'], string> = {
  change: 'What changed?',
  performance: 'Why performance changed',
  improving: 'Who is improving',
  declining: 'Who is declining',
  location: 'Where we lose',
  expectation: 'Outperforming expectations',
};

const SEVERITY_COLORS: Record<AnalyticsInsight['severity'], string> = {
  positive: 'success.main',
  negative: 'error.main',
  neutral: 'text.secondary',
};

export default function AnalyticsWorkspacePage() {
  const [tab, setTab] = useState<AnalyticsTab>('overview');

  const {
    data: questions,
    isLoading: questionsLoading,
    isError: questionsError,
    refetch: refetchQuestions,
  } = useAnalyticsQuestions();
  const {
    data: insights,
    isLoading: insightsLoading,
    isError: insightsError,
    refetch: refetchInsights,
  } = useAnalyticsInsights();

  const questionList = questions ?? [];
  const insightList = insights ?? [];

  const loading = questionsLoading || insightsLoading;
  const error = questionsError || insightsError;
  const refetch = () => {
    refetchQuestions();
    refetchInsights();
  };

  if (loading) {
    return (
      <PageShell>
        <LoadingState message="Loading analytics…" />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState
          title="Unable to load analytics"
          description="There was a problem fetching analytics data."
          action={<Button variant="primary" onClick={refetch}>Retry</Button>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Analytics"
        description="Answering what changed, why, and who is driving performance."
        actions={
          <PageActions>
            <Button variant="ghost" onClick={refetch}>Refresh</Button>
          </PageActions>
        }
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {TABS.map((t) => (
            <Tab key={t.id} value={t.id} label={t.label} icon={t.icon} iconPosition="start" />
          ))}
        </Tabs>
      </Box>

      <Box>
        {tab === 'overview' && <OverviewTab questions={questionList} insights={insightList} />}
        {tab === 'questions' && <QuestionsTab questions={questionList} />}
        {tab === 'insights' && <InsightsTab insights={insightList} />}
        {tab === 'trends' && <TrendsTab insights={insightList} />}
        {tab === 'comparisons' && <ComparisonsTab />}
        {tab === 'heatmap' && <HeatmapTab />}
        {tab === 'scatter' && <ScatterTab />}
      </Box>
    </PageShell>
  );
}

/* ── Overview ─────────────────────────────────────────── */

function OverviewTab({ questions, insights }: { questions: AnalyticsQuestion[]; insights: AnalyticsInsight[] }) {
  const positive = insights.filter((i) => i.severity === 'positive').length;
  const negative = insights.filter((i) => i.severity === 'negative').length;
  const avgChange = insights.length
    ? insights.reduce((acc, i) => acc + Math.abs(i.change), 0) / insights.length
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Questions answered" value={String(questions.length)} />
        <StatCard label="Active insights" value={String(insights.length)} />
        <StatCard label="Positive signals" value={String(positive)} />
        <StatCard label="Concerns" value={String(negative)} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Key Questions">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {questions.slice(0, 4).map((q) => (
              <Box key={q.id} sx={{ px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                  {q.question}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: 0.25 }}>
                  {q.answer}
                </Typography>
              </Box>
            ))}
          </Box>
        </PageSection>

        <PageSection title="Insight Signals">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {insights.map((ins) => (
              <Box key={ins.id} sx={{ px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: SEVERITY_COLORS[ins.severity], flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                    {ins.title}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {ins.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </PageSection>
      </Box>

      <PageSection title="Average absolute change across metrics">
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {avgChange.toFixed(1)}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>units per metric</Typography>
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Questions ────────────────────────────────────────── */

function QuestionsTab({ questions }: { questions: AnalyticsQuestion[] }) {
  if (questions.length === 0) {
    return <EmptyState title="No questions" description="No analytics questions are available yet." />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {questions.map((q) => (
        <PageSection key={q.id} title={q.question}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip
              label={CATEGORY_LABELS[q.category]}
              size="small"
              sx={{ alignSelf: 'flex-start', fontSize: '0.6875rem' }}
            />
            <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>{q.answer}</Typography>
            {q.evidence.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                {q.evidence.map((e, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      {e}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </PageSection>
      ))}
    </Box>
  );
}

/* ── Insights ─────────────────────────────────────────── */

function InsightsTab({ insights }: { insights: AnalyticsInsight[] }) {
  if (insights.length === 0) {
    return <EmptyState title="No insights" description="No analytics insights are available yet." />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {insights.map((ins) => (
        <PageSection key={ins.id} title={ins.title}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: SEVERITY_COLORS[ins.severity], flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{ins.description}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{ins.metric}</Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {ins.change > 0 ? '+' : ''}{ins.change}
              </Typography>
            </Box>
            <LineChart
              labels={ins.trend.map((t) => t.label)}
              series={[{ label: ins.metric, data: ins.trend.map((t) => t.value) }]}
              height={160}
              showLegend={false}
            />
          </Box>
        </PageSection>
      ))}
    </Box>
  );
}

/* ── Trends ───────────────────────────────────────────── */

function TrendsTab({ insights }: { insights: AnalyticsInsight[] }) {
  if (insights.length === 0) {
    return <EmptyState title="No trends" description="No trend data is available yet." />;
  }

  const labels = insights[0].trend.map((t) => t.label);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Metric trends over recent matches">
        <LineChart
          labels={labels}
          series={insights.map((ins) => ({
            label: ins.metric,
            data: ins.trend.map((t) => t.value),
          }))}
          height={260}
        />
      </PageSection>
    </Box>
  );
}

/* ── Comparisons ──────────────────────────────────────── */

function ComparisonsTab() {
  const data = [
    { label: 'Powerplay RR', value: 9.0, baseline: 7.6 },
    { label: 'Death over econ', value: 8.6, baseline: 7.4 },
    { label: 'Boundary %', value: 27, baseline: 21 },
    { label: 'Strike rate', value: 152, baseline: 138 },
    { label: 'Wickets/match', value: 6.4, baseline: 5.8 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Team vs league baseline">
        <BarChart
          data={data.map((d) => ({ label: d.label, value: d.value, baseline: d.baseline }))}
          height={240}
          showValues
        />
      </PageSection>
      <PageSection title="Outperforming expectations">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {data.map((d) => {
            const diff = d.value - d.baseline;
            const positive = diff >= 0;
            return (
              <Box key={d.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <Typography sx={{ flex: 1, fontSize: '0.8125rem', color: 'text.primary' }}>{d.label}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {d.value} vs {d.baseline}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: positive ? 'success.main' : 'error.main', fontVariantNumeric: 'tabular-nums' }}>
                  {positive ? '+' : ''}{diff.toFixed(1)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Heatmap ──────────────────────────────────────────── */

function HeatmapTab() {
  const rows = ['Powerplay', 'Middle', 'Death'];
  const cols = ['M1', 'M2', 'M3', 'M4', 'M5'];
  const values = [
    [7.2, 7.8, 8.1, 8.6, 9.0],
    [6.8, 7.0, 7.1, 7.3, 7.4],
    [7.2, 7.6, 8.0, 8.3, 8.6],
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Run rate by phase and match">
        <Heatmap rows={rows} cols={cols} values={values} height={200} />
      </PageSection>
      <PageSection title="Reading the heatmap">
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
          Brighter cells indicate higher run rates. The powerplay phase is trending up (aggression paying off),
          while the death overs are also rising — a concern for close finishes.
        </Typography>
      </PageSection>
    </Box>
  );
}

/* ── Scatter ──────────────────────────────────────────── */

function ScatterTab() {
  const data = [
    { x: 128, y: 32, label: 'M1' },
    { x: 134, y: 35, label: 'M2' },
    { x: 141, y: 38, label: 'M3' },
    { x: 147, y: 41, label: 'M4' },
    { x: 152, y: 45, label: 'M5' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Strike rate vs boundary percentage">
        <ScatterChart data={data} xLabel="Strike rate" yLabel="Boundary %" height={240} showLabels />
      </PageSection>
      <PageSection title="Player expectation vs output">
        <DonutChart
          data={[
            { label: 'Exceeding', value: 3, color: 'success.main' },
            { label: 'Meeting', value: 4, color: 'primary.main' },
            { label: 'Below', value: 2, color: 'error.main' },
          ]}
          size={180}
          thickness={26}
          centerLabel="Players"
          centerValue="9"
          showLegend
        />
      </PageSection>
    </Box>
  );
}
