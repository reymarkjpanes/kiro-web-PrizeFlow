# Requirements Document

## Introduction

PrizeFlow currently supports only individual recipients with a simple `{ id, name, contact }` data model. Many events distribute awards to groups such as teams, classes, departments, organizations, and clubs. This enhancement introduces a recipient type system that extends the data model, adapts the UI to show type-relevant fields, enables filtering and reporting by type, and migrates existing data seamlessly.

## Glossary

- **Recipient_System**: The PrizeFlow subsystem responsible for storing, displaying, creating, editing, deleting, and filtering recipients.
- **Recipient_Form**: The form component used to create or edit a recipient, which adapts its visible fields based on the selected recipient type.
- **Recipient_Type**: A classification enum applied to each recipient: Individual, Team, Class, Department, Organization, Club, or Other.
- **Prize_Assignment_Selector**: The dropdown/selection component used to link a prize to a recipient.
- **Dashboard_Module**: The PrizeFlow subsystem responsible for displaying summary statistics and breakdowns.
- **Report_Module**: The PrizeFlow subsystem responsible for displaying and exporting tabular prize data.
- **CSV_Exporter**: The PrizeFlow utility responsible for serializing report data into RFC 4180 CSV format.
- **Data_Migration_Layer**: The subsystem responsible for detecting and upgrading legacy recipient data to the enhanced format on application load.
- **Search_Engine**: The PrizeFlow subsystem responsible for filtering recipients and prizes based on text queries and type filters.
- **Member_Import_Parser**: The subsystem responsible for parsing bulk member name input (comma-separated or newline-separated) into a structured member list.

## Requirements

### Requirement 1: Recipient Type Enumeration

**User Story:** As an event organizer, I want to classify recipients by type (Individual, Team, Class, Department, Organization, Club, Other), so that I can accurately represent the diverse entities receiving prizes at my event.

#### Acceptance Criteria

1. THE Recipient_System SHALL support exactly seven recipient types: Individual, Team, Class, Department, Organization, Club, and Other.
2. WHEN a new recipient is created, THE Recipient_Form SHALL default the type selection to Individual.
3. THE Recipient_System SHALL store the selected type as a required field on every recipient record.
4. WHERE the recipient type is Other, THE Recipient_Form SHALL display a custom label text field that is required.
5. THE Recipient_System SHALL treat recipient type as an immutable classification after creation unless the organizer explicitly edits the recipient.

### Requirement 2: Enhanced Recipient Data Model

**User Story:** As an event organizer, I want each recipient to carry structured metadata appropriate to its type (display name, contact person, members, notes), so that I can track all relevant information without relying on naming hacks.

#### Acceptance Criteria

1. THE Recipient_System SHALL store each recipient with the following fields: id (string, required), type (RecipientType, required), displayName (string, required), contactPerson (string, optional), contactInfo (string, optional), members (string array, optional), memberCount (number, auto-calculated from members array length when members are provided), notes (string, optional), customLabel (string, required only when type is Other).
2. THE Recipient_System SHALL compute memberCount automatically from the length of the members array when members are present.
3. WHEN memberCount is computed, THE Recipient_System SHALL allow manual override of memberCount only when the members array is empty.
4. THE Recipient_System SHALL enforce that displayName contains at least one non-whitespace character.
5. THE Recipient_System SHALL enforce that customLabel contains at least one non-whitespace character when the recipient type is Other.

### Requirement 3: Conditional Form Fields

**User Story:** As an event organizer, I want the recipient form to show only the fields relevant to the selected type, so that data entry is streamlined and I am not confused by irrelevant inputs.

#### Acceptance Criteria

1. WHEN the selected type is Individual, THE Recipient_Form SHALL display only the displayName and contactInfo fields.
2. WHEN the selected type is Team, THE Recipient_Form SHALL display the displayName, contactPerson (labeled "Captain"), members, and notes fields.
3. WHEN the selected type is Class, THE Recipient_Form SHALL display the displayName, contactPerson (labeled "Teacher/Advisor"), and notes fields.
4. WHEN the selected type is Department, THE Recipient_Form SHALL display the displayName, contactPerson (labeled "Department Head"), contactInfo, and notes fields.
5. WHEN the selected type is Organization, THE Recipient_Form SHALL display the displayName, contactPerson (labeled "Representative"), contactInfo, members, and notes fields.
6. WHEN the selected type is Club, THE Recipient_Form SHALL display the displayName, contactPerson (labeled "President"), members, and notes fields.
7. WHEN the selected type is Other, THE Recipient_Form SHALL display the displayName, customLabel, contactPerson, contactInfo, and notes fields.
8. WHEN the organizer changes the recipient type in the form, THE Recipient_Form SHALL preserve any previously entered data in fields that remain visible and clear data from fields that become hidden.
9. THE Recipient_Form SHALL maintain full keyboard accessibility and ARIA labeling for all conditionally rendered fields.

### Requirement 4: Bulk Member Import

**User Story:** As an event organizer, I want to paste a comma-separated or newline-separated list of member names into the members field, so that I can quickly add multiple team or club members without tedious one-by-one entry.

#### Acceptance Criteria

1. WHEN the members field is visible, THE Recipient_Form SHALL provide a bulk import action that accepts multi-line or comma-separated text input.
2. WHEN bulk text is submitted, THE Member_Import_Parser SHALL split the input on commas or newline characters and trim whitespace from each resulting name.
3. WHEN bulk text is submitted, THE Member_Import_Parser SHALL discard any empty strings resulting from the split operation.
4. WHEN bulk import is completed, THE Recipient_Form SHALL append the parsed names to the existing members list without removing previously added members.
5. THE Member_Import_Parser SHALL handle mixed delimiters (commas and newlines in the same input) by treating both as separators.
6. FOR ALL valid bulk input strings, parsing the input and then joining with commas SHALL produce a string that, when re-parsed, yields an identical member list (round-trip property).

### Requirement 5: Backward-Compatible Data Migration

**User Story:** As an existing PrizeFlow user, I want my current recipient data to be automatically upgraded to the new format without any data loss or manual action, so that the application continues working seamlessly after the update.

#### Acceptance Criteria

1. WHEN the application loads and detects recipient records in the legacy format (`{ id, name, contact }`), THE Data_Migration_Layer SHALL transform each record to the enhanced format with type set to Individual, displayName set to the legacy name value, and contactInfo set to the legacy contact value.
2. WHEN migration is performed, THE Data_Migration_Layer SHALL preserve the original id value unchanged.
3. WHEN migration is performed, THE Data_Migration_Layer SHALL set members to an empty array, memberCount to 0, contactPerson to an empty string, notes to an empty string, and customLabel to an empty string.
4. THE Data_Migration_Layer SHALL complete migration transparently without displaying any user-facing prompts or interruptions.
5. WHEN migration is performed, THE Data_Migration_Layer SHALL persist the migrated data back to localStorage immediately so subsequent loads do not re-trigger migration.
6. FOR ALL valid legacy recipient records, migrating a record and then serializing it SHALL produce a valid enhanced recipient record that passes all validation rules (round-trip property).
7. IF localStorage contains a mix of legacy and enhanced format records, THEN THE Data_Migration_Layer SHALL migrate only the legacy records and leave enhanced records unchanged.

### Requirement 6: Prize Assignment by Type

**User Story:** As an event organizer, I want the prize assignment dropdown to show recipients grouped by type, so that I can quickly locate the correct recipient when assigning a prize.

#### Acceptance Criteria

1. THE Prize_Assignment_Selector SHALL display recipients grouped under headings corresponding to each recipient type that has at least one recipient.
2. THE Prize_Assignment_Selector SHALL display each recipient entry in the format: displayName.
3. THE Prize_Assignment_Selector SHALL maintain the constraint that exactly one recipient can be assigned to a prize at a time.
4. WHEN a type group contains zero recipients, THE Prize_Assignment_Selector SHALL omit that group heading entirely.
5. THE Prize_Assignment_Selector SHALL support keyboard navigation across group headings and recipient entries using arrow keys.
6. THE Prize_Assignment_Selector SHALL support type-ahead search to filter the displayed recipients within the dropdown.

### Requirement 7: Search and Filtering

**User Story:** As an event organizer, I want to filter recipients by type and search across recipient names, contact persons, and member names, so that I can quickly find the recipient I need in a large list.

#### Acceptance Criteria

1. THE Search_Engine SHALL provide a type filter control that allows selecting one or more recipient types to display.
2. WHEN a type filter is active, THE Search_Engine SHALL display only recipients matching the selected types.
3. WHEN a text search query is entered, THE Search_Engine SHALL match against the displayName, contactPerson, and individual member names (any member name containing the query constitutes a match).
4. WHEN both a type filter and text search are active, THE Search_Engine SHALL apply both filters conjunctively (results must match both the selected type and the text query).
5. THE Search_Engine SHALL return search results within 300 milliseconds of the last keystroke.
6. THE Search_Engine SHALL perform case-insensitive matching for text queries.
7. WHEN no recipients match the active filters, THE Search_Engine SHALL display an empty state message indicating no results were found.
8. THE Search_Engine SHALL provide a filter for prizes by recipient type, displaying only prizes assigned to recipients of the selected types.

### Requirement 8: Dashboard Recipient Type Breakdown

**User Story:** As an event organizer, I want the dashboard to show a breakdown of recipients by type alongside existing totals, so that I can understand the composition of my event at a glance.

#### Acceptance Criteria

1. THE Dashboard_Module SHALL display the total number of recipients.
2. THE Dashboard_Module SHALL display a breakdown showing the count of recipients for each type that has at least one recipient.
3. WHEN a recipient is added, edited, or deleted, THE Dashboard_Module SHALL update the type breakdown counts immediately without requiring a page refresh.
4. THE Dashboard_Module SHALL continue to display Total Prizes, Claimed Prizes, and Unclaimed Prizes counts as existing functionality.
5. WHEN all recipients of a given type are removed, THE Dashboard_Module SHALL hide that type from the breakdown display.

### Requirement 9: Reports Enhancement

**User Story:** As an event organizer, I want reports to include recipient type information and support grouping by type, so that I can produce structured post-event summaries segmented by recipient category.

#### Acceptance Criteria

1. THE Report_Module SHALL display a Recipient Type column in both claimed and unclaimed report views.
2. THE Report_Module SHALL support grouping report rows by recipient type with collapsible type headings.
3. WHEN the claimed report is exported as CSV, THE CSV_Exporter SHALL include columns: Prize Name, Recipient Type, Recipient Name, Claim Date.
4. WHEN the unclaimed report is exported as CSV, THE CSV_Exporter SHALL include columns: Prize Name, Recipient Type, Recipient Name.
5. THE CSV_Exporter SHALL output the recipient type value as a human-readable capitalized string (e.g., "Individual", "Team", "Organization").
6. FOR ALL report data sets, serializing to CSV and parsing the result back SHALL produce field values identical to the original data (round-trip property).

### Requirement 10: Recipient Duplication

**User Story:** As an event organizer, I want to duplicate an existing recipient to quickly create similar entries (e.g., Team A → Team B), so that I can reduce repetitive data entry for structurally similar recipients.

#### Acceptance Criteria

1. THE Recipient_System SHALL provide a Duplicate action for each recipient in the list view.
2. WHEN a recipient is duplicated, THE Recipient_System SHALL create a new recipient with a unique id, the same type, displayName appended with " (Copy)", and all other field values copied from the original.
3. WHEN a recipient is duplicated, THE Recipient_System SHALL open the Recipient_Form pre-filled with the duplicated data so the organizer can modify it before saving.
4. THE Recipient_System SHALL NOT copy any prize assignments from the original recipient to the duplicate.

### Requirement 11: Recipient Quick Stats

**User Story:** As an event organizer, I want to see a quick summary of prize assignment and claim status for each recipient in the list view, so that I can identify which recipients have outstanding prizes without navigating to reports.

#### Acceptance Criteria

1. THE Recipient_System SHALL display, for each recipient in the list view, the number of prizes assigned and the number of prizes claimed.
2. WHEN a recipient has zero prizes assigned, THE Recipient_System SHALL display "No prizes" as the quick stat.
3. WHEN prizes are assigned or claimed, THE Recipient_System SHALL update the quick stats immediately without requiring a page refresh.
4. THE Recipient_System SHALL format the quick stat as "[claimed count] / [assigned count] claimed" (e.g., "1 / 2 claimed").

### Requirement 12: Type-Based Color Coding

**User Story:** As an event organizer, I want each recipient type to have a distinct color-coded badge in the list view, so that I can quickly scan and identify recipient types visually.

#### Acceptance Criteria

1. THE Recipient_System SHALL display a colored badge indicating the recipient type next to each recipient entry in the list view.
2. THE Recipient_System SHALL assign a distinct, accessible color to each of the seven recipient types using the existing Badge component and design token system.
3. THE Recipient_System SHALL ensure that all type badge colors meet WCAG AA contrast ratio requirements (minimum 4.5:1 for text against the badge background).
4. THE Recipient_System SHALL use consistent type badge colors across all views where recipient type is displayed (list view, reports, prize assignment selector).

### Requirement 13: Performance and Architecture Constraints

**User Story:** As a developer, I want the multi-recipient-types feature to maintain the existing architecture patterns and performance targets, so that the codebase remains maintainable and the application stays fast.

#### Acceptance Criteria

1. THE Recipient_System SHALL preserve the existing feature-module architecture where feature modules import only from `shared/` and never from other feature modules.
2. THE Recipient_System SHALL maintain the total application bundle size below 200KB gzipped.
3. THE Search_Engine SHALL return filtered results within 300 milliseconds for datasets containing up to 500 recipients.
4. THE Recipient_System SHALL persist all data using localStorage with no external service dependencies.
5. THE Recipient_System SHALL maintain WCAG AA accessibility compliance including keyboard navigation and ARIA attributes for all new and modified components.
6. THE Recipient_System SHALL use the existing Tailwind design token system as the single source of truth for styling values.
