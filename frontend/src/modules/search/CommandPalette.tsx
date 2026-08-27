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
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Plus, Building2, Zap, ArrowRight } from 'lucide-react';
import { useFilteredNavigation } from '@hooks/useFilteredNavigation';
import { useOrganizationStore } from '@stores/organizationStore';
import { useAuth } from '@providers/AuthProvider';

type CommandKind = 'navigate' | 'create' | 'switch' | 'action';

interface Command {
  id: string;
  kind: CommandKind;
  label: string;
  hint?: string;
  Icon: typeof Zap;
  run: () => void;
}

/**
 * CommandPalette
 * ============================================
 * Ctrl/Cmd+K command palette. Supports:
 *   - Navigation (permission-filtered destinations)
 *   - Create entity (new player / team / match / competition)
 *   - Switch organization
 *   - Quick actions (collapse sidebar, open help)
 * Uses the router (not window.location) for SPA navigation.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const sections = useFilteredNavigation();
  const { switchOrganization } = useAuth();
  const { organizations, currentOrganization } = useOrganizationStore();

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

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = sections.flatMap((s) =>
      s.items.map((item) => ({
        id: `nav:${item.href}`,
        kind: 'navigate' as const,
        label: item.label,
        hint: s.label,
        Icon: item.icon,
        run: () => {
          navigate(item.href);
          close();
        },
      }))
    );

    const create: Command[] = [
      { id: 'create:player', kind: 'create', label: 'New Player', hint: 'Create', Icon: Plus, run: () => { navigate('/players/new'); close(); } },
      { id: 'create:team', kind: 'create', label: 'New Team', hint: 'Create', Icon: Plus, run: () => { navigate('/teams/new'); close(); } },
      { id: 'create:match', kind: 'create', label: 'New Match', hint: 'Create', Icon: Plus, run: () => { navigate('/matches/new'); close(); } },
      { id: 'create:competition', kind: 'create', label: 'New Competition', hint: 'Create', Icon: Plus, run: () => { navigate('/competitions/new'); close(); } },
    ];

    const switchOrg: Command[] = organizations
      .filter((o) => o.id !== currentOrganization?.id)
      .map((o) => ({
        id: `switch:${o.id}`,
        kind: 'switch' as const,
        label: o.name,
        hint: 'Switch organization',
        Icon: Building2,
        run: () => {
          void switchOrganization(o.id).then(() => {
            navigate('/');
            close();
          });
        },
      }));

    const actions: Command[] = [
      { id: 'action:help', kind: 'action', label: 'Help & Documentation', hint: 'Action', Icon: ArrowRight, run: () => { navigate('/help'); close(); } },
      { id: 'action:settings', kind: 'action', label: 'Settings', hint: 'Action', Icon: ArrowRight, run: () => { navigate('/settings'); close(); } },
    ];

    return [...nav, ...create, ...switchOrg, ...actions];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, organizations, currentOrganization, navigate, switchOrganization]);

  const q = query.toLowerCase();
  const filtered = commands.filter(
    (cmd) => cmd.label.toLowerCase().includes(q) || (cmd.hint ?? '').toLowerCase().includes(q)
  );

  const grouped = useMemo(() => {
    const order: CommandKind[] = ['navigate', 'create', 'switch', 'action'];
    return order
      .map((kind) => ({ kind, items: filtered.filter((c) => c.kind === kind) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, top: '15%' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        <TextField
          fullWidth
          placeholder="Type a command, search, or switch organization…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          slotProps={{
            htmlInput: { 'aria-label': 'Command palette search' },
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
        <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {grouped.map((group, gi) => (
            <Box key={group.kind}>
              {gi > 0 && <Divider />}
              <Typography
                variant="overline"
                sx={{ display: 'block', px: 2, pt: 1, color: 'text.secondary', letterSpacing: '0.1em' }}
              >
                {group.kind === 'navigate' ? 'Navigate' : group.kind === 'create' ? 'Create' : group.kind === 'switch' ? 'Switch organization' : 'Actions'}
              </Typography>
              <List dense disablePadding>
                {group.items.map((cmd) => {
                  const Icon = cmd.Icon;
                  return (
                    <ListItem
                      key={cmd.id}
                      onClick={cmd.run}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          cmd.run();
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        '&:focus-visible': { outline: '2px solid var(--cq-focus, #A3E635)', outlineOffset: -2 },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Icon size={18} />
                      </ListItemIcon>
                      <ListItemText primary={cmd.label} secondary={cmd.hint} />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No results
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Press <strong>Ctrl+K</strong> to open &bull; <strong>Esc</strong> to close
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
