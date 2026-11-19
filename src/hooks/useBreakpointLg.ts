import { useState, useEffect } from 'react';

/**
 * Returns true if viewport width is >= 1024px (Tailwind 'lg' breakpoint).
 * SSR-safe, defaults to true on initial render.
 */
export function useBreakpointLg(): boolean {
  const [isLg, setIsLg] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsLg(e.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Safari / legacy fallback
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return isLg;
}
