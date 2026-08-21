/**
 * DataTable — CricketIQ Design System
 * ============================================
 * Dense, sortable, selectable data table built on MUI primitives.
 * Mirrors StudioHub's compact, information-dense tables.
 *
 * Self-contained (no external table engine) so the design system stays
 * decoupled and predictable.
 */
import { useMemo, useState, type ReactNode } from 'react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { ArrowUpDown } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingState';

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
  /** Disable sorting for this column */
  sortable?: boolean;
  /** Custom sort accessor (e.g. nested value) */
  sortValue?: (row: TData) => string | number;
  /** Column width */
  width?: number | string;
}

type SortDirection = 'asc' | 'desc';

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
  /** Loading state — renders skeleton rows */
  loading?: boolean;
  /** Number of skeleton rows while loading */
  loadingRows?: number;
  /** Empty state */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  /** Dense row height */
  dense?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Max height for scrollable body */
  maxHeight?: number | string;
  /** Row click handler */
  onRowClick?: (row: TData) => void;
}

/* ── Component ───────────────────────────────────────────── */

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  loading = false,
  loadingRows = 5,
  emptyTitle = 'No data',
  emptyDescription,
  emptyAction,
  dense = true,
  stickyHeader = false,
  maxHeight,
  onRowClick,
}: DataTableProps<TData>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const rowId = (row: TData, index: number) =>
    getRowId ? getRowId(row) : String((row as Record<string, unknown>).id ?? index);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => (c.id ?? c.accessorKey) === sortKey);
    if (!col || col.sortable === false) return data;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = col.sortValue ? col.sortValue(a) : (a as Record<string, unknown>)[col.accessorKey as string];
      const bv = col.sortValue ? col.sortValue(b) : (b as Record<string, unknown>)[col.accessorKey as string];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, sortKey, sortDir, columns]);

  const handleSort = (col: DataTableColumn<TData>) => {
    const key = col.id ?? col.accessorKey;
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
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

  const hasData = sortedData.length > 0;

  return (
    <TableContainer sx={{ maxHeight, position: 'relative' }}>
      <Table size={dense ? 'small' : 'medium'} stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
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
            {columns.map((col) => {
              const key = col.id ?? col.accessorKey;
              const active = sortKey === key;
              const sortable = col.sortable !== false && !!key;
              return (
                <TableCell
                  key={key ?? col.header?.toString()}
                  align={col.align ?? 'left'}
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    bgcolor: 'background.paper',
                    width: col.width,
                  }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={active}
                      direction={active ? sortDir : 'asc'}
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
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Skeleton width={18} height={18} variant="circular" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.id ?? col.accessorKey ?? i}>
                    <Skeleton width="80%" height={14} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !hasData ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)} sx={{ border: 0, p: 0 }}>
                <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} compact />
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => {
              const id = rowId(row, index);
              return (
                <TableRow
                  key={id}
                  hover
                  selected={selectedRowIds?.has(id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        checked={selectedRowIds?.has(id) ?? false}
                        onChange={() => toggleRow(id)}
                        slotProps={{ input: { 'aria-label': `Select row ${id}` } }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const key = col.id ?? col.accessorKey;
                    const value = col.accessorKey
                      ? (row as Record<string, unknown>)[col.accessorKey]
                      : undefined;
                    return (
                      <TableCell key={key ?? index} align={col.align ?? 'left'} sx={{ whiteSpace: 'nowrap' }}>
                        {col.cell ? col.cell(value, row) : (value as ReactNode)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
