/**
 * CricketOS Domain Registry
 * ============================================
 * Single source of truth for the ten CricketOS domains.
 *
 * Every future feature module MUST belong to exactly one domain. Registering a
 * domain here (and adding a matching `src/modules/<slug>/` directory) keeps the
 * platform consistent and enables org-aware + permission-aware navigation,
 * routing, and search indexing.
 *
 * Domains are intentionally NOT implemented as large business modules yet.
 * This registry establishes the contract so modules can be added uniformly.
 */

export type CricketDomainSlug =
  | 'foundation'
  | 'competition'
  | 'participants'
  | 'facilities'
  | 'development'
  | 'media'
  | 'commercial'
  | 'fan'
  | 'intelligence'
  | 'platform';

export interface CricketDomain {
  /** Stable machine slug (used for module folder + route prefix). */
  slug: CricketDomainSlug;
  /** Human-readable domain name. */
  name: string;
  /** One-line description of the domain's responsibility. */
  description: string;
  /** Primary resources owned by this domain (used for permission scoping). */
  resources: string[];
  /** Whether the domain is currently implemented as a module. */
  implemented: boolean;
}

export const CRICKET_DOMAINS: CricketDomain[] = [
  {
    slug: 'foundation',
    name: 'Foundation',
    description: 'Core platform entities: identity, access, organizations, memberships, roles, permissions.',
    resources: ['user', 'organization', 'membership', 'role', 'permission', 'session'],
    implemented: true,
  },
  {
    slug: 'competition',
    name: 'Competition',
    description: 'Competitions, tournaments, seasons, fixtures, matches, and ball-by-ball scoring.',
    resources: ['competition', 'tournament', 'season', 'fixture', 'match', 'scoring'],
    implemented: false,
  },
  {
    slug: 'participants',
    name: 'Participants',
    description: 'Players, teams, squads, coaches, staff, and match officials.',
    resources: ['player', 'team', 'squad', 'coach', 'staff', 'official'],
    implemented: false,
  },
  {
    slug: 'facilities',
    name: 'Facilities',
    description: 'Venues, grounds, and training/practice facilities.',
    resources: ['venue', 'ground', 'facility'],
    implemented: false,
  },
  {
    slug: 'development',
    name: 'Development',
    description: 'Academies, training, fitness, medical, performance, and scouting.',
    resources: ['academy', 'training', 'fitness', 'medical', 'performance', 'scouting'],
    implemented: false,
  },
  {
    slug: 'media',
    name: 'Media',
    description: 'Photos, videos, documents, highlights, and live streaming.',
    resources: ['media', 'highlight', 'livestream'],
    implemented: false,
  },
  {
    slug: 'commercial',
    name: 'Commercial',
    description: 'Sponsorships, auctions, finance, and subscriptions.',
    resources: ['sponsorship', 'auction', 'finance', 'subscription'],
    implemented: false,
  },
  {
    slug: 'fan',
    name: 'Fan',
    description: 'Fan profiles, fantasy cricket, and fan engagement/voting.',
    resources: ['fanprofile', 'fantasy', 'voting'],
    implemented: false,
  },
  {
    slug: 'intelligence',
    name: 'Intelligence',
    description: 'Statistics, advanced analytics, and AI/ML-powered insights.',
    resources: ['statistics', 'analytics', 'insights'],
    implemented: false,
  },
  {
    slug: 'platform',
    name: 'Platform',
    description: 'Notifications, white-label configuration, and third-party integrations.',
    resources: ['notification', 'whitelabel', 'integration'],
    implemented: true,
  },
];

/** Lookup a domain by slug. */
export function getDomain(slug: CricketDomainSlug): CricketDomain | undefined {
  return CRICKET_DOMAINS.find((d) => d.slug === slug);
}

/** All resources across every domain (for permission registry / docs). */
export const ALL_DOMAIN_RESOURCES: string[] = CRICKET_DOMAINS.flatMap((d) => d.resources);
