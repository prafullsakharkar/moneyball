/**
 * DensityMenu — switch table row density
 * ======================================
 * compact 36px / default 40px / comfortable 44px per design tokens.
 */
import { useState } from 'react';
import { Check, Rows3 } from 'lucide-react';
import { Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import type { TableDensity } from './DataTable';

export interface DensityMenuProps {
  density: TableDensity;
  onChange: (density: TableDensity) => void;
}

const DENSITY_OPTIONS: { value: TableDensity; label: string; hint: string }[] = [
  { value: 'compact', label: 'Compact', hint: '36px rows' },
  { value: 'default', label: 'Default', hint: '40px rows' },
  { value: 'comfortable', label: 'Comfortable', hint: '44px rows' },
];

export function DensityMenu({ density, onChange }: DensityMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Density">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Change density"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <Rows3 size={16} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Density
          </Typography>
        </Box>
        <Divider />
        {DENSITY_OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => { onChange(opt.value); setAnchorEl(null); }}
            selected={density === opt.value}
            dense
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {density === opt.value ? <Check size={16} /> : null}
            </ListItemIcon>
            <ListItemText
              primary={opt.label}
              secondary={opt.hint}
              slotProps={{ primary: { variant: 'body2' }, secondary: { variant: 'caption' } }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
