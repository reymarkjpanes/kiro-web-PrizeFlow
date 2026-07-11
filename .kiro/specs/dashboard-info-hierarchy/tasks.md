# Implementation Plan: Dashboard Information Hierarchy

## Overview

Restructure the PrizeFlow dashboard into three distinct visual zones with differentiated typography, spacing, and component sizing. The implementation creates new utility components (SectionHeading, ClaimProgressBar), enhances DashboardCard with a size variant, then rewires the Dashboard layout to use the new zone-based structure. All changes are purely presentational — no data logic modifications required.

## Tasks

- [ ] 1. Create SectionHeading utility component
  - [x] 1.1 Create `src/shared/components/SectionHeading.tsx` with interface and implementation
    - Define `SectionHeadingProps` interface with `children: React.ReactNode` and optional `as?: 'h2' | 'h3'` prop
    - Implement component that renders the appropriate heading element (default `h2`) with classes `text-h3 font-semibold text-neutral-800`
    - _Requirements: 4.1, 4.2, 4.3, 9.2_

  - [x] 1.2 Export SectionHeading from `src/shared/components/index.ts`
    - Add export for `SectionHeading` and `SectionHeadingProps` to the shared components barrel file
    - _Requirements: 4.1_

  - [ ]* 1.3 Write property tests for SectionHeading
    - **Property 9: SectionHeading Element Type** — verify `as` prop renders correct heading element, defaults to `h2`
    - **Property 10: SectionHeading Consistent Styling** — verify `text-h3`, `font-semibold`, `text-neutral-800` classes always present
    - **Validates: Requirements 4.1, 4.2, 4.3, 6.2, 9.2**

- [ ] 2. Enhance DashboardCard with size variant
  - [x] 2.1 Update `src/features/dashboard/components/DashboardCard.tsx` to support size prop
    - Add `size?: 'default' | 'large'` to `DashboardCardProps` interface
    - Create `sizeClasses` map: default → `{ card: 'p-4', value: 'text-display text-neutral-900', label: 'text-body-sm text-neutral-500', gap: 'gap-1' }`, large → `{ card: 'p-6', value: 'text-display text-neutral-900 text-4xl', label: 'text-body text-neutral-600', gap: 'gap-2' }`
    - Apply size classes while preserving existing variant border color behavior
    - Add `aria-live="polite"` on value element (already present, confirm retained)
    - Ensure omitting `size` prop produces identical output to current implementation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.3, 6.4, 8.4, 9.4_

  - [ ]* 2.2 Write property tests for DashboardCard size variants
    - **Property 3: DashboardCard Default Size Styling** — verify default/omitted size renders `p-4`, `text-body-sm text-neutral-500`, `gap-1`
    - **Property 4: DashboardCard Large Size Styling** — verify large size renders `p-6`, `text-body text-neutral-600`, `gap-2`, larger font
    - **Property 5: DashboardCard Variant Border Independence** — verify border class depends only on variant, not size
    - **Property 6: DashboardCard Value Typography** — verify `text-display` class present for both size variants
    - **Property 11: DashboardCard Accessible Value Announcement** — verify `aria-live="polite"` present on value element
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 6.3, 6.4, 8.4, 9.4**

- [ ] 3. Create ClaimProgressBar component
  - [x] 3.1 Create `src/features/dashboard/components/ClaimProgressBar.tsx`
    - Define `ClaimProgressBarProps` interface: `{ claimed: number; unclaimed: number; claimRate: number }`
    - Implement component wrapped in `Card` with `p-5` padding
    - Render header row with "Claim Progress" label and percentage in `text-h3 font-semibold text-primary-700`
    - Render progress bar container with `h-3 bg-neutral-200 rounded-full overflow-hidden`, `role="progressbar"`, `aria-valuenow={Math.round(claimRate)}`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label="Prize claim completion"`
    - Render inner bar with `bg-primary-500 rounded-full transition-all duration-slow` and inline width style from claimRate
    - Render contextual counts: claimed in `text-success-700` and unclaimed in `text-warning-700`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.3_

  - [x] 3.2 Export ClaimProgressBar from `src/features/dashboard/components/index.ts`
    - Add export for `ClaimProgressBar` and `ClaimProgressBarProps` to the dashboard components barrel file
    - _Requirements: 3.1_

  - [ ]* 3.3 Write property tests for ClaimProgressBar
    - **Property 7: ClaimProgressBar ARIA Correctness** — verify `aria-valuenow` equals `Math.round(claimRate)`, `aria-valuemin=0`, `aria-valuemax=100`
    - **Property 8: ClaimProgressBar Width Matches Claim Rate** — verify inner bar width style equals `${claimRate}%`
    - **Validates: Requirements 3.3, 3.4, 9.3**

- [ ] 4. Checkpoint - Verify new components build correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Restructure Dashboard layout with zones and spacing
  - [x] 5.1 Rewrite `src/features/dashboard/components/Dashboard.tsx` with zone-based layout
    - Import `SectionHeading` from shared components, import `ClaimProgressBar` from local components
    - Update page title from `text-h2` to `text-h1 text-neutral-900` (keep as `h1`)
    - Replace outer `space-y-6` with `space-y-10` for inter-zone spacing (40px)
    - Build Zone 1 (Primary KPIs): `space-y-4` wrapper containing a `grid grid-cols-1 md:grid-cols-3 gap-4` with three large DashboardCards (Total Prizes, Claimed with variant="success", Unclaimed with variant="warning") and conditionally render ClaimProgressBar below when `totalPrizes > 0`
    - Build Zone 2 (Financial Overview): `space-y-4` wrapper with `<SectionHeading>Financial Summary</SectionHeading>` followed by `<FinancialSummaryCards prizes={prizes} />`
    - Build Zone 3 (Secondary Data): `space-y-4` wrapper with `<SectionHeading>Overview</SectionHeading>` followed by a `grid grid-cols-1 md:grid-cols-2 gap-4` containing a default-size DashboardCard for Total Recipients and a Card with Recipients by Type badges
    - Remove the old inline progress bar markup
    - Remove the old 4-column grid layout
    - Preserve the empty state rendering (update its title to `text-h1` as well)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.6, 5.1, 5.2, 5.3, 6.1, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 9.1_

  - [ ]* 5.2 Write property tests for Dashboard zone ordering and structure
    - **Property 1: Zone DOM Ordering** — verify DOM order is page title → Primary_KPIs → Financial_Overview → Secondary_Data
    - **Property 2: Primary KPI Zone Structure** — verify zone contains exactly three large DashboardCards and one ClaimProgressBar
    - **Property 12: Data Completeness** — verify all stat values appear as visible text
    - **Validates: Requirements 1.1, 1.2, 5.1, 8.2**

- [ ] 6. Update FinancialSummaryCards heading
  - [x] 6.1 Replace inline heading in `src/features/dashboard/components/FinancialSummaryCards.tsx` with SectionHeading
    - Import `SectionHeading` from `@/shared/components`
    - Replace `<h2 className="text-body-sm font-medium text-neutral-700">Financial Summary</h2>` with `<SectionHeading>Financial Summary</SectionHeading>`
    - Remove the heading since it's now rendered by the Dashboard parent (Zone 2 wrapper)
    - _Requirements: 1.3, 4.1, 6.2_

- [ ] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All changes are purely presentational — no data logic or hook modifications needed
- The existing `useDashboardStats` hook is used without modification (Requirement 8.1)
- TypeScript is the implementation language (React 19 + Tailwind CSS + Vite)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.2", "3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3"] },
    { "id": 3, "tasks": ["5.1", "6.1"] },
    { "id": 4, "tasks": ["5.2"] }
  ]
}
```
