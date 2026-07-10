---
inclusion: manual
---

# Testing Standards — PrizeFlow

## Current State

The MVP does not include automated tests. This document defines standards for when tests are introduced.

## Recommended Test Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit and integration test runner (Vite-native) |
| React Testing Library | Component testing with user-centric queries |
| jsdom | DOM environment for component tests |

## Test Structure

```
src/
├── utils/
│   ├── storage.ts
│   └── storage.test.ts      # Co-located unit tests
├── components/
│   ├── ConfirmDialog.tsx
│   └── ConfirmDialog.test.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── Dashboard.test.tsx
```

- Test files are co-located with source files
- File naming: `<filename>.test.ts` or `<filename>.test.tsx`

## What to Test

### Must Test (Critical Paths)

- localStorage read/write operations (`storage.ts`)
- CSV generation output (`csv.ts`)
- Claim/unclaim state transitions
- Recipient deletion cascading to prize assignments
- Dashboard count calculations
- Search filtering logic

### Should Test (Important Interactions)

- Form submission creates correct data structure
- Edit populates form with existing values
- Delete confirmation flow
- Empty states render correctly
- Report filtering

### May Skip (Low Value)

- Static rendering of simple components
- Tailwind class application
- Navigation tab switching

## Test Conventions

- Use `describe`/`it` blocks with descriptive names
- Arrange-Act-Assert pattern
- Mock `localStorage` in unit tests
- Use `userEvent` over `fireEvent` for interaction tests
- No snapshot tests (brittle with Tailwind classes)
- Run with `npx vitest --run` (single execution, no watch mode)

## Test Commands

```bash
npx vitest --run              # Run all tests once
npx vitest --run src/utils/   # Run specific directory
npx vitest --coverage         # With coverage report
```
