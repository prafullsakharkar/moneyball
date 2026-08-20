import { useState, useEffect } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemIcon, ListItemText, Typography, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: <DashboardIcon />, href: '/' },
  { id: 'players', label: 'Go to Players', icon: <SportsCricketIcon />, href: '/players' },
  { id: 'teams', label: 'Go to Teams', icon: <GroupsIcon />, href: '/teams' },
  { id: 'settings', label: 'Go to Settings', icon: <SettingsIcon />, href: '/settings' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen((prev) => !prev); }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = COMMANDS.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, top: '15%' } } }}>
      <DialogContent sx={{ p: 0 }}>
        <TextField fullWidth placeholder="Type a command or search…" value={query}
          onChange={(e) => setQuery(e.target.value)} autoFocus
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> } }}
          sx={{ px: 2, py: 1, '& fieldset': { border: 'none' } }} />
        <List dense>
          {filtered.map((cmd) => (
            <ListItem key={cmd.id} onClick={() => { window.location.href = cmd.href; setOpen(false); }}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <ListItemIcon sx={{ minWidth: 36 }}>{cmd.icon}</ListItemIcon>
              <ListItemText>{cmd.label}</ListItemText>
            </ListItem>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No results</Typography>
            </Box>
          )}
        </List>
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Press <strong>Ctrl+K</strong> to open &bull; <strong>Esc</strong> to close
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
