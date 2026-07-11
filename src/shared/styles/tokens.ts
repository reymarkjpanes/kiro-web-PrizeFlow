/**
 * Design Token Constants
 *
 * These mirror the Tailwind configuration for use in JS/TS contexts
 * where Tailwind classes are insufficient (e.g., computed styles,
 * conditional logic based on design values).
 *
 * IMPORTANT: The Tailwind config is the canonical source of truth.
 * These constants exist for TypeScript type safety and programmatic access.
 */

/**
 * Semantic Color Palette
 *
 * All color pairings are WCAG AA compliant (≥4.5:1 contrast ratio):
 * - primary-700 on white: ~7.2:1
 * - neutral-900 on white: ~15.4:1
 * - neutral-700 on neutral-50: ~8.3:1
 * - success-700 on white: ~5.1:1
 * - warning-800 on white: ~5.9:1
 * - danger-700 on white: ~5.5:1
 */
export const COLORS = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
} as const;

/**
 * Typographic Scale
 *
 * Minimum 0.25rem difference between adjacent heading levels:
 * - display: 2.25rem
 * - h1: 1.875rem (diff from display: 0.375rem ✓)
 * - h2: 1.5rem   (diff from h1: 0.375rem ✓)
 * - h3: 1.25rem  (diff from h2: 0.25rem ✓)
 * - h4: 1rem     (diff from h3: 0.25rem ✓)
 * - body: 1rem
 * - body-sm: 0.875rem
 * - caption: 0.75rem
 */
export const TYPOGRAPHY = {
  display: { fontSize: '2.25rem', lineHeight: '2.5rem', fontWeight: '700' },
  h1: { fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: '700' },
  h2: { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: '600' },
  h3: { fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: '600' },
  h4: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '600' },
  body: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400' },
  'body-sm': { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: '400' },
  caption: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: '500' },
} as const;

/**
 * Spacing Scale (4px base)
 *
 * Built on a 4px base unit for consistent visual rhythm.
 * Key values: 8px (2), 16px (4), 24px (6), 32px (8), 48px (12)
 */
export const SPACING = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const RADII = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  lg: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
} as const;

/**
 * Transition Durations
 *
 * - fast (150ms): Used for removals, modal dismiss, micro-interactions
 * - normal (200ms): Used for tab transitions, content switches, standard animations
 * - slow (300ms): Used for progress bars, complex layout shifts
 */
export const TRANSITIONS = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

/**
 * Animation Durations
 *
 * Semantic animation timing constants for programmatic use.
 * Maps to Tailwind's duration-fast (150ms) and default (200ms) utilities.
 *
 * - tabTransition (200ms): Tab content fade/slide on navigation change
 * - modalOpen (150ms): Dialog scale+fade on open
 * - modalClose (150ms): Dialog scale+fade on close
 * - listItemEnter (200ms): Fade-in for new list items
 * - listItemExit (150ms): Fade-out for removed list items
 */
export const ANIMATION_DURATIONS = {
  tabTransition: 200,
  modalOpen: 150,
  modalClose: 150,
  listItemEnter: 200,
  listItemExit: 150,
} as const;
