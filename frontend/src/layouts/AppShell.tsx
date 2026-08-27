import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { GlobalHeader } from './GlobalHeader';
import { PrimarySidebar } from './PrimarySidebar';
import { SecondaryNavigation } from './SecondaryNavigation';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Breadcrumbs } from './Breadcrumbs';
import { layout } from '@design/tokens';

const DRAWER_WIDTH = layout.sidebarWidth;

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const effectiveWidth = collapsed ? layout.sidebarCollapsedWidth : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <GlobalHeader onMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <PrimarySidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={DRAWER_WIDTH}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { md: `${effectiveWidth}px` },
          transition: (t) =>
            t.transitions.create('margin-left', {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar sx={{ minHeight: `${layout.headerHeight}px !important` }} />
        <SecondaryNavigation sidebarWidth={effectiveWidth} />
        <WorkspaceHeader sidebarWidth={effectiveWidth} />
        <Breadcrumbs />
        <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
