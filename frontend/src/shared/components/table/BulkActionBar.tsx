/**
 * BulkActionBar — floating action bar for bulk operations
 * ========================================================
 * Appears when rows are selected. Shows the selection count and
 * contextual bulk actions (batch update, batch delete, batch status,
 * batch assignment). Destructive actions are always confirmed by the
 * caller before execution.
 */
import { type ReactNode } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface BulkAction {
  id: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface BulkActionBarProps {
  /** Number of selected rows */
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
  /** Label for the selection count */
  countLabel?: (count: number) => string;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  actions,
  countLabel = (count) => `${count} selected`,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mx: 2,
        mb: 2,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 4,
        flexWrap: 'wrap',
      }}
    >
      <Chip
        size="small"
        label={countLabel(selectedCount)}
        color="primary"
        onDelete={onClearSelection}
        deleteIcon={<X size={14} />}
        sx={{ fontWeight: 600 }}
      />
      <Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.destructive ? 'danger' : 'secondary'}
          size="small"
          startIcon={action.icon}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
      <Box sx={{ ml: 'auto' }}>
        <Typography variant="caption" color="text.secondary">
          {selectedCount} row{selectedCount === 1 ? '' : 's'}
        </Typography>
      </Box>
    </Box>
  );
}
