/**
 * ContextMenu — contextual row menu
 * =================================
 * A right-click / kebab menu for a table row. Items can be destructive
 * (rendered in danger color) or disabled. Positioned at the cursor.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import type { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Destructive items render in danger color */
  destructive?: boolean;
  disabled?: boolean;
  /** Optional hint text */
  hint?: string;
  /** Render a divider before this item */
  divider?: boolean;
  onClick?: () => void;
}

export interface ContextMenuProps {
  /** Anchor position (from the row's contextmenu event) */
  anchorPosition?: { x: number; y: number } | null;
  onClose: () => void;
  items: ContextMenuItem[];
  /** Optional header shown above items */
  header?: ReactNode;
}

export function ContextMenu({ anchorPosition, onClose, items, header }: ContextMenuProps) {
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!anchorPosition) {
      setMenuPosition(null);
      return;
    }
    // Keep the menu within the viewport
    const menuWidth = 220;
    const menuHeight = items.length * 40 + 16;
    const left = Math.min(anchorPosition.x, window.innerWidth - menuWidth - 8);
    const top = Math.min(anchorPosition.y, window.innerHeight - menuHeight - 8);
    setMenuPosition({ top, left });
  }, [anchorPosition, items.length]);

  return (
    <Menu
      open={Boolean(anchorPosition && menuPosition)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={menuPosition ?? undefined}
      slotProps={{ paper: { sx: { minWidth: 220, maxWidth: 280 } } }}
    >
      {header && (
        <Box sx={{ px: 2, py: 1 }}>{header}</Box>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Box key={item.id}>
            {item.divider && <Divider sx={{ my: 0.5 }} />}
            <MenuItem
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              disabled={item.disabled}
              dense
              sx={{
                color: item.destructive ? 'error.main' : undefined,
                '&:hover': item.destructive ? { bgcolor: 'error.light' } : undefined,
              }}
            >
              {Icon && (
                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                  <Icon size={16} />
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                secondary={item.hint}
                slotProps={{
                  primary: { variant: 'body2' },
                  secondary: { variant: 'caption' },
                }}
              />
            </MenuItem>
          </Box>
        );
      })}
    </Menu>
  );
}
