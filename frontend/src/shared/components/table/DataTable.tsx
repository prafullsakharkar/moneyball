/**
 * DataTable — CricketIQ Enterprise Data Table
 * ============================================
 * Dense, sortable, selectable, resizable data table built on MUI primitives.
 * Mirrors StudioHub's compact, information-dense tables and the CricketOS
 * design tokens (densityTokens, tabular-nums, accentDim selection).
 *
 * Enterprise features:
 *  - Sorting (single column, asc/desc)
 *  - Row selection (checkbox + keyboard)
 *  - Column visibility (controlled)
 *  - Column resizing (drag handle)
 *  - Density (compact 36 / default 40 / comfortable 44)
 *  - Sticky header + scrollable body
 *  - Row expansion (detail rows)
 *  - Inline row actions
 *  - Contextual menu hook (onContextMenu)
 *  - Keyboard navigation (↑ ↓ Home End Enter Space)
 *  - Table states: loading, empty, error, permission denied, no results,
 *    partial data, offline/slow network
 *
 * Self-contained (no external table engine) so the design system stays
 * decoupled and predictable.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { ArrowUpDown, ChevronDown, ChevronRight, GripVertical, WifiOff } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Skeleton } from '../ui/LoadingState';
import { densityTokens } from '@core/theme/tokens';

/* ── Column definition ───────────────────────────────────── */

export interface DataTableColumn<TData> {
  /** Unique id (defaults to `accessorKey`) */
  id?: string;
  /** Key to read from the row object */
  accessorKey?: keyof TData & string;
  /** Header label or render fn */
  header: ReactNode | ((col: DataTableColumn<TData>) => ReactNode);
  /** Cell render fn */
  cell?: (value: unknown, row: TData) => ReactNode;
  /** Right/center alignment */
  align?: 'left' | 'right' | 'center';
  /** Numeric column — right aligned + tabular-nums (cricket metrics) */
  numeric?: boolean;
  /** Disable sorting for this column */
  sortable?: boolean;
  /** Custom sort accessor (e.g. nested value) */
  sortValue?: (row: TData) => string | number;
  /** Column width */
  width?: number | string;
  /** Allow column resizing */
  resizable?: boolean;
  /** Hide by default (still toggleable via column visibility) */
  hiddenByDefault?: boolean;
  /** Minimum width when resizing */
  minWidth?: number;
}

export type TableDensity = 'compact' | 'default' | 'comfortable';

/* ── Props ───────────────────────────────────────────────── */

export interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
  /** Row key accessor (defaults to `id`) */
  getRowId?: (row: TData) => string;
  /** Enable row selection */
  selectable?: boolean;
  /** Controlled selected row ids */
  selectedRowIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;

  /* Sorting */
  sortKey?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string | null, direction: 'asc' | 'desc') => void;

  /* Column visibility */
  columnVisibility?: Record<string, boolean>;

  /* Density */
  density?: TableDensity;
  /** Backward-compat alias for density === 'compact' */
  dense?: boolean;

  /* States */
  loading?: boolean;
  loadingRows?: number;
  error?: boolean;
  errorTitle?: string;
  errorDescription?: string;
  onRetry?: () => void;
  permissionDenied?: boolean;
  permissionTitle?: string;
  permissionDescription?: string;
  noResults?: boolean;
  noResultsTitle?: string;
  noResultsDescription?: string;
  partialData?: boolean;
  partialDataLabel?: string;
  offline?: boolean;

  /* Empty state */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;

  /* Layout */
  stickyHeader?: boolean;
  maxHeight?: number | string;
  /** Row click handler */
  onRowClick?: (row: TData) => void;
  /** Contextual menu — receives the row and event */
  onContextMenu?: (row: TData, event: React.MouseEvent) => void;
  /** Inline row actions (rendered in a trailing actions column) */
  renderRowActions?: (row: TData) => ReactNode;
  /** Enable row expansion */
  expandable?: boolean;
  /** Render expanded detail row */
  renderExpandedRow?: (row: TData) => ReactNode;
  /** Column resize callback */
  onColumnResize?: (columnId: string, width: number) => void;
  /** aria-label for the table */
  ariaLabel?: string;
}

const DENSITY_ROW_HEIGHT: Record<TableDensity, number> = densityTokens.row;

/* ── Component ───────────────────────────────────────────── */

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  sortKey,
  sortDirection = 'asc',
  onSortChange,
  columnVisibility,
  density: densityProp,
  dense = true,
  loading = false,
  loadingRows = 5,
  error = false,
  errorTitle = 'Unable to load data',
  errorDescription,
  onRetry,
  permissionDenied = false,
  permissionTitle = 'You do not have access',
  permissionDescription,
  noResults = false,
  noResultsTitle = 'No matching results',
  noResultsDescription,
  partialData = false,
  partialDataLabel = 'Showing partial data',
  offline = false,
  emptyTitle = 'No data',
  emptyDescription,
  emptyAction,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  onContextMenu,
  renderRowActions,
  expandable = false,
  renderExpandedRow,
  onColumnResize,
  ariaLabel = 'Data table',
}: DataTableProps<TData>) {
  const density: TableDensity = densityProp ?? (dense ? 'compact' : 'default');
  const rowHeight = DENSITY_ROW_HEIGHT[density];

  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const activeSortKey = sortKey !== undefined ? sortKey : internalSortKey;
  const activeSortDir = sortDirection !== undefined ? sortDirection : internalSortDir;

  const rowId = useCallback(
    (row: TData, index: number) =>
      getRowId ? getRowId(row) : String((row as Record<string, unknown>).id ?? index),
    [getRowId]
  );

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => {
      const id = col.id ?? col.accessorKey;
      if (!id) return true;
      if (columnVisibility && id in columnVisibility) return columnVisibility[id];
      return !col.hiddenByDefault;
    });
  }, [columns, columnVisibility]);

  const sortedData = useMemo(() => {
    if (!activeSortKey) return data;
    const col = columns.find((c) => (c.id ?? c.accessorKey) === activeSortKey);
    if (!col || col.sortable === false) return data;
    const dir = activeSortDir === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = col.sortValue ? col.sortValue(a) : (a as Record<string, unknown>)[col.accessorKey as string];
      const bv = col.sortValue ? col.sortValue(b) : (b as Record<string, unknown>)[col.accessorKey as string];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, activeSortKey, activeSortDir, columns]);

  const handleSort = (col: DataTableColumn<TData>) => {
    const key = col.id ?? col.accessorKey;
    if (!key || col.sortable === false) return;
    if (onSortChange) {
      const nextDir = activeSortKey === key ? (activeSortDir === 'asc' ? 'desc' : 'asc') : 'asc';
      onSortChange(key, nextDir);
    } else {
      if (internalSortKey === key) {
        setInternalSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setInternalSortKey(key);
        setInternalSortDir('asc');
      }
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedRowIds ?? []);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const all = new Set(sortedData.map((r, i) => rowId(r, i)));
    const allSelected = sortedData.length > 0 && sortedData.every((r, i) => selectedRowIds?.has(rowId(r, i)));
    onSelectionChange(allSelected ? new Set() : all);
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResize = (colId: string, clientX: number, startWidth: number) => {
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - clientX;
      const next = Math.max(60, startWidth + delta);
      setColWidths((prev) => ({ ...prev, [colId]: next }));
      onColumnResize?.(colId, next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!sortedData.length) return;
    let next = index;
    switch (e.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, sortedData.length - 1);
        break;
      case 'ArrowUp':
        next = Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = sortedData.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (onRowClick) {
          e.preventDefault();
          onRowClick(sortedData[index]);
        }
        return;
      default:
        return;
    }
    e.preventDefault();
    setFocusedRowIndex(next);
    const rows = bodyRef.current?.querySelectorAll<HTMLElement>('[data-row-index]');
    rows?.[next]?.focus();
  };

  useEffect(() => {
    if (focusedRowIndex >= 0) {
      const rows = bodyRef.current?.querySelectorAll<HTMLElement>('[data-row-index]');
      rows?.[focusedRowIndex]?.focus();
    }
  }, [focusedRowIndex]);

  const hasData = sortedData.length > 0;
  const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (renderRowActions ? 1 : 0) + (expandable ? 1 : 0);

  /* ── State rendering ────────────────────────────────────── */

  if (offline) {
    return (
      <TableContainer sx={{ maxHeight, position: 'relative' }}>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <WifiOff size={28} color="var(--cq-muted, inherit)" />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            You appear to be offline
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Reconnect to load the latest data. Your changes are saved locally.
          </Typography>
        </Box>
      </TableContainer>
    );
  }

  if (permissionDenied) {
    return (
      <TableContainer sx={{ maxHeight, position: 'relative' }}>
        <ErrorState title={permissionTitle} description={permissionDescription} />
      </TableContainer>
    );
  }

  if (error) {
    return (
      <TableContainer sx={{ maxHeight, position: 'relative' }}>
        <ErrorState title={errorTitle} description={errorDescription} onRetry={onRetry} />
      </TableContainer>
    );
  }

  return (
    <TableContainer sx={{ maxHeight, position: 'relative' }}>
      {partialData && (
        <Box
          sx={{
            px: 2,
            py: 0.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          <Chip size="small" label={partialDataLabel} color="warning" variant="filled" />
        </Box>
      )}
      <Table size="small" stickyHeader={stickyHeader} aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            {expandable && (
              <TableCell padding="checkbox" sx={{ width: 40, bgcolor: 'background.paper' }} />
            )}
            {selectable && (
              <TableCell padding="checkbox" sx={{ width: 40, bgcolor: 'background.paper' }}>
                <Checkbox
                  size="small"
                  indeterminate={
                    sortedData.some((r, i) => selectedRowIds?.has(rowId(r, i))) &&
                    !sortedData.every((r, i) => selectedRowIds?.has(rowId(r, i)))
                  }
                  checked={hasData && sortedData.every((r, i) => selectedRowIds?.has(rowId(r, i)))}
                  onChange={toggleAll}
                  slotProps={{ input: { 'aria-label': 'Select all rows' } }}
                />
              </TableCell>
            )}
            {visibleColumns.map((col) => {
              const key = col.id ?? col.accessorKey;
              const active = activeSortKey === key;
              const sortable = col.sortable !== false && !!key;
              const width = colWidths[key ?? ''] ?? col.width;
              return (
                <TableCell
                  key={key ?? col.header?.toString()}
                  align={col.numeric ? 'right' : (col.align ?? 'left')}
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    bgcolor: 'background.paper',
                    width,
                    minWidth: col.minWidth,
                    position: 'relative',
                    ...(col.numeric ? { fontVariantNumeric: 'tabular-nums' } : {}),
                  }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={active}
                      direction={active ? activeSortDir : 'asc'}
                      onClick={() => handleSort(col)}
                      IconComponent={ArrowUpDown}
                    >
                      {typeof col.header === 'function' ? col.header(col) : col.header}
                    </TableSortLabel>
                  ) : typeof col.header === 'function' ? (
                    col.header(col)
                  ) : (
                    col.header
                  )}
                  {col.resizable && key && (
                    <Box
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleResize(key, e.clientX, width as number);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 8,
                        height: '100%',
                        cursor: 'col-resize',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.tertiary',
                        '&:hover': { color: 'text.secondary' },
                      }}
                    >
                      <GripVertical size={12} />
                    </Box>
                  )}
                </TableCell>
              );
            })}
            {renderRowActions && (
              <TableCell
                align="right"
                sx={{ width: 48, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}
              />
            )}
          </TableRow>
        </TableHead>
        <TableBody ref={bodyRef}>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} sx={{ height: rowHeight }}>
                {expandable && (
                  <TableCell padding="checkbox">
                    <Skeleton width={18} height={18} variant="circular" />
                  </TableCell>
                )}
                {selectable && (
                  <TableCell padding="checkbox">
                    <Skeleton width={18} height={18} variant="circular" />
                  </TableCell>
                )}
                {visibleColumns.map((col) => (
                  <TableCell key={col.id ?? col.accessorKey ?? i}>
                    <Skeleton width="80%" height={14} />
                  </TableCell>
                ))}
                {renderRowActions && (
                  <TableCell>
                    <Skeleton width={24} height={14} />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : !hasData ? (
            <TableRow>
              <TableCell colSpan={colSpan} sx={{ border: 0, p: 0 }}>
                {noResults ? (
                  <EmptyState
                    title={noResultsTitle}
                    description={noResultsDescription}
                    action={emptyAction}
                    compact
                  />
                ) : (
                  <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} compact />
                )}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => {
              const id = rowId(row, index);
              const isExpanded = expandedRows.has(id);
              const isSelected = selectedRowIds?.has(id) ?? false;
              return (
                <TableRow
                  key={id}
                  hover
                  selected={isSelected}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onContextMenu={onContextMenu ? (e) => onContextMenu(row, e) : undefined}
                  tabIndex={onRowClick ? 0 : -1}
                  data-row-index={index}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  sx={{
                    height: rowHeight,
                    cursor: onRowClick ? 'pointer' : undefined,
                    outline: 'none',
                    '&:focus-visible': {
                      outline: '2px solid var(--cq-focus, #A3E635)',
                      outlineOffset: -2,
                    },
                  }}
                >
                  {expandable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(id)}
                        aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </IconButton>
                    </TableCell>
                  )}
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        slotProps={{ input: { 'aria-label': `Select row ${id}` } }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((col) => {
                    const key = col.id ?? col.accessorKey;
                    const value = col.accessorKey
                      ? (row as Record<string, unknown>)[col.accessorKey]
                      : undefined;
                    return (
                      <TableCell
                        key={key ?? index}
                        align={col.numeric ? 'right' : (col.align ?? 'left')}
                        sx={{
                          whiteSpace: 'nowrap',
                          ...(col.numeric ? { fontVariantNumeric: 'tabular-nums' } : {}),
                        }}
                      >
                        {col.cell ? col.cell(value, row) : (value as ReactNode)}
                      </TableCell>
                    );
                  })}
                  {renderRowActions && (
                    <TableCell align="right" onClick={(e) => e.stopPropagation()} sx={{ whiteSpace: 'nowrap' }}>
                      {renderRowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
          {expandable &&
            !loading &&
            hasData &&
            sortedData.map((row, index) => {
              const id = rowId(row, index);
              if (!expandedRows.has(id)) return null;
              return (
                <TableRow key={`expanded-${id}`}>
                  <TableCell colSpan={colSpan} sx={{ py: 0, border: 0 }}>
                    <Collapse in timeout="auto" unmountOnExit>
                      <Box sx={{ py: 2, px: 2 }}>{renderExpandedRow?.(row)}</Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
