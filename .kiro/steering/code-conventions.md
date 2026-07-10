---
inclusion: auto
---

# Code Conventions — PrizeFlow

## TypeScript

- Strict mode enabled (`"strict": true`)
- No unused locals or parameters (compiler enforced)
- Prefer `interface` over `type` for object shapes
- Use explicit return types on exported functions
- Use `string | null` over `string | undefined` for optional model fields
- Generate IDs with `crypto.randomUUID()`

## React

- Functional components only (no class components)
- Props interfaces defined inline or co-located with the component
- State lifted to `App.tsx`; pages receive data and updater callbacks via props
- Use `useCallback` for functions passed as props to prevent unnecessary re-renders
- Use `useEffect` sparingly and only for side effects (data loading, event listeners)
- Event handlers prefixed with `handle` (e.g., `handleSubmit`, `handleDelete`)

## Styling (Tailwind CSS)

- Use utility classes directly in JSX
- Custom component classes defined in `src/index.css` `@layer components` block
- Predefined utility classes: `btn`, `btn-primary`, `btn-secondary`, `btn-danger`, `btn-success`, `input`, `card`
- Responsive: mobile-first approach; use `sm:`, `md:`, `lg:` breakpoints
- Colors: use the `primary-*` palette for brand colors

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `ConfirmDialog` |
| Files (components/pages) | PascalCase.tsx | `Recipients.tsx` |
| Files (utilities) | camelCase.ts | `storage.ts` |
| Interfaces/Types | PascalCase | `Recipient`, `Prize` |
| Functions | camelCase | `getRecipients`, `handleSubmit` |
| Constants | UPPER_SNAKE_CASE | `RECIPIENTS_KEY` |
| CSS classes (custom) | kebab-case | `btn-primary` |

## Error Handling

- Form validation: use HTML5 `required` attribute for required fields
- Guard against empty strings with `.trim()` before saving
- Confirm destructive actions with `ConfirmDialog` component

## Code Quality

- No `any` types
- No `console.log` in committed code (use only during debugging)
- No commented-out code in committed files
- Keep components under 200 lines; extract sub-components if larger
- Prefer early returns over deep nesting
