/**
 * TableToolbar — Enterprise table toolbar
 * ============================================
 * Renders search, filters, and action controls for a data table.
 * Includes column visibility, density, and export controls wired to
 * the useDataTable hook. Presentational — state lives in the hook.
 */
import { type ReactNode } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { Download, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { DensityMenu } from './DensityMenu';
import type { TableDensity } from './DataTable';

export interface TableToolbarColumn {
  id: string;
  label: string;
  visible: boolean;
}

export interface TableToolbarProps {
  /** Search input value */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Title shown on the left */
  title?: string;
  /** Result count shown next to title */
  resultCount?: number;
  /** Primary action (e.g. "New Player") */
  primaryAction?: ReactNode;
  /** Extra filter controls rendered between search and actions */
  filters?: ReactNode;
  /** Column visibility state */
  columns?: TableToolbarColumn[];
  onToggleColumn?: (id: string) => void;
  onResetColumns?: () => void;
  /** Density state */
  density?: TableDensity;
  onDensityChange?: (density: TableDensity) => void;
  /** Export */
  onExport?: () => void;
  exportLabel?: string;
  /** Hide the search box */
  hideSearch?: boolean;
}

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  title,
  resultCount,
  primaryAction,
  filters,
  columns,
  onToggleColumn,
  onResetColumns,
  density,
  onDensityChange,
  onExport,
  exportLabel = 'Export',
  hideSearch = false,
}: TableToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        px: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {(title || resultCount !== undefined) && (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mr: 1 }}>
          {title && (
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {resultCount !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {resultCount}
            </Typography>
          )}
        </Box>
      )}

      {!hideSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={search ?? ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          size="small"
          sx={{ minWidth: 220, flex: '1 1 220px' }}
          slotProps={{
            input: {
              startAdornment: <Search size={16} />,
            },
          }}
        />
      )}

      {filters}

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {onExport && (
          <Tooltip title={exportLabel}>
            <Button variant="ghost" size="small" onClick={onExport} startIcon={<Download size={16} />}>
              {exportLabel}
            </Button>
          </Tooltip>
        )}
        {columns && onToggleColumn && (
          <ColumnVisibilityMenu
            columns={columns}
            onToggle={onToggleColumn}
            onReset={onResetColumns}
          />
        )}
        {density && onDensityChange && (
          <DensityMenu density={density} onChange={onDensityChange} />
        )}
        {primaryAction}
      </Box>
    </Box>
  );
}
