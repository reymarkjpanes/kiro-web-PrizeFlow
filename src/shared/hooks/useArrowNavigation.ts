import { useEffect, useCallback } from 'react';

interface ArrowNavigationOptions {
  orientation: 'horizontal' | 'vertical';
  loop: boolean;
}

/**
 * Arrow key navigation for tab bars, menus, and similar lists.
 *
 * - Moves focus between focusable children on Arrow keys
 * - Horizontal: Left/Right arrows
 * - Vertical: Up/Down arrows
 * - Wraps when loop=true (last→first, first→last)
 */
export function useArrowNavigation(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ArrowNavigationOptions
): void {
  const { orientation, loop } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    if (event.key !== prevKey && event.key !== nextKey) return;

    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>('[role="tab"], button:not([disabled]), [tabindex]')
    ).filter(el => el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    event.preventDefault();

    let nextIndex: number;
    if (event.key === nextKey) {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) {
        nextIndex = loop ? 0 : focusableElements.length - 1;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = loop ? focusableElements.length - 1 : 0;
      }
    }

    focusableElements[nextIndex].focus();
  }, [containerRef, orientation, loop]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, containerRef]);
}
