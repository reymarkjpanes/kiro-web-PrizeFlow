---
inclusion: auto
---

# Project Structure Conventions — PrizeFlow

## Directory Organization

| Directory | Purpose | Naming Convention |
|-----------|---------|-------------------|
| `src/components/` | Reusable UI components shared across pages | PascalCase (e.g., `ConfirmDialog.tsx`) |
| `src/pages/` | Top-level page components (one per navigation tab) | PascalCase (e.g., `Dashboard.tsx`) |
| `src/types/` | TypeScript interfaces and type exports | `index.ts` barrel file |
| `src/utils/` | Pure utility functions with no React dependency | camelCase (e.g., `storage.ts`, `csv.ts`) |
| `public/` | Static assets served as-is | kebab-case |
| `docs/` | Product documentation (PRD) | PascalCase or kebab-case |

## File Conventions

- One component per file
- File name matches the default export name
- Page components correspond 1:1 with navigation tabs
- Utility files group related functions (e.g., all storage ops in `storage.ts`)

## Data Models

All types are defined in `src/types/index.ts`:

```typescript
interface Recipient {
  id: string;
  name: string;
  contact: string;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  recipientId: string | null;
  claimed: boolean;
  claimDate: string | null; // YYYY-MM-DD
}

type TabId = 'dashboard' | 'recipients' | 'prizes' | 'reports';
```

## Adding New Features

1. If it's a new page/tab: add to `src/pages/`, update `TabId` type, add to `Navigation` and `App`.
2. If it's a shared component: add to `src/components/`.
3. If it's a utility function: add to existing util file or create a new one in `src/utils/`.
4. If it's a new data model: add interface to `src/types/index.ts`.

## Import Aliases

The `@/` alias resolves to `src/`:

```typescript
import { Recipient } from '@/types';
import { getRecipients } from '@/utils/storage';
```

(Configured in `tsconfig.json` and `vite.config.ts`)
