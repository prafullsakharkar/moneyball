import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import { useOrganizationStore } from '@stores/organizationStore';

interface PrimaryNavigationProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { label: 'Organizations', href: '/organizations', icon: <BusinessIcon /> },
  { label: 'Players', href: '/players', icon: <SportsCricketIcon /> },
  { label: 'Teams', href: '/teams', icon: <GroupsIcon /> },
  { label: 'Matches', href: '/matches', icon: <SportsCricketIcon /> },
  { label: 'Competitions', href: '/competitions', icon: <EmojiEventsIcon /> },
  { label: 'Analytics', href: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Training', href: '/training', icon: <FitnessCenterIcon /> },
  { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

function NavContent({ onNavigate }: { onNavigate: (href: string) => void }) {
  const location = useLocation();
  const currentOrg = useOrganizationStore((s) => s.currentOrganization);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          minHeight: '64px !important',
          px: 2,
          gap: 1,
        }}
      >
        <SportsCricketIcon />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            CricketOS
          </Typography>
          {currentOrg && (
            <Typography variant="caption" sx={{ opacity: 0.7, lineHeight: 1.2 }}>
              {currentOrg.name}
            </Typography>
          )}
        </Box>
      </Toolbar>

      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => onNavigate(item.href)}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 } } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export function PrimaryNavigation({ open, onClose, width }: PrimaryNavigationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleNavigate = (href: string) => {
    navigate(href);
    if (isMobile) onClose();
  };

  return (
    <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={isMobile && open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width },
        }}
      >
        <NavContent onNavigate={handleNavigate} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        <NavContent onNavigate={handleNavigate} />
      </Drawer>
    </Box>
  );
}
