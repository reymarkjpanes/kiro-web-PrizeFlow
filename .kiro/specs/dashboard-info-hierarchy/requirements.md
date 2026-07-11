# Requirements Document

## Introduction

This document formalizes the requirements for restructuring the PrizeFlow dashboard into a clear information hierarchy with three visual zones. The redesign improves scannability by promoting prize-claim KPIs to primary prominence, establishing consistent spacing between zones, and introducing size variants for dashboard cards. All changes are purely presentational — existing data logic, hooks, and state management remain unchanged.

## Glossary

- **Dashboard**: The main overview page displaying aggregated metrics for prizes and recipients
- **DashboardCard**: A reusable component that renders a single KPI metric with a label, value, and optional variant color
- **ClaimProgressBar**: A self-contained component that visualizes prize claim completion with a progress bar, percentage, and contextual counts
- **SectionHeading**: A utility component that renders consistent heading typography for dashboard zones
- **Zone**: A visually distinct group of related information on the dashboard, separated by intentional spacing
- **Primary_KPIs**: Zone 1 — the most critical metrics (Total Prizes, Claimed, Unclaimed) displayed in large cards
- **Financial_Overview**: Zone 2 — budget and distribution metrics displayed in default-sized cards
- **Secondary_Data**: Zone 3 — supporting contextual information (Total Recipients, type breakdown)
- **Size_Variant**: A prop-driven styling mode for DashboardCard, either "large" (promoted) or "default" (standard)
- **Inter_Zone_Spacing**: The 40px (space-y-10) gap between distinct dashboard zones
- **Intra_Zone_Spacing**: The 16px (space-y-4) gap between items within a single zone

## Requirements

### Requirement 1: Visual Zone Ordering

**User Story:** As a dashboard user, I want the most critical metrics displayed first and supporting data below, so that I can immediately assess prize claim status without scrolling.

#### Acceptance Criteria

1. THE Dashboard SHALL render content in the fixed order: page title, then Primary_KPIs zone, then Financial_Overview zone, then Secondary_Data zone
2. WHEN the Dashboard renders with data, THE Primary_KPIs zone SHALL contain exactly three DashboardCard components (Total Prizes, Claimed, Unclaimed) and one ClaimProgressBar component
3. WHEN the Dashboard renders with data, THE Financial_Overview zone SHALL contain a SectionHeading labeled "Financial Summary" followed by the existing FinancialSummaryCards component
4. WHEN the Dashboard renders with data, THE Secondary_Data zone SHALL contain a SectionHeading labeled "Overview" followed by Total Recipients and Recipients by Type content

### Requirement 2: DashboardCard Size Variants

**User Story:** As a dashboard user, I want primary KPI cards to appear larger and more prominent than secondary cards, so that I can visually distinguish high-priority metrics at a glance.

#### Acceptance Criteria

1. THE DashboardCard SHALL accept an optional `size` prop with values "default" or "large"
2. WHEN the `size` prop is omitted, THE DashboardCard SHALL render with default styling (padding p-4, label text-body-sm text-neutral-500, gap-1)
3. WHEN the `size` prop is "large", THE DashboardCard SHALL render with increased padding (p-6), promoted label styling (text-body text-neutral-600), and increased gap (gap-2)
4. WHEN the `size` prop is "large", THE DashboardCard value text SHALL render at a larger font size than the default variant
5. THE DashboardCard SHALL preserve all existing variant border color behavior regardless of the size prop value

### Requirement 3: Claim Progress Bar

**User Story:** As a dashboard user, I want to see claim progress displayed prominently with contextual counts, so that I can understand both the overall rate and specific numbers in one glance.

#### Acceptance Criteria

1. THE ClaimProgressBar SHALL render inside a Card with a progress bar, a percentage value, and claimed/unclaimed counts
2. THE ClaimProgressBar SHALL use a progress bar height of h-3 for increased visual prominence
3. THE ClaimProgressBar progress bar element SHALL have `role="progressbar"`, `aria-valuenow` matching the rounded claim rate, `aria-valuemin` of 0, `aria-valuemax` of 100, and `aria-label` of "Prize claim completion"
4. WHEN rendered, THE ClaimProgressBar inner bar width SHALL equal the `claimRate` percentage value
5. THE ClaimProgressBar inner bar SHALL use a CSS transition for width changes using the duration-slow token
6. WHEN `totalPrizes` is 0, THE Dashboard SHALL hide the ClaimProgressBar component entirely

### Requirement 4: Section Heading Component

**User Story:** As a developer, I want a reusable section heading component, so that all dashboard zone labels use consistent typography and semantic structure.

#### Acceptance Criteria

1. THE SectionHeading SHALL render its children inside a heading element with text-h3, font-semibold, and text-neutral-800 styling
2. THE SectionHeading SHALL accept an optional `as` prop to render as either an `h2` or `h3` element
3. WHEN the `as` prop is omitted, THE SectionHeading SHALL default to rendering an `h2` element

### Requirement 5: Spacing Hierarchy

**User Story:** As a dashboard user, I want clear visual separation between information groups, so that I can perceive distinct sections without labels alone.

#### Acceptance Criteria

1. THE Dashboard SHALL apply Inter_Zone_Spacing (40px / space-y-10) between the page title, Primary_KPIs zone, Financial_Overview zone, and Secondary_Data zone
2. THE Dashboard SHALL apply Intra_Zone_Spacing (16px / space-y-4) between items within each zone
3. THE Dashboard spacing ratio between inter-zone and intra-zone gaps SHALL be approximately 2.5:1

### Requirement 6: Typography Hierarchy

**User Story:** As a dashboard user, I want a clear typographic scale that reinforces the information hierarchy, so that I can navigate the page structure without relying solely on position.

#### Acceptance Criteria

1. THE Dashboard page title SHALL use text-h1 (1.875rem/700 weight) styling
2. THE SectionHeading components SHALL use text-h3 (1.25rem/600 weight) styling
3. THE DashboardCard value text SHALL use text-display styling for both size variants
4. THE DashboardCard label text SHALL use text-body-sm for default size and text-body for large size

### Requirement 7: Responsive Layout

**User Story:** As a mobile user, I want the dashboard to adapt gracefully to smaller screens, so that all information remains readable without horizontal scrolling.

#### Acceptance Criteria

1. WHILE the viewport is below the `md` breakpoint, THE Primary_KPIs grid SHALL stack cards in a single column
2. WHILE the viewport is at or above the `md` breakpoint, THE Primary_KPIs grid SHALL display cards in a 3-column layout
3. WHILE the viewport is below the `md` breakpoint, THE Secondary_Data grid SHALL stack items in a single column
4. WHILE the viewport is at or above the `md` breakpoint, THE Secondary_Data grid SHALL display items in a 2-column layout

### Requirement 8: Backward Compatibility

**User Story:** As a developer, I want the redesign to preserve all existing functionality, so that no data, behavior, or accessibility features are lost.

#### Acceptance Criteria

1. THE Dashboard SHALL continue to use the existing `useDashboardStats` hook without modification
2. THE Dashboard SHALL continue to render all existing data values (totalRecipients, totalPrizes, claimedCount, unclaimedCount, claimRate, typeBreakdown)
3. WHEN both `recipients` and `prizes` arrays are empty, THE Dashboard SHALL display the existing EmptyState component
4. THE DashboardCard SHALL produce identical rendered output when the `size` prop is omitted compared to the current implementation
5. THE Dashboard SHALL maintain WCAG AA color contrast ratios (minimum 4.5:1) for all text content against its background

### Requirement 9: Accessibility

**User Story:** As a user relying on assistive technology, I want the dashboard to maintain proper semantics and ARIA attributes, so that I can navigate and understand all content.

#### Acceptance Criteria

1. THE Dashboard page title SHALL render as an `h1` element
2. THE SectionHeading components SHALL render as `h2` or `h3` elements to maintain heading hierarchy
3. THE ClaimProgressBar SHALL include `role="progressbar"` with accurate `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes
4. THE DashboardCard value SHALL include `aria-live="polite"` to announce value changes to screen readers
5. WHILE text-neutral-600 or darker colors are rendered on a white background, THE Dashboard SHALL maintain a contrast ratio of at least 4.5:1
