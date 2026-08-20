import { Outlet } from 'react-router-dom';
import { Box, Card, CardContent, Typography } from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SportsCricketIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
              CricketOS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Global Cricket Platform
            </Typography>
          </Box>
          <Outlet />
        </CardContent>
      </Card>
    </Box>
  );
}
