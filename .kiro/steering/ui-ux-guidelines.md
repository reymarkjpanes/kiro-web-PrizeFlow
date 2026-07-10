---
inclusion: manual
---

# UI/UX Guidelines — PrizeFlow

## Design Principles

1. **Simplicity** — Every screen should be immediately understandable without instructions
2. **Speed** — Interactions complete in under 300ms; no loading spinners for local operations
3. **Clarity** — Status is always visible; users never wonder what state data is in
4. **Forgiveness** — Destructive actions require confirmation; claims are reversible

## Layout

- Max content width: `max-w-7xl` (1280px)
- Page padding: `px-4 sm:px-6 lg:px-8`
- Vertical spacing between sections: `py-6` or `mb-6`
- Minimum supported width: 768px (tablet and up)

## Navigation

- Tab-based single-page navigation (no URL routing)
- Active tab indicated with bottom border and primary color
- Tabs are always visible in the header

## Visual Hierarchy

- Page titles: `text-2xl font-bold text-gray-900`
- Section titles: `text-lg font-semibold text-gray-800`
- Body text: `text-sm text-gray-600`
- Primary actions: blue (`btn-primary`)
- Destructive actions: red (`btn-danger`)
- Success/positive actions: green (`btn-success`)
- Neutral/secondary actions: gray border (`btn-secondary`)

## Cards & Tables

- Cards: white background, rounded corners, subtle border and shadow (`card` class)
- Tables: full-width, alternating hover states, header with gray background
- Empty states: centered text with guidance on what to do next

## Status Indicators

- Claimed: green badge (`bg-green-100 text-green-800`)
- Unclaimed: amber badge (`bg-amber-100 text-amber-800`)
- Dashboard cards: color-coded borders (blue=total, green=claimed, amber=unclaimed)

## Forms

- Labels above inputs
- Required fields marked with red asterisk
- Placeholder text for guidance
- Form appears inline (not a separate page)
- Cancel button always available alongside submit

## Feedback Patterns

- Confirmation dialog for all delete operations
- Immediate visual feedback on claim/unclaim (badge color change)
- Dashboard progress bar shows distribution progress
- Empty states with helpful messages

## Responsive Behavior

- Grid columns: 1 on mobile, 3 on `md:` breakpoint (dashboard cards)
- Flex direction: column on mobile, row on `sm:` (header actions)
- Tables: horizontal scroll (`overflow-x-auto`) on narrow screens
- Button groups: wrap naturally with `flex-wrap`
