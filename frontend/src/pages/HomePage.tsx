import { Box, Card, CardContent, Typography } from '@mui/material';
import { PageHeader } from '@shared/components/PageHeader';

const stats = [
  { label: 'Teams', value: 0, color: 'primary.main' },
  { label: 'Players', value: 0, color: 'success.main' },
  { label: 'Matches', value: 0, color: 'warning.main' },
  { label: 'Competitions', value: 0, color: 'info.main' },
];

export default function HomePage() {
  return (
    <Box>
      <PageHeader title="Dashboard" description="Overview of your cricket platform" />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{stat.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
