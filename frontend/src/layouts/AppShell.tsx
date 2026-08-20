import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { GlobalHeader } from './GlobalHeader';
import { PrimaryNavigation } from './PrimaryNavigation';
import { Breadcrumbs } from './Breadcrumbs';

const DRAWER_WIDTH = 260;

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <GlobalHeader onMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <PrimaryNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={DRAWER_WIDTH}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Breadcrumbs />
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
