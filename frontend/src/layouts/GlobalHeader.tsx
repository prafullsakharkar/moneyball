import { AppBar, Toolbar, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { OrganizationSwitcher } from '@modules/organization/OrganizationSwitcher';
import { GlobalSearch } from '@modules/search/GlobalSearch';
import { NotificationCenter } from '@modules/notifications/NotificationCenter';
import { UserMenu } from '@modules/user/UserMenu';

interface GlobalHeaderProps {
  onMenuToggle: () => void;
}

export function GlobalHeader({ onMenuToggle }: GlobalHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar disableGutters sx={{ px: { xs: 1, md: 2 }, gap: 1 }}>
        {isMobile && (
          <IconButton edge="start" onClick={onMenuToggle} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <OrganizationSwitcher />

        <Box sx={{ flex: 1 }} />

        <GlobalSearch />
        <NotificationCenter />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
