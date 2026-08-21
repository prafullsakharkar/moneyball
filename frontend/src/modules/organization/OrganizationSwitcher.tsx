import { useState, useMemo } from 'react';
import {
  Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography,
  Divider, Box, TextField, InputAdornment, Avatar, Chip, Tooltip,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';

import { useAuth } from '@providers/AuthProvider';
import { useOrganizationStore } from '@stores/organizationStore';

const ORG_TYPE_SHORT: Record<string, string> = {
  national_board: 'Board',
  state_association: 'Association',
  league: 'League',
  franchise: 'Franchise',
  professional_club: 'Club',
  amateur_club: 'Club',
  academy: 'Academy',
  school: 'School',
  university: 'University',
  corporate: 'Corporate',
  media: 'Media',
};

export function OrganizationSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState('');
  const { switchOrganization } = useAuth();
  const { currentOrganization, organizations, memberships, isSwitching } = useOrganizationStore();
  const open = Boolean(anchorEl);

  const filtered = useMemo(() => {
    if (!search) return organizations;
    const q = search.toLowerCase();
    return organizations.filter(
      (o) => o.name.toLowerCase().includes(q) || o.type.replace(/_/g, ' ').includes(q)
    );
  }, [organizations, search]);

  // Group: favorites (active members) first, then the rest
  const activeOrgIds = useMemo(() => new Set(memberships.filter((m) => m.status === 'active').map((m) => m.organizationId)), [memberships]);

  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrganization?.id) return;
    try {
      await switchOrganization(orgId);
    } catch {
      /* handled by AuthProvider */
    } finally {
      setAnchorEl(null);
      setSearch('');
    }
  };

  if (organizations.length === 0) {
    return (
      <Button startIcon={<BusinessIcon />} size="small" disabled sx={{ textTransform: 'none', color: 'text.secondary' }}>
        No organizations
      </Button>
    );
  }

  if (organizations.length === 1) {
    return (
      <Button startIcon={<BusinessIcon />} size="small" disabled sx={{ textTransform: 'none', color: 'text.secondary' }}>
        {currentOrganization?.name ?? 'CricketOS'}
      </Button>
    );
  }

  return (
    <>
      <Tooltip title={currentOrganization?.name ?? 'Select organization'}>
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={isSwitching ? <CircularProgress size={14} /> : <ExpandMoreIcon />}
          startIcon={<BusinessIcon />}
          size="small"
          sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 500 }}
        >
          <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
            {currentOrganization?.name ?? 'Select Organization'}
          </Typography>
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => { setAnchorEl(null); setSearch(''); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 280, maxHeight: 380 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Switch organization ({organizations.length})
          </Typography>
          <TextField
            placeholder="Search organizations..."
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Divider />

        {filtered.length === 0 ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              No organizations match "{search}"
            </Typography>
          </Box>
        ) : (
          filtered.map((org) => {
            const isCurrent = org.id === currentOrganization?.id;
            const isActiveMember = activeOrgIds.has(org.id);

            return (
              <MenuItem
                key={org.id}
                onClick={() => handleSwitch(org.id)}
                selected={isCurrent}
                disabled={isSwitching}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Avatar
                    sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: isCurrent ? 'primary.main' : 'grey.300' }}
                    src={org.logoUrl ?? undefined}
                  >
                    {org.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: isCurrent ? 600 : 400 }}>
                        {org.name}
                      </Typography>
                      {isCurrent && <CheckIcon color="primary" sx={{ fontSize: 16 }} />}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                      <Chip
                        label={ORG_TYPE_SHORT[org.type] ?? org.type}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                      {isActiveMember && (
                        <Chip
                          label="Member"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                  }
                  slotProps={{ secondary: { component: 'div' } }}
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
