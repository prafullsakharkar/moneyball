import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChevronLeft, Zap } from 'lucide-react';
import { type NavItem } from './navigation';
import { useOrganizationStore } from '@stores/organizationStore';
import { useFilteredNavigation } from '@hooks/useFilteredNavigation';
import { layout } from '@design/tokens';

interface PrimarySidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
  /** Collapsed (icon-only) state for desktop */
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function isActive(href: string, pathname: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

interface NavContentProps {
  onNavigate: (href: string) => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
}

function NavContent({ onNavigate, collapsed, onToggleCollapse }: NavContentProps) {
  const location = useLocation();
  const currentOrg = useOrganizationStore((s) => s.currentOrganization);
  const sections = useFilteredNavigation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <Toolbar
        sx={{
          minHeight: `${layout.headerHeight}px !important`,
          px: collapsed ? 1 : 2,
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              flexShrink: 0,
            }}
          >
            <Zap size={16} strokeWidth={2.2} />
          </Box>
          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                CricketOS
              </Typography>
              {currentOrg && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', lineHeight: 1.2, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {currentOrg.name}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {!collapsed && onToggleCollapse && (
          <IconButton size="small" onClick={onToggleCollapse} sx={{ color: 'text.secondary' }} aria-label="Collapse sidebar">
            <ChevronLeft size={16} />
          </IconButton>
        )}
      </Toolbar>

      {/* Sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: 1, py: 1 }}>
        {sections.map((section) => (
          <List
            key={section.label}
            dense
            disablePadding
            subheader={
              !collapsed ? (
                <ListSubheader
                  disableSticky
                  sx={{
                    bgcolor: 'transparent',
                    px: 1.5,
                    py: 1,
                    lineHeight: 1,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  {section.label}
                </ListSubheader>
              ) : undefined
            }
          >
            {section.items.map((item: NavItem) => {
              const active = isActive(item.href, location.pathname);
              const Icon = item.icon;
              const button = (
                <ListItemButton
                  onClick={() => onNavigate(item.href)}
                  selected={active}
                  sx={{
                    borderRadius: 1,
                    minHeight: 32,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'action.selected' },
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 32,
                      justifyContent: 'center',
                      color: active ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.8125rem',
                            fontWeight: active ? 600 : 400,
                            color: active ? 'text.primary' : 'text.secondary',
                          },
                        },
                      }}
                    />
                  )}
                  {!collapsed && item.badge && (
                    <Box
                      component="span"
                      sx={{
                        ml: 'auto',
                        px: 0.75,
                        py: 0.125,
                        borderRadius: '999px',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItemButton>
              );

              return (
                <ListItem key={item.href} disablePadding sx={{ mb: 0.125 }}>
                  {collapsed ? (
                    <Tooltip title={item.label} placement="right">
                      <Box sx={{ width: '100%' }}>{button}</Box>
                    </Tooltip>
                  ) : (
                    button
                  )}
                </ListItem>
              );
            })}
          </List>
        ))}
      </Box>

      {/* Collapse toggle (bottom) for desktop */}
      {!collapsed && onToggleCollapse && (
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <ListItemButton onClick={onToggleCollapse} sx={{ borderRadius: 1, minHeight: 32 }}>
            <ListItemIcon sx={{ minWidth: 32, justifyContent: 'center', color: 'text.secondary' }}>
              <ChevronLeft size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Collapse"
              slotProps={{ primary: { sx: { fontSize: '0.8125rem', color: 'text.secondary' } } }}
            />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );
}

export function PrimarySidebar({
  open,
  onClose,
  width,
  collapsed = false,
  onToggleCollapse,
}: PrimarySidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleNavigate = (href: string) => {
    navigate(href);
    if (isMobile) onClose();
  };

  const effectiveWidth = collapsed ? layout.sidebarCollapsedWidth : width;

  return (
    <Box component="nav" sx={{ width: { md: effectiveWidth }, flexShrink: { md: 0 } }}>
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
        <NavContent onNavigate={handleNavigate} collapsed={false} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: effectiveWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        <NavContent
          onNavigate={handleNavigate}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </Drawer>
    </Box>
  );
}
