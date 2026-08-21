import { AppBar, Toolbar, IconButton, Box, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { Menu, Command } from 'lucide-react';
import { OrganizationSwitcher } from '@modules/organization/OrganizationSwitcher';
import { GlobalSearch } from '@modules/search/GlobalSearch';
import { CommandPalette } from '@modules/search/CommandPalette';
import { NotificationCenter } from '@modules/notifications/NotificationCenter';
import { UserMenu } from '@modules/user/UserMenu';
import { ThemeToggle } from '@shared/components';
import { layout } from '@design/tokens';

interface GlobalHeaderProps {
  onMenuToggle: () => void;
}

export function GlobalHeader({ onMenuToggle }: GlobalHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }));
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: `${layout.headerHeight}px !important`,
          px: { xs: 1, md: 2 },
          gap: 1,
        }}
      >
        {isMobile && (
          <IconButton edge="start" onClick={onMenuToggle} sx={{ mr: 0.5 }} aria-label="Open navigation">
            <Menu size={20} />
          </IconButton>
        )}

        <OrganizationSwitcher />

        <Box sx={{ flex: 1 }} />

        <GlobalSearch />
        <Tooltip title="Command palette (Ctrl+K)">
          <IconButton onClick={openCommandPalette} aria-label="Open command palette" sx={{ color: 'text.secondary' }}>
            <Command size={18} />
          </IconButton>
        </Tooltip>
        <ThemeToggle />
        <NotificationCenter />
        <UserMenu />
      </Toolbar>
      <CommandPalette />
    </AppBar>
  );
}
