import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Zap } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ display: 'inline-flex', color: 'text.disabled', mb: 2 }}>
        <Zap size={64} strokeWidth={1.5} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>404</Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
        This page does not exist yet.
      </Typography>
      <Link
        to="/"
        style={{ fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        &larr; Back to Dashboard
      </Link>
    </Box>
  );
}
