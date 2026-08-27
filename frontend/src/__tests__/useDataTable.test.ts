/**
 * useDataTable — Enterprise table state hook tests.
 * Covers sorting, pagination, selection, density, and column visibility.
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDataTable, sortData } from '../hooks/useDataTable';

interface Row {
  id: string;
  name: string;
  runs: number;
}

const rows: Row[] = [
  { id: 'a', name: 'Alpha', runs: 100 },
  { id: 'b', name: 'Bravo', runs: 50 },
  { id: 'c', name: 'Charlie', runs: 200 },
];

describe('useDataTable', () => {
  it('initializes with defaults', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    expect(result.current.page).toBe(0);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.density).toBe('default');
    expect(result.current.sort.key).toBeNull();
    expect(result.current.selectedCount).toBe(0);
  });

  it('respects initial options', () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({
        initialPageSize: 25,
        initialDensity: 'compact',
        initialSort: { key: 'runs', direction: 'desc' },
        initialColumnVisibility: { name: false },
      })
    );
    expect(result.current.pageSize).toBe(25);
    expect(result.current.density).toBe('compact');
    expect(result.current.sort).toEqual({ key: 'runs', direction: 'desc' });
    expect(result.current.columnVisibility.name).toBe(false);
  });

  it('toggles sort direction on repeated calls', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.toggleSort('runs'));
    expect(result.current.sort).toEqual({ key: 'runs', direction: 'asc' });
    act(() => result.current.toggleSort('runs'));
    expect(result.current.sort).toEqual({ key: 'runs', direction: 'desc' });
    act(() => result.current.toggleSort('name'));
    expect(result.current.sort).toEqual({ key: 'name', direction: 'asc' });
  });

  it('sets sort explicitly', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.setSort('runs', 'desc'));
    expect(result.current.sort).toEqual({ key: 'runs', direction: 'desc' });
  });

  it('manages pagination state', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    act(() => result.current.setPageSize(50));
    expect(result.current.pageSize).toBe(50);
  });

  it('toggles row selection', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.toggleRow('a'));
    expect(result.current.isRowSelected('a')).toBe(true);
    expect(result.current.selectedCount).toBe(1);
    act(() => result.current.toggleRow('a'));
    expect(result.current.isRowSelected('a')).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it('selects all and clears selection', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.toggleAll(rows));
    expect(result.current.selectedCount).toBe(3);
    expect(result.current.isAllSelected(rows)).toBe(true);
    act(() => result.current.clearSelection());
    expect(result.current.selectedCount).toBe(0);
  });

  it('toggles all off when everything is selected', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.toggleAll(rows));
    act(() => result.current.toggleAll(rows));
    expect(result.current.selectedCount).toBe(0);
  });

  it('reports partial selection', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.toggleRow('a'));
    expect(result.current.isSomeSelected(rows)).toBe(true);
    expect(result.current.isAllSelected(rows)).toBe(false);
  });

  it('uses custom getRowId accessor', () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({ getRowId: (r) => `key-${r.id}` })
    );
    act(() => result.current.toggleAll(rows));
    expect(result.current.isRowSelected('key-a')).toBe(true);
    expect(result.current.selectedCount).toBe(3);
  });

  it('toggles column visibility and resets', () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({ initialColumnVisibility: { name: true, runs: true } })
    );
    act(() => result.current.toggleColumn('name'));
    expect(result.current.columnVisibility.name).toBe(false);
    act(() => result.current.resetColumnVisibility());
    expect(result.current.columnVisibility.name).toBe(true);
  });

  it('changes density', () => {
    const { result } = renderHook(() => useDataTable<Row>());
    act(() => result.current.setDensity('comfortable'));
    expect(result.current.density).toBe('comfortable');
  });
});

describe('sortData', () => {
  it('returns data unchanged when no sort key', () => {
    expect(sortData(rows, { key: null, direction: 'asc' })).toEqual(rows);
  });

  it('sorts numbers ascending', () => {
    const sorted = sortData(rows, { key: 'runs', direction: 'asc' });
    expect(sorted.map((r) => r.runs)).toEqual([50, 100, 200]);
  });

  it('sorts numbers descending', () => {
    const sorted = sortData(rows, { key: 'runs', direction: 'desc' });
    expect(sorted.map((r) => r.runs)).toEqual([200, 100, 50]);
  });

  it('sorts strings via accessor', () => {
    const sorted = sortData(
      rows,
      { key: 'name', direction: 'asc' },
      (r) => r.name
    );
    expect(sorted.map((r) => r.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
  });

  it('does not mutate the original array', () => {
    const copy = [...rows];
    sortData(rows, { key: 'runs', direction: 'desc' });
    expect(rows).toEqual(copy);
  });
});
