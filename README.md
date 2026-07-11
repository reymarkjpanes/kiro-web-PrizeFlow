# PrizeFlow

> A production-quality web application for digitizing prize distribution at events.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest&logoColor=white)

## Overview

PrizeFlow replaces manual paper-based and spreadsheet-based prize distribution workflows with a centralized dashboard. Built for schools, universities, and organizations managing 50–500 prize items per event. All data persists locally — no server required.

## Features

- **Dashboard** — Real-time summary metrics and progress visualization
- **Recipient Management** — Full CRUD with instant search filtering
- **Prize Management** — CRUD, recipient assignment, claim/unclaim with date tracking
- **Reports** — Claimed/unclaimed views with RFC 4180-compliant CSV export
- **Responsive** — Optimized for 768px+ with 44px touch targets on tablet
- **Accessible** — Full keyboard navigation, WCAG AA contrast, WAI-ARIA patterns
- **Offline-First** — localStorage persistence with graceful error recovery

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 19.2.7 |
| Language | TypeScript | 5.8.3 |
| Build | Vite | 6.3.5 |
| Styling | Tailwind CSS | 3.4.17 |
| Testing | Vitest + fast-check | 4.1.10 / 4.9.0 |
| Deployment | Vercel | Zero-config |

## Architecture

```
src/
├── features/           # Self-contained feature modules
│   ├── dashboard/      # Summary cards, progress bar, stats hook
│   ├── recipients/     # CRUD, search, form validation
│   ├── prizes/         # CRUD, assignment, claim toggling
│   └── reports/        # Table views, CSV export
├── shared/             # Reusable infrastructure
│   ├── components/     # Button, Input, Card, Badge, Table, Dialog, EmptyState, Navigation
│   ├── hooks/          # useLocalStorage, useFocusTrap, useArrowNavigation, useRecipients, usePrizes
│   ├── utils/          # Storage layer, CSV serializer
│   ├── types/          # Domain types + variant types
│   └── styles/         # Design token constants
├── App.tsx             # Shell: nav + tabpanel + error boundary
├── ErrorBoundary.tsx   # Graceful error recovery
└── main.tsx            # Entry point
```

**Key architectural decisions:**

- **Feature isolation** — No cross-feature imports; each module owns its components, hooks, and logic
- **Custom hooks for state** — No external state library needed at this scale
- **Design tokens** — Centralized in Tailwind config as the single source of truth
- **Pure functions** — CSV serializer and filter logic are side-effect-free for easy testing
- **Collocated tests** — Property-based tests live alongside the code they verify

## Getting Started

```bash
git clone https://github.com/reymarkjpanes/kiro-web-PrizeFlow.git
cd kiro-web-PrizeFlow

npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Testing

```bash
npm run test:run    # Single run (CI)
npm test            # Watch mode
npx vitest run --coverage
```

### Property-Based Tests

| Property | Validates | Runs |
|----------|-----------|------|
| Storage Integrity | JSON round-trip for all domain objects | 100 |
| CSV Round-Trip | serialize → parse produces identical values | 100 |
| CSV Field Isolation | Special characters don't corrupt adjacent fields | 200 |
| Cascade Delete | No orphaned references after recipient deletion | 100 |
| Focus Trap | Tab never escapes dialog boundary | Design-verified |
| Arrow Nav Wrapping | N presses cycle through all N tabs | Design-verified |
| Filter Subset | Results are correct strict subsets | 100 |

## Design System

Defined in `tailwind.config.js`:

- **5 semantic color scales** — primary, neutral, success, warning, danger (50–900 shades)
- **8-level typography scale** — display through caption
- **4px-based spacing** — consistent across all components
- **Motion tokens** — fast: 150ms, normal: 200ms, slow: 300ms
- **Shadow, radius, and animation tokens** — for visual consistency

Components consume tokens exclusively — no magic values in component code.

## Accessibility

- WAI-ARIA tablist with Left/Right arrow key cycling
- Focus trapping in dialogs with restoration on close
- WCAG AA contrast (4.5:1 normal text, 3:1 large text)
- Semantic HTML throughout (`nav`, `main`, `section`, `form`, `table`, `dialog`)
- Keyboard-first design — all interactions operable without mouse
- ARIA live regions for dynamic content announcements

## Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Bundle (gzipped) | < 200 KB | 68.85 KB |
| LCP | < 2s | Sub-second (no network deps) |
| Interaction response | < 100ms | Immediate (local state) |
| Search latency | < 300ms | ~1ms (memoized filter) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |

## Deployment

Deploy to Vercel with zero configuration:

```bash
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard:
- **Build command:** `npm run build`
- **Output directory:** `dist`

## License

MIT
