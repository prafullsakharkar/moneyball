/**
 * useContextHierarchy
 * ============================================
 * Derives the current navigation context level from the URL, following the
 * CricketOS hierarchy:
 *
 *   Global → Organization → Competition → Season → Team → Match → Player
 *
 * The shell uses this to keep the user oriented and to surface contextual
 * navigation without ever forcing them back to the root. Each level maps to
 * a URL segment pattern; deeper segments imply a more specific context.
 *
 * Returns the deepest matched level plus the id captured at that level.
 */
import { useLocation } from 'react-router-dom';

export type ContextLevel =
  | 'global'
  | 'organization'
  | 'competition'
  | 'season'
  | 'team'
  | 'match'
  | 'player';

export interface ContextHierarchy {
  /** Deepest context level detected from the URL. */
  level: ContextLevel;
  /** Id captured at the deepest level ('' when none). */
  id: string;
  /** Ordered list of levels from root to the deepest matched. */
  breadcrumb: ContextLevel[];
}

/** Ordered hierarchy from root to leaf. */
const HIERARCHY: ContextLevel[] = [
  'global',
  'organization',
  'competition',
  'season',
  'team',
  'match',
  'player',
];

/** Map a URL root segment to a context level. */
const SEGMENT_TO_LEVEL: Record<string, ContextLevel> = {
  organizations: 'organization',
  competitions: 'competition',
  tournaments: 'competition',
  leagues: 'competition',
  seasons: 'season',
  teams: 'team',
  matches: 'match',
  players: 'player',
};

export function useContextHierarchy(): ContextHierarchy {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  let level: ContextLevel = 'global';
  let id = '';

  for (const segment of segments) {
    const mapped = SEGMENT_TO_LEVEL[segment];
    if (mapped) {
      level = mapped;
      // The next segment (if present) is the entity id.
      const idx = segments.indexOf(segment);
      const next = segments[idx + 1];
      if (next && !SEGMENT_TO_LEVEL[next]) {
        id = next;
      }
    }
  }

  const levelIndex = HIERARCHY.indexOf(level);
  const breadcrumb = HIERARCHY.slice(0, levelIndex + 1);

  return { level, id, breadcrumb };
}
