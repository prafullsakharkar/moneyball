/**
 * SecondaryNavigation
 * ============================================
 * Horizontal sub-navigation bar rendered below the global header.
 * Shows the items of the currently active primary section, filtered by the
 * user's permissions in the active organization.
 *
 * Organization-aware: scoped to the current org context.
 * Permission-aware: uses `useFilteredNavigation` so restricted items are hidden.
 */
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import { useFilteredNavigation } from '@hooks/useFilteredNavigation';
import { layout } from '@design/tokens';

function isActive(href: string, pathname: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function SecondaryNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sections = useFilteredNavigation();

  // Find the active section (the one containing the current path).
  const activeSection = sections.find((section) =>
    section.items.some((item) => isActive(item.href, location.pathname))
  );

  if (!activeSection || activeSection.items.length <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: { xs: 1, md: 2 },
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflowX: 'auto',
        ml: { md: `${layout.sidebarWidth}px` },
      }}
    >
      {activeSection.items.map((item) => {
        const active = isActive(item.href, location.pathname);
        const Icon = item.icon;
        return (
          <Chip
            key={item.href}
            icon={<Icon size={14} />}
            label={item.label}
            clickable
            onClick={() => navigate(item.href)}
            color={active ? 'primary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
            size="small"
            sx={{
              fontWeight: active ? 600 : 400,
              '& .MuiChip-icon': { fontSize: 14 },
            }}
          />
        );
      })}
      {isMobile && <Box sx={{ flex: 1 }} />}
    </Box>
  );
}
