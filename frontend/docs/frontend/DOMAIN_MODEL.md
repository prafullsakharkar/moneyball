# CricketOS Domain Model

> The ten domains below are registered as the single source of truth in
> `src/types/domain.ts` (`CRICKET_DOMAINS`). Each domain maps to a future
> `src/modules/<slug>/` module. See `docs/frontend/MODULES.md` for the module
> structure and dependency rules.

## Foundation Domain

Core platform entities that support all cricket operations.

### Identity & Access
- **User** — Global user account (email, name, avatar, MFA status)
- **Organization** — Tenant entity (cricket board, association, club, etc.)
- **Membership** — User↔Organization link with role and permissions
- **Role** — owner | admin | coach | manager | player | viewer
- **Permission** — Resource + Action pairs (e.g., players:create)
- **Session** — Active login session with device info
- **SecurityEvent** — Audit trail for auth events

### Organization Types
- National Board (e.g., Cricket Australia, BCCI)
- State Association (e.g., Mumbai Cricket Association)
- Franchise (e.g., Mumbai Indians)
- Club
- Academy
- School
- University

## Competition Domain

- **Competition** — Top-level container (IPL, BBL, etc.)
- **Tournament** — Instance of a competition in a season
- **Season** — Year/period of a tournament
- **Fixture** — Scheduled match-up
- **Match** — A specific cricket match
- **Scoring** — Ball-by-ball data

## Participants Domain

- **Player** — Cricket player profile
- **Team** — Cricket team
- **Squad** — Team roster for a competition
- **Coach** — Team coaching staff
- **Staff** — Support staff
- **Officials** — Umpires, match referees

## Facilities Domain

- **Venue** — Cricket ground/stadium
- **Ground** — Playing surface details
- **Facility** — Training/practice facilities

## Development Domain

- **Academy** — Player development program
- **Training** — Training session management
- **Fitness** — Fitness programs
- **Medical** — Medical records
- **Performance** — Performance metrics
- **Scouting** — Scouting reports

## Media Domain

- **Media** — Photos, videos, documents
- **Highlights** — Match highlights
- **LiveStream** — Live streaming

## Commercial Domain

- **Sponsorship** — Sponsorship deals
- **Auction** — Player auctions
- **Finance** — Financial transactions
- **Subscription** — Platform subscriptions

## Intelligence Domain

- **Statistics** — Player/team statistics
- **Analytics** — Advanced analytics
- **AI/ML** — AI-powered insights

## Fan Domain

- **FanProfile** — Fan engagement
- **Fantasy** — Fantasy cricket
- **Voting** — Fan polls/votes

## Platform Domain

- **Notification** — Push/email/SMS notifications
- **WhiteLabel** — White-label configuration
- **Integration** — Third-party integrations
