// React hook for accessibility focus management

import { useEffect, useCallback, useRef, RefObject } from 'react';

// Focus trap options
export interface UseFocusTrapOptions {
  enabled?: boolean;
  returnFocus?: boolean;
  allowedElements?: ((element: HTMLElement) => boolean)[];
}

// Focusable element selector
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
  'audio[controls]',
  'video[controls]',
  '[tabindex]:not([disabled])',
].join(', ');

/**
 * Check if element is visible and focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return false;
  }
  
  return element.matches(FOCUSABLE_SELECTORS) && !element.hasAttribute('disabled');
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
  return Array.from(focusableElements).filter(isFocusable);
}

/**
 * Get the first focusable element
 */
export function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  return getFocusableElements(container)[0] || null;
}

/**
 * Get the last focusable element
 */
export function getLastFocusable(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[elements.length - 1] || null;
}

/**
 * Custom hook for focus trap management
 * Traps focus within a specified container element
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  options: UseFocusTrapOptions = {}
): {
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
} {
  const { enabled = true, returnFocus = true } = options;
  
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusHistory = useRef<HTMLElement[]>([]);
  
  // Store previous active element when focus trap is enabled
  useEffect(() => {
    if (!enabled) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    focusFirst();

    return () => {
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, returnFocus]);

  // Focus first element
  const focusFirst = useCallback((): void => {
    if (!ref.current) return;
    
    const first = getFirstFocusable(ref.current);
    if (first) {
      first.focus();
      focusHistory.current = [first];
    }
  }, [ref]);

  // Focus last element
  const focusLast = useCallback((): void => {
    if (!ref.current) return;
    
    const last = getLastFocusable(ref.current);
    if (last) {
      last.focus();
      focusHistory.current.push(last);
    }
  }, [ref]);

  // Focus next element (with wrap-around)
  const focusNext = useCallback((): void => {
    if (!ref.current) return;
    
    const focusable = getFocusableElements(ref.current);
    if (focusable.length === 0) return;
    
    const currentIndex = focusHistory.current.length > 0
      ? focusable.indexOf(focusHistory.current[focusHistory.current.length - 1])
      : -1;
    
    const nextIndex = (currentIndex + 1) % focusable.length;
    const nextElement = focusable[nextIndex];
    
    if (nextElement) {
      nextElement.focus();
      focusHistory.current.push(nextElement);
    }
  }, [ref]);

  // Focus previous element (with wrap-around)
  const focusPrevious = useCallback((): void => {
    if (!ref.current) return;
    
    const focusable = getFocusableElements(ref.current);
    if (focusable.length === 0) return;
    
    const currentIndex = focusHistory.current.length > 0
      ? focusable.indexOf(focusHistory.current[focusHistory.current.length - 1])
      : 0;
    
    const previousIndex = (currentIndex - 1 + focusable.length) % focusable.length;
    const previousElement = focusable[previousIndex];
    
    if (previousElement) {
      previousElement.focus();
      focusHistory.current.push(previousElement);
    }
  }, [ref]);

  // Handle key events for focus trapping
  useEffect(() => {
    if (!enabled || !ref.current) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Tab') {
        const focusable = getFocusableElements(ref.current!);
        
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (event.shiftKey) {
          // Shift + Tab: moving backwards
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          // Tab: moving forwards
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
      
      // Arrow keys navigation support
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          focusNext();
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          focusPrevious();
        }
      }
      
      // Escape key to close
      if (event.key === 'Escape') {
        // Allow consumer to handle escape
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, ref, focusNext, focusPrevious]);

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  };
}

/**
 * Custom hook for modal focus management
 */
export function useModalFocusTrap(
  ref: RefObject<HTMLElement>,
  isOpen: boolean,
  onClose?: () => void
): {
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
} {
  const result = useFocusTrap(ref, {
    enabled: isOpen,
    returnFocus: true,
  });

  useEffect(() => {
    if (isOpen) {
      result.focusFirst();
    }
  }, [isOpen]);

  // Add escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return result;
}

/**
 * Custom hook for dropdown focus management
 */
export function useDropdownFocusTrap(
  ref: RefObject<HTMLElement>,
  isOpen: boolean,
  onToggle: (isOpen: boolean) => void
): {
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
} {
  const result = useFocusTrap(ref, {
    enabled: isOpen,
    returnFocus: false,
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        onToggle(false);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        result.focusFirst();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onToggle(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        result.focusNext();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        result.focusPrevious();
      }
    },
    [onToggle, result]
  );

  return {
    ...result,
    handleKeyDown,
  };
}

/**
 * Custom hook for toast focus management
 */
export function useToastFocusTrap(
  ref: RefObject<HTMLElement>,
  autoDismiss?: boolean
): {
  focusFirst: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
} {
  const result = useFocusTrap(ref, {
    enabled: true,
    returnFocus: false,
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === 'Tab') {
        event.preventDefault();
        result.focusNext();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        result.focusNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        result.focusPrevious();
      }
    },
    [result]
  );

  return {
    ...result,
    handleKeyDown,
  };
}

/**
 * Custom hook for focus management with custom allowed elements
 */
export function useCustomFocusTrap(
  ref: RefObject<HTMLElement>,
  options: UseFocusTrapOptions & {
    allowedClicks?: (element: HTMLElement) => boolean;
  } = {}
): {
  focusFirst: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
} {
  const { allowedElements = [], ...restOptions } = options;

  const trapOptions: UseFocusTrapOptions = {
    ...restOptions,
    allowedElements: [
      ...allowedElements,
      (element) => element.getAttribute('role') === 'button',
    ],
  };

  return useFocusTrap(ref, trapOptions);
}