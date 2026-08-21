import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Zap } from 'lucide-react';
import { Card } from '@shared/components';

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'inline-flex', color: 'primary.main', mb: 1 }}>
            <Zap size={48} strokeWidth={1.5} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
            CricketOS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global Cricket Platform
          </Typography>
        </Box>
        <Outlet />
      </Card>
    </Box>
  );
}
