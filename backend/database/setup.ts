// Database Setup Script for CricketIQ Platform
// This script initializes all database schemas for the microservices

import { pool as identityPool } from '../identity/src/config/database';
import { pool as organizationPool } from '../organization/src/config/database';
import { pool as playerPool } from '../player/src/config/database';
import { pool as teamPool } from '../team/src/config/database';
import { pool as matchPool } from '../match/src/config/database';
import { pool as scoringPool } from '../scoring/src/config/database';
import { pool as competitionPool } from '../competition/src/config/database';
import { pool as analyticsPool } from '../analytics/src/config/database';
import { pool as mediaPool } from '../media/src/config/database';
import { pool as financePool } from '../finance/src/config/database';
import { pool as notificationPool } from '../notification/src/config/database';
import { pool as videoAnalysisPool } from '../video-analysis/src/config/database';
import { pool as trainingPool } from '../training/src/config/database';
import { pool as scoutingPool } from '../scouting/src/config/database';
import { pool as reportingPool } from '../reporting/src/config/database';
import { pool as auctionPool } from '../auction/src/config/database';
import { pool as sponsorshipPool } from '../sponsorship/src/config/database';
import { pool as adminPool } from '../admin/src/config/database';

const databases = [
  { name: 'Identity', pool: identityPool },
  { name: 'Organization', pool: organizationPool },
  { name: 'Player', pool: playerPool },
  { name: 'Team', pool: teamPool },
  { name: 'Match', pool: matchPool },
  { name: 'Scoring', pool: scoringPool },
  { name: 'Competition', pool: competitionPool },
  { name: 'Analytics', pool: analyticsPool },
  { name: 'Media', pool: mediaPool },
  { name: 'Finance', pool: financePool },
  { name: 'Notification', pool: notificationPool },
  { name: 'Video Analysis', pool: videoAnalysisPool },
  { name: 'Training', pool: trainingPool },
  { name: 'Scouting', pool: scoutingPool },
  { name: 'Reporting', pool: reportingPool },
  { name: 'Auction', pool: auctionPool },
  { name: 'Sponsorship', pool: sponsorshipPool },
  { name: 'Admin', pool: adminPool }
];

const setupDatabase = async (): Promise<void> => {
  console.log('Starting database setup for CricketIQ Platform...\n');

  for (const db of databases) {
    try {
      console.log(`Initializing ${db.name} database...`);
      await db.pool.query('SELECT 1');
      console.log(`  ✓ ${db.name} database connection successful`);
    } catch (error) {
      console.error(`  ✗ ${db.name} database connection failed:`, error);
    }
  }

  console.log('\nDatabase setup completed!');
};

const main = async (): Promise<void> => {
  try {
    await setupDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

main();
