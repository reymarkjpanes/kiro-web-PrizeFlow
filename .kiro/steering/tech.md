---
inclusion: auto
---

# Technology Stack — PrizeFlow

## Core Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ~5.8 |
| UI Framework | React | ^19 |
| Build Tool | Vite | ^6 |
| Styling | Tailwind CSS | ^3.4 |
| PostCSS | autoprefixer + tailwindcss | latest |
| Package Manager | npm | system |
| Deployment | Vercel | zero-config |

## Project Structure

```
/
├── .kiro/steering/       # Kiro steering files
├── docs/PRD.md           # Product requirements (source of truth)
├── public/               # Static assets
├── src/
│   ├── components/       # Shared/reusable UI components
│   ├── pages/            # Page-level components (one per tab)
│   ├── types/            # TypeScript interfaces and type aliases
│   ├── utils/            # Pure utility functions (storage, csv)
│   ├── App.tsx           # Root component with state management
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind directives and global styles
├── index.html            # Vite HTML entry
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## Data Persistence

- All data is stored in `localStorage` under two keys:
  - `prizeflow_recipients` — JSON array of `Recipient` objects
  - `prizeflow_prizes` — JSON array of `Prize` objects
- IDs are generated via `crypto.randomUUID()`
- No backend, no API, no database

## State Management

- React `useState` at the `App` component level (lifted state)
- Props passed down to page components
- `useCallback` wrappers persist data to localStorage on every mutation
- No external state library needed at this scale

## Build & Run Commands

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server (Vite)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
```

## Deployment

- Push to any branch connected to Vercel
- Vite auto-detects and builds; no `vercel.json` needed
- Output: `dist/` directory with static assets

## Dependencies Philosophy

- Minimize external dependencies
- No routing library (single-page with tabs)
- No state management library
- No component library (Tailwind utility classes instead)
- No testing libraries in MVP (can be added later)
