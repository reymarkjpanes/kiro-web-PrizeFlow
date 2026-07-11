import React, { useState, useEffect, useRef } from 'react';

export interface AnimatedListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * AnimatedList - A generic list wrapper that animates additions with fade-in.
 *
 * - New items (not present in previous render) receive a fade-in animation
 * - Respects `prefers-reduced-motion` via motion-safe: Tailwind prefix
 * - Falls back to emptyState when items array is empty
 */
function AnimatedList<T>({ items, keyExtractor, renderItem, emptyState }: AnimatedListProps<T>) {
  const [previousKeys, setPreviousKeys] = useState<Set<string>>(new Set());
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());
  const isInitialRender = useRef(true);

  useEffect(() => {
    const currentKeys = new Set(items.map(keyExtractor));

    if (isInitialRender.current) {
      // On initial render, don't animate anything
      isInitialRender.current = false;
      setPreviousKeys(currentKeys);
      return;
    }

    // Find keys that are new (in current but not in previous)
    const addedKeys = new Set<string>();
    currentKeys.forEach(key => {
      if (!previousKeys.has(key)) {
        addedKeys.add(key);
      }
    });

    setNewKeys(addedKeys);
    setPreviousKeys(currentKeys);

    // Clear new keys after animation completes (200ms)
    if (addedKeys.size > 0) {
      const timer = setTimeout(() => {
        setNewKeys(new Set());
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [items, keyExtractor, previousKeys]);

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-2" role="list">
      {items.map(item => {
        const key = keyExtractor(item);
        const isNew = newKeys.has(key);

        return (
          <div
            key={key}
            role="listitem"
            className={isNew ? 'motion-safe:animate-fade-in' : ''}
          >
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}

export { AnimatedList };
