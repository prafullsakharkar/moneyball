/**
 * Utility for conditionally joining classNames together.
 * Simple implementation without external deps.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
