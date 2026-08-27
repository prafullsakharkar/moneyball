/**
 * AiWorkspacePage — CricketOS AI Workspace
 * ============================================
 * Contextual AI insights, match/player/team analysis, scouting insights,
 * performance recommendations, and natural language search.
 *
 * Generated insights are clearly distinguished from verified statistics.
 * Respects org/permissions/data boundaries via tenant-isolated hooks.
 */
import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Chip, IconButton } from '@mui/material';
import {
  PageShell,
  PageHeader,
  PageActions,
  PageSection,
  EmptyState,
  LoadingState,
  ErrorState,
  Button,
  Input,
} from '@shared/components';
import { StatCard } from '@shared/components/cricket';
import { useAiInsights, useAiConversation, useAiAsk } from '@hooks/useCricket';
import type { AiInsight, AiConversationMessage } from '@domain/index';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RecommendIcon from '@mui/icons-material/Recommend';

type AiTab = 'overview' | 'insights' | 'conversation' | 'scouting' | 'recommendations';

const TABS: { id: AiTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <AutoAwesomeIcon /> },
  { id: 'insights', label: 'Insights', icon: <PsychologyIcon /> },
  { id: 'conversation', label: 'Ask', icon: <ChatIcon /> },
  { id: 'scouting', label: 'Scouting', icon: <PersonSearchIcon /> },
  { id: 'recommendations', label: 'Recommendations', icon: <RecommendIcon /> },
];

const SOURCE_LABELS: Record<AiInsight['source'], string> = {
  generated: 'Generated',
  verified: 'Verified',
};

export default function AiWorkspacePage() {
  const [tab, setTab] = useState<AiTab>('overview');

  const {
    data: insights,
    isLoading: insightsLoading,
    isError: insightsError,
    refetch: refetchInsights,
  } = useAiInsights();
  const {
    data: conversation,
    isLoading: conversationLoading,
    isError: conversationError,
  } = useAiConversation();

  const insightList = insights ?? [];
  const conversationList = conversation ?? [];

  const loading = insightsLoading || conversationLoading;
  const error = insightsError || conversationError;

  if (loading) {
    return (
      <PageShell>
        <LoadingState message="Loading AI insights…" />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState
          title="Unable to load AI insights"
          description="There was a problem fetching AI data."
          action={<Button variant="primary" onClick={() => refetchInsights()}>Retry</Button>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="AI Insights"
        description="Contextual analysis across matches, players, and teams."
        actions={
          <PageActions>
            <Button variant="ghost" onClick={() => refetchInsights()}>Refresh</Button>
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
        {tab === 'overview' && <OverviewTab insights={insightList} />}
        {tab === 'insights' && <InsightsTab insights={insightList} />}
        {tab === 'conversation' && <ConversationTab initial={conversationList} />}
        {tab === 'scouting' && <ScoutingTab />}
        {tab === 'recommendations' && <RecommendationsTab />}
      </Box>
    </PageShell>
  );
}

/* ── Overview ─────────────────────────────────────────── */

function OverviewTab({ insights }: { insights: AiInsight[] }) {
  const generated = insights.filter((i) => i.source === 'generated').length;
  const verified = insights.filter((i) => i.source === 'verified').length;
  const avgConfidence = insights.length
    ? insights.reduce((acc, i) => acc + (i.confidence ?? 0), 0) / insights.length
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Total insights" value={String(insights.length)} />
        <StatCard label="Generated" value={String(generated)} />
        <StatCard label="Verified" value={String(verified)} />
        <StatCard label="Avg confidence" value={`${Math.round(avgConfidence * 100)}%`} />
      </Box>

      <PageSection title="How to read AI insights">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip icon={<PsychologyIcon />} label="Generated" size="small" />
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
              Model-derived analysis. Validate against verified statistics before acting.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip icon={<VerifiedIcon />} label="Verified" size="small" />
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
              Backed by confirmed statistics from the data layer.
            </Typography>
          </Box>
        </Box>
      </PageSection>

      <PageSection title="Latest insights">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {insights.slice(0, 3).map((ins) => (
            <InsightCard key={ins.id} insight={ins} />
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Insights ─────────────────────────────────────────── */

function InsightsTab({ insights }: { insights: AiInsight[] }) {
  if (insights.length === 0) {
    return <EmptyState title="No insights" description="No AI insights are available yet." />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {insights.map((ins) => (
        <InsightCard key={ins.id} insight={ins} />
      ))}
    </Box>
  );
}

function InsightCard({ insight }: { insight: AiInsight }) {
  const generated = insight.source === 'generated';
  return (
    <Box sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        {generated ? <PsychologyIcon sx={{ fontSize: 18, color: 'primary.main' }} /> : <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />}
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{insight.title}</Typography>
        <Chip
          label={SOURCE_LABELS[insight.source]}
          size="small"
          color={generated ? 'primary' : 'success'}
          variant="outlined"
          sx={{ ml: 'auto', fontSize: '0.6875rem' }}
        />
      </Box>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{insight.body}</Typography>
      {insight.supportingStats.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
          {insight.supportingStats.map((st, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{st.label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                {st.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {insight.confidence !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Confidence</Typography>
          <Box sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ width: `${Math.round(insight.confidence * 100)}%`, height: '100%', bgcolor: 'primary.main' }} />
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(insight.confidence * 100)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* ── Conversation ─────────────────────────────────────── */

function ConversationTab({ initial }: { initial: AiConversationMessage[] }) {
  const [messages, setMessages] = useState<AiConversationMessage[]>(initial);
  const [input, setInput] = useState('');
  const ask = useAiAsk();

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    const userMsg: AiConversationMessage = {
      id: 'local_' + Date.now(),
      role: 'user',
      content: q,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    ask.mutate(q, {
      onSuccess: (reply) => {
        setMessages((prev) => [...prev, reply]);
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Natural language search">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 420, overflowY: 'auto' }}>
            {messages.length === 0 && (
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                Ask a question about matches, players, or teams. Example: "Who should bat at number 3 against spin?"
              </Typography>
            )}
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  bgcolor: m.role === 'user' ? 'primary.main' : 'background.paper',
                  border: m.role === 'user' ? 'none' : '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography sx={{ fontSize: '0.8125rem', color: m.role === 'user' ? 'primary.contrastText' : 'text.primary' }}>
                  {m.content}
                </Typography>
                {m.source && (
                  <Chip
                    label={SOURCE_LABELS[m.source]}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5, fontSize: '0.625rem', height: 18 }}
                  />
                )}
              </Box>
            ))}
            {ask.isPending && (
              <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Thinking…</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Input
              fullWidth
              size="small"
              placeholder="Ask about matches, players, or teams…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <IconButton onClick={handleSend} color="primary" disabled={!input.trim() || ask.isPending} aria-label="Send message">
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Scouting ─────────────────────────────────────────── */

function ScoutingTab() {
  const prospects = [
    { name: 'A. Sharma', role: 'Batsman', sr: 141, avg: 38.4, note: 'Strong against pace, improving vs spin.' },
    { name: 'R. Fernando', role: 'Pacer', econ: 7.1, wkts: 14, note: 'Effective in powerplay, death overs a concern.' },
    { name: 'K. Patel', role: 'All-rounder', sr: 128, econ: 7.8, note: 'Two-way value, high work rate.' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Scouting insights">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {prospects.map((p, i) => (
            <Box key={i} sx={{ px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <PersonSearchIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{p.name}</Typography>
                <Chip label={p.role} size="small" sx={{ ml: 'auto', fontSize: '0.6875rem' }} />
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{p.note}</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 0.75 }}>
                {'sr' in p && (
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>SR</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{p.sr}</Typography>
                  </Box>
                )}
                {'avg' in p && (
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Avg</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{p.avg}</Typography>
                  </Box>
                )}
                {'econ' in p && (
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Econ</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{p.econ}</Typography>
                  </Box>
                )}
                {'wkts' in p && (
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Wkts</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{p.wkts}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

/* ── Recommendations ──────────────────────────────────── */

function RecommendationsTab() {
  const recommendations = [
    { title: 'Protect Maxwell until the 15th over', detail: 'He scores 45% of runs in the final 5 overs. Preserve his wicket to maximize the total.', priority: 'High' },
    { title: 'Address death-over economy', detail: 'Economy in overs 16-20 has risen to 8.6. Consider a specialist death bowler.', priority: 'High' },
    { title: 'Continue powerplay aggression', detail: 'Higher boundary rate in the first 6 overs correlates with win probability.', priority: 'Medium' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Performance recommendations">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {recommendations.map((r, i) => (
            <Box key={i} sx={{ px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <RecommendIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{r.title}</Typography>
                <Chip
                  label={r.priority}
                  size="small"
                  color={r.priority === 'High' ? 'error' : 'primary'}
                  variant="outlined"
                  sx={{ ml: 'auto', fontSize: '0.6875rem' }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{r.detail}</Typography>
            </Box>
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}
