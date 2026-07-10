# Implementation Plan: Production-Quality MVP

## Overview

Transform PrizeFlow from a functional prototype into a production-quality MVP by systematically improving architecture, design system, component library, accessibility, performance, state management, CSV export, and responsive layout. Tasks are ordered so that foundational work (tokens, shared components, hooks) comes first, enabling feature modules to be rebuilt on top of solid infrastructure.

## Tasks

- [ ] 1. Foundation — Design tokens, Tailwind config, and project structure
  - [ ] 1.1 Set up feature-based directory structure and barrel files
    - Create `src/features/dashboard/`, `src/features/recipients/`, `src/features/prizes/`, `src/features/reports/` directories with `components/`, `hooks/`, and `index.ts` barrel files
    - Create `src/shared/components/`, `src/shared/hooks/`, `src/shared/utils/`, `src/shared/types/`, `src/shared/styles/` directories with `index.ts` barrels
    - Move existing type definitions to `src/shared/types/index.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [ ] 1.2 Configure design token system in Tailwind
    - Extend `tailwind.config.js` with semantic color scales (primary, neutral, success, warning, danger — each with 50–900 shades)
    - Define typography scale with 5 heading levels and 2 body sizes specifying font-size, line-height, font-weight
    - Define spacing scale based on 4px base unit with at least 8 increments (4px–64px)
    - Add border-radius tokens (sm: 4px, md: 8px, lg: 12px, xl: 16px, full), shadow tokens (sm, md, lg), transition-duration tokens (fast: 150ms, normal: 200ms, slow: 300ms)
    - Define custom keyframes for press animation and badge color transition
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 1.3 Create design token TypeScript constants
    - Create `src/shared/styles/tokens.ts` exporting COLORS, TRANSITIONS, RADII constants mirroring Tailwind config
    - Ensure tokens are typed with `as const` for type safety
    - _Requirements: 2.1, 2.4, 2.5_

  - [ ] 1.4 Set up Vitest and testing infrastructure
    - Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `@fast-check/vitest`, `jsdom`
    - Configure `vitest.config.ts` (or extend `vite.config.ts`) with test environment, setup files, and coverage
    - Create a test setup file registering jest-dom matchers
    - _Requirements: (testing infrastructure supports all requirements)_

- [ ] 2. Shared Component Library
  - [ ] 2.1 Implement Button component
    - Create `src/shared/components/Button.tsx` with `ButtonProps` interface (variant: primary/secondary/danger/success, size: default/small)
    - Use `React.forwardRef` for ref forwarding
    - Apply variant-derived Tailwind classes, disabled state (`opacity-50 cursor-not-allowed pointer-events-none`)
    - Include hover state change (<50ms), `active:scale-95` press animation (150ms via `transition-transform duration-fast`)
    - _Requirements: 3.1, 5.1, 5.2, 6.3, 11.7_

  - [ ] 2.2 Implement Input component
    - Create `src/shared/components/Input.tsx` with `InputProps` interface (label, error, id, plus standard input attributes)
    - Render `<label htmlFor={id}>` with required asterisk (`*`) and `required` attribute when applicable
    - Show error message below input with `aria-describedby` linkage and danger-colored border when error is provided
    - Use `useId()` for generating unique describedby IDs
    - _Requirements: 3.2, 6.4, 12.1, 12.4, 12.7_

  - [ ] 2.3 Implement Card component
    - Create `src/shared/components/Card.tsx` with consistent padding, border, shadow, and border-radius from design tokens
    - Use `bg-white rounded-lg shadow-sm border border-neutral-200 p-4`
    - _Requirements: 3.3, 11.2_

  - [ ] 2.4 Implement Badge component
    - Create `src/shared/components/Badge.tsx` with `BadgeVariant` (success, warning, neutral)
    - Pill-shaped with semantic background/text colors
    - Include `transition-colors duration-normal` for animated status changes (≤300ms)
    - _Requirements: 3.4, 5.3, 11.3_

  - [ ] 2.5 Implement Table compound component
    - Create `src/shared/components/Table.tsx` with sub-components: Table.Head, Table.Body, Table.Row, Table.HeaderCell, Table.Cell
    - Wrap in horizontally-scrollable container for responsive overflow
    - `Table.HeaderCell` renders `<th scope="col">` for accessibility
    - Apply alternating row backgrounds (`even:bg-neutral-50`) or visible row separators
    - _Requirements: 3.5, 6.11, 8.5, 11.6_

  - [ ] 2.6 Implement Dialog component
    - Create `src/shared/components/Dialog.tsx` with `DialogProps` (open, onClose, title, children, triggerRef)
    - Use `role="dialog" aria-modal="true"` with inert backdrop
    - Integrate `useFocusTrap` hook (implemented in next epic)
    - On open: animate entrance (fade+scale, 150ms), move focus to first focusable child
    - On close: return focus to `triggerRef`, dismiss on Escape/backdrop click
    - _Requirements: 3.6, 5.5, 6.6, 6.7, 13.4, 13.5_

  - [ ] 2.7 Implement EmptyState component
    - Create `src/shared/components/EmptyState.tsx` with heading, description, optional actionLabel/onAction, optional icon
    - Centered layout with personality; CTA uses `Button variant="primary"`
    - _Requirements: 3.7, 4.1, 4.2_

  - [ ]* 2.8 Write unit tests for shared components
    - Test Button variants, disabled state, press animation class
    - Test Input label linkage, error display, aria-describedby
    - Test Table accessibility attributes (scope="col")
    - Test Dialog focus behavior, Escape dismissal, backdrop click
    - Test EmptyState rendering with and without CTA
    - _Requirements: 3.1–3.7_

- [ ] 3. Shared Hooks
  - [ ] 3.1 Implement useLocalStorage hook
    - Create `src/shared/hooks/useLocalStorage.ts` with generic `useLocalStorage<T>(key, defaultValue)`
    - Read from localStorage on mount with JSON.parse; return `defaultValue` on parse failure, log `console.warn`
    - Handle non-array values by returning default and warning
    - On `QuotaExceededError`, retain value in memory and set `error` state
    - Memoize `setValue` with `useCallback`
    - _Requirements: 9.1, 9.2, 9.3, 9.6_

  - [ ] 3.2 Implement useFocusTrap hook
    - Create `src/shared/hooks/useFocusTrap.ts` accepting containerRef and active boolean
    - Query focusable elements (`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`)
    - On Tab at last element → focus first; on Shift+Tab at first → focus last
    - Prevent scroll of background content while active
    - _Requirements: 3.6, 6.6_

  - [ ] 3.3 Implement useArrowNavigation hook
    - Create `src/shared/hooks/useArrowNavigation.ts` with orientation (horizontal/vertical) and loop option
    - Listen for Arrow keys within container, move focus between focusable children
    - Wrap when `loop: true` (last→first, first→last)
    - _Requirements: 6.10_

  - [ ]* 3.4 Write property test for useLocalStorage (Property 1: Storage Integrity)
    - **Property 1: Storage Integrity (Round-Trip)**
    - Use fast-check to generate arbitrary arrays of Recipient/Prize objects
    - Assert serialize→deserialize produces deeply equal arrays
    - **Validates: Requirements 9.2**

  - [ ]* 3.5 Write property test for useFocusTrap (Property 5: Focus Trap Containment)
    - **Property 5: Focus Trap Containment**
    - Generate arbitrary sequences of Tab/Shift+Tab key presses with N focusable elements
    - Assert focused element index always remains within [0, N-1]
    - **Validates: Requirements 3.6, 6.6**

  - [ ]* 3.6 Write property test for useArrowNavigation (Property 6: Arrow Key Navigation Wrapping)
    - **Property 6: Arrow Key Navigation Wrapping**
    - Generate tab list of N≥2 tabs and arbitrary starting index
    - Assert N Right Arrow presses cycle back to original; N Left Arrow presses cycle back in reverse
    - **Validates: Requirements 6.10**

- [ ] 4. Checkpoint — Foundation validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. State Management Hooks and Storage Layer
  - [ ] 5.1 Implement storage utility module
    - Create `src/shared/utils/storage.ts` with key-based persistence interface
    - `readStorage<T>(key, defaultValue): T` — reads and parses; returns default on failure with console.warn
    - `writeStorage<T>(key, value): { success: boolean; error?: string }` — serializes to JSON; catches QuotaExceededError
    - Separate storage keys for recipients and prizes
    - _Requirements: 9.2, 9.3, 9.6_

  - [ ] 5.2 Implement useRecipients hook
    - Create `src/shared/hooks/useRecipients.ts` (or `src/features/recipients/hooks/useRecipients.ts` — shared since prizes depend on it)
    - Build on `useLocalStorage`; provide `addRecipient`, `updateRecipient`, `deleteRecipient`
    - `deleteRecipient` performs cascade delete: clear `recipientId`, set `claimed = false`, set `claimDate = null` on all prizes referencing deleted recipient
    - All mutation functions memoized with `useCallback`
    - _Requirements: 9.1, 9.4, 9.5_

  - [ ] 5.3 Implement usePrizes hook
    - Create `src/shared/hooks/usePrizes.ts`
    - Build on `useLocalStorage`; provide `addPrize`, `updatePrize`, `deletePrize`, `assignRecipient`, `claimPrize`, `unclaimPrize`
    - All mutation functions memoized with `useCallback`
    - _Requirements: 9.1, 9.4_

  - [ ]* 5.4 Write property test for cascade delete (Property 4: Cascade Delete Consistency)
    - **Property 4: Cascade Delete Consistency**
    - Generate arbitrary recipients and prizes with random assignments
    - After `deleteRecipient(id)`, assert no prize has `recipientId === id`, and no such prize has `claimed === true` or non-null `claimDate`
    - **Validates: Requirements 9.5**

- [ ] 6. CSV Export Module
  - [ ] 6.1 Implement CSV serializer with RFC 4180 compliance
    - Create `src/shared/utils/csv.ts` with `serializeCsv(rows, options)` and `parseCsv(csv, options)`
    - Escape commas, double quotes (doubled), newlines by wrapping in double quotes
    - Output UTF-8 with BOM prefix, CRLF line terminators
    - Apply escaping to header row as well
    - Handle null/undefined fields as empty strings
    - Empty dataset produces header-only file
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

  - [ ] 6.2 Implement CSV download utility
    - Create `downloadCsv(filename, content)` in the same module
    - Use `Blob` + `URL.createObjectURL` for download trigger
    - Handle `createObjectURL` failure gracefully
    - _Requirements: 10.4, 10.5, 10.6_

  - [ ]* 6.3 Write property test for CSV round-trip (Property 2: CSV Round-Trip)
    - **Property 2: CSV Round-Trip**
    - Generate arbitrary prize names, recipient names, and ISO dates
    - Assert `parseCsv(serializeCsv([fields], opts))[0]` equals original fields character-for-character
    - **Validates: Requirements 10.10, 10.1, 10.2, 10.3, 10.8**

  - [ ]* 6.4 Write property test for CSV field isolation (Property 3: CSV Field Isolation)
    - **Property 3: CSV Field Isolation**
    - Generate two adjacent fields with arbitrary commas, double quotes, and newlines
    - Assert serializing then parsing produces correct original values without corruption
    - **Validates: Requirements 10.1, 10.2, 10.3**

- [ ] 7. Checkpoint — Core infrastructure validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Feature Module: Dashboard
  - [ ] 8.1 Implement DashboardCard component
    - Create `src/features/dashboard/components/DashboardCard.tsx`
    - Renders summary card with numeric value at font-size ≥2.5× larger than label text
    - Uses Card component from shared library
    - Use ARIA live region (`aria-live="polite"`) for count updates
    - _Requirements: 11.4, 6.12_

  - [ ] 8.2 Implement useDashboardStats hook
    - Create `src/features/dashboard/hooks/useDashboardStats.ts`
    - Compute total recipients, total prizes, claimed count, unclaimed count
    - Memoize computations with `useMemo` (collections may exceed 50 items)
    - _Requirements: 7.1, 14.4_

  - [ ] 8.3 Build Dashboard page component
    - Create `src/features/dashboard/components/Dashboard.tsx` using DashboardCard and shared components
    - Responsive grid layout: single-column on md, multi-column on lg+
    - Export via `src/features/dashboard/index.ts`
    - _Requirements: 8.2, 8.4, 11.2, 14.4_

- [ ] 9. Feature Module: Recipients
  - [ ] 9.1 Implement RecipientForm component
    - Create `src/features/recipients/components/RecipientForm.tsx`
    - Use shared Input component with validation (required field errors)
    - Auto-focus first input on form open
    - Escape key collapses form, returns focus to trigger button
    - Form submission clears fields and collapses panel with height animation (200–400ms)
    - Inline error removal on valid input within 100ms
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.7, 5.4_

  - [ ] 9.2 Implement RecipientList with search and empty states
    - Create `src/features/recipients/components/RecipientList.tsx`
    - Search input with debounced filtering (results within 300ms)
    - Empty state for zero recipients (with "Add Recipient" CTA)
    - Empty state for zero search results (no CTA)
    - Memoize filtered results with `useMemo`
    - _Requirements: 4.2, 4.3, 7.1, 7.4_

  - [ ] 9.3 Implement RecipientRow component
    - Create `src/features/recipients/components/RecipientRow.tsx`
    - Display recipient name and contact with edit/delete action buttons
    - Delete button triggers confirmation Dialog with cascade warning
    - _Requirements: 13.1, 13.3, 6.5_

  - [ ] 9.4 Compose Recipients page and wire to index
    - Create `src/features/recipients/components/Recipients.tsx` composing form, list, and rows
    - Export all public components/hooks via `src/features/recipients/index.ts`
    - _Requirements: 1.3, 14.5_

  - [ ]* 9.5 Write property test for recipient filter (Property 7: Filter Subset Correctness)
    - **Property 7: Filter Subset Correctness**
    - Generate arbitrary recipient lists and search queries
    - Assert filtered result is strict subset; every match contains query in searchable field; no valid match is excluded
    - **Validates: Requirements 7.4**

- [ ] 10. Feature Module: Prizes
  - [ ] 10.1 Implement PrizeForm component
    - Create `src/features/prizes/components/PrizeForm.tsx`
    - Use shared Input with validation; auto-focus on open
    - Support add and edit modes
    - Escape dismissal with focus restoration; collapse animation on submit
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.7, 5.4_

  - [ ] 10.2 Implement PrizeList with filtering and empty states
    - Create `src/features/prizes/components/PrizeList.tsx`
    - Filter/search with memoized computation
    - Empty state for zero prizes (with "Add Prize" CTA)
    - Virtualize list if >100 items (render ≤50 DOM elements at a time)
    - _Requirements: 4.1, 7.1, 7.4, 7.6_

  - [ ] 10.3 Implement PrizeRow component with claim/unclaim actions
    - Create `src/features/prizes/components/PrizeRow.tsx`
    - Display prize info, assignment, claim status Badge
    - Claim/unclaim actions with Badge transition animation (≤300ms)
    - Delete triggers confirmation Dialog
    - State updates reflected within 100ms
    - _Requirements: 5.3, 7.7, 13.2, 13.3_

  - [ ] 10.4 Compose Prizes page and wire to index
    - Create `src/features/prizes/components/Prizes.tsx` composing form, list, rows
    - Export via `src/features/prizes/index.ts`
    - _Requirements: 1.3, 14.5_

- [ ] 11. Feature Module: Reports
  - [ ] 11.1 Implement ReportTable component
    - Create `src/features/reports/components/ReportTable.tsx`
    - Use shared Table component with claimed/unclaimed tab views
    - Filter functionality with empty states for each tab (claimed empty, unclaimed empty, no filter results)
    - _Requirements: 4.4, 4.5, 4.6, 6.11_

  - [ ] 11.2 Implement ExportButton component
    - Create `src/features/reports/components/ExportButton.tsx`
    - Trigger CSV export with correct columns per tab (claimed: Prize Name, Recipient Name, Claim Date; unclaimed: Prize Name, Recipient Name)
    - Handle empty field for unassigned prizes
    - _Requirements: 10.5, 10.6, 10.7, 10.9_

  - [ ] 11.3 Implement useReportData hook
    - Create `src/features/reports/hooks/useReportData.ts`
    - Compute claimed/unclaimed prize lists, filter results
    - Memoize with `useMemo` for datasets >50 items
    - _Requirements: 7.1_

  - [ ] 11.4 Compose Reports page and wire to index
    - Create `src/features/reports/components/Reports.tsx`
    - Export via `src/features/reports/index.ts`
    - _Requirements: 1.3, 14.5_

- [ ] 12. Checkpoint — Feature modules complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Navigation and Application Shell
  - [ ] 13.1 Implement accessible Navigation component
    - Rebuild `src/shared/components/Navigation.tsx` (or `src/App.tsx` inline) implementing WAI-ARIA tablist pattern
    - `role="tablist"` on container, `role="tab"` on each button, `role="tabpanel"` on content
    - `aria-selected` on active tab, `aria-controls` linking tab to panel
    - `tabindex="0"` on active tab, `tabindex="-1"` on inactive tabs
    - Integrate `useArrowNavigation` for Left/Right Arrow key cycling with wrapping
    - Visible focus indicator (3:1 contrast), active tab bottom border/text color distinction
    - Fixed horizontal tab bar at top of viewport
    - _Requirements: 6.9, 6.10, 14.1, 14.2, 14.6_

  - [ ] 13.2 Wire App.tsx with feature modules and state hooks
    - Rebuild `src/App.tsx` importing only from feature module index files and shared
    - Instantiate `useRecipients` and `usePrizes` at app level, pass as props to feature modules
    - Tab switching renders content within 100ms; default to Dashboard on load/refresh
    - Preserve persisted data across tab switches
    - _Requirements: 1.2, 14.3, 14.4, 14.5_

  - [ ] 13.3 Add error boundaries to feature modules
    - Wrap each feature module's top-level component in lightweight error boundary
    - Error boundary renders recovery message with "Reload" button
    - Errors logged to `console.error`
    - _Requirements: (graceful degradation design principle)_

- [ ] 14. Accessibility and Responsive Polish
  - [ ] 14.1 Audit and fix semantic HTML across all components
    - Replace generic `div` elements with `nav`, `main`, `header`, `section`, `form`, `button` where applicable
    - Ensure all icon-only buttons have `aria-label`
    - Verify every form input has associated `<label>` via `htmlFor` or nesting
    - _Requirements: 6.1, 6.4, 6.5_

  - [ ] 14.2 Implement visible focus indicators and contrast compliance
    - Add custom focus-visible styles meeting 3:1 contrast ratio
    - Verify all text meets WCAG AA contrast (4.5:1 normal, 3:1 large text)
    - Ensure keyboard operability for all interactive elements (Tab, Enter, Space, Escape)
    - _Requirements: 6.2, 6.3, 6.8_

  - [ ] 14.3 Implement responsive layout adjustments
    - Apply responsive grid utilities (md, lg, xl breakpoints) across all pages
    - Ensure 44×44px minimum touch targets on tablet (768–1024px)
    - No page-level horizontal scrollbar on viewports ≥768px
    - Tables overflow horizontally within container; page body stays at viewport width
    - Minimum 14px font size on viewports ≥768px
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 15. Performance Optimization
  - [ ] 15.1 Add memoization throughout rendering pipeline
    - Audit all list computations and memoize with `useMemo` where collections ≥50 items
    - Memoize all callback props with `useCallback`
    - Ensure child components receiving unchanged props skip re-renders
    - _Requirements: 7.1, 7.2_

  - [ ] 15.2 Implement list virtualization for large datasets
    - Add virtualization (or pagination rendering ≤50 DOM elements) for lists >100 items
    - Maintain scripting frame duration <50ms during scrolling/filtering
    - _Requirements: 7.6, 7.8_

  - [ ] 15.3 Configure bundle optimization
    - Verify production build <200KB gzipped
    - Configure Vite code splitting for feature modules if needed
    - Validate LCP <2s with 500-item dataset on simulated broadband
    - _Requirements: 7.3, 7.5_

- [ ] 16. Final Checkpoint — All tests pass, full integration verified
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — all implementations use TypeScript
- Feature modules import only from `shared/` — never from each other
- Design tokens are the single source of truth for all visual values
- Focus management and keyboard navigation are first-class concerns in every component

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.4"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.7"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 4, "tasks": ["2.6", "3.4", "3.5", "3.6"] },
    { "id": 5, "tasks": ["2.8", "5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "6.1"] },
    { "id": 7, "tasks": ["5.4", "6.2", "6.3", "6.4"] },
    { "id": 8, "tasks": ["8.1", "8.2", "9.1", "9.2", "9.3", "10.1", "10.2", "10.3", "11.1", "11.2", "11.3"] },
    { "id": 9, "tasks": ["8.3", "9.4", "9.5", "10.4", "11.4"] },
    { "id": 10, "tasks": ["13.1", "13.2"] },
    { "id": 11, "tasks": ["13.3", "14.1", "14.2", "14.3"] },
    { "id": 12, "tasks": ["15.1", "15.2", "15.3"] }
  ]
}
```
