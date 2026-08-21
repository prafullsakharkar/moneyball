import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useFilteredNavigation } from '@hooks/useFilteredNavigation';

/**
 * CommandPalette
 * ============================================
 * Ctrl+K quick navigation. Commands are derived from the permission-filtered
 * navigation so restricted destinations are never offered. Uses the router
 * (not window.location) for SPA navigation.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const sections = useFilteredNavigation();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = useMemo(
    () => sections.flatMap((s) => s.items.map((item) => ({ id: item.href, label: item.label, href: item.href, Icon: item.icon }))),
    [sections]
  );

  const filtered = commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    navigate(href);
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, top: '15%' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        <TextField
          fullWidth
          placeholder="Type a command or search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ px: 2, py: 1, '& fieldset': { border: 'none' } }}
        />
        <List dense>
          {filtered.map((cmd) => {
            const Icon = cmd.Icon;
            return (
              <ListItem
                key={cmd.id}
                onClick={() => handleSelect(cmd.href)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText>{cmd.label}</ListItemText>
              </ListItem>
            );
          })}
          {filtered.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No results
              </Typography>
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
