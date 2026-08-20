import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <SportsCricketIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700 }}>404</Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
        This page does not exist yet.
      </Typography>
      <Link to="/" style={{ fontWeight: 500 }}>&larr; Back to Dashboard</Link>
    </Box>
  );
}
