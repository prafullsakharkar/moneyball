// React hook for click outside detection

import { useEffect, useCallback, useRef } from 'react';

// Click outside handler
export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

// Use click outside options
export interface UseClickOutsideOptions {
  enabled?: boolean;
  events?: ('click' | 'touchstart')[];
  exclude?: HTMLElement[];
}

/**
 * Custom hook for click outside detection
 * Triggers a callback when clicking outside of specified elements
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: ClickOutsideHandler,
  options: UseClickOutsideOptions = {}
): void {
  const { enabled = true, events = ['click', 'touchstart'], exclude = [] } = options;

  const savedHandler = useRef<ClickOutsideHandler>(handler);

  // Update ref value if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: MouseEvent | TouchEvent): void => {
      const target = event.target as HTMLElement | null;
      
      // Check if target is inside our ref
      const isInside = ref.current?.contains(target) ?? false;
      
      // Check if target is in excluded elements
      const isExcluded = exclude.some((el) => el.contains(target));
      
      // Check if target is the ref element itself
      const isRefElement = ref.current === target;

      if (!isInside && !isExcluded && !isRefElement) {
        savedHandler.current(event);
      }
    };

    // Add event listeners
    events.forEach((eventType) => {
      document.addEventListener(eventType, handleEvent);
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, handleEvent);
      });
    };
  }, [ref, enabled, events, exclude]);
}

/**
 * Custom hook for click outside detection with modal behavior
 */
export interface UseModalClickOutsideOptions extends UseClickOutsideOptions {
  closeOnBackdrop?: boolean;
}

export function useModalClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  options: UseModalClickOutsideOptions = {}
): void {
  const { closeOnBackdrop = true, ...restOptions } = options;

  const handler = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      if (closeOnBackdrop) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  useClickOutside(ref, handler, restOptions);
}

/**
 * Custom hook for dropdown click outside detection
 */
export interface UseDropdownClickOutsideOptions extends UseClickOutsideOptions {
  closeOnItemClick?: boolean;
}

export function useDropdownClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  isOpen: boolean,
  onClose: () => void,
  options: UseDropdownClickOutsideOptions = {}
): (event: React.MouseEvent | React.TouchEvent) => void {
  const { closeOnItemClick = true, ...restOptions } = options;

  // Handle click inside the dropdown
  const handleItemClick = useCallback(
    (event: React.MouseEvent | React.TouchEvent): void => {
      event.stopPropagation();
      if (closeOnItemClick) {
        onClose();
      }
    },
    [closeOnItemClick, onClose]
  );

  useClickOutside(ref, onClose, restOptions);

  return handleItemClick;
}

/**
 * Custom hook for toast click outside detection
 */
export function useToastClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onDismiss: (id: string) => void,
  id: string,
  options: UseClickOutsideOptions = {}
): void {
  const handler = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      onDismiss(id);
    },
    [id, onDismiss]
  );

  useClickOutside(ref, handler, options);
}

/**
 * Custom hook for menu click outside detection
 */
export function useMenuClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
  options: UseClickOutsideOptions = {}
): void {
  useClickOutside(ref, onClose, {
    enabled: isOpen,
    ...options,
  });
}

/**
 * Custom hook for detecting clicks outside multiple elements
 */
export function useClickOutsideMultiple(
  refs: React.RefObject<HTMLElement | null>[],
  handler: ClickOutsideHandler,
  options: UseClickOutsideOptions = {}
): void {
  const { enabled = true, events = ['click', 'touchstart'] } = options;

  const savedHandler = useRef<ClickOutsideHandler>(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: MouseEvent | TouchEvent): void => {
      const target = event.target as HTMLElement | null;

      // Check if target is inside any of the refs
      const isInsideAny = refs.some((ref) => ref.current?.contains(target) ?? false);

      if (!isInsideAny) {
        savedHandler.current(event);
      }
    };

    // Add event listeners
    events.forEach((eventType) => {
      document.addEventListener(eventType, handleEvent);
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, handleEvent);
      });
    };
  }, [refs, enabled, events]);
}