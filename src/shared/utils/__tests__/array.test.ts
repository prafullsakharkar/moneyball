/**
 * Unit Tests for Array Utilities
 * ================================
 * 
 * Tests for array manipulation and utility functions.
 */

import { describe, it, expect } from 'vitest';
import { chunk, flatten, unique, sortBy, groupBy, compact, partition } from '../array';

describe('chunk', () => {
  it('should split array into chunks of specified size', () => {
    const result = chunk([1, 2, 3, 4, 5], 2);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should handle empty array', () => {
    const result = chunk([], 2);
    expect(result).toEqual([]);
  });

  it('should handle chunk size larger than array', () => {
    const result = chunk([1, 2], 5);
    expect(result).toEqual([[1, 2]]);
  });

  it('should handle chunk size of 1', () => {
    const result = chunk([1, 2, 3], 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should fill incomplete chunks when option is set', () => {
    const result = chunk([1, 2, 3], 2, { fill: 0 });
    expect(result).toEqual([[1, 2], [3, 0]]);
  });
});

describe('flatten', () => {
  it('should flatten nested arrays', () => {
    const result = flatten([[1, 2], [3, 4], [5]]);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle empty array', () => {
    const result = flatten([]);
    expect(result).toEqual([]);
  });

  it('should handle single level nesting', () => {
    const result = flatten([[1], [2], [3]]);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('unique', () => {
  it('should remove duplicates from array', () => {
    const result = unique([1, 2, 2, 3, 3, 3, 4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should handle empty array', () => {
    const result = unique([]);
    expect(result).toEqual([]);
  });

  it('should handle array with no duplicates', () => {
    const result = unique([1, 2, 3, 4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should handle string arrays', () => {
    const result = unique(['apple', 'banana', 'apple', 'cherry', 'banana']);
    expect(result).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should remove duplicates using key function', () => {
    interface Item {
      id: number;
      name: string;
    }
    const items: Item[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 1, name: 'Item 1 Duplicate' },
    ];
    const result = unique(items, (item) => item.id);
    expect(result).toEqual([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
  });
});

describe('compact', () => {
  it('should remove null and undefined values', () => {
    const result = compact([1, null, 2, undefined, 3, null]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle empty array', () => {
    const result = compact([]);
    expect(result).toEqual([]);
  });

  it('should handle array with only null/undefined', () => {
    const result = compact([null, undefined, null]);
    expect(result).toEqual([]);
  });
});

describe('partition', () => {
  it('should partition array based on predicate', () => {
    const result = partition([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
    expect(result).toEqual([[2, 4, 6], [1, 3, 5]]);
  });

  it('should handle empty array', () => {
    const result = partition([], () => true);
    expect(result).toEqual([[], []]);
  });

  it('should handle all truthy', () => {
    const result = partition([1, 2, 3], () => true);
    expect(result).toEqual([[1, 2, 3], []]);
  });

  it('should handle all falsy', () => {
    const result = partition([1, 2, 3], () => false);
    expect(result).toEqual([[], [1, 2, 3]]);
  });
});

describe('sortBy', () => {
  interface Item {
    id: number;
    name: string;
    score: number;
  }

  it('should sort array of objects by number property', () => {
    const items: Item[] = [
      { id: 3, name: 'Item 3', score: 80 },
      { id: 1, name: 'Item 1', score: 95 },
      { id: 2, name: 'Item 2', score: 70 },
    ];
    const result = sortBy(items, 'score');
    expect(result).toEqual([
      { id: 2, name: 'Item 2', score: 70 },
      { id: 3, name: 'Item 3', score: 80 },
      { id: 1, name: 'Item 1', score: 95 },
    ]);
  });

  it('should sort array of objects by string property', () => {
    const items: Item[] = [
      { id: 1, name: 'Charlie', score: 80 },
      { id: 2, name: 'Alice', score: 95 },
      { id: 3, name: 'Bob', score: 70 },
    ];
    const result = sortBy(items, 'name');
    expect(result).toEqual([
      { id: 2, name: 'Alice', score: 95 },
      { id: 3, name: 'Bob', score: 70 },
      { id: 1, name: 'Charlie', score: 80 },
    ]);
  });

  it('should sort in descending order', () => {
    const items: Item[] = [
      { id: 1, name: 'Item 1', score: 95 },
      { id: 2, name: 'Item 2', score: 70 },
    ];
    const result = sortBy(items, 'score', true);
    expect(result).toEqual([
      { id: 1, name: 'Item 1', score: 95 },
      { id: 2, name: 'Item 2', score: 70 },
    ]);
  });

  it('should handle empty array', () => {
    const result = sortBy([], 'id');
    expect(result).toEqual([]);
  });
});

describe('groupBy', () => {
  interface Item {
    id: number;
    category: string;
    name: string;
  }

  it('should group by property name', () => {
    const items: Item[] = [
      { id: 1, category: 'A', name: 'Item 1' },
      { id: 2, category: 'B', name: 'Item 2' },
      { id: 3, category: 'A', name: 'Item 3' },
      { id: 4, category: 'B', name: 'Item 4' },
    ];
    const result = groupBy(items, (item) => item.category);
    expect(result).toEqual({
      A: [
        { id: 1, category: 'A', name: 'Item 1' },
        { id: 3, category: 'A', name: 'Item 3' },
      ],
      B: [
        { id: 2, category: 'B', name: 'Item 2' },
        { id: 4, category: 'B', name: 'Item 4' },
      ],
    });
  });

  it('should group by key function', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const result = groupBy(items, (n) => n % 2 === 0 ? 'even' : 'odd');
    expect(result).toEqual({
      odd: [1, 3, 5],
      even: [2, 4, 6],
    });
  });

  it('should handle empty array', () => {
    const result = groupBy<Item>([], (item) => item.category);
    expect(result).toEqual({});
  });
});
