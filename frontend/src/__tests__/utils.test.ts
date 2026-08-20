import { describe, it, expect } from 'vitest';
import { cn } from '@utils/cn';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns empty string for no truthy inputs', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});
