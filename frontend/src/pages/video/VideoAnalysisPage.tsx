/**
 * VideoAnalysisPage — CricketOS Video Analysis Workspace
 * ======================================================
 * Video, timeline, events, tags, players, ball events, clips, and annotations.
 */
import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Chip, Slider } from '@mui/material';
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
import { useMediaVideos, useMediaVideo } from '@hooks/useCricket';
import { useHasPermission } from '@hooks/index';
import type { VideoAsset, VideoEvent, VideoClip } from '@domain/index';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TimelineIcon from '@mui/icons-material/Timeline';
import EventIcon from '@mui/icons-material/Event';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TagIcon from '@mui/icons-material/Tag';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

type VideoTab = 'overview' | 'timeline' | 'events' | 'clips' | 'tags';

const TABS: { id: VideoTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <VideoLibraryIcon /> },
  { id: 'timeline', label: 'Timeline', icon: <TimelineIcon /> },
  { id: 'events', label: 'Events', icon: <EventIcon /> },
  { id: 'clips', label: 'Clips', icon: <ContentCutIcon /> },
  { id: 'tags', label: 'Tags', icon: <TagIcon /> },
];

const EVENT_TYPE_LABELS: Record<VideoEvent['type'], string> = {
  ball: 'Ball',
  wicket: 'Wicket',
  boundary: 'Boundary',
  milestone: 'Milestone',
  annotation: 'Annotation',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function VideoAnalysisPage() {
  const [tab, setTab] = useState<VideoTab>('overview');
  const [activeId, setActiveId] = useState<string | null>(null);
  const canManageMedia = useHasPermission('media', 'manage');

  const {
    data: videosData,
    isLoading: videosLoading,
    isError: videosError,
    refetch: refetchVideos,
  } = useMediaVideos();

  const videos = videosData?.data ?? [];
  const activeVideo = activeId ? videos.find((v) => v.id === activeId) ?? null : videos[0] ?? null;

  const { data: detailVideo } = useMediaVideo(activeVideo?.id ?? '');

  const video: VideoAsset | null = detailVideo ?? activeVideo;

  if (videosLoading) {
    return (
      <PageShell>
        <LoadingState message="Loading video analysis…" />
      </PageShell>
    );
  }

  if (videosError) {
    return (
      <PageShell>
        <ErrorState
          title="Unable to load videos"
          description="There was a problem fetching the video library."
          action={<Button variant="primary" onClick={() => refetchVideos()}>Retry</Button>}
        />
      </PageShell>
    );
  }

  if (!video) {
    return (
      <PageShell>
        <EmptyState title="No videos" description="No video assets are available for analysis." />
      </PageShell>
    );
  }

  const totalEvents = video.events.length;
  const totalClips = video.clips.length;
  const allTags = Array.from(new Set([...video.tags, ...video.events.flatMap((e) => e.tags), ...video.clips.flatMap((c) => c.tags)]));

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Video Analysis"
        description={video.title}
        actions={
          canManageMedia ? (
            <PageActions>
              <Button variant="primary" startIcon={<PlayCircleIcon />}>Play</Button>
            </PageActions>
          ) : undefined
        }
      />

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        <Box sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {videos.map((v) => (
              <Box
                key={v.id}
                onClick={() => setActiveId(v.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: v.id === video.id ? 'primary.main' : 'divider',
                  bgcolor: v.id === video.id ? 'action.selected' : 'transparent',
                }}
              >
                <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <VideoLibraryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{formatDuration(v.duration)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {videos.map((v) => (
                <Chip
                  key={v.id}
                  label={v.title}
                  size="small"
                  onClick={() => setActiveId(v.id)}
                  color={v.id === video.id ? 'primary' : 'default'}
                  variant={v.id === video.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
              {TABS.map((t) => (
                <Tab key={t.id} value={t.id} label={t.label} icon={t.icon} iconPosition="start" />
              ))}
            </Tabs>
          </Box>

          <Box>
            {tab === 'overview' && <OverviewTab video={video} totalEvents={totalEvents} totalClips={totalClips} />}
            {tab === 'timeline' && <TimelineTab video={video} />}
            {tab === 'events' && <EventsTab video={video} />}
            {tab === 'clips' && <ClipsTab video={video} />}
            {tab === 'tags' && <TagsTab video={video} tags={allTags} />}
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}

function OverviewTab({ video, totalEvents, totalClips }: { video: VideoAsset; totalEvents: number; totalClips: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Duration" value={formatDuration(video.duration)} />
        <StatCard label="Events" value={totalEvents} />
        <StatCard label="Clips" value={totalClips} />
        <StatCard label="Tags" value={video.tags.length} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Video Player">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, px: 2, py: 6, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
            <PlayCircleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{video.title}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{video.matchLabel ?? 'No match linked'}</Typography>
            </Box>
          </Box>
        </PageSection>
        <PageSection title="Video Details">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {video.description && <DetailRow label="Description" value={video.description} />}
            <DetailRow label="Duration" value={formatDuration(video.duration)} />
            <DetailRow label="Match" value={video.matchLabel ?? '—'} />
            <DetailRow label="Events" value={String(video.events.length)} />
            <DetailRow label="Clips" value={String(video.clips.length)} />
          </Box>
        </PageSection>
      </Box>

      <PageSection title="Tags">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {video.tags.map((t) => (
            <Chip key={t} label={t} size="small" />
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

function TimelineTab({ video }: { video: VideoAsset }) {
  const events = [...video.events].sort((a, b) => a.timestamp - b.timestamp);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="Timeline">
        <Box sx={{ mb: 2 }}>
          <Slider
            value={video.duration}
            min={0}
            max={video.duration}
            disabled
            valueLabelDisplay="off"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {events.length === 0 ? (
            <EmptyState title="No events" description="No timeline events have been tagged yet." compact />
          ) : (
            events.map((e) => (
              <Box key={e.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <Box sx={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{formatTime(e.timestamp)}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>{e.label}</Typography>
                  {e.playerName && <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{e.playerName}</Typography>}
                </Box>
                <Chip label={EVENT_TYPE_LABELS[e.type]} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />
              </Box>
            ))
          )}
        </Box>
      </PageSection>
    </Box>
  );
}

function EventsTab({ video }: { video: VideoAsset }) {
  const events = [...video.events].sort((a, b) => a.timestamp - b.timestamp);
  if (events.length === 0) {
    return <EmptyState title="No events" description="No events have been tagged on this video." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {events.map((e) => (
        <Box key={e.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SportsCricketIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{e.label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
              <Chip label={EVENT_TYPE_LABELS[e.type]} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />
              {e.runs !== undefined && <Chip label={`${e.runs} runs`} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />}
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{formatTime(e.timestamp)}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function ClipsTab({ video }: { video: VideoAsset }) {
  if (video.clips.length === 0) {
    return <EmptyState title="No clips" description="No clips have been created from this video." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {video.clips.map((c) => (
        <ClipCard key={c.id} clip={c} />
      ))}
    </Box>
  );
}

function ClipCard({ clip }: { clip: VideoClip }) {
  return (
    <Box sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ContentCutIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{clip.title}</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
        {formatTime(clip.start)} – {formatTime(clip.end)}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {clip.tags.map((t) => (
          <Chip key={t} label={t} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />
        ))}
      </Box>
    </Box>
  );
}

function TagsTab({ video, tags }: { video: VideoAsset; tags: string[] }) {
  if (tags.length === 0) {
    return <EmptyState title="No tags" description="No tags have been applied to this video." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="All Tags">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map((t) => (
            <Chip key={t} label={t} size="small" />
          ))}
        </Box>
      </PageSection>
      <PageSection title="Tagged Events">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {video.events.map((e) => (
            <Box key={e.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>{e.label}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {e.tags.map((t) => (
                  <Chip key={t} label={t} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}
