# Implementation Plan: PrizeFlow Evolution

## Overview

This plan implements PrizeFlow Evolution in incremental phases: foundational type/utility changes first, then the RBAC engine, financial management, landing page, UX enhancements, and finally integration wiring. Each task builds on previous tasks, ensuring no orphaned code. The implementation uses TypeScript with React 19, Tailwind CSS, and Vite.

## Tasks

- [ ] 1. Extend shared types and create utility modules
  - [x] 1.1 Extend shared types with financial and RBAC type definitions
    - Add `SupportedCurrency`, `PrizeType`, `DistributionStatus` types to `src/shared/types/index.ts`
    - Extend the `Prize` interface with optional financial fields (prizeValue, currency, prizeType, fundingSource, sponsor, budgetCategory, distributionStatus)
    - Add `RoleName`, `FeatureCategory`, `PermissionLevel`, `PermissionMatrixData`, `RolePermissions` types
    - Add `BudgetSummary`, `CurrencyTotal` interfaces
    - Extend `TabId` to include `'rbac'`
    - _Requirements: 4.1, 9.1, 9.2, 5.1, 7.4_

  - [x] 1.2 Create currency formatting utility (`src/shared/utils/currency.ts`)
    - Implement `formatCurrencyValue(value: number, currency: SupportedCurrency): string` using ISO 4217 codes with 2 decimal places (0 for JPY)
    - Use locale-appropriate thousand separators
    - _Requirements: 5.5, 7.2_

  - [x] 1.3 Create financial calculation utility (`src/shared/utils/financialCalc.ts`)
    - Implement `calculateBudgetSummary(prizes: Prize[]): BudgetSummary`
    - Implement `calculateCurrencyTotals(prizes: Prize[]): CurrencyTotal[]`
    - Implement `getDominantCurrency(prizes: Prize[]): SupportedCurrency`
    - Implement `validatePrizeValue(input: string): ValidationResult`
    - Exclude prizes with null/zero prizeValue from monetary sums
    - _Requirements: 5.1, 5.3, 4.5, 4.6, 7.4, 7.5_

  - [x] 1.4 Create localStorage data migration utility (`src/shared/utils/migration.ts`)
    - Implement `migratePrizes(raw: unknown[]): Prize[]` that preserves existing fields and applies defaults for missing financial fields
    - Handle JSON parse failures gracefully: retain raw data, fall back to empty arrays, surface error
    - _Requirements: 16.5, 16.7_

  - [x]* 1.5 Write property tests for migration utility
    - **Property 1: Migration preserves existing fields and applies correct defaults**
    - **Validates: Requirements 4.1, 16.5**
    - Create `src/shared/utils/__tests__/migration.property.test.ts`

  - [x]* 1.6 Write property tests for financial calculations
    - **Property 4: Budget summary calculation correctness**
    - **Validates: Requirements 5.1, 4.5, 6.3, 6.4, 6.5**
    - Create `src/shared/utils/__tests__/financialCalc.property.test.ts`

  - [x]* 1.7 Write property tests for currency formatting
    - **Property 6: Currency formatting**
    - **Validates: Requirements 5.5, 7.2**
    - Create `src/shared/utils/__tests__/currency.property.test.ts`

  - [x]* 1.8 Write property tests for prize value validation
    - **Property 3: Prize value validation correctness**
    - **Validates: Requirements 4.6**
    - Create `src/shared/utils/__tests__/validation.property.test.ts`

  - [x]* 1.9 Write property test for dominant currency determination
    - **Property 5: Dominant currency determination**
    - **Validates: Requirements 5.3**
    - Add to `src/shared/utils/__tests__/financialCalc.property.test.ts`

  - [x]* 1.10 Write property test for per-currency budget grouping
    - **Property 7: Per-currency budget grouping**
    - **Validates: Requirements 7.4**
    - Add to `src/shared/utils/__tests__/financialCalc.property.test.ts`

- [ ] 2. Implement RBAC engine and context
  - [x] 2.1 Create RBAC types and permission matrix data (`src/shared/rbac/types.ts` and `src/shared/rbac/permissions.ts`)
    - Define static permission matrix constant mapping all 7 roles to their feature categories and permission levels
    - Define `TAB_CATEGORY_MAP` mapping TabIds to FeatureCategories
    - _Requirements: 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11_

  - [x] 2.2 Create RBAC engine functions (`src/shared/rbac/engine.ts`)
    - Implement `hasPermission(role, category, level): boolean`
    - Implement `getRolePermissions(role): RolePermissions`
    - Implement `isTabVisible(role, tabId): boolean`
    - Implement `isActionEnabled(role, category, action): boolean`
    - Enforce implicit View requirement: any non-View permission implies View
    - Handle unknown roles by falling back to Super Administrator
    - Handle unknown categories by denying all permissions
    - _Requirements: 9.2, 9.10, 9.11, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 2.3 Create RBAC React context and hook (`src/shared/hooks/useRBAC.ts`)
    - Implement `RBACProvider` context that wraps the App Shell
    - Implement `useRBAC()` hook returning `RBACContextValue`
    - Persist selected role to localStorage (`prizeflow_role`)
    - Restore role from localStorage on mount, fall back to "Super Administrator" for invalid values
    - Set `isDegraded` flag if permission matrix is unavailable
    - _Requirements: 8.3, 8.5, 8.6, 8.7_

  - [x]* 2.4 Write property tests for RBAC engine
    - **Property 8: Permission evaluation determinism and implicit View enforcement**
    - **Validates: Requirements 9.2, 9.10, 9.11**
    - Create `src/shared/rbac/__tests__/engine.property.test.ts`

  - [x]* 2.5 Write property tests for RBAC UI enforcement matching
    - **Property 9: RBAC UI enforcement matches permission matrix**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**
    - Add to `src/shared/rbac/__tests__/engine.property.test.ts`

  - [x]* 2.6 Write property tests for role persistence
    - **Property 10: Role persistence round-trip**
    - **Validates: Requirements 8.3, 8.6**
    - Add to `src/shared/rbac/__tests__/engine.property.test.ts`

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement landing page feature module
  - [x] 4.1 Create landing page components (`src/features/landing/`)
    - Create `Landing.tsx` container component with `onEnterApp` prop
    - Create `HeroSection.tsx` with product name, value proposition (≤150 chars), "Get Started" CTA, and dashboard preview illustration
    - Create `ProblemSection.tsx` listing 6 pain points with heading
    - Create `SolutionSection.tsx` with numbered workflow steps (Event Created → Recipients Registered → Prizes Assigned → Claims Recorded → Reports Generated)
    - Create `FeaturesSection.tsx` listing 5 capabilities with headings and descriptions (≥10 words each)
    - Create `WhySection.tsx` listing 5 benefits
    - Create `CtaSection.tsx` with final "Get Started" button
    - Create `LandingNav.tsx` with fixed header, PrizeFlow logo, "Enter App" link, keyboard-focusable with visible focus indicators
    - Create `index.ts` barrel export
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.4_

  - [x] 4.2 Integrate landing page into App.tsx with view state management
    - Add `view` state (`'landing' | 'app'`) to `App.tsx`
    - Render `Landing` component when `view === 'landing'`
    - Render App Shell when `view === 'app'`
    - Handle "Get Started" / "Enter App" → switch to app view with error handling (remain on landing if navigation fails)
    - Add "Back to Home" link in the app shell navigation
    - Store/restore view preference in localStorage (`prizeflow_view`)
    - Default to 'landing' for first-time visitors
    - _Requirements: 1.2, 3.2, 3.3, 2.7_

  - [ ]* 4.3 Write unit tests for landing page
    - Test hero content rendering, section ordering, CTA button behavior
    - Test responsive layout breakpoints (768px)
    - Test error handling when navigation callback throws
    - Create `src/features/landing/__tests__/Landing.test.tsx`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.5, 2.7_

- [ ] 5. Implement financial management in prize forms and hooks
  - [x] 5.1 Update `usePrizes` hook to use migration and extended Prize type
    - Modify `src/shared/hooks/usePrizes.ts` to call `migratePrizes` on localStorage load
    - Handle `QuotaExceededError` on write (retain in memory, display warning)
    - Ensure new prizes default financial fields correctly
    - _Requirements: 4.4, 16.5, 16.7_

  - [x] 5.2 Create `CurrencySelector` shared component (`src/shared/components/CurrencySelector.tsx`)
    - Render dropdown with all 8 supported currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR)
    - Default to USD, support `disabled` prop
    - _Requirements: 7.1, 7.3_

  - [x] 5.3 Extend `PrizeForm` with financial fields
    - Add optional fields: prizeValue, currency (using CurrencySelector), prizeType, fundingSource, sponsor, budgetCategory
    - Add distributionStatus field (only visible in edit mode, defaults to "pending" on create)
    - Add inline validation for prizeValue using `validatePrizeValue`
    - Display validation error message with acceptable range
    - Allow all distributionStatus transitions without restriction
    - _Requirements: 4.2, 4.3, 4.6, 4.7, 7.3_

  - [ ]* 5.4 Write property tests for prize serialization round-trip
    - **Property 2: Prize data serialization round-trip**
    - **Validates: Requirements 4.4**
    - Create `src/shared/hooks/__tests__/usePrizes.property.test.ts`

  - [ ]* 5.5 Write property tests for distribution status transitions
    - **Property 13: Distribution status transitions are unrestricted**
    - **Validates: Requirements 4.7**
    - Add to `src/shared/hooks/__tests__/usePrizes.property.test.ts`

- [ ] 6. Implement financial dashboard and reporting enhancements
  - [x] 6.1 Create `useFinancialSummary` hook (`src/shared/hooks/useFinancialSummary.ts`)
    - Compute `BudgetSummary` and `CurrencyTotal[]` from prizes
    - Derive dominant currency for display
    - _Requirements: 5.1, 5.2, 5.3, 7.4_

  - [x] 6.2 Add financial summary cards to Dashboard
    - Create `FinancialSummaryCards` component in `src/features/dashboard/components/`
    - Display: Total Prize Budget, Total Distributed Value, Remaining Budget, Cash Awards Count, Physical Awards Count
    - Group by currency when multiple currencies exist
    - Show zero values with message when no prize financial data exists
    - Format all monetary values to 2 decimal places with currency symbol and thousand separators
    - Render alongside existing dashboard cards (Total Prizes, Claimed, Unclaimed)
    - _Requirements: 5.1, 5.4, 5.5, 7.4, 16.3_

  - [x] 6.3 Extend Reports table with financial columns
    - Add columns: Prize Value, Currency, Prize Type, Funding Source, Sponsor, Budget Category, Distribution Status after existing columns
    - Display empty cell for prizes with no prizeValue
    - _Requirements: 6.1, 6.5_

  - [x] 6.4 Add financial summary section above Reports table
    - Display total budget, total distributed, remaining budget for filtered view
    - Recalculate when filter changes (claimed/unclaimed)
    - _Requirements: 6.3, 6.4_

  - [x] 6.5 Extend CSV export with financial columns
    - Append financial columns after existing columns in exported CSV
    - Maintain original column order for backward compatibility
    - _Requirements: 6.2, 16.4_

  - [ ]* 6.6 Write property tests for CSV export column ordering
    - **Property 12: CSV export column ordering**
    - **Validates: Requirements 6.2, 16.4**
    - Create `src/shared/utils/__tests__/csv.property.test.ts`

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement RBAC UI enforcement and management page
  - [x] 8.1 Create `RoleSwitcher` component (`src/shared/components/RoleSwitcher.tsx`)
    - Render dropdown in navigation area with all 7 roles in specified order
    - Keyboard-navigable, screen-reader labeled
    - Display currently active role name visibly at all times
    - Call `setRole` from RBAC context on selection
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 8.2 Wire RBAC context into App Shell and navigation
    - Wrap App Shell content in `RBACProvider`
    - Filter navigation tabs based on `isTabVisible` for current role
    - Display degraded warning indicator if `isDegraded` is true
    - Redirect to dashboard with access-denied notification if user attempts to reach restricted tab
    - _Requirements: 10.1, 10.6, 8.7_

  - [x] 8.3 Enforce RBAC on action buttons across feature views
    - Disable "Add"/"Create" buttons when Create permission missing (reduced opacity, non-interactive, aria-disabled, tooltip)
    - Disable "Edit" buttons when Edit permission missing
    - Disable "Delete" buttons when Delete permission missing
    - Disable CSV export button when Export permission missing
    - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.7_

  - [x] 8.4 Create RBAC management page (`src/features/rbac/`)
    - Create `RBACPage.tsx` container
    - Create `PermissionMatrix.tsx` table with roles as columns, feature category/permission combinations as rows
    - Create `RoleDetailPanel.tsx` showing all permissions for selected role with descriptions
    - Create `PermissionLegend.tsx` explaining each permission level
    - Distinguish granted vs denied with non-color-dependent indicators (checkmark vs empty/"X")
    - Show/hide RBAC tab based on Settings View permission
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 8.5 Write unit tests for RBAC page and role switcher
    - Test matrix rendering, detail panel, legend
    - Test role switcher selection, keyboard navigation, persistence
    - Create `src/features/rbac/__tests__/RBACPage.test.tsx`
    - _Requirements: 11.1, 11.2, 8.1, 8.2_

- [ ] 9. Implement UX enhancements (animations, empty states, typography)
  - [x] 9.1 Extend design tokens and typography system (`src/shared/styles/tokens.ts`)
    - Define typographic scale: h1 through h4 with ≥0.25rem difference between levels, body and caption sizes
    - Define spacing tokens on 4px base: 8px, 16px, 24px+
    - Define semantic color palette (primary, neutral, success, warning, danger) with WCAG AA compliant contrast
    - Define animation duration tokens (200ms for transitions, 150ms for removals/modals)
    - _Requirements: 12.1, 12.2, 12.3, 14.1_

  - [x] 9.2 Create `AnimatedList` shared component (`src/shared/components/AnimatedList.tsx`)
    - Implement fade-in for additions and fade-out for removals
    - Respect `prefers-reduced-motion` media query (disable animations)
    - _Requirements: 14.2, 14.3, 14.5_

  - [x] 9.3 Add transition animations to navigation tab switching and modals
    - Apply fade/slide animation (≤200ms) on tab content changes
    - Apply scale+fade (≤150ms) on dialog open/close
    - Disable all animations when `prefers-reduced-motion` is active
    - _Requirements: 14.1, 14.4, 14.5_

  - [x] 9.4 Implement contextual empty states for all views
    - Recipients empty state: icon, descriptive message, "Add Recipient" CTA
    - Prizes empty state: icon, descriptive message, "Add Prize" CTA
    - Dashboard empty state: message about populating data, direction to Prizes/Recipients
    - Reports empty state: message about automatic population
    - Toggle between empty state and data list based on array length
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 9.5 Apply typography, spacing, and table styling across all views
    - Apply heading scale and spacing tokens globally
    - Add visible row separation to all data tables (alternating backgrounds or 1px borders)
    - Ensure all text meets WCAG AA 4.5:1 contrast ratio
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 9.6 Enhance navigation with section headers and sub-section controls
    - Add section header at top of each tab's content area showing current section name
    - Add in-page tab controls for Reports (Claimed/Unclaimed sub-sections)
    - Maintain active tab during modal open/close and form submission
    - Ensure tab content renders within 200ms
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 9.7 Write property tests for empty state toggle
    - **Property 11: Empty state toggle correctness**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**
    - Create `src/features/dashboard/__tests__/EmptyState.property.test.ts`

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Integration, backward compatibility, and final wiring
  - [x] 11.1 Verify backward compatibility of existing CRUD operations
    - Ensure all recipient operations (add, edit, delete, duplicate, search) work identically
    - Ensure all prize operations (add, edit, delete, assign, unassign, claim, unclaim) work identically
    - Confirm existing dashboard summary cards (Total Prizes, Claimed, Unclaimed) remain visible alongside new financial cards
    - Verify existing CSV export columns remain in original order
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 11.2 Wire all new components into App.tsx and verify full flow
    - Integrate landing page view toggle
    - Integrate RBAC provider and role switcher in navigation
    - Integrate RBAC tab in navigation (conditional on role)
    - Ensure all feature modules are wrapped in individual ErrorBoundary components
    - Verify no blank screens on error (fallbacks in place)
    - _Requirements: 3.2, 3.3, 8.1, 11.1, 16.6_

  - [ ] 11.3 Run existing cascade-delete property tests and confirm passing
    - Verify `src/shared/hooks/__tests__/cascade-delete.property.test.ts` passes without changes
    - Confirm extended Prize type is backward-compatible with existing test fixtures
    - _Requirements: 16.1, 16.2_

  - [ ]* 11.4 Write integration tests for end-to-end flows
    - Test landing → app shell → CRUD operations → role switching → report export
    - Verify financial data flows through create → dashboard → reports → export
    - _Requirements: 16.1, 16.2, 16.6_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific UI behaviors and edge cases
- The design uses TypeScript throughout; all implementation follows TypeScript with React 19 + Tailwind CSS
- All new modules follow the existing feature-based architecture (`src/features/` and `src/shared/`)
- Existing `fast-check` and `@fast-check/vitest` packages are already in devDependencies

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "2.1"] },
    { "id": 2, "tasks": ["1.5", "1.6", "1.7", "1.8", "1.9", "1.10", "2.2"] },
    { "id": 3, "tasks": ["2.3", "4.1", "9.1"] },
    { "id": 4, "tasks": ["2.4", "2.5", "2.6", "4.2", "5.1", "5.2", "9.2"] },
    { "id": 5, "tasks": ["4.3", "5.3", "6.1", "8.1", "9.3", "9.4"] },
    { "id": 6, "tasks": ["5.4", "5.5", "6.2", "6.3", "6.4", "6.5", "8.2", "9.5", "9.6"] },
    { "id": 7, "tasks": ["6.6", "8.3", "8.4", "9.7"] },
    { "id": 8, "tasks": ["8.5", "11.1", "11.2"] },
    { "id": 9, "tasks": ["11.3", "11.4"] }
  ]
}
```
