/**
 * MediaWorkspacePage — CricketOS Media Workspace
 * ==============================================
 * Video, clips, highlights, galleries, match footage, player footage,
 * tagging, and search across the media library.
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
  Input,
} from '@shared/components';
import { StatCard } from '@shared/components/cricket';
import { useMediaAssets, useMediaVideos } from '@hooks/useCricket';
import { useHasPermission } from '@hooks/index';
import type { MediaAsset, MediaKind, VideoAsset } from '@domain/index';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MovieIcon from '@mui/icons-material/Movie';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import TagIcon from '@mui/icons-material/Tag';

type MediaTab = 'overview' | 'videos' | 'clips' | 'highlights' | 'gallery' | 'tags';

const TABS: { id: MediaTab; label: string; icon: React.ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <VideoLibraryIcon /> },
  { id: 'videos', label: 'Videos', icon: <MovieIcon /> },
  { id: 'clips', label: 'Clips', icon: <ContentCutIcon /> },
  { id: 'highlights', label: 'Highlights', icon: <PhotoLibraryIcon /> },
  { id: 'gallery', label: 'Gallery', icon: <PhotoLibraryIcon /> },
  { id: 'tags', label: 'Tags', icon: <TagIcon /> },
];

const KIND_LABELS: Record<MediaKind, string> = {
  video: 'Video',
  image: 'Image',
  clip: 'Clip',
  highlight: 'Highlight',
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MediaWorkspacePage() {
  const [tab, setTab] = useState<MediaTab>('overview');
  const [search, setSearch] = useState('');

  const canManageMedia = useHasPermission('media', 'manage');

  const {
    data: assetsData,
    isLoading: assetsLoading,
    isError: assetsError,
    refetch: refetchAssets,
  } = useMediaAssets();
  const {
    data: videosData,
    isLoading: videosLoading,
    isError: videosError,
    refetch: refetchVideos,
  } = useMediaVideos();

  const assets = assetsData?.data ?? [];
  const videos = videosData?.data ?? [];

  const filteredAssets = assets.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const videosCount = assets.filter((a) => a.kind === 'video').length;
  const imagesCount = assets.filter((a) => a.kind === 'image').length;
  const clipsCount = assets.filter((a) => a.kind === 'clip').length;
  const highlightsCount = assets.filter((a) => a.kind === 'highlight').length;
  const totalDuration = videos.reduce((sum, v) => sum + (v.duration || 0), 0);

  const allTags = Array.from(new Set(assets.flatMap((a) => a.tags))).sort();

  const loading = assetsLoading || videosLoading;
  const error = assetsError || videosError;

  if (loading) {
    return (
      <PageShell>
        <LoadingState message="Loading media library…" />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState
          title="Unable to load media"
          description="There was a problem fetching the media library."
          action={<Button variant="primary" onClick={() => { refetchAssets(); refetchVideos(); }}>Retry</Button>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth={1400}>
      <PageHeader
        title="Media"
        description="Video, clips, highlights, and galleries across the organization."
        actions={
          canManageMedia ? (
            <PageActions>
              <Button variant="primary" startIcon={<UploadIcon />}>Upload</Button>
            </PageActions>
          ) : undefined
        }
      />

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Input
              size="small"
              placeholder="Search media…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', sm: 320 } }}
              startAdornment={
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              }
            />
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {(['video', 'image', 'clip', 'highlight'] as MediaKind[]).map((k) => (
                <Chip key={k} label={KIND_LABELS[k]} size="small" variant="outlined" />
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
            {tab === 'overview' && <OverviewTab assets={filteredAssets} videos={videos} counts={{ videos: videosCount, images: imagesCount, clips: clipsCount, highlights: highlightsCount }} totalDuration={totalDuration} />}
            {tab === 'videos' && <VideosTab videos={videos} />}
            {tab === 'clips' && <ClipsTab assets={filteredAssets} />}
            {tab === 'highlights' && <HighlightsTab assets={filteredAssets} />}
            {tab === 'gallery' && <GalleryTab assets={filteredAssets} />}
            {tab === 'tags' && <TagsTab assets={filteredAssets} tags={allTags} />}
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}

function OverviewTab({ assets, videos, counts, totalDuration }: { assets: MediaAsset[]; videos: VideoAsset[]; counts: { videos: number; images: number; clips: number; highlights: number }; totalDuration: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <StatCard label="Videos" value={counts.videos} />
        <StatCard label="Images" value={counts.images} />
        <StatCard label="Clips" value={counts.clips} />
        <StatCard label="Highlights" value={counts.highlights} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <PageSection title="Recent Assets">
          {assets.length === 0 ? (
            <EmptyState title="No media yet" description="Upload media to get started." />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {assets.slice(0, 5).map((a) => (
                <AssetRow key={a.id} asset={a} />
              ))}
            </Box>
          )}
        </PageSection>
        <PageSection title="Video Library">
          {videos.length === 0 ? (
            <EmptyState title="No videos" description="No video assets available." />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {videos.map((v) => (
                <VideoRow key={v.id} video={v} />
              ))}
            </Box>
          )}
        </PageSection>
      </Box>

      <PageSection title="Library Summary">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DetailRow label="Total assets" value={String(assets.length)} />
          <DetailRow label="Total video duration" value={formatDuration(totalDuration)} />
          <DetailRow label="Unique tags" value={String(new Set(assets.flatMap((a) => a.tags)).size)} />
        </Box>
      </PageSection>
    </Box>
  );
}

function VideosTab({ videos }: { videos: VideoAsset[] }) {
  if (videos.length === 0) {
    return <EmptyState title="No videos" description="No video assets available." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {videos.map((v) => (
        <VideoRow key={v.id} video={v} />
      ))}
    </Box>
  );
}

function ClipsTab({ assets }: { assets: MediaAsset[] }) {
  const clips = assets.filter((a) => a.kind === 'clip');
  if (clips.length === 0) {
    return <EmptyState title="No clips" description="No clips have been created yet." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {clips.map((a) => (
        <AssetCard key={a.id} asset={a} />
      ))}
    </Box>
  );
}

function HighlightsTab({ assets }: { assets: MediaAsset[] }) {
  const highlights = assets.filter((a) => a.kind === 'highlight');
  if (highlights.length === 0) {
    return <EmptyState title="No highlights" description="No highlights have been created yet." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {highlights.map((a) => (
        <AssetCard key={a.id} asset={a} />
      ))}
    </Box>
  );
}

function GalleryTab({ assets }: { assets: MediaAsset[] }) {
  const images = assets.filter((a) => a.kind === 'image');
  if (images.length === 0) {
    return <EmptyState title="No images" description="No gallery images available." />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {images.map((a) => (
        <AssetCard key={a.id} asset={a} />
      ))}
    </Box>
  );
}

function TagsTab({ assets, tags }: { assets: MediaAsset[]; tags: string[] }) {
  if (tags.length === 0) {
    return <EmptyState title="No tags" description="No tags have been applied yet." />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PageSection title="All Tags">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map((t) => {
            const count = assets.filter((a) => a.tags.includes(t)).length;
            return <Chip key={t} label={`${t} (${count})`} size="small" />;
          })}
        </Box>
      </PageSection>
      <PageSection title="Tagged Assets">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {assets.map((a) => (
            <AssetRow key={a.id} asset={a} />
          ))}
        </Box>
      </PageSection>
    </Box>
  );
}

function AssetRow({ asset }: { asset: MediaAsset }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MovieIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <Chip label={KIND_LABELS[asset.kind]} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{formatDate(asset.createdAt)}</Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{formatDuration(asset.duration)}</Typography>
      </Box>
    </Box>
  );
}

function AssetCard({ asset }: { asset: MediaAsset }) {
  return (
    <Box sx={{ px: 1.5, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper' }}>
      <Box sx={{ width: '100%', height: 96, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        <MovieIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
      </Box>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>{asset.title}</Typography>
      {asset.description && (
        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>{asset.description}</Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {asset.tags.map((t) => (
          <Chip key={t} label={t} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />
        ))}
      </Box>
    </Box>
  );
}

function VideoRow({ video }: { video: VideoAsset }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MovieIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          {video.matchLabel && <Chip label={video.matchLabel} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6875rem' }} />}
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{video.events.length} events · {video.clips.length} clips</Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{formatDuration(video.duration)}</Typography>
      </Box>
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
