import { Box } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import { PageShell, PageHeader, StatCard, Motion, stagger } from '@shared/components';
import { motion } from '@shared/components/motion';

const stats = [
  { label: 'Teams', value: 0, icon: <GroupsIcon />, accent: 'primary' as const },
  { label: 'Players', value: 0, icon: <PeopleIcon />, accent: 'success' as const },
  { label: 'Matches', value: 0, icon: <SportsCricketIcon />, accent: 'warning' as const },
  { label: 'Competitions', value: 0, icon: <EmojiEventsIcon />, accent: 'info' as const },
];

export default function HomePage() {
  return (
    <PageShell>
      <PageHeader title="Dashboard" description="Overview of your cricket platform" />

      <motion.div variants={stagger} initial="hidden" animate="visible">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {stats.map((stat) => (
            <Motion key={stat.label} variant="fadeUp">
              <StatCard value={stat.value} label={stat.label} icon={stat.icon} accent={stat.accent} />
            </Motion>
          ))}
        </Box>
      </motion.div>
    </PageShell>
  );
}
