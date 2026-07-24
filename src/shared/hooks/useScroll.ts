// React hook for scroll position tracking

import { useState, useEffect, useCallback } from 'react';

// Scroll state types
export interface ScrollState {
  y: number;
  x: number;
  isTop: boolean;
  isBottom: boolean;
  direction: 'up' | 'down' | null;
  threshold: number;
}

export interface UseScrollOptions {
  threshold?: number;
  throttle?: number;
}

/**
 * Custom hook for tracking scroll position
 * Returns current scroll position, direction, and boundary states
 */
export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { threshold = 100, throttle = 16 } = options;

  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollX, setScrollX] = useState<number>(0);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  // Calculate if we're at top or bottom
  const [isTop, setIsTop] = useState<boolean>(true);
  const [isBottom, setIsBottom] = useState<boolean>(false);

  useEffect(() => {
    let lastScrollY = 0;
    let timeoutId: number | null = null;

    const handleScroll = (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        const currentScrollY = window.scrollY || window.pageYOffset;
        const currentScrollX = window.scrollX || window.pageXOffset;

        setScrollY(currentScrollY);
        setScrollX(currentScrollX);

        // Determine direction
        if (currentScrollY > lastScrollY + threshold) {
          setDirection('down');
        } else if (currentScrollY < lastScrollY - threshold) {
          setDirection('up');
        } else {
          setDirection(null);
        }

        lastScrollY = currentScrollY;

        // Check boundaries
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPosition = currentScrollY + viewportHeight;

        setIsTop(currentScrollY <= 0);
        setIsBottom(scrollPosition >= documentHeight - threshold);
      }, throttle);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    const initialScrollY = window.scrollY || window.pageYOffset;
    setScrollY(initialScrollY);
    setScrollX(window.scrollX || window.pageXOffset);
    setIsTop(initialScrollY <= 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, throttle]);

  return {
    y: scrollY,
    x: scrollX,
    isTop,
    isBottom,
    direction,
    threshold,
  };
}

/**
 * Custom hook for tracking scroll position of a specific element
 */
export function useElementScroll(elementRef: React.RefObject<HTMLElement | Window>): ScrollState {
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollX, setScrollX] = useState<number>(0);

  useEffect(() => {
    const element = elementRef.current || window;

    const handleScroll = (): void => {
      const currentScrollY = element instanceof Window 
        ? element.scrollY 
        : element.scrollTop;
      const currentScrollX = element instanceof Window 
        ? element.scrollX 
        : element.scrollLeft;

      setScrollY(currentScrollY);
      setScrollX(currentScrollX);
    };

    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check
      const initialY = element instanceof Window ? element.scrollY : element.scrollTop;
      const initialX = element instanceof Window ? element.scrollX : element.scrollLeft;
      setScrollY(initialY);
      setScrollX(initialX);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [elementRef]);

  return {
    y: scrollY,
    x: scrollX,
    isTop: scrollY <= 0,
    isBottom: false, // Cannot determine without element height
    direction: null,
    threshold: 0,
  };
}

/**
 * Custom hook for scroll-to-top functionality
 */
export interface UseScrollToTopOptions {
  smooth?: boolean;
}

export function useScrollToTop(options?: UseScrollToTopOptions) {
  const { smooth = true } = options || {};

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }, [smooth]);

  return { scrollToTop };
}

/**
 * Custom hook for scroll threshold detection
 */
export function useScrollThreshold(threshold: number = 100): { isAboveThreshold: boolean } {
  const { y, isTop } = useScroll({ threshold });

  const isAboveThreshold = !isTop && y > threshold;

  return { isAboveThreshold };
}

/**
 * Custom hook for detecting infinite scroll trigger
 */
export function useInfiniteScroll(
  isLoading: boolean,
  hasMore: boolean,
  callback: () => void,
  threshold: number = 100
): (node: HTMLDivElement | null) => void {
  return useCallback((node: HTMLDivElement | null): void => {
    if (!node || isLoading || !hasMore) return;

    const observerCallback = (entries: IntersectionObserverEntry[]): void => {
      if (entries[0].isIntersecting) {
        callback();
      }
    };

    const intersectionObserver = new IntersectionObserver(observerCallback, {
      rootMargin: `${threshold}px`,
    });

    intersectionObserver.observe(node);

    return () => {
      if (node) {
        intersectionObserver.unobserve(node);
      }
    };
  }, [isLoading, hasMore, callback, threshold]);
}
