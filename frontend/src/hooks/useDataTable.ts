/**
 * useDataTable — Enterprise table state hook
 * ============================================
 * Central state manager for the enterprise data workspace. Owns sorting,
 * pagination, row selection, density, and column visibility so the DataTable
 * component and its toolbar/menus stay presentational.
 *
 * Density follows the design tokens: compact 36px, default 40px, comfortable 44px.
 */
import { useCallback, useMemo, useState } from 'react';

export type TableDensity = 'compact' | 'default' | 'comfortable';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string | null;
  direction: SortDirection;
}

export interface UseDataTableOptions<TData> {
  /** Initial page size */
  initialPageSize?: number;
  /** Initial density */
  initialDensity?: TableDensity;
  /** Initial sort */
  initialSort?: SortState;
  /** Initial column visibility (id → visible) */
  initialColumnVisibility?: Record<string, boolean>;
  /** Row id accessor for selection */
  getRowId?: (row: TData) => string;
}

export interface UseDataTableReturn<TData> {
  /* Sorting */
  sort: SortState;
  setSort: (key: string | null, direction?: SortDirection) => void;
  toggleSort: (key: string) => void;

  /* Pagination */
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  /* Selection */
  selectedRowIds: Set<string>;
  toggleRow: (id: string) => void;
  toggleAll: (rows: TData[]) => void;
  clearSelection: () => void;
  setSelectedRowIds: (ids: Set<string>) => void;
  isRowSelected: (id: string) => boolean;
  isAllSelected: (rows: TData[]) => boolean;
  isSomeSelected: (rows: TData[]) => boolean;

  /* Density */
  density: TableDensity;
  setDensity: (density: TableDensity) => void;

  /* Column visibility */
  columnVisibility: Record<string, boolean>;
  toggleColumn: (id: string) => void;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  resetColumnVisibility: () => void;

  /* Derived */
  selectedCount: number;
}

/**
 * Sort a data array by a key using an optional accessor.
 */
export function sortData<TData>(
  data: TData[],
  sort: SortState,
  accessor?: (row: TData, key: string) => string | number | null | undefined
): TData[] {
  if (!sort.key) return data;
  const dir = sort.direction === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    const av = accessor ? accessor(a, sort.key!) : (a as Record<string, unknown>)[sort.key!];
    const bv = accessor ? accessor(b, sort.key!) : (b as Record<string, unknown>)[sort.key!];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export function useDataTable<TData>(options: UseDataTableOptions<TData> = {}): UseDataTableReturn<TData> {
  const {
    initialPageSize = 10,
    initialDensity = 'default',
    initialSort = { key: null, direction: 'asc' },
    initialColumnVisibility = {},
    getRowId,
  } = options;

  const [sort, setSortState] = useState<SortState>(initialSort);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(initialColumnVisibility);

  const rowId = useCallback(
    (row: TData) => (getRowId ? getRowId(row) : String((row as Record<string, unknown>).id ?? '')),
    [getRowId]
  );

  const setSort = useCallback((key: string | null, direction?: SortDirection) => {
    setSortState((prev) => ({ key, direction: direction ?? prev.direction }));
  }, []);

  const toggleSort = useCallback((key: string) => {
    setSortState((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const toggleRow = useCallback(
    (id: string) => {
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    []
  );

  const toggleAll = useCallback(
    (rows: TData[]) => {
      setSelectedRowIds((prev) => {
        const ids = rows.map(rowId);
        const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
        if (allSelected) return new Set();
        return new Set(ids);
      });
    },
    [rowId]
  );

  const clearSelection = useCallback(() => setSelectedRowIds(new Set()), []);

  const isRowSelected = useCallback((id: string) => selectedRowIds.has(id), [selectedRowIds]);

  const isAllSelected = useCallback(
    (rows: TData[]) => rows.length > 0 && rows.every((r) => selectedRowIds.has(rowId(r))),
    [selectedRowIds, rowId]
  );

  const isSomeSelected = useCallback(
    (rows: TData[]) => rows.some((r) => selectedRowIds.has(rowId(r))),
    [selectedRowIds, rowId]
  );

  const toggleColumn = useCallback((id: string) => {
    setColumnVisibility((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }, []);

  const resetColumnVisibility = useCallback(() => setColumnVisibility(initialColumnVisibility), [initialColumnVisibility]);

  const selectedCount = useMemo(() => selectedRowIds.size, [selectedRowIds]);

  return {
    sort,
    setSort,
    toggleSort,
    page,
    pageSize,
    setPage,
    setPageSize,
    selectedRowIds,
    toggleRow,
    toggleAll,
    clearSelection,
    setSelectedRowIds,
    isRowSelected,
    isAllSelected,
    isSomeSelected,
    density,
    setDensity,
    columnVisibility,
    toggleColumn,
    setColumnVisibility,
    resetColumnVisibility,
    selectedCount,
  };
}
