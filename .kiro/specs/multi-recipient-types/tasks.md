# Implementation Plan: Multi-Recipient Types

## Overview

This plan implements the multi-recipient types feature for PrizeFlow, extending the recipient system from a simple individual model to a type-aware system supporting seven classifications. Implementation follows a foundation-up approach: types & migration first, then shared components, hooks, feature modules, and finally tests.

## Tasks

- [ ] 1. Set up types, configuration, and migration utilities
  - [ ] 1.1 Define enhanced Recipient types and configuration objects
    - Update `src/shared/types/index.ts` with `RecipientType`, `Recipient`, `LegacyRecipient`, `RecipientFormData`, `ValidationResult` types
    - Create `src/shared/utils/recipientConfig.ts` with `RECIPIENT_TYPES`, `FORM_FIELDS_BY_TYPE`, `TYPE_BADGE_CONFIG` configuration objects
    - _Requirements: 1.1, 1.3, 2.1, 3.1–3.7, 12.2_

  - [ ] 1.2 Implement migration and validation pure functions
    - Create `src/shared/utils/recipientMigration.ts` with `isLegacyRecipient`, `migrateRecipient`, `migrateRecipients` functions
    - Create `src/shared/utils/recipientValidation.ts` with `validateRecipient` function
    - Create `src/shared/utils/recipientUtils.ts` with `parseBulkMembers`, `groupRecipientsByType`, `filterRecipients`, `computeTypeBreakdown`, `computeQuickStats`, `formatQuickStat`, `duplicateRecipient` functions
    - Create `src/shared/utils/index.ts` barrel export
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.7, 2.4, 2.5, 4.2, 4.3, 4.5, 7.2, 7.3, 7.4, 8.2, 10.2, 11.1_

  - [ ]* 1.3 Write property tests for migration logic (Properties 1 & 2)
    - **Property 1: Migration Integrity** — verify `migrateRecipient` produces valid enhanced recipient from any legacy record
    - **Property 2: Selective Migration Preservation** — verify `migrateRecipients` transforms only legacy records, leaves enhanced records unchanged
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.6, 5.7**

  - [ ]* 1.4 Write property tests for bulk member parsing (Properties 5, 6, 7)
    - **Property 5: Bulk Member Import Round-Trip** — joining with commas and re-parsing yields identical array
    - **Property 6: Bulk Import Append-Only** — bulk import preserves existing members as prefix
    - **Property 7: Bulk Import No Empty Strings** — `parseBulkMembers` never produces empty or whitespace-only entries
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6**

  - [ ]* 1.5 Write property tests for validation and utilities (Properties 12, 13, 15, 16)
    - **Property 12: MemberCount Invariant** — `memberCount === members.length` when members non-empty
    - **Property 13: DisplayName Validation** — whitespace-only rejected, non-whitespace accepted
    - **Property 15: Quick Stats Correctness** — `computeQuickStats` counts match actual prize assignments and claims
    - **Property 16: Duplicate Produces Valid Copy** — duplicated record has " (Copy)" suffix, same type, same fields except id
    - **Validates: Requirements 2.2, 2.4, 10.2, 11.1**

- [ ] 2. Create new shared UI components
  - [ ] 2.1 Create Select component
    - Create `src/shared/components/Select.tsx` with label, options, value, onChange, error, ARIA support
    - Export from `src/shared/components/index.ts`
    - _Requirements: 1.2, 3.9, 13.5_

  - [ ] 2.2 Create TagInput component
    - Create `src/shared/components/TagInput.tsx` with tag add/remove, bulk import button, keyboard accessibility
    - Export from `src/shared/components/index.ts`
    - _Requirements: 4.1, 4.4, 3.9, 13.5_

  - [ ] 2.3 Create FilterPills component
    - Create `src/shared/components/FilterPills.tsx` with multi-select pill buttons, ARIA label, keyboard navigation
    - Export from `src/shared/components/index.ts`
    - _Requirements: 7.1, 7.2, 13.5_

- [ ] 3. Update hooks with migration and filtering logic
  - [ ] 3.1 Extend useRecipients hook with migration and new methods
    - Update `src/shared/hooks/useRecipients.ts` to run `migrateRecipients` on mount
    - Add `addRecipient(data: RecipientFormData)` method that computes `memberCount` from `members.length`
    - Add `duplicateRecipient(id: string)` method using `duplicateRecipient` utility
    - Update `updateRecipient` to accept enhanced fields
    - Persist migrated data back to localStorage
    - _Requirements: 5.1, 5.4, 5.5, 5.7, 2.2, 2.3, 10.2_

  - [ ] 3.2 Create useRecipientFilter hook
    - Create `src/shared/hooks/useRecipientFilter.ts` with `selectedTypes`, `setSelectedTypes`, `searchQuery`, `setSearchQuery`, `filterRecipients` state and methods
    - Use memoization for filtered results
    - Export from `src/shared/hooks/index.ts`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 13.3_

  - [ ]* 3.3 Write property tests for filter logic (Properties 8, 9, 10)
    - **Property 8: Filter Correctness — Type Filter** — returns exactly recipients with matching types
    - **Property 9: Filter Correctness — Text Search** — matches displayName, contactPerson, or member names case-insensitively
    - **Property 10: Filter Correctness — Conjunction** — combined filter equals intersection of individual filters
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.6**

- [ ] 4. Checkpoint — Verify foundation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Rewrite RecipientForm with type-aware conditional fields
  - [ ] 5.1 Implement config-driven RecipientForm component
    - Rewrite `src/features/recipients/components/RecipientForm.tsx` to use `FORM_FIELDS_BY_TYPE`
    - Add type selector (Select component) defaulting to Individual
    - Render fields dynamically based on selected type
    - Implement field preservation on type switch (keep shared fields, clear removed fields)
    - Include validation with inline error display and focus management on error
    - Wire bulk import through TagInput for members field
    - Full ARIA labeling and keyboard accessibility
    - _Requirements: 1.2, 1.4, 1.5, 2.4, 2.5, 3.1–3.9, 4.1, 4.4, 13.5_

  - [ ]* 5.2 Write property tests for form field configuration and type switching (Properties 3, 4)
    - **Property 3: Type-Conditional Field Configuration** — each type has non-empty config including required displayName
    - **Property 4: Type Switch Field Preservation** — switching types preserves shared fields and clears hidden fields
    - **Validates: Requirements 3.1–3.8**

- [ ] 6. Extend RecipientList with type filter, badges, quick stats, and duplication
  - [ ] 6.1 Add type filter pills and update RecipientList
    - Update `src/features/recipients/components/Recipients.tsx` to integrate FilterPills above existing search
    - Wire `useRecipientFilter` hook into recipient list rendering
    - Display empty state when filters yield no results
    - _Requirements: 7.1, 7.2, 7.4, 7.7_

  - [ ] 6.2 Extend RecipientRow with type badge, quick stats, and duplicate action
    - Update `src/features/recipients/components/RecipientRow.tsx` to display type badge using `TYPE_BADGE_CONFIG`
    - Add quick stats display using `computeQuickStats` and `formatQuickStat`
    - Add Duplicate button that calls `duplicateRecipient` from the hook and opens pre-filled form
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3_

  - [ ]* 6.3 Write property test for grouping and quick stats (Property 11)
    - **Property 11: Recipient Grouping Completeness** — every group has ≥1 member, sum equals total, each recipient in correct group
    - **Validates: Requirements 6.1, 6.4, 8.2, 8.5**

- [ ] 7. Update Dashboard with type breakdown
  - [ ] 7.1 Add recipient type breakdown section to Dashboard
    - Update `src/features/dashboard/components/Dashboard.tsx` to show type breakdown using `computeTypeBreakdown`
    - Display breakdown only for types with count > 0
    - Use `TYPE_BADGE_CONFIG` for consistent color coding
    - Update `src/features/dashboard/hooks/useDashboardStats.ts` to compute type breakdown
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8. Extend Prize Assignment selector with grouped display
  - [ ] 8.1 Update prize assignment to group recipients by type
    - Update `src/features/prizes/components/PrizeForm.tsx` (or relevant assignment component) to render recipients grouped under type headings using `groupRecipientsByType`
    - Implement type-ahead search within the selector
    - Ensure keyboard navigation across groups with arrow keys
    - Omit groups with zero recipients
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 9. Extend Reports and CSV export with Recipient Type column
  - [ ] 9.1 Add Recipient Type column and update CSV export
    - Update `src/features/reports/components/ReportTable.tsx` to add Recipient Type column
    - Update report data hook to include recipient type in report rows
    - Add group-by-type toggle with collapsible type headings
    - Update CSV export to include Recipient Type column with capitalized values
    - Update CSV column order: Prize Name, Recipient Type, Recipient Name, (Claim Date for claimed)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 9.2 Write property test for CSV round-trip (Property 14)
    - **Property 14: CSV Report Round-Trip** — serialize to CSV and parse back yields identical field values
    - **Validates: Requirements 9.6**

- [ ] 10. Final checkpoint — Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All pure functions are extracted into `src/shared/utils/` for easy testing
- The implementation uses TypeScript throughout, matching the existing codebase
- Performance: memoize filtered lists in hooks, keep bundle under 200KB gzipped
- Accessibility: all new components must have ARIA labels, keyboard navigation, and focus management

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["1.3", "1.4", "1.5", "3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1", "6.2", "7.1", "8.1"] },
    { "id": 5, "tasks": ["6.3", "9.1"] },
    { "id": 6, "tasks": ["9.2"] }
  ]
}
```
