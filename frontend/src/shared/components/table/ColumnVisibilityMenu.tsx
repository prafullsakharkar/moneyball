/**
 * ColumnVisibilityMenu — toggle which columns are shown
 * ======================================================
 * Dropdown menu listing all columns with checkboxes. Wired to the
 * useDataTable hook's columnVisibility state.
 */
import { useState } from 'react';
import { Box, Checkbox, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Columns3, RotateCcw } from 'lucide-react';

export interface ColumnVisibilityMenuColumn {
  id: string;
  label: string;
  visible: boolean;
}

export interface ColumnVisibilityMenuProps {
  columns: ColumnVisibilityMenuColumn[];
  onToggle: (id: string) => void;
  onReset?: () => void;
}

export function ColumnVisibilityMenu({ columns, onToggle, onReset }: ColumnVisibilityMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Columns">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Toggle columns"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <Columns3 size={16} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200, maxHeight: 320 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Columns
          </Typography>
        </Box>
        <Divider />
        {columns.map((col) => (
          <MenuItem key={col.id} onClick={() => onToggle(col.id)} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Checkbox size="small" edge="start" checked={col.visible} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={col.label} slotProps={{ primary: { variant: 'body2' } }} />
          </MenuItem>
        ))}
        {onReset && (
          <>
            <Divider />
            <MenuItem onClick={() => { onReset(); setAnchorEl(null); }} dense>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <RotateCcw size={16} />
              </ListItemIcon>
              <ListItemText primary="Reset columns" slotProps={{ primary: { variant: 'body2' } }} />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
